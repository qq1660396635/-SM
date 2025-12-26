#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
文件名: file_splitter.py
功能: 服务器端文件拆分工具
"""

import os
import re
import sys
from pathlib import Path
from datetime import datetime
import json

# 尝试导入Word处理库
try:
    from docx import Document
    DOCX_AVAILABLE = True
except ImportError:
    DOCX_AVAILABLE = False

class FileSplitter:
    """文件拆分器"""
    
    def __init__(self):
        self.default_dir = "/storage/emulated/0/Download/"
        # 保留模板但不再强制使用
        self.supported_types = {
            "1": {"name": "TXT合并文件", "pattern": "合并_TXT文件.txt"},
            "2": {"name": "Python合并文件", "pattern": "合并_Python文件.txt"},
            "3": {"name": "除HTML外所有文件的合并", "pattern": "合并_除HTML外所有文件.txt"},
            "4": {"name": "DOCX合并文件", "pattern": "合并_DOCX文件.docx"}
        }
    
    def parse_text_merged_file(self, file_path):
        """解析文本合并文件的结构"""
        files_info = []
        current_file = None
        content_lines = []
        reading_content = False
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                lines = f.readlines()
        except UnicodeDecodeError:
            try:
                with open(file_path, 'r', encoding='gbk') as f:
                    lines = f.readlines()
            except:
                return []
        
        for line in lines:
            line = line.rstrip('\n\r')
            
            # 检测文件分隔符 - 更灵活的匹配
            if '---' in line and '⬇️' in line:
                # 保存前一个文件的内容
                if current_file and content_lines:
                    current_file['content'] = '\n'.join(content_lines)
                    files_info.append(current_file)
                
                # 提取文件名 - 更灵活的提取
                filename = line
                filename = re.sub(r'---\s*', '', filename)
                filename = re.sub(r'\s*⬇️.*', '', filename)
                filename = filename.strip()
                
                current_file = {
                    'filename': filename,
                    'size': 0,
                    'mod_time': '',
                    'content': ''
                }
                content_lines = []
                reading_content = False
                continue
            
            # 检测文件信息
            if current_file and not reading_content:
                if '文件大小:' in line:
                    current_file['size'] = line.split(':', 1)[1].strip().replace('字节', '').strip()
                elif '修改时间:' in line:
                    current_file['mod_time'] = line.split(':', 1)[1].strip()
                elif '----------------' in line:
                    reading_content = True
                continue
            
            # 收集文件内容
            if reading_content and current_file:
                # 检查是否是下一个文件的分隔符
                if '---' in line and '⬇️' in line:
                    # 保存当前文件
                    if content_lines:
                        current_file['content'] = '\n'.join(content_lines)
                        files_info.append(current_file)
                    
                    # 开始新文件
                    filename = re.sub(r'---\s*', '', line)
                    filename = re.sub(r'\s*⬇️.*', '', filename)
                    filename = filename.strip()
                    
                    current_file = {
                        'filename': filename,
                        'size': 0,
                        'mod_time': '',
                        'content': ''
                    }
                    content_lines = []
                    reading_content = False
                else:
                    content_lines.append(line)
        
        # 保存最后一个文件
        if current_file and content_lines:
            current_file['content'] = '\n'.join(content_lines)
            files_info.append(current_file)
        
        return files_info
    
    def split_text_files(self, input_file, output_dir):
        """拆分文本合并文件"""
        try:
            # 解析文件结构
            files_info = self.parse_text_merged_file(input_file)
            
            if not files_info:
                return {"status": "error", "message": "未能解析出任何文件信息"}
            
            # 创建输出目录
            os.makedirs(output_dir, exist_ok=True)
            
            success_count = 0
            output_files = []
            
            for i, file_info in enumerate(files_info, 1):
                try:
                    filename = file_info['filename']
                    content = file_info['content']
                    
                    # 确保文件名不为空
                    if not filename:
                        filename = f"未命名文件_{i}.txt"
                    
                    # 清理文件名中的非法字符
                    filename = re.sub(r'[<>:"/\\|?*]', '_', filename)
                    
                    output_path = os.path.join(output_dir, filename)
                    
                    # 如果文件已存在，添加序号
                    counter = 1
                    original_path = output_path
                    while os.path.exists(output_path):
                        name, ext = os.path.splitext(original_path)
                        output_path = f"{name}_{counter}{ext}"
                        counter += 1
                    
                    # 写入文件
                    with open(output_path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    
                    # 尝试设置文件时间
                    if file_info['mod_time']:
                        try:
                            mod_time = datetime.strptime(file_info['mod_time'], '%Y-%m-%d %H:%M:%S')
                            timestamp = mod_time.timestamp()
                            os.utime(output_path, (timestamp, timestamp))
                        except:
                            pass
                    
                    output_files.append(filename)
                    success_count += 1
                    
                except Exception as e:
                    print(f"拆分文件 {file_info.get('filename', f'文件{i}')} 时出错: {str(e)}")
                    continue
            
            return {
                "status": "success",
                "message": f"文件拆分完成，成功拆分 {success_count}/{len(files_info)} 个文件",
                "output_dir": output_dir,
                "file_count": len(files_info),
                "success_count": success_count,
                "files": output_files
            }
            
        except Exception as e:
            return {"status": "error", "message": f"拆分失败: {str(e)}"}
    
    def split_docx_files(self, input_file, output_dir):
        """拆分DOCX合并文件"""
        if not DOCX_AVAILABLE:
            return {"status": "error", "message": "DOCX拆分功能不可用，请安装库：pip install python-docx"}
        
        try:
            doc = Document(input_file)
            files_info = []
            current_file = None
            current_content = []
            reading_content = False
            
            for paragraph in doc.paragraphs:
                text = paragraph.text.strip()
                
                # 检测文件分隔符
                if '---' in text and '⬇️' in text:
                    # 保存前一个文件
                    if current_file and current_content:
                        current_file['content'] = '\n'.join(current_content)
                        files_info.append(current_file)
                    
                    # 提取文件名
                    filename = text
                    filename = re.sub(r'---\s*', '', filename)
                    filename = re.sub(r'\s*⬇️.*', '', filename)
                    filename = filename.strip()
                    
                    current_file = {'filename': filename, 'content': ''}
                    current_content = []
                    reading_content = False
                    continue
                
                # 检测开始读取内容
                if current_file and not reading_content and '----------------' in text:
                    reading_content = True
                    continue
                
                # 收集内容
                if current_file and reading_content and text:
                    # 检查是否是下一个文件的分隔符
                    if '---' in text and '⬇️' in text:
                        # 保存当前文件
                        if current_content:
                            current_file['content'] = '\n'.join(current_content)
                            files_info.append(current_file)
                        
                        # 开始新文件
                        filename = re.sub(r'---\s*', '', text)
                        filename = re.sub(r'\s*⬇️.*', '', filename)
                        filename = filename.strip()
                        
                        current_file = {'filename': filename, 'content': ''}
                        current_content = []
                        reading_content = False
                    else:
                        current_content.append(text)
            
            # 保存最后一个文件
            if current_file and current_content:
                current_file['content'] = '\n'.join(current_content)
                files_info.append(current_file)
            
            if not files_info:
                return {"status": "error", "message": "未能解析出任何文件信息"}
            
            # 创建输出目录
            os.makedirs(output_dir, exist_ok=True)
            
            success_count = 0
            output_files = []
            
            for i, file_info in enumerate(files_info, 1):
                try:
                    filename = file_info['filename']
                    content = file_info['content']
                    
                    # 确保文件名不为空
                    if not filename:
                        filename = f"未命名文件_{i}.txt"
                    
                    # 确保有扩展名
                    if not '.' in filename:
                        filename += '.txt'
                    
                    # 清理文件名
                    filename = re.sub(r'[<>:"/\\|?*]', '_', filename)
                    
                    output_path = os.path.join(output_dir, filename)
                    
                    # 如果文件已存在，添加序号
                    counter = 1
                    original_path = output_path
                    while os.path.exists(output_path):
                        name, ext = os.path.splitext(original_path)
                        output_path = f"{name}_{counter}{ext}"
                        counter += 1
                    
                    with open(output_path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    
                    output_files.append(filename)
                    success_count += 1
                    
                except Exception as e:
                    print(f"拆分DOCX文件 {file_info.get('filename', f'文件{i}')} 时出错: {str(e)}")
                    continue
            
            return {
                "status": "success",
                "message": f"DOCX文件拆分完成，成功拆分 {success_count}/{len(files_info)} 个文件",
                "output_dir": output_dir,
                "file_count": len(files_info),
                "success_count": success_count,
                "files": output_files
            }
            
        except Exception as e:
            return {"status": "error", "message": f"拆分DOCX文件失败: {str(e)}"}
    
    def split_files(self, split_type, input_file, output_dir):
        """执行拆分操作"""
        # 优先使用直接指定的输入文件
        if input_file:
            # 验证输入文件存在
            if not os.path.exists(input_file):
                return {"status": "error", "message": f"输入文件不存在: {input_file}"}
            
            # 如果没有指定输出目录，自动生成
            if not output_dir:
                input_path = Path(input_file)
                base_name = input_path.stem
                parent_dir = input_path.parent
                output_dir = str(parent_dir / f"{base_name}_拆分结果")
        else:
            # 只有在没有指定输入文件时才使用模板
            if split_type not in self.supported_types:
                return {"status": "error", "message": "未提供拆分类型或输入文件"}
            
            input_file = os.path.join(self.default_dir, self.supported_types[split_type]["pattern"])
            
            # 验证输入文件存在
            if not os.path.exists(input_file):
                return {"status": "error", "message": f"输入文件不存在: {input_file}"}
            
            # 自动生成输出目录
            input_path = Path(input_file)
            base_name = input_path.stem
            parent_dir = input_path.parent
            output_dir = str(parent_dir / f"{base_name}_拆分结果")
        
        # 创建输出目录
        try:
            os.makedirs(output_dir, exist_ok=True)
        except Exception as e:
            return {"status": "error", "message": f"无法创建输出目录: {str(e)}"}
        
        # 根据文件类型执行不同的拆分
        if input_file.lower().endswith('.docx'):
            result = self.split_docx_files(input_file, output_dir)
        else:
            result = self.split_text_files(input_file, output_dir)
        
        return result

    @staticmethod
    def get_page():
        """返回拆分页面"""
        from flask import send_from_directory
        return send_from_directory('.', 'split.html')
    
    @staticmethod
    def run_split():
        """执行拆分操作的路由处理函数"""
        from flask import request, jsonify
        try:
            data = request.get_json()
            split_type = data.get('split_type', '')
            input_file = data.get('input_file', '')
            output_dir = data.get('output_dir', '')
            
            # 只要有输入文件就可以拆分，不再强制要求split_type
            if not input_file:
                return jsonify({'status': 'error', 'message': '请提供输入文件路径'}), 400
            
            splitter = FileSplitter()
            result = splitter.split_files(split_type, input_file, output_dir)
            
            if result['status'] == 'success':
                return jsonify(result), 200
            else:
                return jsonify(result), 400
                
        except Exception as e:
            return jsonify({'status': 'error', 'message': f'内部错误: {str(e)}'}), 500
