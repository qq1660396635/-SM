/**
 * 便签跳转插件
 * 在磁力链接导航页面添加便签跳转按钮
 * 使用方法：在磁力链接页面中引入此文件
 * <script src="便签跳转插件.js"></script>
 */

(function() {
    // 等待页面加载完成
    function initPlugin() {
        // 检查是否已经存在便签按钮，避免重复创建
        if (document.getElementById('noteJumpBtn')) {
            return;
        }
        
        // 创建便签跳转按钮样式
        const style = document.createElement('style');
        style.textContent = `
            /* 便签跳转按钮样式 */
            .note-jump-btn {
                position: fixed;
                top: 10px;
                right: 10px;
                padding: 5px 12px;
                border-radius: 16px;
                background: #3a7bd5;
                border: none;
                cursor: pointer;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                transition: all 0.2s ease;
                z-index: 9999;
                color: white;
                font-weight: 500;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                width: auto;
                min-width: 0;
                max-width: none;
            }
            
            /* 按钮悬停效果 */
            .note-jump-btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
                background: #4a8be5;
            }
            
            .note-jump-btn:active {
                transform: translateY(0);
                box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
            }
            
            /* 响应式设计 */
            @media (max-width: 768px) {
                .note-jump-btn {
                    top: 8px;
                    right: 8px;
                    padding: 4px 10px;
                    font-size: 11px;
                }
            }
            
            @media (max-width: 480px) {
                .note-jump-btn {
                    top: 6px;
                    right: 6px;
                    padding: 3px 8px;
                    font-size: 10px;
                }
            }
        `;
        document.head.appendChild(style);
        
        // 创建便签跳转按钮
        const noteBtn = document.createElement('button');
        noteBtn.id = 'noteJumpBtn';
        noteBtn.className = 'note-jump-btn';
        noteBtn.title = '跳转到便签页面';
        noteBtn.innerHTML = '跳转便签';
        noteBtn.onclick = function() {
            window.location.href = '/B..导航逻辑/1.工具导航/C.日记中心/1_快捷便签.html';
        };
        
        // 将按钮添加到页面
        document.body.appendChild(noteBtn);
        
        // 添加进入动画
        setTimeout(() => {
            noteBtn.style.opacity = '0';
            noteBtn.style.transform = 'translateY(-20px)';
            noteBtn.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            setTimeout(() => {
                noteBtn.style.opacity = '1';
                noteBtn.style.transform = 'translateY(0)';
            }, 50);
        }, 100);
        
        console.log('便签跳转插件已加载');
    }
    
    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPlugin);
    } else {
        initPlugin();
    }
})();
