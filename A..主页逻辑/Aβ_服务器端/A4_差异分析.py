#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
文件名: A4_差异分析.py
功能: 服务器端文件差异分析工具
"""

import os
import sys
import re
import difflib
import argparse
from datetime import datetime
from pathlib import Path
import json
import subprocess

class DiffAnalyzer:
    """文件差异分析器"""
    
    def __init__(self):
        self.default_dir = "/storage/emulated/0/Download/"
        self.supported_extensions = ['.c', '.cpp', '.py', '.java', '.js', '.html', '.css', '.txt', '.h', '.hpp']
    
    def safe_read_file(self, filepath):
        """安全读取文件，处理编码问题"""
        encodings = ['utf-8', 'gbk', 'gb2312', 'latin-1']
        for encoding in encodings:
            try:
                with open(filepath, 'r', encoding=encoding) as f:
                    return f.readlines(), encoding
            except UnicodeDecodeError:
                continue
        # 如果所有编码都失败，使用忽略错误的方式读取
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            return f.readlines(), 'utf-8'
    
    def get_file_info(self, filepath):
        """获取文件基本信息"""
        try:
            file_stat = os.stat(filepath)
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                line_count = sum(1 for _ in f)
            
            return {
                'name': os.path.basename(filepath),
                'path': os.path.dirname(filepath),
                'size': file_stat.st_size,
                'lines': line_count
            }
        except Exception as e:
            return {
                'name': os.path.basename(filepath),
                'path': os.path.dirname(filepath),
                'size': 0,
                'lines': 0,
                'error': str(e)
            }
    
    def generate_html_diff_report(self, file1, file2, output_dir):
        """生成HTML格式的差异报告"""
        try:
            # 创建输出目录
            os.makedirs(output_dir, exist_ok=True)
            
            # 生成报告文件名
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            html_report_path = os.path.join(output_dir, f"代码差异报告_{timestamp}.html")
            
            file1_lines, enc1 = self.safe_read_file(file1)
            file2_lines, enc2 = self.safe_read_file(file2)
            
            # 生成HTML格式的diff报告
            html_diff = difflib.HtmlDiff().make_file(
                file1_lines, file2_lines, 
                fromdesc=file1, todesc=file2,
                context=True, numlines=3
            )
            
            with open(html_report_path, 'w', encoding='utf-8') as html_file:
                html_file.write(html_diff)
            
            return html_report_path
            
        except Exception as e:
            return None
    
    def generate_diff_content(self, file1, file2):
        """生成内存中的diff内容用于分析"""
        try:
            file1_lines, enc1 = self.safe_read_file(file1)
            file2_lines, enc2 = self.safe_read_file(file2)
            
            # 生成unified diff格式
            diff = difflib.unified_diff(file1_lines, file2_lines, 
                                       fromfile=file1, tofile=file2, n=3)
            
            return list(diff)
        except Exception as e:
            return []
    
    def analyze_diff_statistics(self, diff_content):
        """分析差异统计"""
        try:
            added = sum(1 for line in diff_content if line.startswith('+') and not line.startswith('+++'))
            deleted = sum(1 for line in diff_content if line.startswith('-') and not line.startswith('---'))
            changed_blocks = sum(1 for line in diff_content if line.startswith('@@'))
            
            return added, deleted, changed_blocks
        except Exception as e:
            return 0, 0, 0
    
    def parse_diff_blocks(self, diff_content, limit=50):
        """解析diff区块"""
        try:
            blocks = []
            current_block = {}
            
            for line in diff_content[:limit]:
                if line.startswith('@@'):
                    # 保存上一个区块
                    if current_block:
                        blocks.append(current_block)
                    
                    # 解析区块头信息
                    match = re.match(r'@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@', line)
                    if match:
                        start1 = int(match.group(1))
                        count1 = int(match.group(2)) if match.group(2) else 1
                        start2 = int(match.group(3))
                        count2 = int(match.group(4)) if match.group(4) else 1
                        
                        current_block = {
                            'header': line.strip(),
                            'start1': start1,
                            'end1': start1 + count1 - 1,
                            'start2': start2,
                            'end2': start2 + count2 - 1,
                            'changes': []
                        }
                elif line.startswith('-') and not line.startswith('---'):
                    current_block['changes'].append(('delete', line[1:].rstrip()))
                elif line.startswith('+') and not line.startswith('+++'):
                    current_block['changes'].append(('add', line[1:].rstrip()))
            
            # 保存最后一个区块
            if current_block:
                blocks.append(current_block)
            
            return blocks
        except Exception as e:
            return []
    
    def detect_key_changes(self, diff_content, keywords):
        """检测关键变更"""
        try:
            key_changes = []
            for line in diff_content:
                if any(keyword.lower() in line.lower() for keyword in keywords):
                    change_type = 'delete' if line.startswith('-') else 'add' if line.startswith('+') else 'context'
                    key_changes.append((change_type, line.rstrip()))
            
            return key_changes
        except Exception as e:
            return []
    
    def generate_analysis_report(self, file1, file2, output_dir):
        """生成文本格式的详细分析报告"""
        try:
            # 创建输出目录
            os.makedirs(output_dir, exist_ok=True)
            
            # 生成报告文件名
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            analysis_report_path = os.path.join(output_dir, f"差异分析报告_{timestamp}.txt")
            
            # 获取文件信息
            file1_info = self.get_file_info(file1)
            file2_info = self.get_file_info(file2)
            
            # 生成diff内容
            diff_content = self.generate_diff_content(file1, file2)
            
            # 分析统计
            added, deleted, changed_blocks = self.analyze_diff_statistics(diff_content)
            
            # 解析区块
            blocks = self.parse_diff_blocks(diff_content)
            
            # 检测关键变更
            uart_keywords = ['HAL_UART', 'USART', '中断', 'interrupt']
            key_changes = self.detect_key_changes(diff_content, uart_keywords)
            
            # 生成报告
            with open(analysis_report_path, 'w', encoding='utf-8') as report:
                # 报告头部
                report.write("=" * 60 + "\n")
                report.write("                  代码差异分析报告\n")
                report.write("=" * 60 + "\n")
                report.write(f"生成时间: {datetime.now()}\n")
                report.write(f"比较文件: {file1_info['name']} ↔ {file2_info['name']}\n\n")
                
                # 1. 文件基本信息
                report.write("一、文件基本信息\n")
                report.write("=" * 25 + "\n")
                report.write("1. 源文件:\n")
                report.write(f"   - 文件名: {file1_info['name']}\n")
                report.write(f"   - 路径: {file1_info['path']}\n")
                report.write(f"   - 大小: {file1_info['size']} 字节\n")
                report.write(f"   - 行数: {file1_info['lines']} 行\n\n")
                
                report.write("2. 目标文件:\n")
                report.write(f"   - 文件名: {file2_info['name']}\n")
                report.write(f"   - 路径: {file2_info['path']}\n")
                report.write(f"   - 大小: {file2_info['size']} 字节\n")
                report.write(f"   - 行数: {file2_info['lines']} 行\n\n")
                
                # 2. 差异统计
                report.write("二、差异统计摘要\n")
                report.write("=" * 25 + "\n")
                report.write("1. 基本统计:\n")
                report.write(f"   - 源文件总行数: {file1_info['lines']}\n")
                report.write(f"   - 目标文件总行数: {file2_info['lines']}\n")
                report.write(f"   - 行数差异: {file2_info['lines'] - file1_info['lines']} 行\n\n")
                
                report.write("2. 变更统计:\n")
                report.write(f"   - 新增行数: {added}\n")
                report.write(f"   - 删除行数: {deleted}\n")
                report.write(f"   - 变更区块数: {changed_blocks}\n\n")
                
                # 3. 详细差异分析
                report.write("三、详细差异分析\n")
                report.write("=" * 25 + "\n")
                
                if added == 0 and deleted == 0:
                    report.write("✅ 两个文件内容完全一致\n")
                else:
                    report.write(f"❌ 文件存在差异，共发现 {changed_blocks} 个变更区块\n\n")
                    
                    for i, block in enumerate(blocks, 1):
                        if i > 1:
                            report.write("\n\n")
                        
                        report.write(f"【变更区块 {i}】@@{block['start1']}-{block['end1']}行 ↔ {block['start2']}-{block['end2']}行@@\n")
                        
                        for change_type, content in block['changes'][:10]:
                            if change_type == 'delete':
                                report.write(f"  ❌ 删除: {content}\n")
                            else:
                                report.write(f"      ✅ 新增: {content}\n")
                    report.write("\n")
                
                # 4. 关键变更识别
                report.write("四、关键变更识别\n")
                report.write("=" * 25 + "\n")
                
                if key_changes:
                    report.write("🔧 检测到串口相关变更:\n")
                    for change_type, content in key_changes[:5]:
                        if change_type == 'delete':
                            report.write(f"  ❌ 删除: {content}\n")
                        elif change_type == 'add':
                            report.write(f"     ✅ 新增: {content}\n")
                else:
                    report.write("   未检测到明显的串口相关变更\n")
                report.write("\n")
                
                # 5. 总结与建议
                report.write("五、总结与建议\n")
                report.write("=" * 25 + "\n")
                
                if added == 0 and deleted == 0:
                    report.write("✅ 文件完全相同，无需进一步操作\n")
                else:
                    total_changes = added + deleted
                    total_lines = max(file1_info['lines'], 1)
                    change_ratio = (total_changes * 100) // total_lines
                    
                    report.write("📊 变更程度分析:\n")
                    report.write(f"   - 总变更行数: {total_changes}\n")
                    report.write(f"   - 变更率: {change_ratio}%\n\n")
                    report.write("💡 处理建议:\n")
                    
                    if change_ratio < 10:
                        report.write("   - 轻微变更 - 建议重点审查具体变更行\n")
                    elif change_ratio < 30:
                        report.write("   - 中等变更 - 需要仔细审查变更逻辑\n")
                    else:
                        report.write("   - 重大变更 - 建议全面测试验证\n")
                
                report.write("\n" + "=" * 60 + "\n")
                report.write("报告生成完成\n")
                report.write("=" * 60 + "\n")
            
            return analysis_report_path
            
        except Exception as e:
            return None
    
    def analyze_files(self, file1, file2, output_dir):
        """执行差异分析操作"""
        try:
            # 使用默认目录如果未提供
            if not output_dir:
                output_dir = self.default_dir
            
            # 验证文件存在
            if not os.path.exists(file1):
                return {"status": "error", "message": f"文件不存在: {file1}"}
            if not os.path.exists(file2):
                return {"status": "error", "message": f"文件不存在: {file2}"}
            
            # 创建输出目录
            os.makedirs(output_dir, exist_ok=True)
            
            # 生成HTML差异报告
            html_report = self.generate_html_diff_report(file1, file2, output_dir)
            
            # 生成分析报告
            analysis_report = self.generate_analysis_report(file1, file2, output_dir)
            
            if html_report and analysis_report:
                return {
                    "status": "success",
                    "message": "差异分析完成",
                    "html_report": html_report,
                    "analysis_report": analysis_report,
                    "file1": os.path.basename(file1),
                    "file2": os.path.basename(file2)
                }
            else:
                return {"status": "error", "message": "生成报告失败"}
                
        except Exception as e:
            return {"status": "error", "message": f"分析失败: {str(e)}"}

    @staticmethod
    def get_page():
        """返回差异分析页面"""
        from flask import send_from_directory
        return send_from_directory('.', 'diff.html')
    
    @staticmethod
    def run_diff():
        """执行差异分析操作的路由处理函数"""
        from flask import request, jsonify
        try:
            data = request.get_json()
            file1 = data.get('file1', '')
            file2 = data.get('file2', '')
            output_dir = data.get('output_dir', '')
            
            if not file1 or not file2:
                return jsonify({'status': 'error', 'message': '未提供文件路径'}), 400
            
            analyzer = DiffAnalyzer()
            result = analyzer.analyze_files(file1, file2, output_dir)
            
            if result['status'] == 'success':
                return jsonify(result), 200
            else:
                return jsonify(result), 400
                
        except Exception as e:
            return jsonify({'status': 'error', 'message': f'内部错误: {str(e)}'}), 500
