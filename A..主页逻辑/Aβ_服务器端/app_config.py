import os

class AppConfig:
    # 服务器监听的主机地址，'0.0.0.0'表示监听所有网络接口
    HOST = '0.0.0.0'
    # 服务器监听的端口号
    PORT = 8080
    # 是否启用调试模式，生产环境建议设置为False
    DEBUG = False
    # 是否启用多线程处理请求
    THREADED = True
    
    # Shell执行器的路径，这里指向Termux的bash
    SHELL_PATH = '/data/data/com.termux/files/usr/bin/bash'
    # 启动Shell时传递的参数，-i表示交互式模式
    SHELL_ARGS = ['-i']
    # 缓冲区大小，0表示使用系统默认值
    BUFFER_SIZE = 0
    # Shell启动后的延迟时间（秒），确保Shell完全启动
    STARTUP_DELAY = 1
    
    # 命令执行超时时间（秒）
    COMMAND_TIMEOUT = 30
    # Server-Sent Events超时时间（秒）
    SSE_TIMEOUT = 1
    # Shell准备就绪的超时时间（秒）
    SHELL_READY_TIMEOUT = 5
    
    # 网络连接测试使用的IP地址
    TEST_CONNECTION_IP = '8.8.8.8'
    # 网络连接测试使用的端口号
    TEST_CONNECTION_PORT = 80
    
    # CORS跨域请求头设置
    CORS_HEADERS = {
        # 允许所有域名跨域访问
        'Access-Control-Allow-Origin': '*',
        # 允许的请求头
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        # 允许的HTTP方法
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS'
    }
    
    # 静态文件存放目录，'.'表示当前目录
    STATIC_FOLDER = '.'
    # 静态文件URL路径前缀，空字符串表示使用根路径
    STATIC_URL_PATH = ''
    # 复制当前环境变量
    ENV = os.environ.copy()

# ==================== 脚本模块导入 ====================
try:
    from A1_端口_cflow源码分析 import CflowAnalyzer
    CflowAnalyzer_AVAILABLE = True
except ImportError:
    CflowAnalyzer_AVAILABLE = False
    CflowAnalyzer = None

try:
    from B1_初步网站测试 import SecurityTester
    SecurityTester_AVAILABLE = True
except ImportError:
    SecurityTester_AVAILABLE = False
    SecurityTester = None

try:
    from A2_文件合并 import FileMerger
    FileMerger_AVAILABLE = True
except ImportError:
    FileMerger_AVAILABLE = False
    FileMerger = None

try:
    from A3_文件拆分 import FileSplitter
    FileSplitter_AVAILABLE = True
except ImportError:
    FileSplitter_AVAILABLE = False
    FileSplitter = None

try:
    from A4_差异分析 import DiffAnalyzer
    DiffAnalyzer_AVAILABLE = True
except ImportError:
    DiffAnalyzer_AVAILABLE = False
    DiffAnalyzer = None

try:
    from A5_截图工具 import ScreenshotTool
    ScreenshotTool_AVAILABLE = True
except ImportError:
    ScreenshotTool_AVAILABLE = False
    ScreenshotTool = None

try:
    from A6_Python函数分析 import PythonFunctionAnalyzer
    PythonFunctionAnalyzer_AVAILABLE = True
except ImportError:
    PythonFunctionAnalyzer_AVAILABLE = False
    PythonFunctionAnalyzer = None

# ==================== 脚本路由注册函数 ====================
def register_script_routes(app):
    """注册所有脚本相关的路由"""
    
    # 注册cflow相关路由
    if CflowAnalyzer_AVAILABLE:
        app.add_url_rule('/cflow', 'cflow_page', CflowAnalyzer.cflow_page, methods=['GET'])
        app.add_url_rule('/cflow', 'cflow_analyze', CflowAnalyzer.cflow_analyze, methods=['POST'])
        print("✅ Cflow分析模块已加载")
    else:
        print("❌ Cflow分析模块未找到")
    
    # 注册网安测试相关路由
    if SecurityTester_AVAILABLE:
        app.add_url_rule('/security-test', 'security_test_page', SecurityTester.get_page, methods=['GET'])
        app.add_url_rule('/security-test', 'security_test_run', SecurityTester.run_test, methods=['POST'])
        print("✅ 网安测试模块已加载")
    else:
        print("❌ 网安测试模块未找到")
    
    # 注册文件合并相关路由
    if FileMerger_AVAILABLE:
        app.add_url_rule('/merge', 'merge_page', FileMerger.get_page, methods=['GET'])
        app.add_url_rule('/merge', 'merge_run', FileMerger.run_merge, methods=['POST'])
        print("✅ 文件合并模块已加载")
    else:
        print("❌ 文件合并模块未找到")
    
    # 注册文件拆分相关路由
    if FileSplitter_AVAILABLE:
        app.add_url_rule('/split', 'split_page', FileSplitter.get_page, methods=['GET'])
        app.add_url_rule('/split', 'split_run', FileSplitter.run_split, methods=['POST'])
        print("✅ 文件拆分模块已加载")
    else:
        print("❌ 文件拆分模块未找到")
    
    # 注册差异分析相关路由
    if DiffAnalyzer_AVAILABLE:
        app.add_url_rule('/diff', 'diff_page', DiffAnalyzer.get_page, methods=['GET'])
        app.add_url_rule('/diff', 'diff_analyze', DiffAnalyzer.run_diff, methods=['POST'])
        print("✅ 差异分析模块已加载")
    else:
        print("❌ 差异分析模块未找到")
    
    # 注册截图工具相关路由
    if ScreenshotTool_AVAILABLE:
        app.add_url_rule('/screenshot', 'screenshot_page', ScreenshotTool.get_page, methods=['GET'])
        app.add_url_rule('/screenshot', 'screenshot_run', ScreenshotTool.run_screenshot, methods=['POST'])
        print("✅ 截图工具模块已加载")
    else:
        print("❌ 截图工具模块未找到")
    
    # 注册Python函数分析相关路由
    if PythonFunctionAnalyzer_AVAILABLE:
        app.add_url_rule('/python-analyzer', 'python_analyzer_page', PythonFunctionAnalyzer.get_page, methods=['GET'])
        app.add_url_rule('/python-analyzer', 'python_analyzer_run', PythonFunctionAnalyzer.run_analysis, methods=['POST'])
        print("✅ Python函数分析模块已加载")
    else:
        print("❌ Python函数分析模块未找到")

# ==================== 脚本模块配置 ====================
class ScriptConfig:
    """脚本模块配置类"""
    
    # Cflow分析配置
    CFLOW_SCRIPT_NAME = 'A1_脚本_cflow 源码分析.bash'
    
    # 文件合并配置
    FILE_MERGER_DEFAULT_DIR = "/storage/emulated/0/Download/"
    FILE_MERGER_SUPPORTED_TYPES = {
        "1": {"name": "TXT文件", "pattern": "*.txt", "output": "合并_TXT文件.txt"},
        "2": {"name": "Python文件", "pattern": "*.py", "output": "合并_Python文件.txt"},
        "3": {"name": "DOCX文件", "pattern": "*.docx", "output": "合并_DOCX文件.docx"},
        "4": {"name": "除HTML外的所有文件", "pattern": "*", "output": "合并_除HTML外所有文件.txt"}
    }
    
    # 文件拆分配置
    FILE_SPLITTER_DEFAULT_DIR = "/storage/emulated/0/Download/"
    FILE_SPLITTER_SUPPORTED_TYPES = {
        "1": {"name": "TXT合并文件", "pattern": "合并_TXT文件.txt"},
        "2": {"name": "Python合并文件", "pattern": "合并_Python文件.txt"},
        "3": {"name": "除HTML外所有文件的合并", "pattern": "合并_除HTML外所有文件.txt"},
        "4": {"name": "DOCX合并文件", "pattern": "合并_DOCX文件.docx"}
    }
    
    # 差异分析配置
    DIFF_ANALYZER_DEFAULT_DIR = "/storage/emulated/0/Download/"
    DIFF_ANALYZER_SUPPORTED_EXTENSIONS = ['.c', '.cpp', '.py', '.java', '.js', '.html', '.css', '.txt', '.h', '.hpp']
    
    # 截图工具配置
    SCREENSHOT_TOOL_DEFAULT_DIR = "/storage/emulated/0/Download/"
    SCREENSHOT_TOOL_DEFAULT_WIDTH = 2000
    SCREENSHOT_TOOL_DEFAULT_HEIGHT = 3000
    SCREENSHOT_TOOL_DEFAULT_FORMAT = 'png'
    SCREENSHOT_TOOL_SUPPORTED_FORMATS = ['png', 'jpg', 'jpeg', 'pdf']
    
    # Python函数分析配置
    PYTHON_ANALYZER_DEFAULT_DIR = "/storage/emulated/0/Download/"
    PYTHON_ANALYZER_SUPPORTED_EXTENSIONS = ['.py']
    PYTHON_ANALYZER_MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
    
    # 网安测试配置
    SECURITY_TEST_TIMEOUT = 60
    SECURITY_TEST_MAX_URLS = 100
