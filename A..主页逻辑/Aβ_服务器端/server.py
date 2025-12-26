import subprocess
import threading
import queue
import json
from flask import Flask, request, jsonify, Response, send_from_directory
import time
import sys
import socket

from app_config import AppConfig, register_script_routes

app = Flask(__name__, 
           static_folder=AppConfig.STATIC_FOLDER, 
           static_url_path=AppConfig.STATIC_URL_PATH)

# --- 全局变量---
shell_process = None
output_queue = queue.Queue()
shell_ready = threading.Event()

def enqueue_output(stream, q, stream_name):
    """从子进程流中读取数据并放入队列"""
    try:
        while True:
            line = stream.readline()
            if not line:
                break
            if line:
                text = line.decode('utf-8', errors='replace').rstrip()
                q.put({'type': stream_name, 'text': text})
    except Exception as e:
        q.put({'type': 'error', 'text': f"流读取错误({stream_name}): {str(e)}"})
    finally:
        stream.close()
        q.put({'type': 'status', 'text': f"{stream_name}流已关闭"})

def start_shell_session():
    """启动一个持久的shell 会话和读取线程"""
    global shell_process
    print("正在启动Termux Shell 会话...")
    try:
        shell_process = subprocess.Popen(
            [AppConfig.SHELL_PATH] + AppConfig.SHELL_ARGS,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            bufsize=AppConfig.BUFFER_SIZE,
            env=AppConfig.ENV
        )
        t_stdout = threading.Thread(target=enqueue_output, args=(shell_process.stdout, output_queue, 'stdout'))
        t_stderr = threading.Thread(target=enqueue_output, args=(shell_process.stderr, output_queue, 'stderr'))
        t_stdout.daemon = True
        t_stderr.daemon = True
        t_stdout.start()
        t_stderr.start()
        time.sleep(AppConfig.STARTUP_DELAY)
        if shell_process.poll() is None:
            shell_ready.set()
            print("Shell 会话已启动成功。")
            output_queue.put({'type': 'status', 'text': '*** Shell 已就绪***'})
        else:
            print(f"Shell 启动失败，退出码: {shell_process.poll()}")
            output_queue.put({'type': 'error', 'text': f'*** Shell 启动失败，退出码: {shell_process.poll()} ***'})
    except Exception as e:
        print(f"启动Shell 时出错: {str(e)}")
        output_queue.put({'type': 'error', 'text': f'*** 启动Shell 失败: {str(e)} ***'})

@app.after_request
def after_request(response):
    for key, value in AppConfig.CORS_HEADERS.items():
        response.headers.add(key, value)
    return response

# 核心路由
@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/console')
def console():
    return app.send_static_file('console.html')

@app.route('/test')
def test_connection():
    """测试连接接口"""
    return jsonify({
        'status': 'success',
        'message': '服务器连接正常',
        'timestamp': time.time(),
        'server': 'Termux Web Console'
    })

@app.route('/ip')
def get_server_ip():
    """返回当前服务器的实际IP，方便用户配置"""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect((AppConfig.TEST_CONNECTION_IP, AppConfig.TEST_CONNECTION_PORT))
        ip = s.getsockname()[0]
        s.close()
    except Exception:
        ip = '127.0.0.1'
    
    return jsonify({
        'ip': ip,
        'port': AppConfig.PORT,
        'message': f'请在APP中配置 http://{ip}:{AppConfig.PORT}'
    })

@app.route('/execute', methods=['POST', 'OPTIONS'])
def execute():
    if request.method == 'OPTIONS':
        return '', 200
    try:
        data = request.get_json()
        if not data or 'command' not in data:
            return jsonify({'status': 'error', 'message': '未提供命令'}), 400
        command = data['command']
        if not shell_ready.is_set():
            return jsonify({'status': 'error', 'message': 'Shell 未就绪'}), 503
        if shell_process and shell_process.poll() is None:
            shell_process.stdin.write((command + '\n').encode('utf-8'))
            shell_process.stdin.flush()
            return jsonify({'status': 'success'})
        else:
            return jsonify({'status': 'error', 'message': 'Shell 进程已退出'}), 500
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/stream')
def stream():
    def generate():
        yield f"data: {json.dumps({'type': 'status', 'text': '*** 已连接到服务器 ***'})}\n\n"
        if not shell_ready.is_set():
            yield f"data: {json.dumps({'type': 'status', 'text': '*** 等待Shell启动... ***'})}\n\n"
        shell_ready.wait(timeout=AppConfig.SHELL_READY_TIMEOUT)
        while True:
            try:
                try:
                    output = output_queue.get(timeout=AppConfig.SSE_TIMEOUT)
                    yield f"data: {json.dumps(output)}\n\n"
                except queue.Empty:
                    yield f"data: {json.dumps({'type': 'heartbeat'})}\n\n"
                    continue
            except GeneratorExit:
                print("SSE 客户端断开连接")
                break
            except Exception as e:
                yield f"data: {json.dumps({'type': 'error', 'text': f'流错误: {str(e)}'})}\n\n"
    return Response(generate(), mimetype='text/event-stream', headers={'Cache-Control': 'no-cache'})

# 注册所有脚本相关路由
register_script_routes(app)

if __name__ == '__main__':
    start_shell_session()
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect((AppConfig.TEST_CONNECTION_IP, AppConfig.TEST_CONNECTION_PORT))
        local_ip = s.getsockname()[0]
        s.close()
    except:
        local_ip = "localhost"
    
    print("\n" + "="*50)
    print("【重要】服务器已启动！")
    print("【重要】请在APP中配置以下地址：")
    print(f"    http://{local_ip}:{AppConfig.PORT}")
    print("或在浏览器中访问以下地址查看IP:")
    print(f"    http://{local_ip}:{AppConfig.PORT}/ip")
    print("="*50 + "\n")
    
    app.run(host=AppConfig.HOST, port=AppConfig.PORT, threaded=AppConfig.THREADED)
