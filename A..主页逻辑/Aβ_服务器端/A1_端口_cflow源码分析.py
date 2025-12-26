import os
import subprocess
from flask import request, jsonify, send_from_directory
from app_config import AppConfig

class CflowAnalyzer:
    CFLOW_SCRIPT_NAME = 'A1_脚本_cflow源码分析.bash'
    
    @staticmethod
    def get_script_path(script_name=None):
        if script_name is None:
            script_name = CflowAnalyzer.CFLOW_SCRIPT_NAME
        return os.path.join(os.path.dirname(__file__), script_name)
    
    @staticmethod
    def script_exists(script_name=None):
        return os.path.exists(CflowAnalyzer.get_script_path(script_name))
    
    @staticmethod
    def cflow_page():
        """cflow页面路由"""
        return send_from_directory('.', 'cflow.html')
    
    @staticmethod
    def cflow_analyze():
        """cflow分析路由"""
        try:
            c_code = request.get_data(as_text=True)
            if not c_code.strip():
                return jsonify({'error': '错误：源代码为空'}), 400
            
            script_path = CflowAnalyzer.get_script_path()
            if not CflowAnalyzer.script_exists():
                return jsonify({
                    'error': f'分析脚本不存在：{CflowAnalyzer.CFLOW_SCRIPT_NAME}',
                    'script_path': script_path
                }), 500
            
            completed = subprocess.run(
                ['bash', script_path],
                input=c_code,
                text=True,
                capture_output=True,
                timeout=AppConfig.COMMAND_TIMEOUT
            )
            
            if completed.returncode == 0:
                result_text = completed.stdout.strip()
                if not result_text:
                    result_text = "⚠️分析完成但无输出结果"
                return jsonify({
                    'status': 'success',
                    'result': result_text,
                    'debug': {
                        'returncode': completed.returncode,
                        'stdout': completed.stdout,
                        'stderr': completed.stderr
                    }
                })
            else:
                return jsonify({
                    'status': 'error',
                    'error': completed.stderr,
                    'debug': {
                        'returncode': completed.returncode,
                        'stdout': completed.stdout,
                        'stderr': completed.stderr
                    }
                }), 500
        except subprocess.TimeoutExpired:
            return jsonify({'error': '错误：分析超时（>30 秒）'}), 504
        except Exception as e:
            return jsonify({'error': f'内部错误：{str(e)}'}), 500
