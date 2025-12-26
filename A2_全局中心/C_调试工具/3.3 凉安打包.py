#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# 一体化Cordova 构建工具（凉安V 定制版）- 温和配置版

import os
import sys
import shutil
import random
import subprocess
import glob
from datetime import datetime

# --- 全局配置---
OUT_DIR = "/storage/emulated/0/Download"
PROJ_DIR = os.path.join(os.path.expanduser("~"), "2026")

def run_command(command, check=True, capture_output=False):
    """运行外部命令的辅助函数"""
    print(f"🔧执行命令: {command}")
    try:
        result = subprocess.run(
            command, shell=True, check=check, capture_output=capture_output, text=True
        )
        if capture_output:
            return result.stdout.strip()
        return result
    except subprocess.CalledProcessError as e:
        print(f"❌命令执行失败: {command}")
        print(f"错误信息: {e.stderr.strip() if e.stderr else '未知'}")
        sys.exit(1)
    except FileNotFoundError:
        print(f"❌命令未找到: {command.split()[0]}")
        sys.exit(1)

def check_deps():
    """检查并安装必要的依赖"""
    print("🔍检查依赖...")
    if not shutil.which("node"):
        print("❌请先pkg install nodejs")
        sys.exit(1)
    
    try:
        run_command("pkg list-installed aapt2", capture_output=True)
    except SystemExit:
        print("📦aapt2 未安装，正在安装...")
        run_command("pkg install aapt2 -y")
    
    if not shutil.which("cordova"):
        print("📦Cordova 未安装，正在全局安装...")
        run_command("npm i -g cordova")
    
    print("✅所有依赖检查通过。")

def ask_app_name():
    """询问版本号并生成应用名称"""
    ver = input("请输入今天版本号（如11.2a）: ")
    if not ver:
        print("❌版本号不能为空")
        sys.exit(1)
    return f"凉安V{ver}"

def rand_apk_name():
    """生成带4位随机数的APK文件名"""
    num = random.randint(0, 9999)
    return f"凉安V{num:04d}.apk"

def build_apk():
    """打包网页为APK（温和配置版）"""
    print("\n=== 打包模式 ===")
    print("1) 打包单个HTML文件")
    print("2) 打包整个目录（含index.html）")
    mode = input("请选择(1/2): ")
    if mode not in ("1", "2"):
        print("❌无效选择")
        return
    
    src_path = input("请输入路径（文件或目录）: ").strip()
    if not os.path.exists(src_path):
        print("❌路径不存在")
        return
    
    app_title = ask_app_name()
    
    # 1. 检查并安装依赖
    check_deps()
    
    # 2. 创建并配置Cordova 项目
    if os.path.exists(PROJ_DIR):
        print(f"🧹清理旧项目目录: {PROJ_DIR}")
        shutil.rmtree(PROJ_DIR)
    
    app_id = f"com.example.auto.v{int(datetime.now().timestamp())}"
    run_command(f"cordova create {PROJ_DIR} {app_id} '{app_title}'")
    
    original_cwd = os.getcwd()
    os.chdir(PROJ_DIR)
    print(f"📍切换到项目目录: {os.getcwd()}")
    
    try:
        # 3. 复制源文件到www目录
        print("📋复制源文件...")
        www_dir = "www"
        shutil.rmtree(www_dir, ignore_errors=True)
        os.makedirs(www_dir)
        
        # 图标处理
        icon_path = None
        if mode == "1":
            src_dir = os.path.dirname(os.path.abspath(src_path))
            potential_icon = os.path.join(src_dir, "icon.png")
            if os.path.exists(potential_icon):
                icon_path = potential_icon
            shutil.copy2(src_path, os.path.join(www_dir, "index.html"))
        else:
            potential_icon = os.path.join(os.path.abspath(src_path), "icon.png")
            if os.path.exists(potential_icon):
                icon_path = potential_icon
            shutil.copytree(src_path, www_dir, dirs_exist_ok=True)
        
        if icon_path and os.path.exists(icon_path):
            print("🎨检测到图标，正在配置...")
            dest_icon = os.path.join(os.getcwd(), "icon.png")
            shutil.copy2(icon_path, dest_icon)
            
            # 修改config.xml添加图标配置
            config_path = "config.xml"
            with open(config_path, 'r', encoding='utf-8') as f:
                config_content = f.read()
            
            widget_start = config_content.find('<widget')
            if widget_start != -1:
                icon_config = '\n    <icon src="icon.png" />\n'
                insert_pos = config_content.find('>', widget_start) + 1
                new_config = config_content[:insert_pos] + icon_config + config_content[insert_pos:]
                with open(config_path, 'w', encoding='utf-8') as f:
                    f.write(new_config)
        
        # 4. 温和添加平台和插件（优化顺序）
        print("🤖添加Android平台...")
        run_command("cordova platform add android@12.0.1 --no-fetch")
        
        print("🔌添加基础插件...")
        run_command("cordova plugin add cordova-plugin-inappbrowser")
        run_command("cordova plugin add cordova-plugin-file")
        run_command("cordova plugin add cordova-plugin-dialogs")
        run_command("cordova plugin add cordova-plugin-x-socialsharing")
        
        # 5. 温和配置权限
        print("📋配置必要权限...")
        manifest_path = "platforms/android/app/src/main/AndroidManifest.xml"
        
        # 只添加必要的权限
        with open(manifest_path, 'r') as f:
            manifest_content = f.read()
        
        permissions = [
            'android.permission.WRITE_EXTERNAL_STORAGE',
            'android.permission.READ_EXTERNAL_STORAGE'
        ]
        
        for perm in permissions:
            if f'android:name="{perm}"' not in manifest_content:
                manifest_content = manifest_content.replace(
                    '</manifest>',
                    f'    <uses-permission android:name="{perm}" />\n</manifest>'
                )
        
        # 添加传统存储模式支持
        if 'android:requestLegacyExternalStorage="true"' not in manifest_content:
            manifest_content = manifest_content.replace(
                '<application',
                '<application android:requestLegacyExternalStorage="true"'
            )
        
        with open(manifest_path, 'w') as f:
            f.write(manifest_content)
        
        # 6. 温和配置网络安全
        print("🔒配置网络安全策略...")
        config_dir = "platforms/android/app/src/main/res/xml"
        os.makedirs(config_dir, exist_ok=True)
        config_file_path = os.path.join(config_dir, "network_security_config.xml")
        
        with open(config_file_path, 'w') as f:
            f.write(
                '<?xml version="1.0" encoding="utf-8"?>\n'
                '<network-security-config>\n'
                '    <base-config cleartextTrafficPermitted="true" />\n'
                '</network-security-config>\n'
            )
        
        # 更新AndroidManifest.xml
        with open(manifest_path, 'r') as f:
            manifest_content = f.read()
        
        if 'android:usesCleartextTraffic="true"' not in manifest_content:
            manifest_content = manifest_content.replace(
                '<application',
                '<application android:usesCleartextTraffic="true"'
            )
        
        if 'android:networkSecurityConfig="@xml/network_security_config"' not in manifest_content:
            manifest_content = manifest_content.replace(
                '<application',
                '<application android:networkSecurityConfig="@xml/network_security_config"'
            )
        
        with open(manifest_path, 'w') as f:
            f.write(manifest_content)
        
        # 7. 配置Gradle
        print("⚙️配置Gradle...")
        gradle_props_path = os.path.join("platforms", "android", "gradle.properties")
        aapt2_termux_path = "/data/data/com.termux/files/usr/bin/aapt2"
        
        with open(gradle_props_path, "a") as f:
            f.write(f"\nandroid.aapt2FromMavenOverride={aapt2_termux_path}\n")
            f.write("android.enableAapt2Daemon=false\n")
        
        # 8. 清理构建缓存
        print("🧹清理构建缓存...")
        shutil.rmtree("platforms/android/build", ignore_errors=True)
        shutil.rmtree("platforms/android/app/build", ignore_errors=True)
        run_command("pkill -f gradle", check=False)
        
        # 9. 执行构建
        print("🏗️开始构建...")
        run_command("cordova build android")
        
        # 10. 复制APK
        print("📦复制APK...")
        os.makedirs(OUT_DIR, exist_ok=True)
        apk_src_path = "platforms/android/app/build/outputs/apk/debug/app-debug.apk"
        apk_dest_path = os.path.join(OUT_DIR, "凉安V1r.apk")
        shutil.copy2(apk_src_path, apk_dest_path)
        print(f"✅构建完成→{apk_dest_path}")
        
    finally:
        os.chdir(original_cwd)

def copy_latest_apk():
    """复制最新APK"""
    print("\n=== 复制最新APK ===")
    if not os.path.isdir(PROJ_DIR):
        print("❌项目目录不存在")
        return
    
    original_cwd = os.getcwd()
    os.chdir(PROJ_DIR)
    
    try:
        apk_list = glob.glob("./*.apk", recursive=True)
        if not apk_list:
            print("❌未找到APK")
            return
        
        latest_apk_path = max(apk_list, key=os.path.getmtime)
        new_name = rand_apk_name()
        
        os.makedirs(OUT_DIR, exist_ok=True)
        dest_path = os.path.join(OUT_DIR, new_name)
        shutil.copy2(latest_apk_path, dest_path)
        print(f"✅已复制→{dest_path}")
    
    finally:
        os.chdir(original_cwd)

if __name__ == "__main__":
    print("=== Cordova 构建工具（凉安V 温和版）===")
    print("1) 打包网页为APK（温和配置）")
    print("2) 复制最新APK")
    
    choice = input("请输入选择(1/2): ")
    
    if choice == "1":
        build_apk()
    elif choice == "2":
        copy_latest_apk()
    else:
        print("❌无效选择")
