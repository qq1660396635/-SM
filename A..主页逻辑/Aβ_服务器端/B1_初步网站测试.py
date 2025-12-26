import os
import subprocess
import requests
import socket
import ssl
import time
import json
import re
import dns.resolver
from flask import request, jsonify, send_from_directory
from app_config import AppConfig

class SecurityTester:
    COMMON_PORTS = [21, 22, 23, 25, 53, 80, 110, 143, 443, 993, 995, 1433, 3306, 3389, 5432, 6379, 8080, 8443]
    COMMON_DIRS = ['admin', 'backup', 'config', 'test', 'api', 'docs', 'logs', 'tmp', 'old', 'dev', 'db', 'sql', 'backup.php', 'config.php', 'admin.php']
    COMMON_FILES = ['.env', '.git/config', 'wp-config.php', 'config.ini', 'database.yml', 'web.config']
    
    @staticmethod
    def get_page():
        """安全测试页面"""
        return send_from_directory('.', '2_网安网站测试.html')
    
    @staticmethod
    def run_test():
        """执行安全测试"""
        try:
            data = request.get_json()
            url = data.get('url', '').strip()
            test_type = data.get('test', '')
            
            if not url:
                return jsonify({'status': 'error', 'error': 'URL不能为空'})
            
            # 确保URL格式正确
            if not url.startswith(('http://', 'https://')):
                url = 'https://' + url
            
            # 根据测试类型执行相应测试
            test_methods = {
                'http_headers': SecurityTester.test_http_headers,
                'ssl_tls': SecurityTester.test_ssl_tls,
                'port_scan': SecurityTester.test_port_scan,
                'dir_scan': SecurityTester.test_directory_scan,
                'subdomain': SecurityTester.test_subdomain_enum,
                'whois': SecurityTester.test_whois,
                'dns_records': SecurityTester.test_dns_records,
                'http_methods': SecurityTester.test_http_methods,
                'server_info': SecurityTester.test_server_info,
                'vuln_scan': SecurityTester.test_vulnerabilities,
                'robots_txt': SecurityTester.test_robots_txt,
                'sitemap': SecurityTester.test_sitemap,
                'response_time': SecurityTester.test_response_time,
                'redirects': SecurityTester.test_redirects,
                'cookies': SecurityTester.test_cookies,
                'csp': SecurityTester.test_csp,
                'hsts': SecurityTester.test_hsts,
                'x_frame': SecurityTester.test_x_frame_options,
                'content_type': SecurityTester.test_content_type,
                'file_upload': SecurityTester.test_file_upload,
                'sql_injection': SecurityTester.test_sql_injection,
                'xss': SecurityTester.test_xss,
                'csrf': SecurityTester.test_csrf,
                'session_mgmt': SecurityTester.test_session_management,
                'auth_mechanism': SecurityTester.test_authentication,
                'access_control': SecurityTester.test_access_control,
                'info_leak': SecurityTester.test_info_leakage,
                'backup_files': SecurityTester.test_backup_files,
                'config_files': SecurityTester.test_config_files,
                'error_pages': SecurityTester.test_error_pages,
                'api_endpoints': SecurityTester.test_api_endpoints,
                'tech_stack': SecurityTester.test_tech_stack
            }
            
            if test_type in test_methods:
                result = test_methods[test_type](url)
                return jsonify({'status': 'success', 'result': result})
            else:
                return jsonify({'status': 'error', 'error': '未知测试类型'})
                
        except Exception as e:
            return jsonify({'status': 'error', 'error': str(e)})
    
    @staticmethod
    def test_http_headers(url):
        """HTTP安全头检查"""
        try:
            response = requests.get(url, timeout=10, verify=False)
            headers = response.headers
            
            security_headers = {
                'X-Frame-Options': headers.get('X-Frame-Options', '未设置'),
                'X-XSS-Protection': headers.get('X-XSS-Protection', '未设置'),
                'X-Content-Type-Options': headers.get('X-Content-Type-Options', '未设置'),
                'Strict-Transport-Security': headers.get('Strict-Transport-Security', '未设置'),
                'Content-Security-Policy': headers.get('Content-Security-Policy', '未设置'),
                'Referrer-Policy': headers.get('Referrer-Policy', '未设置'),
                'Permissions-Policy': headers.get('Permissions-Policy', '未设置')
            }
            
            result = "安全头检查结果:\n"
            for header, value in security_headers.items():
                status = "✅" if value != "未设置" else "❌"
                result += f"{status} {header}: {value}\n"
            
            return result
        except Exception as e:
            return f"测试失败: {str(e)}"
    
    @staticmethod
    def test_ssl_tls(url):
        """SSL/TLS配置检查"""
        try:
            hostname = url.split('//')[1].split('/')[0]
            context = ssl.create_default_context()
            context.check_hostname = False
            context.verify_mode = ssl.CERT_NONE
            
            with socket.create_connection((hostname, 443), timeout=10) as sock:
                with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                    cert = ssock.getpeercert()
                    version = ssock.version()
                    cipher = ssock.cipher()
                    
                    result = f"SSL/TLS信息:\n"
                    result += f"版本: {version}\n"
                    result += f"加密套件: {cipher[0]}\n"
                    result += f"证书主体: {cert['subject'][0][0][1]}\n"
                    result += f"颁发者: {cert['issuer'][0][0][1]}\n"
                    result += f"有效期: {cert['notBefore']} 至 {cert['notAfter']}\n"
                    
                    return result
        except Exception as e:
            return f"SSL/TLS检查失败: {str(e)}"
    
    @staticmethod
    def test_port_scan(url):
        """端口扫描"""
        try:
            hostname = url.split('//')[1].split('/')[0]
            result = f"端口扫描结果 ({hostname}):\n"
            
            for port in SecurityTester.COMMON_PORTS:
                sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                sock.settimeout(1)
                try:
                    sock.connect((hostname, port))
                    result += f"✅ 端口 {port} 开放\n"
                except:
                    result += f"❌ 端口 {port} 关闭\n"
                finally:
                    sock.close()
            
            return result
        except Exception as e:
            return f"端口扫描失败: {str(e)}"
    
    @staticmethod
    def test_directory_scan(url):
        """目录扫描"""
        try:
            base_url = url.rstrip('/')
            result = "敏感目录扫描结果:\n"
            
            for dir_name in SecurityTester.COMMON_DIRS:
                test_url = f"{base_url}/{dir_name}/"
                try:
                    response = requests.get(test_url, timeout=5, verify=False)
                    if response.status_code == 200:
                        result += f"✅ 发现目录: {test_url} (状态码: {response.status_code})\n"
                except:
                    pass
            
            return result if "✅" in result else "未发现敏感目录"
        except Exception as e:
            return f"目录扫描失败: {str(e)}"
    
    @staticmethod
    def test_subdomain_enum(url):
        """子域名枚举"""
        try:
            domain = url.split('//')[1].split('/')[0]
            result = f"子域名枚举结果 ({domain}):\n"
            
            common_subdomains = ['www', 'mail', 'ftp', 'admin', 'test', 'dev', 'api', 'blog', 'shop', 'forum']
            
            for sub in common_subdomains:
                subdomain = f"{sub}.{domain}"
                try:
                    socket.gethostbyname(subdomain)
                    result += f"✅ 发现子域名: {subdomain}\n"
                except:
                    pass
            
            return result if "✅" in result else "未发现常见子域名"
        except Exception as e:
            return f"子域名枚举失败: {str(e)}"
    
    @staticmethod
    def test_whois(url):
        """WHOIS信息查询"""
        try:
            domain = url.split('//')[1].split('/')[0]
            result = f"WHOIS信息 ({domain}):\n"
            
            try:
                import whois
                w = whois.whois(domain)
                result += f"注册商: {w.registrar}\n"
                result += f"创建时间: {w.creation_date}\n"
                result += f"过期时间: {w.expiration_date}\n"
                result += f"域名服务器: {', '.join(w.name_servers)}\n"
            except:
                result += "WHOIS查询失败，可能需要安装python-whois包"
            
            return result
        except Exception as e:
            return f"WHOIS查询失败: {str(e)}"
    
    @staticmethod
    def test_dns_records(url):
        """DNS记录查询"""
        try:
            domain = url.split('//')[1].split('/')[0]
            result = f"DNS记录查询 ({domain}):\n"
            
            record_types = ['A', 'AAAA', 'MX', 'TXT', 'NS']
            
            for record_type in record_types:
                try:
                    answers = dns.resolver.resolve(domain, record_type)
                    result += f"{record_type}记录: "
                    for rdata in answers:
                        result += f"{rdata} "
                    result += "\n"
                except:
                    result += f"{record_type}记录: 未找到\n"
            
            return result
        except Exception as e:
            return f"DNS查询失败: {str(e)}"
    
    @staticmethod
    def test_http_methods(url):
        """HTTP方法检测"""
        try:
            methods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'PATCH', 'TRACE']
            result = "HTTP方法检测结果:\n"
            
            for method in methods:
                try:
                    response = requests.request(method, url, timeout=5, verify=False)
                    if response.status_code not in [405, 501]:
                        result += f"✅ {method} 方法允许 (状态码: {response.status_code})\n"
                    else:
                        result += f"❌ {method} 方法不允许\n"
                except:
                    result += f"❌ {method} 方法不可用\n"
            
            return result
        except Exception as e:
            return f"HTTP方法检测失败: {str(e)}"
    
    @staticmethod
    def test_server_info(url):
        """服务器信息泄露"""
        try:
            response = requests.get(url, timeout=10, verify=False)
            headers = response.headers
            
            result = "服务器信息检查:\n"
            result += f"服务器: {headers.get('Server', '未暴露')}\n"
            result += f"X-Powered-By: {headers.get('X-Powered-By', '未暴露')}\n"
            result += f"X-Generator: {headers.get('X-Generator', '未暴露')}\n"
            
            # 检查响应中的技术栈信息
            content = response.text.lower()
            tech_stack = []
            if 'wordpress' in content:
                tech_stack.append('WordPress')
            if 'drupal' in content:
                tech_stack.append('Drupal')
            if 'joomla' in content:
                tech_stack.append('Joomla')
            if 'react' in content:
                tech_stack.append('React')
            if 'vue' in content:
                tech_stack.append('Vue.js')
            if 'angular' in content:
                tech_stack.append('Angular')
            
            if tech_stack:
                result += f"检测到的技术栈: {', '.join(tech_stack)}\n"
            
            return result
        except Exception as e:
            return f"服务器信息检查失败: {str(e)}"
    
    @staticmethod
    def test_vulnerabilities(url):
        """常见漏洞扫描"""
        try:
            result = "常见漏洞扫描:\n"
            
            # 检查SQL注入
            test_urls = [
                f"{url}?id=1'",
                f"{url}?id=1 OR 1=1",
                f"{url}?id=1 UNION SELECT 1"
            ]
            
            sql_injection_found = False
            for test_url in test_urls:
                try:
                    response = requests.get(test_url, timeout=5, verify=False)
                    if 'error' in response.text.lower() or 'mysql' in response.text.lower():
                        result += "⚠️ 可能存在SQL注入漏洞\n"
                        sql_injection_found = True
                        break
                except:
                    pass
            
            if not sql_injection_found:
                result += "✅ 未发现明显的SQL注入漏洞\n"
            
            # 检查目录遍历
            traversal_urls = [
                f"{url}?file=../../../../etc/passwd",
                f"{url}?path=../windows/system32/drivers/etc/hosts"
            ]
            
            for test_url in traversal_urls:
                try:
                    response = requests.get(test_url, timeout=5, verify=False)
                    if 'root:' in response.text or 'localhost' in response.text:
                        result += "⚠️ 可能存在目录遍历漏洞\n"
                        break
                except:
                    pass
            
            return result
        except Exception as e:
            return f"漏洞扫描失败: {str(e)}"
    
    @staticmethod
    def test_robots_txt(url):
        """robots.txt检查"""
        try:
            robots_url = url.rstrip('/') + '/robots.txt'
            response = requests.get(robots_url, timeout=10, verify=False)
            
            if response.status_code == 200:
                result = f"发现robots.txt文件:\n{response.text[:500]}"
                if len(response.text) > 500:
                    result += "\n...(内容过长，已截断)"
            else:
                result = f"robots.txt不存在 (状态码: {response.status_code})"
            
            return result
        except Exception as e:
            return f"robots.txt检查失败: {str(e)}"
    
    @staticmethod
    def test_sitemap(url):
        """sitemap.xml检查"""
        try:
            sitemap_urls = [
                url.rstrip('/') + '/sitemap.xml',
                url.rstrip('/') + '/sitemap_index.xml'
            ]
            
            for sitemap_url in sitemap_urls:
                try:
                    response = requests.get(sitemap_url, timeout=10, verify=False)
                    if response.status_code == 200:
                        result = f"发现sitemap文件: {sitemap_url}\n"
                        # 简单解析URL数量
                        url_count = response.text.count('<url>')
                        result += f"包含 {url_count} 个URL"
                        return result
                except:
                    continue
            
            return "未发现sitemap文件"
        except Exception as e:
            return f"sitemap检查失败: {str(e)}"
    
    @staticmethod
    def test_response_time(url):
        """响应时间测试"""
        try:
            times = []
            for _ in range(5):
                start = time.time()
                response = requests.get(url, timeout=10, verify=False)
                end = time.time()
                times.append((end - start) * 1000)
            
            avg_time = sum(times) / len(times)
            min_time = min(times)
            max_time = max(times)
            
            result = f"响应时间测试结果 (5次请求):\n"
            result += f"平均响应时间: {avg_time:.2f}ms\n"
            result += f"最快响应时间: {min_time:.2f}ms\n"
            result += f"最慢响应时间: {max_time:.2f}ms\n"
            
            if avg_time < 200:
                result += "✅ 响应速度优秀"
            elif avg_time < 500:
                result += "⚠️ 响应速度一般"
            else:
                result += "❌ 响应速度较慢"
            
            return result
        except Exception as e:
            return f"响应时间测试失败: {str(e)}"
    
    @staticmethod
    def test_redirects(url):
        """重定向链检查"""
        try:
            response = requests.get(url, timeout=10, verify=False, allow_redirects=True)
            history = response.history
            
            result = f"重定向链检查:\n"
            if history:
                result += f"重定向次数: {len(history)}\n"
                for i, resp in enumerate(history):
                    result += f"{i+1}. {resp.url} -> {resp.headers.get('Location', 'N/A')}\n"
                result += f"最终URL: {response.url}"
            else:
                result += "无重定向"
            
            return result
        except Exception as e:
            return f"重定向检查失败: {str(e)}"
    
    @staticmethod
    def test_cookies(url):
        """Cookie安全检查"""
        try:
            response = requests.get(url, timeout=10, verify=False)
            cookies = response.cookies
            
            result = "Cookie安全检查:\n"
            if cookies:
                for cookie in cookies:
                    result += f"Cookie: {cookie.name}\n"
                    if cookie.secure:
                        result += "  ✅ Secure标志已设置\n"
                    else:
                        result += "  ❌ Secure标志未设置\n"
                    
                    if cookie.has_nonstandard_attr('HttpOnly'):
                        result += "  ✅ HttpOnly标志已设置\n"
                    else:
                        result += "  ❌ HttpOnly标志未设置\n"
                    
                    if cookie.has_nonstandard_attr('SameSite'):
                        result += "  ✅ SameSite标志已设置\n"
                    else:
                        result += "  ⚠️ SameSite标志未设置\n"
            else:
                result += "未发现Cookie"
            
            return result
        except Exception as e:
            return f"Cookie检查失败: {str(e)}"
    
    @staticmethod
    def test_csp(url):
        """CSP策略检查"""
        try:
            response = requests.get(url, timeout=10, verify=False)
            csp = response.headers.get('Content-Security-Policy')
            
            result = "CSP策略检查:\n"
            if csp:
                result += f"✅ CSP已设置: {csp[:100]}..."
                if len(csp) > 100:
                    result += "(内容过长，已截断)"
            else:
                result += "❌ CSP未设置，建议配置以防止XSS攻击"
            
            return result
        except Exception as e:
            return f"CSP检查失败: {str(e)}"
    
    @staticmethod
    def test_hsts(url):
        """HSTS检查"""
        try:
            response = requests.get(url, timeout=10, verify=False)
            hsts = response.headers.get('Strict-Transport-Security')
            
            result = "HSTS检查:\n"
            if hsts:
                result += f"✅ HSTS已设置: {hsts}"
            else:
                result += "❌ HSTS未设置，建议启用以强制HTTPS"
            
            return result
        except Exception as e:
            return f"HSTS检查失败: {str(e)}"
    
    @staticmethod
    def test_x_frame_options(url):
        """X-Frame-Options检查"""
        try:
            response = requests.get(url, timeout=10, verify=False)
            xfo = response.headers.get('X-Frame-Options')
            
            result = "X-Frame-Options检查:\n"
            if xfo:
                result += f"✅ X-Frame-Options已设置: {xfo}"
            else:
                result += "❌ X-Frame-Options未设置，可能存在点击劫持风险"
            
            return result
        except Exception as e:
            return f"X-Frame-Options检查失败: {str(e)}"
    
    @staticmethod
    def test_content_type(url):
        """内容类型嗅探检查"""
        try:
            response = requests.get(url, timeout=10, verify=False)
            xcto = response.headers.get('X-Content-Type-Options')
            
            result = "内容类型嗅探检查:\n"
            if xcto == 'nosniff':
                result += "✅ 已禁用内容类型嗅探"
            else:
                result += "❌ 未禁用内容类型嗅探，存在MIME类型混淆风险"
            
            return result
        except Exception as e:
            return f"内容类型检查失败: {str(e)}"
    
    @staticmethod
    def test_file_upload(url):
        """文件上传漏洞检测"""
        try:
            result = "文件上传功能检查:\n"
            
            # 检查常见的上传路径
            upload_paths = ['/upload', '/uploads', '/files', '/upload.php']
            base_url = url.rstrip('/')
            
            found_upload = False
            for path in upload_paths:
                test_url = f"{base_url}{path}"
                try:
                    response = requests.get(test_url, timeout=5, verify=False)
                    if response.status_code == 200:
                        result += f"⚠️ 发现可能的上传页面: {test_url}\n"
                        found_upload = True
                except:
                    pass
            
            if not found_upload:
                result += "✅ 未发现明显的文件上传功能"
            
            return result
        except Exception as e:
            return f"文件上传检查失败: {str(e)}"
    
    @staticmethod
    def test_sql_injection(url):
        """SQL注入检测"""
        try:
            result = "SQL注入检测:\n"
            
            # 测试参数
            test_params = [
                {"id": "1'"},
                {"id": "1\""},
                {"id": "1 OR 1=1"},
                {"id": "1 AND 1=1"},
                {"search": "' OR '1'='1"}
            ]
            
            injection_found = False
            for params in test_params:
                try:
                    response = requests.get(url, params=params, timeout=5, verify=False)
                    # 检查SQL错误
                    sql_errors = ['mysql', 'sql syntax', 'ora-', 'microsoft odbc', 'sqlite_']
                    if any(error in response.text.lower() for error in sql_errors):
                        result += f"⚠️ 可能存在SQL注入漏洞 (参数: {params})\n"
                        injection_found = True
                except:
                    pass
            
            if not injection_found:
                result += "✅ 未发现明显的SQL注入漏洞"
            
            return result
        except Exception as e:
            return f"SQL注入检测失败: {str(e)}"
    
    @staticmethod
    def test_xss(url):
        """XSS漏洞检测"""
        try:
            result = "XSS漏洞检测:\n"
            
            # XSS测试载荷
            xss_payloads = [
                "<script>alert('XSS')</script>",
                "javascript:alert('XSS')",
                "<img src=x onerror=alert('XSS')>",
                "';alert('XSS');//"
            ]
            
            xss_found = False
            for payload in xss_payloads:
                try:
                    response = requests.get(url, params={'q': payload, 'search': payload}, timeout=5, verify=False)
                    if payload in response.text:
                        result += f"⚠️ 可能存在XSS漏洞 (载荷: {payload[:20]}...)\n"
                        xss_found = True
                except:
                    pass
            
            if not xss_found:
                result += "✅ 未发现明显的XSS漏洞"
            
            return result
        except Exception as e:
            return f"XSS检测失败: {str(e)}"
    
    @staticmethod
    def test_csrf(url):
        """CSRF令牌检查"""
        try:
            response = requests.get(url, timeout=10, verify=False)
            content = response.text.lower()
            
            result = "CSRF保护检查:\n"
            
            # 检查CSRF令牌
            csrf_indicators = ['csrf', 'token', '_token', 'authenticity_token']
            csrf_found = any(indicator in content for indicator in csrf_indicators)
            
            if csrf_found:
                result += "✅ 发现CSRF保护机制"
            else:
                result += "⚠️ 未发现明显的CSRF保护机制"
            
            return result
        except Exception as e:
            return f"CSRF检查失败: {str(e)}"
    
    @staticmethod
    def test_session_management(url):
        """会话管理安全"""
        try:
            response = requests.get(url, timeout=10, verify=False)
            
            result = "会话管理安全检查:\n"
            
            # 检查Session Cookie
            cookies = response.cookies
            session_cookie = None
            for cookie in cookies:
                if 'session' in cookie.name.lower() or 'jsession' in cookie.name.lower():
                    session_cookie = cookie
                    break
            
            if session_cookie:
                result += f"发现会话Cookie: {session_cookie.name}\n"
                if session_cookie.secure:
                    result += "✅ Secure标志已设置\n"
                else:
                    result += "❌ Secure标志未设置\n"
                
                if session_cookie.has_nonstandard_attr('HttpOnly'):
                    result += "✅ HttpOnly标志已设置\n"
                else:
                    result += "❌ HttpOnly标志未设置\n"
            else:
                result += "未发现会话Cookie"
            
            return result
        except Exception as e:
            return f"会话管理检查失败: {str(e)}"
    
    @staticmethod
    def test_authentication(url):
        """认证机制分析"""
        try:
            response = requests.get(url, timeout=10, verify=False)
            content = response.text.lower()
            
            result = "认证机制分析:\n"
            
            # 检查登录相关
            if 'login' in content or 'signin' in content:
                result += "✅ 发现登录功能\n"
                
                # 检查HTTPS
                if url.startswith('https://'):
                    result += "✅ 登录页面使用HTTPS\n"
                else:
                    result += "❌ 登录页面未使用HTTPS\n"
            else:
                result += "未发现明显的登录功能"
            
            return result
        except Exception as e:
            return f"认证机制检查失败: {str(e)}"
    
    @staticmethod
    def test_access_control(url):
        """权限控制测试"""
        try:
            result = "权限控制测试:\n"
            
            # 测试常见的管理路径
            admin_paths = ['/admin', '/administrator', '/admin.php', '/admin.html']
            base_url = url.rstrip('/')
            
            for path in admin_paths:
                test_url = f"{base_url}{path}"
                try:
                    response = requests.get(test_url, timeout=5, verify=False)
                    if response.status_code == 200:
                        result += f"⚠️ 发现管理页面: {test_url}\n"
                except:
                    pass
            
            if "⚠️" not in result:
                result += "✅ 未发现暴露的管理页面"
            
            return result
        except Exception as e:
            return f"权限控制测试失败: {str(e)}"
    
    @staticmethod
    def test_info_leakage(url):
        """敏感信息泄露"""
        try:
            response = requests.get(url, timeout=10, verify=False)
            content = response.text.lower()
            
            result = "敏感信息泄露检查:\n"
            
            # 检查敏感信息
            sensitive_patterns = [
                ('email', r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'),
                ('phone', r'\b\d{3}-\d{3}-\d{4}\b'),
                ('api key', r'api[_-]?key["\']?\s*[:=]\s*["\']?[A-Za-z0-9_-]+'),
                ('password', r'password["\']?\s*[:=]\s*["\']?[^\s"\']+'),
                ('error', r'error|exception|fatal|warning')
            ]
            
            for pattern_name, pattern in sensitive_patterns:
                matches = re.findall(pattern, content)
                if matches:
                    result += f"⚠️ 发现{pattern_name}: {len(matches)}处\n"
            
            if "⚠️" not in result:
                result += "✅ 未发现明显的敏感信息泄露"
            
            return result
        except Exception as e:
            return f"信息泄露检查失败: {str(e)}"
    
    @staticmethod
    def test_backup_files(url):
        """备份文件扫描"""
        try:
            result = "备份文件扫描:\n"
            base_url = url.rstrip('/')
            
            backup_extensions = ['.bak', '.backup', '.old', '.orig', '.save', '.tmp', '.zip', '.tar.gz']
            backup_files = ['config', 'database', 'db', 'backup', 'dump', 'sql']
            
            found_backup = False
            for file in backup_files:
                for ext in backup_extensions:
                    test_url = f"{base_url}/{file}{ext}"
                    try:
                        response = requests.get(test_url, timeout=5, verify=False)
                        if response.status_code == 200:
                            result += f"⚠️ 发现备份文件: {test_url}\n"
                            found_backup = True
                    except:
                        pass
            
            if not found_backup:
                result += "✅ 未发现备份文件"
            
            return result
        except Exception as e:
            return f"备份文件扫描失败: {str(e)}"
    
    @staticmethod
    def test_config_files(url):
        """配置文件检查"""
        try:
            result = "配置文件检查:\n"
            base_url = url.rstrip('/')
            
            config_files = [
                '.env', '.env.example', '.env.local',
                'config.php', 'config.ini', 'config.yml',
                'wp-config.php', 'database.yml',
                'web.config', '.htaccess'
            ]
            
            found_config = False
            for file in config_files:
                test_url = f"{base_url}/{file}"
                try:
                    response = requests.get(test_url, timeout=5, verify=False)
                    if response.status_code == 200:
                        result += f"⚠️ 发现配置文件: {test_url}\n"
                        found_config = True
                except:
                    pass
            
            if not found_config:
                result += "✅ 未发现暴露的配置文件"
            
            return result
        except Exception as e:
            return f"配置文件检查失败: {str(e)}"
    
    @staticmethod
    def test_error_pages(url):
        """错误页面信息"""
        try:
            result = "错误页面信息泄露检查:\n"
            
            # 测试404错误
            test_urls = [
                f"{url}/nonexistent-page-{int(time.time())}",
                f"{url}?id=invalid"
            ]
            
            for test_url in test_urls:
                try:
                    response = requests.get(test_url, timeout=5, verify=False)
                    if response.status_code == 404:
                        # 检查是否泄露服务器信息
                        if 'server' in response.text.lower() or 'apache' in response.text.lower() or 'nginx' in response.text.lower():
                            result += f"⚠️ 404页面可能泄露服务器信息\n"
                        break
                except:
                    pass
            
            if "⚠️" not in result:
                result += "✅ 错误页面未泄露敏感信息"
            
            return result
        except Exception as e:
            return f"错误页面检查失败: {str(e)}"
    
    @staticmethod
    def test_api_endpoints(url):
        """API端点发现"""
        try:
            result = "API端点发现:\n"
            base_url = url.rstrip('/')
            
            api_paths = ['/api', '/api/v1', '/api/v2', '/rest', '/graphql', '/webhook']
            
            found_api = False
            for path in api_paths:
                test_url = f"{base_url}{path}"
                try:
                    response = requests.get(test_url, timeout=5, verify=False)
                    if response.status_code in [200, 401, 403]:
                        result += f"✅ 发现API端点: {test_url} (状态码: {response.status_code})\n"
                        found_api = True
                except:
                    pass
            
            if not found_api:
                result += "未发现明显的API端点"
            
            return result
        except Exception as e:
            return f"API端点发现失败: {str(e)}"
    
    @staticmethod
    def test_tech_stack(url):
        """Web技术栈识别"""
        try:
            response = requests.get(url, timeout=10, verify=False)
            headers = response.headers
            content = response.text.lower()
            
            result = "Web技术栈识别:\n"
            
            # 服务器软件
            server = headers.get('Server', '').lower()
            if 'apache' in server:
                result += "✅ Web服务器: Apache\n"
            elif 'nginx' in server:
                result += "✅ Web服务器: Nginx\n"
            elif 'iis' in server:
                result += "✅ Web服务器: IIS\n"
            
            # 编程语言/框架
            if 'php' in content:
                result += "✅ 后端语言: PHP\n"
            if 'asp.net' in content or '__viewstate' in content:
                result += "✅ 后端框架: ASP.NET\n"
            if 'django' in content:
                result += "✅ 后端框架: Django\n"
            if 'flask' in content:
                result += "✅ 后端框架: Flask\n"
            if 'express' in content:
                result += "✅ 后端框架: Express.js\n"
            if 'spring' in content:
                result += "✅ 后端框架: Spring\n"
            
            # 前端框架
            if 'react' in content:
                result += "✅ 前端框架: React\n"
            if 'vue' in content:
                result += "✅ 前端框架: Vue.js\n"
            if 'angular' in content:
                result += "✅ 前端框架: Angular\n"
            if 'jquery' in content:
                result += "✅ 前端库: jQuery\n"
            
            # CMS
            if 'wordpress' in content:
                result += "✅ CMS: WordPress\n"
            if 'drupal' in content:
                result += "✅ CMS: Drupal\n"
            if 'joomla' in content:
                result += "✅ CMS: Joomla\n"
            
            if "✅" not in result:
                result += "未能识别出明显的技术栈"
            
            return result
        except Exception as e:
            return f"技术栈识别失败: {str(e)}"
