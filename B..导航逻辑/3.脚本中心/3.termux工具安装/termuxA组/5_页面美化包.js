// 页面装饰器 - 专门优化安卓工具安装页面
(function() {
    'use strict';
    
    // 等待DOM加载完成
    function waitForDOM() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initDecorator);
        } else {
            initDecorator();
        }
    }
    
    // 初始化装饰器
    function initDecorator() {
        // 延迟执行，确保其他脚本已加载
        setTimeout(() => {
            optimizeOverallLayout();
            styleTabButtons();
            enhanceTableStyling();
            improveModuleCards();
            addSmoothAnimations();
            setupTabChangeListener();
        }, 100);
    }
    
    // 设置标签页切换监听器
    function setupTabChangeListener() {
        // 监听标签按钮点击
        const tabButtons = document.querySelectorAll('.tab');
        tabButtons.forEach(btn => {
            // 保存原始的onclick事件
            const originalOnClick = btn.onclick;
            btn.onclick = function(e) {
                // 先执行原始事件
                if (originalOnClick) {
                    originalOnClick.call(this, e);
                }
                
                // 延迟重新应用样式，等待内容渲染完成
                setTimeout(() => {
                    const activeTab = document.querySelector('.tab.active');
                    if (activeTab && activeTab.textContent.includes('工具列表')) {
                        // 如果切换到工具列表页，重新应用表格样式
                        setTimeout(() => {
                            enhanceTableStyling();
                        }, 50);
                    } else if (activeTab && activeTab.textContent.includes('安装模块')) {
                        // 如果切换到安装模块页，重新应用模块样式
                        setTimeout(() => {
                            improveModuleCards();
                        }, 50);
                    }
                }, 100);
            };
        });
        
        // 使用MutationObserver监听内容变化
        const contentContainer = document.getElementById('contentContainer');
        if (contentContainer) {
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        // 检查是否添加了表格
                        const hasTable = contentContainer.querySelector('.tools-table');
                        if (hasTable) {
                            setTimeout(() => {
                                enhanceTableStyling();
                            }, 50);
                        }
                        
                        // 检查是否添加了模块
                        const hasModules = contentContainer.querySelector('.module-item');
                        if (hasModules) {
                            setTimeout(() => {
                                improveModuleCards();
                            }, 50);
                        }
                    }
                });
            });
            
            observer.observe(contentContainer, {
                childList: true,
                subtree: true
            });
        }
    }
    
    // 优化整体布局
    function optimizeOverallLayout() {
        // 设置整体字体大小为60%
        document.documentElement.style.fontSize = '60%';
        
        const container = document.getElementById('mainContainer');
        if (!container) return;
        
        container.style.cssText = `
            max-width: 1400px !important;
            margin: 0 auto !important;
            padding: 1rem !important;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
            min-height: 100vh !important;
            position: relative !important;
        `;
        
        // 压缩标题区域
        const header = document.querySelector('.header');
        if (header) {
            header.style.cssText = `
                text-align: center !important;
                padding: 1rem 0 0.5rem 0 !important;
                margin-bottom: 0.5rem !important;
            `;
            
            const h1 = header.querySelector('h1');
            if (h1) {
                h1.style.cssText = `
                    font-size: 2.5rem !important;
                    margin: 0 !important;
                    color: #2c3e50 !important;
                    font-weight: 700 !important;
                `;
            }
            
            const p = header.querySelector('p');
            if (p) {
                p.style.cssText = `
                    font-size: 1.2rem !important;
                    margin: 0.5rem 0 0 0 !important;
                    color: #6c757d !important;
                `;
            }
            
            // 隐藏进度条或缩小
            const progressBar = header.querySelector('.progress-bar');
            if (progressBar) {
                progressBar.style.cssText = `
                    height: 3px !important;
                    margin-top: 0.5rem !important;
                    background: rgba(0,0,0,0.1) !important;
                    border-radius: 2px !important;
                `;
            }
        }
        
        // 优化内容区域，让表格占90%空间
        const contentContainer = document.getElementById('contentContainer');
        if (contentContainer) {
            contentContainer.style.cssText = `
                width: 95% !important;
                max-width: none !important;
                margin: 0 auto !important;
                padding: 0 !important;
            `;
        }
        
        // 缩小提示区域
        const tips = document.querySelector('.tips');
        if (tips) {
            tips.style.cssText = `
                margin-top: 1rem !important;
                padding: 1rem !important;
                font-size: 1.1rem !important;
                background: rgba(255,255,255,0.8) !important;
                border-radius: 8px !important;
                box-shadow: 0 2px 10px rgba(0,0,0,0.05) !important;
            `;
            
            tips.querySelector('h3').style.cssText = `
                font-size: 1.3rem !important;
                margin: 0 0 0.5rem 0 !important;
                color: #495057 !important;
            `;
        }
    }
    
    // 美化标签页按钮并居中
    function styleTabButtons() {
        const tabsContainer = document.querySelector('.tabs');
        if (!tabsContainer) return;
        
        tabsContainer.style.cssText = `
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            gap: 1rem !important;
            margin: 1rem auto !important;
            padding: 0.5rem !important;
            background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7)) !important;
            border-radius: 30px !important;
            backdrop-filter: blur(10px) !important;
            max-width: fit-content !important;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08) !important;
            border: 1px solid rgba(0,0,0,0.05) !important;
        `;
        
        const tabButtons = tabsContainer.querySelectorAll('.tab');
        tabButtons.forEach((btn) => {
            btn.style.cssText = `
                padding: 0.6rem 2rem !important;
                border: none !important;
                background: transparent !important;
                color: #6c757d !important;
                font-size: 1.3rem !important;
                font-weight: 500 !important;
                cursor: pointer !important;
                border-radius: 20px !important;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                position: relative !important;
                overflow: hidden !important;
            `;
            
            // 悬停效果
            btn.addEventListener('mouseenter', function() {
                if (!this.classList.contains('active')) {
                    this.style.transform = 'translateY(-1px)';
                    this.style.background = 'rgba(0,123,255,0.1)';
                    this.style.color = '#007bff';
                }
            });
            
            btn.addEventListener('mouseleave', function() {
                if (!this.classList.contains('active')) {
                    this.style.transform = 'translateY(0)';
                    this.style.background = 'transparent';
                    this.style.color = '#6c757d';
                }
            });
            
            // 激活状态
            if (btn.classList.contains('active')) {
                btn.style.cssText += `
                    background: linear-gradient(135deg, #007bff, #0056b3) !important;
                    color: white !important;
                    box-shadow: 0 2px 10px rgba(0,123,255,0.3) !important;
                    transform: scale(1.02) !important;
                `;
            }
        });
    }
    
    // 增强表格样式 - 重点优化
    function enhanceTableStyling() {
        const sectionCards = document.querySelectorAll('.section-card');
        sectionCards.forEach(card => {
            // 让卡片占满空间
            card.style.cssText = `
                background: white !important;
                border-radius: 12px !important;
                box-shadow: 0 4px 20px rgba(0,0,0,0.08) !important;
                margin-bottom: 1rem !important;
                overflow: hidden !important;
                animation: fadeInUp 0.5s ease-out !important;
            `;
            
            // 压缩标题
            const header = card.querySelector('.section-header');
            if (header) {
                header.style.cssText = `
                    background: linear-gradient(135deg, #007bff, #0056b3) !important;
                    color: white !important;
                    padding: 0.8rem 1.5rem !important;
                    font-size: 1.4rem !important;
                    font-weight: 600 !important;
                    margin: 0 !important;
                `;
            }
            
            // 优化内容区
            const content = card.querySelector('.section-content');
            if (content) {
                content.style.cssText = `
                    padding: 0 !important;
                    margin: 0 !important;
                `;
            }
        });
        
        // 重点优化表格
        const table = document.querySelector('.tools-table');
        if (!table) return;
        
        table.style.cssText = `
            width: 100% !important;
            border-collapse: collapse !important;
            background: white !important;
            font-size: 1.2rem !important;
            table-layout: fixed !important;
        `;
        
        // 表头样式
        const thead = table.querySelector('thead');
        if (thead) {
            thead.style.cssText = `
                background: linear-gradient(135deg, #343a40, #495057) !important;
                color: white !important;
                position: sticky !important;
                top: 0 !important;
                z-index: 10 !important;
            `;
        }
        
        // 表头单元格
        const thCells = table.querySelectorAll('th');
        thCells.forEach((th, index) => {
            th.style.cssText = `
                padding: 0.8rem 0.5rem !important;
                text-align: center !important;
                font-weight: 600 !important;
                font-size: 1.1rem !important;
                border: 1px solid #dee2e6 !important;
                border-bottom: 2px solid #adb5bd !important;
                background: inherit !important;
                color: white !important;
                position: relative !important;
            `;
            
            // 设置列宽
            if (index === 0) th.style.width = '5%';  // 序号
            if (index === 1) th.style.width = '15%'; // 名称
            if (index === 2) th.style.width = '35%'; // 安装方式
            if (index === 3) th.style.width = '35%'; // 路径
            if (index === 4) th.style.width = '10%'; // 备注
        });
        
        // 表格行样式
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach((row, index) => {
            row.style.cssText = `
                transition: all 0.2s ease !important;
            `;
            
            // 移除旧的事件监听器
            row.onmouseenter = null;
            row.onmouseleave = null;
            
            // 悬停效果
            row.addEventListener('mouseenter', function() {
                this.style.background = 'rgba(0,123,255,0.05)';
                this.style.transform = 'scale(1.005)';
            });
            
            row.addEventListener('mouseleave', function() {
                this.style.background = index % 2 === 0 ? '#f8f9fa' : 'white';
                this.style.transform = 'scale(1)';
            });
            
            // 斑马纹
            if (index % 2 === 0) {
                row.style.background = '#f8f9fa';
            }
        });
        
        // 表格单元格样式 - 添加分割线
        const tdCells = table.querySelectorAll('td');
        tdCells.forEach((td, index) => {
            td.style.cssText = `
                padding: 0.6rem 0.5rem !important;
                border: 1px solid #dee2e6 !important;
                vertical-align: middle !important;
                text-align: left !important;
                font-size: 1.1rem !important;
                line-height: 1.4 !important;
                word-break: break-word !important;
            `;
            
            // 特殊列对齐
            const colIndex = index % 5;
            if (colIndex === 0) td.style.textAlign = 'center'; // 序号居中
            if (colIndex === 4) td.style.textAlign = 'center'; // 备注居中
            
            // 代码样式
            const code = td.querySelector('code');
            if (code) {
                code.style.cssText = `
                    background: linear-gradient(135deg, #28a745, #20c997) !important;
                    color: white !important;
                    padding: 0.2rem 0.5rem !important;
                    border-radius: 4px !important;
                    font-size: 1rem !important;
                    font-weight: 500 !important;
                    display: inline-block !important;
                    font-family: 'Courier New', monospace !important;
                    white-space: nowrap !important;
                    overflow: hidden !important;
                    text-overflow: ellipsis !important;
                    max-width: 100% !important;
                `;
            }
        });
    }
    
    // 改进模块卡片
    function improveModuleCards() {
        const moduleItems = document.querySelectorAll('.module-item');
        moduleItems.forEach((item, index) => {
            item.style.cssText = `
                margin-bottom: 1rem !important;
                padding: 0 !important;
                background: white !important;
                border-radius: 8px !important;
                box-shadow: 0 2px 10px rgba(0,0,0,0.05) !important;
                cursor: pointer !important;
                transition: all 0.3s ease !important;
                overflow: hidden !important;
                animation: fadeInUp 0.5s ease-out !important;
                animation-delay: ${index * 0.1}s !important;
            `;
            
            // 完成状态
            if (item.classList.contains('completed-step')) {
                item.style.cssText += `
                    background: linear-gradient(135deg, rgba(40,167,69,0.05), rgba(32,201,151,0.05)) !important;
                    border: 2px solid #28a745 !important;
                `;
            }
            
            // 移除旧的事件监听器
            item.onmouseenter = null;
            item.onmouseleave = null;
            
            // 悬停效果
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
            });
        });
        
        // 美化命令块
        const commandBlocks = document.querySelectorAll('.command-block');
        commandBlocks.forEach(block => {
            block.style.cssText = `
                position: relative !important;
                margin: 0 !important;
                padding: 0 !important;
            `;
            
            const pre = block.querySelector('pre');
            if (pre) {
                pre.style.cssText = `
                    margin: 0 !important;
                    padding: 1rem !important;
                    background: #2d3748 !important;
                    color: #e2e8f0 !important;
                    overflow-x: auto !important;
                    font-size: 1rem !important;
                    line-height: 1.5 !important;
                    font-family: 'Courier New', monospace !important;
                `;
            }
            
            const copyBtn = block.querySelector('.copy-btn');
            if (copyBtn) {
                copyBtn.style.cssText = `
                    position: absolute !important;
                    top: 0.5rem !important;
                    right: 0.5rem !important;
                    padding: 0.3rem 0.8rem !important;
                    background: linear-gradient(135deg, #007bff, #0056b3) !important;
                    color: white !important;
                    border: none !important;
                    border-radius: 4px !important;
                    cursor: pointer !important;
                    font-size: 0.9rem !important;
                    font-weight: 500 !important;
                    transition: all 0.3s ease !important;
                    z-index: 10 !important;
                `;
            }
        });
    }
    
    // 添加平滑动画
    function addSmoothAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            * {
                transition: all 0.2s ease !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // 初始化
    waitForDOM();
})();
