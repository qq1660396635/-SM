/**
 * 主页跳转插件 - main-jumper.js
 * 功能：在任何页面引入后，自动在底部生成跳转按钮
 * 使用  <script src="/A2_全局中心/1.插件_主页跳转.js"></script>
 * 版本：1.0.2
 */

(function() {
    'use strict';

    // 配置选项
    const CONFIG = {
        // 目标页面
        targetUrl: '/index.html',
        
        // 按钮文本
        buttonText: '🏠',
        
        // 按钮样式
        buttonStyles: {
            position: 'fixed',
            bottom: '15px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: '9999',
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '20px',
            padding: '8px 16px',
            fontSize: '16px',
            fontWeight: '400',
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '50px',
            height: '40px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            opacity: '0.8'
        },
        
        // 悬停样式
        hoverStyles: {
            opacity: '1',
            transform: 'translateX(-50%) translateY(-2px)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
            background: 'rgba(0, 0, 0, 0.7)'
        },
        
        // 点击动画
        clickAnimation: {
            transform: 'translateX(-50%) scale(0.95)',
            transition: 'transform 0.1s ease'
        },
        
        // 是否在主页显示（默认不显示）
        hideOnHomePage: true,
        
        // 延迟显示时间（毫秒）
        showDelay: 500, // 减少延迟，更快显示
        
        // 移动端适配
        mobileStyles: {
            bottom: '10px',
            padding: '6px 12px',
            fontSize: '14px',
            height: '36px',
            minWidth: '45px'
        },
        
        // 移动端断点
        mobileBreakpoint: 768
    };

    /**
     * 检查是否为主页 - 改进版本
     */
    function isHomePage() {
        const currentPath = window.location.pathname;
        const homePagePaths = ['/index.html', '/', '/index.htm', ''];
        
        // 标准化路径进行比较
        const normalizedPath = currentPath.replace(/\/$/, '') || '/';
        
        return homePagePaths.some(path => {
            const normalizedHomePagePath = path.replace(/\/$/, '') || '/';
            return normalizedPath === normalizedHomePagePath || 
                   normalizedPath.endsWith(normalizedHomePagePath);
        });
    }

    /**
     * 检查是否为移动端
     */
    function isMobile() {
        return window.innerWidth <= CONFIG.mobileBreakpoint || 
               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    /**
     * 应用样式到元素
     */
    function applyStyles(element, styles) {
        Object.keys(styles).forEach(property => {
            element.style[property] = styles[property];
        });
    }

    /**
     * 创建跳转按钮
     */
    function createJumperButton() {
        const button = document.createElement('button');
        button.id = 'main-jumper-btn';
        button.className = 'main-jumper-button';
        button.innerHTML = CONFIG.buttonText;
        button.title = '返回主页';
        button.setAttribute('aria-label', '返回主页'); // 无障碍支持
        
        // 应用基础样式
        applyStyles(button, CONFIG.buttonStyles);
        
        // 移动端适配
        if (isMobile()) {
            applyStyles(button, CONFIG.mobileStyles);
        }
        
        return button;
    }

    /**
     * 处理按钮点击事件
     */
    function handleButtonClick(event) {
        const button = event.currentTarget;
        
        // 添加点击动画
        applyStyles(button, CONFIG.clickAnimation);
        
        // 显示加载状态
        const originalText = button.innerHTML;
        button.innerHTML = '⏳';
        button.disabled = true;
        
        // 执行跳转
        setTimeout(() => {
            try {
                window.location.href = CONFIG.targetUrl;
            } catch (error) {
                console.error('跳转失败:', error);
                button.innerHTML = '❌';
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.disabled = false;
                    // 重新应用基础样式
                    if (isMobile()) {
                        applyStyles(button, { ...CONFIG.buttonStyles, ...CONFIG.mobileStyles });
                    } else {
                        applyStyles(button, CONFIG.buttonStyles);
                    }
                }, 2000);
            }
        }, 300);
    }

    /**
     * 添加事件监听器
     */
    function addEventListeners(button) {
        // 点击事件
        button.addEventListener('click', handleButtonClick);
        
        // 悬停事件（仅对非移动设备）
        if (!isMobile()) {
            button.addEventListener('mouseenter', () => {
                applyStyles(button, CONFIG.hoverStyles);
            });
            
            button.addEventListener('mouseleave', () => {
                applyStyles(button, CONFIG.buttonStyles);
            });
        }
        
        // 键盘事件（Enter键触发）
        button.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleButtonClick(e);
            }
        });
    }

    /**
     * 强制创建并显示按钮
     */
    function forceCreateButton() {
        // 先移除已存在的按钮
        const existingButton = document.getElementById('main-jumper-btn');
        if (existingButton) {
            existingButton.remove();
        }
        
        // 创建新按钮
        const button = createJumperButton();
        addEventListeners(button);
        
        // 立即添加到页面
        document.body.appendChild(button);
        
        // 显示动画
        button.style.opacity = '0';
        button.style.transform = 'translateX(-50%) translateY(10px)';
        
        // 使用 requestAnimationFrame 确保动画流畅
        requestAnimationFrame(() => {
            button.style.transition = 'all 0.5s ease';
            button.style.opacity = '0.8';
            button.style.transform = 'translateX(-50%) translateY(0)';
        });
        
        console.log('Main Jumper: 跳转按钮已强制创建');
        return button;
    }

    /**
     * 初始化插件 - 改进版本
     */
    function initPlugin() {
        console.log('Main Jumper: 开始初始化，当前路径:', window.location.pathname);
        
        // 检查是否在主页
        if (CONFIG.hideOnHomePage && isHomePage()) {
            console.log('Main Jumper: 当前在主页，不显示跳转按钮');
            return;
        }

        // 使用多重检查确保按钮创建
        let attempts = 0;
        const maxAttempts = 3;
        
        function tryCreateButton() {
            attempts++;
            
            // 检查是否已存在按钮
            const existingButton = document.getElementById('main-jumper-btn');
            if (existingButton) {
                console.log('Main Jumper: 跳转按钮已存在');
                return;
            }
            
            // 确保body存在
            if (!document.body) {
                console.log('Main Jumper: body不存在，等待...');
                if (attempts < maxAttempts) {
                    setTimeout(tryCreateButton, 100);
                }
                return;
            }
            
            // 创建按钮
            const button = createJumperButton();
            addEventListeners(button);
            
            // 延迟显示
            setTimeout(() => {
                document.body.appendChild(button);
                
                // 显示动画
                button.style.opacity = '0';
                button.style.transform = 'translateX(-50%) translateY(10px)';
                
                setTimeout(() => {
                    button.style.transition = 'all 0.5s ease';
                    button.style.opacity = '0.8';
                    button.style.transform = 'translateX(-50%) translateY(0)';
                }, 50);
                
                console.log('Main Jumper: 跳转按钮已创建');
            }, CONFIG.showDelay);
        }
        
        // 立即尝试创建
        tryCreateButton();
        
        // 备用方案：确保按钮在页面加载后存在
        window.addEventListener('load', () => {
            setTimeout(() => {
                if (!document.getElementById('main-jumper-btn')) {
                    console.log('Main Jumper: 备用方案触发，重新创建按钮');
                    forceCreateButton();
                }
            }, 100);
        });
    }

    /**
     * 响应式处理
     */
    function handleResponsive() {
        const button = document.getElementById('main-jumper-btn');
        if (!button) return;
        
        if (isMobile()) {
            applyStyles(button, CONFIG.mobileStyles);
        } else {
            applyStyles(button, CONFIG.buttonStyles);
        }
    }

    /**
     * 清理函数
     */
    function cleanup() {
        const button = document.getElementById('main-jumper-btn');
        if (button) {
            button.remove();
            console.log('Main Jumper: 跳转按钮已移除');
        }
    }

    /**
     * 公开API - 更新配置
     */
    window.MainJumper = {
        // 更新目标URL
        updateTargetUrl: function(url) {
            CONFIG.targetUrl = url;
            console.log('Main Jumper: 目标URL已更新为:', url);
        },
        
        // 更新按钮文本
        updateButtonText: function(text) {
            CONFIG.buttonText = text;
            const button = document.getElementById('main-jumper-btn');
            if (button) {
                button.innerHTML = text;
            }
            console.log('Main Jumper: 按钮文本已更新为:', text);
        },
        
        // 显示/隐藏按钮
        show: function() {
            const button = document.getElementById('main-jumper-btn');
            if (button) {
                button.style.display = 'flex';
            } else {
                initPlugin();
            }
        },
        
        hide: function() {
            const button = document.getElementById('main-jumper-btn');
            if (button) {
                button.style.display = 'none';
            }
        },
        
        // 销毁插件
        destroy: cleanup,
        
        // 重新初始化
        reinit: function() {
            cleanup();
            initPlugin();
        },
        
        // 强制刷新按钮
        refresh: function() {
            cleanup();
            setTimeout(forceCreateButton, 100);
        },
        
        // 获取当前配置
        getConfig: function() {
            return { ...CONFIG };
        }
    };

    // 多重初始化策略
    function startInit() {
        // 策略1: DOM已加载完成
        if (document.readyState === 'interactive' || document.readyState === 'complete') {
            initPlugin();
        } else {
            // 策略2: 等待DOM加载
            document.addEventListener('DOMContentLoaded', initPlugin);
        }
        
        // 策略3: 确保在页面完全加载后按钮存在
        window.addEventListener('load', () => {
            setTimeout(() => {
                if (!document.getElementById('main-jumper-btn') && !isHomePage()) {
                    console.log('Main Jumper: 页面加载后未找到按钮，强制创建');
                    forceCreateButton();
                }
            }, 200);
        });
    }

    // 开始初始化
    startInit();

    // 监听窗口大小变化
    window.addEventListener('resize', handleResponsive);

    // 监听页面卸载，清理资源
    window.addEventListener('beforeunload', cleanup);

    // 监听页面可见性变化（处理浏览器标签页切换）
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && !document.getElementById('main-jumper-btn') && !isHomePage()) {
            console.log('Main Jumper: 页面重新可见，检查按钮');
            setTimeout(initPlugin, 100);
        }
    });

    console.log('Main Jumper Plugin v1.0.2 已加载');
})();
