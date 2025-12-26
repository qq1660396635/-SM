#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
文件名: A6_Python函数分析.py
功能: 服务器端Python函数分析工具
"""

import os
import sys
import ast
import re
from pathlib import Path
from datetime import datetime
import json

class PythonFunctionAnalyzer:
    """Python函数分析器"""
    
    def __init__(self):
        self.default_dir = "/storage/emulated/0/Download/"
        self.supported_extensions = ['.py']
        self.max_file_size = 10 * 1024 * 1024  # 10MB
    
    def analyze_python_file(self, file_path):
        """分析单个Python文件"""
        try:
            # 检查文件大小
            if os.path.getsize(file_path) > self.max_file_size:
                return {"status": "error", "message": f"文件过大，超过{self.max_file_size // (1024*1024)}MB限制"}
            
            # 读取文件内容
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            # 解析AST
            try:
                tree = ast.parse(content)
            except SyntaxError as e:
                return {"status": "error", "message": f"语法错误: {str(e)}"}
            
            # 分析函数
            functions = []
            classes = []
            imports = []
            
            for node in ast.walk(tree):
                if isinstance(node, ast.FunctionDef):
                    func_info = self._analyze_function(node, content)
                    functions.append(func_info)
                elif isinstance(node, ast.ClassDef):
                    class_info = self._analyze_class(node, content)
                    classes.append(class_info)
                elif isinstance(node, (ast.Import, ast.ImportFrom)):
                    import_info = self._analyze_import(node)
                    imports.append(import_info)
            
            # 分析复杂度
            complexity = self._calculate_complexity(content)
            
            # 统计信息
            stats = {
                'total_lines': len(content.splitlines()),
                'code_lines': len([line for line in content.splitlines() if line.strip() and not line.strip().startswith('#')]),
                'comment_lines': len([line for line in content.splitlines() if line.strip().startswith('#')]),
                'blank_lines': len([line for line in content.splitlines() if not line.strip()]),
                'functions': len(functions),
                'classes': len(classes),
                'imports': len(imports)
            }
            
            return {
                "status": "success",
                "file_info": {
                    "name": os.path.basename(file_path),
                    "path": file_path,
                    "size": os.path.getsize(file_path),
                    "stats": stats
                },
                "functions": functions,
                "classes": classes,
                "imports": imports,
                "complexity": complexity
            }
            
        except Exception as e:
            return {"status": "error", "message": f"分析失败: {str(e)}"}
    
    def _analyze_function(self, node, content):
        """分析函数节点"""
        # 获取函数代码行
        start_line = node.lineno
        end_line = node.end_lineno if hasattr(node, 'end_lineno') else start_line
        lines = content.splitlines()
        func_lines = lines[start_line-1:end_line]
        func_code = '\n'.join(func_lines)
        
        # 计算函数复杂度
        func_complexity = self._calculate_function_complexity(node)
        
        # 提取文档字符串
        docstring = ast.get_docstring(node) or ""
        
        # 分析参数
        args = []
        for arg in node.args.args:
            args.append(arg.arg)
        
        # 分析返回类型
        return_type = None
        if node.returns:
            if hasattr(node.returns, 'id'):
                return_type = node.returns.id
            elif hasattr(node.returns, 'attr'):
                return_type = node.returns.attr
        
        return {
            "name": node.name,
            "line": start_line,
            "end_line": end_line,
            "args": args,
            "return_type": return_type,
            "docstring": docstring,
            "complexity": func_complexity,
            "code": func_code,
            "is_async": isinstance(node, ast.AsyncFunctionDef)
        }
    
    def _analyze_class(self, node, content):
        """分析类节点"""
        # 获取类代码行
        start_line = node.lineno
        end_line = node.end_lineno if hasattr(node, 'end_lineno') else start_line
        lines = content.splitlines()
        class_lines = lines[start_line-1:end_line]
        class_code = '\n'.join(class_lines)
        
        # 提取类的方法
        methods = []
        for item in node.body:
            if isinstance(item, ast.FunctionDef):
                methods.append(item.name)
        
        # 提取基类
        bases = []
        for base in node.bases:
            if hasattr(base, 'id'):
                bases.append(base.id)
            elif hasattr(base, 'attr'):
                bases.append(base.attr)
        
        return {
            "name": node.name,
            "line": start_line,
            "end_line": end_line,
            "bases": bases,
            "methods": methods,
            "code": class_code
        }
    
    def _analyze_import(self, node):
        """分析导入语句"""
        if isinstance(node, ast.Import):
            return {
                "type": "import",
                "module": [alias.name for alias in node.names],
                "line": node.lineno
            }
        elif isinstance(node, ast.ImportFrom):
            return {
                "type": "from_import",
                "module": node.module or "",
                "names": [alias.name for alias in node.names],
                "line": node.lineno
            }
    
    def _calculate_complexity(self, content):
        """计算代码复杂度"""
        complexity = {
            "cyclomatic": 1,  # 基础复杂度
            "cognitive": 0,    # 认知复杂度
            "nesting_depth": 0  # 嵌套深度
        }
        
        try:
            tree = ast.parse(content)
            for node in ast.walk(tree):
                # 圈复杂度计算
                if isinstance(node, (ast.If, ast.While, ast.For, ast.AsyncFor)):
                    complexity["cyclomatic"] += 1
                elif isinstance(node, ast.ExceptHandler):
                    complexity["cyclomatic"] += 1
                elif isinstance(node, ast.With, ast.AsyncWith):
                    complexity["cyclomatic"] += 1
                elif isinstance(node, ast.BoolOp):
                    complexity["cyclomatic"] += len(node.values) - 1
                
                # 嵌套深度计算
                if isinstance(node, (ast.If, ast.While, ast.For, ast.AsyncFor, ast.With, ast.AsyncWith, ast.Try)):
                    depth = self._calculate_nesting_depth(node)
                    complexity["nesting_depth"] = max(complexity["nesting_depth"], depth)
        
        except:
            pass
        
        return complexity
    
    def _calculate_function_complexity(self, node):
        """计算函数复杂度"""
        complexity = 1
        
        for child in ast.walk(node):
            if isinstance(child, (ast.If, ast.While, ast.For, ast.AsyncFor)):
                complexity += 1
            elif isinstance(child, ast.ExceptHandler):
                complexity += 1
            elif isinstance(child, ast.BoolOp):
                complexity += len(child.values) - 1
        
        return complexity
    
    def _calculate_nesting_depth(self, node, current_depth=0):
        """递归计算嵌套深度"""
        max_depth = current_depth
        
        for child in ast.iter_child_nodes(node):
            if isinstance(child, (ast.If, ast.While, ast.For, ast.AsyncFor, ast.With, ast.AsyncWith, ast.Try)):
                depth = self._calculate_nesting_depth(child, current_depth + 1)
                max_depth = max(max_depth, depth)
        
        return max_depth
    
    def generate_analysis_report(self, analysis_result, output_dir):
        """生成分析报告"""
        try:
            # 创建输出目录
            os.makedirs(output_dir, exist_ok=True)
            
            # 生成报告文件名
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            report_file = os.path.join(output_dir, f"Python函数分析报告_{timestamp}.html")
            
            # 生成HTML报告
            html_content = self._generate_html_report(analysis_result)
            
            with open(report_file, 'w', encoding='utf-8') as f:
                f.write(html_content)
            
            return report_file
            
        except Exception as e:
            return None
    
    def _generate_html_report(self, analysis_result):
        """生成HTML格式的分析报告"""
        file_info = analysis_result["file_info"]
        functions = analysis_result["functions"]
        classes = analysis_result["classes"]
        imports = analysis_result["imports"]
        complexity = analysis_result["complexity"]
        
        html = f"""
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Python函数分析报告</title>
    <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }}
        .container {{ max-width: 1200px; margin: 0 auto; background: rgba(255,255,255,0.95); border-radius: 20px; padding: 30px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }}
        h1 {{ color: #333; text-align: center; margin-bottom: 30px; font-size: 2.5em; }}
        h2 {{ color: #555; border-bottom: 2px solid #ddd; padding-bottom: 10px; margin-top: 30px; }}
        h3 {{ color: #666; margin-top: 25px; }}
        .file-info {{ background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px; }}
        .stats {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }}
        .stat-card {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; text-align: center; }}
        .stat-number {{ font-size: 2em; font-weight: bold; }}
        .stat-label {{ font-size: 0.9em; opacity: 0.9; }}
        .function-list, .class-list {{ margin: 20px 0; }}
        .function-item, .class-item {{ background: #f8f9fa; margin: 10px 0; padding: 15px; border-radius: 8px; border-left: 4px solid #667eea; }}
        .function-name {{ font-weight: bold; color: #333; font-size: 1.1em; }}
        .function-meta {{ color: #666; font-size: 0.9em; margin: 5px 0; }}
        .function-code {{ background: #f4f4f4; padding: 10px; border-radius: 5px; font-family: 'Courier New', monospace; font-size: 0.9em; overflow-x: auto; margin-top: 10px; }}
        .complexity {{ background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107; }}
        .import-list {{ background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0; }}
        .import-item {{ margin: 5px 0; font-family: 'Courier New', monospace; }}
        @media (max-width: 768px) {{ .container {{ padding: 15px; }} .stats {{ grid-template-columns: repeat(2, 1fr); }} }}
    </style>
</head>
<body>
    <div class="container">
        <h1>🐍 Python函数分析报告</h1>
        
        <div class="file-info">
            <h2>📄 文件信息</h2>
            <p><strong>文件名:</strong> {file_info['name']}</p>
            <p><strong>路径:</strong> {file_info['path']}</p>
            <p><strong>大小:</strong> {file_info['size']} 字节</p>
            <p><strong>分析时间:</strong> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
        </div>
        
        <div class="stats">
            <div class="stat-card">
                <div class="stat-number">{file_info['stats']['total_lines']}</div>
                <div class="stat-label">总行数</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">{file_info['stats']['code_lines']}</div>
                <div class="stat-label">代码行数</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">{file_info['stats']['functions']}</div>
                <div class="stat-label">函数数量</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">{file_info['stats']['classes']}</div>
                <div class="stat-label">类数量</div>
            </div>
        </div>
        
        <div class="complexity">
            <h2>📊 复杂度分析</h2>
            <p><strong>圈复杂度:</strong> {complexity['cyclomatic']}</p>
            <p><strong>嵌套深度:</strong> {complexity['nesting_depth']}</p>
        </div>
        
        <div class="function-list">
            <h2>🔧 函数列表 ({len(functions)})</h2>
            {self._generate_function_html(functions)}
        </div>
        
        <div class="class-list">
            <h2>🏗️ 类列表 ({len(classes)})</h2>
            {self._generate_class_html(classes)}
        </div>
        
        <div class="import-list">
            <h2>📦 导入模块 ({len(imports)})</h2>
            {self._generate_import_html(imports)}
        </div>
    </div>
</body>
</html>
        """
        
        return html
    
    def _generate_function_html(self, functions):
        """生成函数列表HTML"""
        html = ""
        for func in functions:
            async_prefix = "async " if func["is_async"] else ""
            args_str = ", ".join(func["args"])
            return_type_str = f" -> {func['return_type']}" if func["return_type"] else ""
            
            html += f"""
            <div class="function-item">
                <div class="function-name">{async_prefix}{func['name']}({args_str}){return_type_str}</div>
                <div class="function-meta">
                    行号: {func['line']}-{func['end_line']} | 复杂度: {func['complexity']}
                </div>
                {f'<div class="function-meta"><strong>文档:</strong> {func["docstring"]}</div>' if func["docstring"] else ''}
                <div class="function-code"><pre>{func['code']}</pre></div>
            </div>
            """
        
        return html
    
    def _generate_class_html(self, classes):
        """生成类列表HTML"""
        html = ""
        for cls in classes:
            bases_str = ", ".join(cls["bases"]) if cls["bases"] else "object"
            methods_str = ", ".join(cls["methods"]) if cls["methods"] else "无"
            
            html += f"""
            <div class="class-item">
                <div class="function-name">class {cls['name']}({bases_str})</div>
                <div class="function-meta">
                    行号: {cls['line']}-{cls['end_line']} | 方法: {methods_str}
                </div>
                <div class="function-code"><pre>{cls['code']}</pre></div>
            </div>
            """
        
        return html
    
    def _generate_import_html(self, imports):
        """生成导入列表HTML"""
        html = ""
        for imp in imports:
            if imp["type"] == "import":
                modules_str = ", ".join(imp["module"])
                html += f'<div class="import-item">import {modules_str} (行号: {imp["line"]})</div>'
            else:
                names_str = ", ".join(imp["names"])
                html += f'<div class="import-item">from {imp["module"]} import {names_str} (行号: {imp["line"]})</div>'
        
        return html
    
    def analyze_python_file_with_report(self, file_path, output_dir):
        """分析Python文件并生成报告"""
        try:
            # 使用默认目录如果未提供
            if not output_dir:
                output_dir = self.default_dir
            
            # 验证文件存在
            if not os.path.exists(file_path):
                return {"status": "error", "message": f"文件不存在: {file_path}"}
            
            # 验证文件扩展名
            if not file_path.lower().endswith('.py'):
                return {"status": "error", "message": "不是Python文件"}
            
            # 分析文件
            analysis_result = self.analyze_python_file(file_path)
            
            if analysis_result["status"] == "error":
                return analysis_result
            
            # 生成报告
            report_file = self.generate_analysis_report(analysis_result, output_dir)
            
            if report_file:
                return {
                    "status": "success",
                    "message": "分析完成",
                    "report_file": report_file,
                    "analysis": analysis_result
                }
            else:
                return {"status": "error", "message": "生成报告失败"}
                
        except Exception as e:
            return {"status": "error", "message": f"分析异常: {str(e)}"}

    @staticmethod
    def get_page():
        """返回Python函数分析页面"""
        from flask import send_from_directory
        return send_from_directory('.', 'python-analyzer.html')
    
    @staticmethod
    def run_analysis():
        """执行Python函数分析操作的路由处理函数"""
        from flask import request, jsonify
        try:
            data = request.get_json()
            file_path = data.get('file_path', '')
            output_dir = data.get('output_dir', '')
            
            if not file_path:
                return jsonify({'status': 'error', 'message': '未提供Python文件路径'}), 400
            
            analyzer = PythonFunctionAnalyzer()
            result = analyzer.analyze_python_file_with_report(file_path, output_dir)
            
            if result['status'] == 'success':
                return jsonify(result), 200
            else:
                return jsonify(result), 400
                
        except Exception as e:
            return jsonify({'status': 'error', 'message': f'内部错误: {str(e)}'}), 500
