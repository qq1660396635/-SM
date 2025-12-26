#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
文件名: A5_截图工具.py
功能: 服务器端HTML截图工具
"""

import os
import subprocess
import tempfile
import glob
import shutil
from pathlib import Path
import json
from datetime import datetime

class ScreenshotTool:
    """HTML截图工具"""
    
    def __init__(self):
        self.default_dir = "/storage/emulated/0/Download/"
        self.default_width = 2000
        self.default_height = 3000
        self.default_format = 'png'
        self.supported_formats = ['png', 'jpg', 'jpeg', 'pdf']
        
        # 检测可用的浏览器
        self.browser = self._find_browser()
    
    def _find_browser(self):
        """查找可用的浏览器"""
        browsers = [
            'chromium-browser',
            'chrome',
            'google-chrome',
            'firefox'
        ]
        
        for browser in browsers:
            if shutil.which(browser):
                return browser
        
        return 'chromium-browser'  # 默认值
    
    def _get_chromium_args(self, width, height, output_file):
        """获取Chromium浏览器参数"""
        return [
            self.browser,
            "--headless",
            "--disable-gpu",
            "--no-sandbox",
            "--run-all-compositor-stages-before-draw",
            "--virtual-time-budget=30000",
            f"--window-size={width},{height}",
            f"--screenshot={output_file}"
        ]
    
    def capture_single_html(self, html_file, output_file, width=None, height=None):
        """对单个HTML文件进行截图"""
        try:
            if width is None:
                width = self.default_width
            if height is None:
                height = self.default_height
            
            # 验证HTML文件存在
            if not os.path.exists(html_file):
                return {"status": "error", "message": f"HTML文件不存在: {html_file}"}
            
            # 创建输出目录
            os.makedirs(os.path.dirname(output_file), exist_ok=True)
            
            # 构建命令
            cmd = self._get_chromium_args(width, height, output_file)
            cmd.append(f"file://{html_file}")
            
            # 执行截图
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            if result.returncode == 0:
                file_size = os.path.getsize(output_file)
                return {
                    "status": "success",
                    "message": "截图完成",
                    "output_file": output_file,
                    "file_size": file_size,
                    "width": width,
                    "height": height
                }
            else:
                return {
                    "status": "error",
                    "message": f"截图失败: {result.stderr[:200]}",
                    "browser": self.browser
                }
                
        except Exception as e:
            return {"status": "error", "message": f"截图异常: {str(e)}"}
    
    def capture_multiple_html(self, html_dir, output_file, width=None, height=None, format_type='png'):
        """对目录下的所有HTML文件进行截图并合并"""
        try:
            if width is None:
                width = self.default_width
            if height is None:
                height = self.default_height
            
            # 验证目录存在
            if not os.path.exists(html_dir):
                return {"status": "error", "message": f"目录不存在: {html_dir}"}
            
            # 查找所有HTML文件
            html_files = glob.glob(os.path.join(html_dir, "*.html"))
            if not html_files:
                return {"status": "error", "message": "目录中没有找到HTML文件"}
            
            html_files.sort()  # 按文件名排序
            
            # 创建临时目录
            with tempfile.TemporaryDirectory() as temp_dir:
                png_files = []
                
                # 对每个HTML文件进行截图
                for i, html_file in enumerate(html_files):
                    png_file = os.path.join(temp_dir, f"temp_{i:04d}.png")
                    
                    result = self.capture_single_html(html_file, png_file, width, height)
                    
                    if result['status'] == 'success':
                        png_files.append(png_file)
                    else:
                        return {"status": "error", "message": f"截图失败: {html_file} - {result['message']}"}
                
                if not png_files:
                    return {"status": "error", "message": "没有成功生成任何截图"}
                
                # 根据格式类型处理输出
                if format_type.lower() == 'pdf':
                    # 合并成PDF
                    output_file = output_file if output_file.lower().endswith('.pdf') else output_file + '.pdf'
                    cmd = ["magick"] + png_files + [output_file]
                    
                    result = subprocess.run(cmd, capture_output=True, text=True)
                    
                    if result.returncode == 0:
                        file_size = os.path.getsize(output_file)
                        return {
                            "status": "success",
                            "message": f"成功合并{len(png_files)}个HTML文件为PDF",
                            "output_file": output_file,
                            "file_size": file_size,
                            "html_count": len(html_files),
                            "width": width,
                            "height": height,
                            "format": "pdf"
                        }
                    else:
                        return {"status": "error", "message": f"PDF合并失败: {result.stderr[:200]}"}
                else:
                    # 返回第一个PNG文件（或创建ZIP）
                    output_file = output_file if output_file.lower().endswith('.png') else output_file + '.png'
                    
                    # 如果有多个文件，创建ZIP
                    if len(png_files) > 1:
                        import zipfile
                        zip_file = output_file.replace('.png', '.zip')
                        
                        with zipfile.ZipFile(zip_file, 'w') as zipf:
                            for i, png_file in enumerate(png_files):
                                zipf.write(png_file, f"page_{i+1}.png")
                        
                        file_size = os.path.getsize(zip_file)
                        return {
                            "status": "success",
                            "message": f"成功生成{len(png_files)}个截图，已打包为ZIP",
                            "output_file": zip_file,
                            "file_size": file_size,
                            "html_count": len(html_files),
                            "width": width,
                            "height": height,
                            "format": "zip"
                        }
                    else:
                        # 复制单个PNG文件
                        shutil.copy2(png_files[0], output_file)
                        file_size = os.path.getsize(output_file)
                        
                        return {
                            "status": "success",
                            "message": "截图完成",
                            "output_file": output_file,
                            "file_size": file_size,
                            "html_count": 1,
                            "width": width,
                            "height": height,
                            "format": "png"
                        }
                        
        except Exception as e:
            return {"status": "error", "message": f"批量截图异常: {str(e)}"}
    
    def capture_screenshot(self, html_path, output_path, width=None, height=None, format_type='png'):
        """执行截图操作"""
        try:
            # 判断是单个文件还是目录
            if os.path.isfile(html_path):
                # 单个HTML文件
                if not output_path:
                    # 自动生成输出文件名
                    base_name = os.path.splitext(os.path.basename(html_path))[0]
                    output_path = os.path.join(os.path.dirname(html_path), f"{base_name}_screenshot.{format_type}")
                
                result = self.capture_single_html(html_path, output_path, width, height)
                
            elif os.path.isdir(html_path):
                # 目录下的所有HTML文件
                if not output_path:
                    # 自动生成输出文件名
                    dir_name = os.path.basename(html_path.rstrip('/'))
                    output_path = os.path.join(html_path, f"{dir_name}_merged.{format_type}")
                
                result = self.capture_multiple_html(html_path, output_path, width, height, format_type)
                
            else:
                return {"status": "error", "message": f"路径不存在: {html_path}"}
            
            return result
            
        except Exception as e:
            return {"status": "error", "message": f"截图操作异常: {str(e)}"}

    @staticmethod
    def get_page():
        """返回截图页面"""
        from flask import send_from_directory
        return send_from_directory('.', 'screenshot.html')
    
    @staticmethod
    def run_screenshot():
        """执行截图操作的路由处理函数"""
        from flask import request, jsonify
        try:
            data = request.get_json()
            html_path = data.get('html_path', '')
            output_path = data.get('output_path', '')
            width = data.get('width', None)
            height = data.get('height', None)
            format_type = data.get('format', 'png')
            
            if not html_path:
                return jsonify({'status': 'error', 'message': '未提供HTML文件路径'}), 400
            
            if format_type not in ['png', 'jpg', 'jpeg', 'pdf']:
                return jsonify({'status': 'error', 'message': f'不支持的格式: {format_type}'}), 400
            
            tool = ScreenshotTool()
            result = tool.capture_screenshot(html_path, output_path, width, height, format_type)
            
            if result['status'] == 'success':
                return jsonify(result), 200
            else:
                return jsonify(result), 400
                
        except Exception as e:
            return jsonify({'status': 'error', 'message': f'内部错误: {str(e)}'}), 500
