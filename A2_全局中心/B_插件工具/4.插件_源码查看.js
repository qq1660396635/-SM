/**
 * 页面源码查看器插件
 * 使用方法：在页面中引入 <script src="source-viewer.js"></script>
 * 然后调用 SourceViewer.init() 或按快捷键 Ctrl+Shift+S 打开查看器
 */
(function() {
    'use strict';
    
    // 插件主对象
    const SourceViewer = {
        // 配置选项
        options: {
            theme: 'prism-tomorrow.min.css',
            fontSize: 1,
            autoInit: true,
            shortcutKey: 'ctrl+shift+s'
        },
        
        // 主题列表
        themes: [
            { name: 'Tomorrow Night', url: 'prism-tomorrow.min.css' },
            { name: 'Dark', url: 'prism-dark.min.css' },
            { name: 'Okaidia', url: 'prism-okaidia.min.css' },
            { name: 'VSC Dark Plus', url: 'prism-vsc-dark-plus.min.css' },
            { name: 'Atom Dark', url: 'prism-atom-dark.min.css' },
            { name: 'Synthwave 84', url: 'prism-synthwave84.min.css' },
            { name: 'Dracula', url: 'prism-dracula.min.css' },
            { name: 'Material Dark', url: 'prism-material-dark.min.css' }
        ],
        
        // 当前状态
        currentThemeIndex: 0,
        currentFontSize: 1,
        isInitialized: false,
        isVisible: false,
        
        /**
         * 初始化插件
         */
        init: function() {
            if (this.isInitialized) return;
            
            this.createStyles();
            this.createViewer();
            this.bindEvents();
            this.isInitialized = true;
            
            console.log('Source Viewer 插件已初始化');
        },
        
        /**
         * 创建CSS样式
         */
        createStyles: function() {
            const style = document.createElement('style');
            style.textContent = `
                #source-viewer-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.95);
                    z-index: 999999;
                    display: none;
                    flex-direction: column;
                    font-family: 'SF Mono', 'Fira Code', 'Consolas', 'Menlo', monospace;
                }
                
                #source-viewer-header {
                    background: linear-gradient(135deg, #0a0e27 0%, #1e3a5f 40%, #0077b6 100%);
                    padding: 10px 15px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #1e3a5f;
                    flex-shrink: 0;
                }
                
                #source-viewer-title {
                    color: #e0f2fe;
                    font-size: 16px;
                    font-weight: 700;
                    background: linear-gradient(135deg, #00b4d8, #90e0ef, #0077b6);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                
                #source-viewer-controls {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                }
                
                .sv-control-btn {
                    background: linear-gradient(135deg, #00b4d8, #0077b6);
                    color: white;
                    border: none;
                    padding: 6px 10px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 11px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    white-space: nowrap;
                    box-shadow: 0 2px 8px rgba(0, 180, 216, 0.3);
                }
                
                .sv-control-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 180, 216, 0.5);
                }
                
                .sv-control-btn:active {
                    transform: translateY(-1px);
                }
                
                #source-viewer-content {
                    flex: 1;
                    overflow: auto;
                    background: #0a0e27;
                    padding: 15px;
                }
                
                #source-viewer-code {
                    margin: 0;
                    padding: 15px;
                    font-size: 1rem;
                    transition: font-size 0.3s ease;
                    border-radius: 0;
                }
                
                #source-viewer-toast {
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(0, 0, 0, 0.9);
                    color: white;
                    padding: 10px 20px;
                    border-radius: 20px;
                    font-size: 12px;
                    z-index: 1000000;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    box-shadow: 0 3px 15px rgba(0, 0, 0, 0.4);
                }
                
                #source-viewer-toast.show {
                    opacity: 1;
                }
                
                @media (max-width: 768px) {
                    #source-viewer-header {
                        padding: 8px 10px;
                    }
                    
                    #source-viewer-title {
                        font-size: 14px;
                    }
                    
                    .sv-control-btn {
                        padding: 5px 8px;
                        font-size: 10px;
                    }
                    
                    #source-viewer-content {
                        padding: 10px;
                    }
                    
                    #source-viewer-code {
                        padding: 10px;
                    }
                }
            `;
            document.head.appendChild(style);
        },
        
        /**
         * 创建查看器DOM结构
         */
        createViewer: function() {
            const overlay = document.createElement('div');
            overlay.id = 'source-viewer-overlay';
            overlay.innerHTML = `
                <div id="source-viewer-header">
                    <div id="source-viewer-title">页面源码查看器</div>
                    <div id="source-viewer-controls">
                        <button class="sv-control-btn" onclick="SourceViewer.toggleView()">🔄切换视图</button>
                        <button class="sv-control-btn" onclick="SourceViewer.adjustZoom(-2)">🔍-</button>
                        <button class="sv-control-btn" onclick="SourceViewer.adjustZoom(2)">🔍+</button>
                        <button class="sv-control-btn" onclick="SourceViewer.resetZoom()">🔄重置</button>
                        <button class="sv-control-btn" onclick="SourceViewer.cycleTheme()">🎨主题</button>
                        <button class="sv-control-btn" onclick="SourceViewer.copyCode()">📋复制</button>
                        <button class="sv-control-btn" onclick="SourceViewer.close()">✖关闭</button>
                    </div>
                </div>
                <div id="source-viewer-content">
                    <pre id="source-viewer-code"><code class="language-html"></code></pre>
                </div>
            `;
            document.body.appendChild(overlay);
            
            // 加载Prism主题
            this.loadTheme(this.themes[this.currentThemeIndex].url);
        },
        
        /**
         * 绑定事件
         */
        bindEvents: function() {
            // 快捷键绑定
            document.addEventListener('keydown', (e) => {
                // Ctrl+Shift+S 打开/关闭查看器
                if (e.ctrlKey && e.shiftKey && e.key === 'S') {
                    e.preventDefault();
                    this.toggle();
                }
                
                // ESC 关闭查看器
                if (e.key === 'Escape' && this.isVisible) {
                    this.close();
                }
                
                // 查看器内的快捷键
                if (this.isVisible) {
                    if (e.ctrlKey || e.metaKey) {
                        if (e.key === '+' || e.key === '=') {
                            e.preventDefault();
                            this.adjustZoom(2);
                        } else if (e.key === '-' || e.key === '_') {
                            e.preventDefault();
                            this.adjustZoom(-2);
                        } else if (e.key === '0') {
                            e.preventDefault();
                            this.resetZoom();
                        } else if (e.key === 't' || e.key === 'T') {
                            e.preventDefault();
                            this.cycleTheme();
                        } else if (e.key === 'c' || e.key === 'C') {
                            e.preventDefault();
                            this.copyCode();
                        }
                    }
                }
            });
        },
        
        /**
         * 加载Prism.js和主题
         */
        loadPrism: function() {
            if (window.Prism) return Promise.resolve();
            
            // 加载CSS主题
            const link = document.createElement('link');
            link.id = 'prism-theme';
            link.rel = 'stylesheet';
            link.href = `https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/${this.themes[this.currentThemeIndex].url}`;
            document.head.appendChild(link);
            
            // 加载JS
            return this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js')
                .then(() => this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js'));
        },
        
        /**
         * 加载脚本
         */
        loadScript: function(url) {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = url;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        },
        
        /**
         * 加载主题
         */
        loadTheme: function(themeUrl) {
            let themeLink = document.getElementById('prism-theme');
            if (!themeLink) {
                themeLink = document.createElement('link');
                themeLink.id = 'prism-theme';
                themeLink.rel = 'stylesheet';
                document.head.appendChild(themeLink);
            }
            themeLink.href = `https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/${themeUrl}`;
        },
        
        /**
         * 获取页面源码
         */
        getPageSource: function() {
            let pageSource = document.documentElement.outerHTML;
            // 简单格式化
            return this.formatHTML(pageSource);
        },
        
        /**
         * 格式化HTML
         */
        formatHTML: function(html) {
            let formatted = '';
            let indent = 0;
            const tab = '  ';
            
            html.split(/>\s*</).forEach(function(element) {
                if (element.match(/^\/\w/)) {
                    indent--;
                }
                
                formatted += tab.repeat(Math.max(0, indent)) + '<' + element + '>\n';
                
                if (element.match(/^<?\w[^>]*[^\/]$/) && !element.startsWith("!--")) {
                    indent++;
                }
            });
            
            return formatted.trim();
        },
        
        /**
         * 获取渲染后的HTML
         */
        getRenderedHTML: function() {
            const clone = document.documentElement.cloneNode(true);
            // 移除查看器相关元素
            const viewer = clone.querySelector('#source-viewer-overlay');
            if (viewer) viewer.remove();
            return this.formatHTML(clone.outerHTML);
        },
        
        /**
         * 显示源码
         */
        showSource: function(source) {
            const codeElement = document.querySelector('#source-viewer-code code');
            if (codeElement) {
                codeElement.textContent = source;
                if (window.Prism) {
                    Prism.highlightElement(codeElement);
                }
            }
        },
        
        /**
         * 切换视图
         */
        toggleView: function() {
            if (this.currentView === 'source') {
                this.currentView = 'rendered';
                this.showSource(this.getRenderedHTML());
                this.showToast('已切换到渲染后HTML');
            } else {
                this.currentView = 'source';
                this.showSource(this.getPageSource());
                this.showToast('已切换到原始源码');
            }
        },
        
        /**
         * 打开查看器
         */
        open: async function() {
            if (this.isVisible) return;
            
            const overlay = document.getElementById('source-viewer-overlay');
            if (!overlay) {
                this.init();
            }
            
            // 加载Prism
            await this.loadPrism();
            
            // 显示原始源码
            this.currentView = 'source';
            this.showSource(this.getPageSource());
            
            // 显示查看器
            document.getElementById('source-viewer-overlay').style.display = 'flex';
            this.isVisible = true;
            this.showToast('源码查看器已打开 (ESC关闭)');
        },
        
        /**
         * 关闭查看器
         */
        close: function() {
            if (!this.isVisible) return;
            
            document.getElementById('source-viewer-overlay').style.display = 'none';
            this.isVisible = false;
            this.showToast('源码查看器已关闭');
        },
        
        /**
         * 切换显示/隐藏
         */
        toggle: function() {
            if (this.isVisible) {
                this.close();
            } else {
                this.open();
            }
        },
        
        /**
         * 调整字体大小
         */
        adjustZoom: function(delta) {
            const deltaInRem = delta / 16;
            this.currentFontSize = Math.max(0.75, Math.min(1.625, this.currentFontSize + deltaInRem));
            document.getElementById('source-viewer-code').style.fontSize = this.currentFontSize + 'rem';
            this.showToast(`字体大小: ${(this.currentFontSize * 16).toFixed(0)}px`);
        },
        
        /**
         * 重置字体大小
         */
        resetZoom: function() {
            this.currentFontSize = 1;
            document.getElementById('source-viewer-code').style.fontSize = '1rem';
            this.showToast('字体大小已重置');
        },
        
        /**
         * 切换主题
         */
        cycleTheme: function() {
            this.currentThemeIndex = (this.currentThemeIndex + 1) % this.themes.length;
            this.loadTheme(this.themes[this.currentThemeIndex].url);
            this.showToast(`主题: ${this.themes[this.currentThemeIndex].name}`);
            
            // 重新高亮
            if (window.Prism) {
                const codeElement = document.querySelector('#source-viewer-code code');
                if (codeElement) {
                    Prism.highlightElement(codeElement);
                }
            }
        },
        
        /**
         * 复制代码
         */
        copyCode: function() {
            const codeElement = document.querySelector('#source-viewer-code code');
            if (codeElement) {
                navigator.clipboard.writeText(codeElement.textContent).then(() => {
                    this.showToast('代码已复制到剪贴板');
                }).catch(() => {
                    this.showToast('复制失败，请手动选择复制');
                });
            }
        },
        
        /**
         * 显示提示
         */
        showToast: function(message) {
            let toast = document.getElementById('source-viewer-toast');
            if (!toast) {
                toast = document.createElement('div');
                toast.id = 'source-viewer-toast';
                document.body.appendChild(toast);
            }
            
            toast.textContent = message;
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    };
    
    // 暴露到全局
    window.SourceViewer = SourceViewer;
    
    // 自动初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            if (SourceViewer.options.autoInit) {
                SourceViewer.init();
            }
        });
    } else {
        if (SourceViewer.options.autoInit) {
            SourceViewer.init();
        }
    }
})();
