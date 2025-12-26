// ==================== 注入公共样式 ====================
const commonStyles = `
* { 
    margin: 0; 
    padding: 0; 
    box-sizing: border-box; 
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    background-attachment: fixed;
    min-height: 100vh; 
    padding: 8px; 
    color: #333; 
    overflow-x: hidden;
}

.container { 
    max-width: 100%; 
    margin: 0 auto; 
}

.header {
    text-align: center; 
    color: white; 
    margin-bottom: 12px; 
    padding: 12px;
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.header h1 {
    font-size: 1.3rem; 
    font-weight: 600; 
    margin-bottom: 6px;
    text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.header p { 
    font-size: 0.7rem; 
    opacity: 0.9; 
    text-shadow: 0 1px 2px rgba(0,0,0,0.2);
}

.progress-bar {
    background: rgba(255,255,255,0.2); 
    border-radius: 10px;
    height: 8px; 
    margin: 8px 0; 
    overflow: hidden;
}

.progress-fill {
    background: linear-gradient(90deg, #4caf50 0%, #8bc34a 100%);
    height: 100%; 
    width: 0%;
    transition: width 0.3s ease;
    border-radius: 10px;
}

.section-card {
    background: rgba(255, 255, 255, 0.15); 
    backdrop-filter: blur(10px);
    border-radius: 15px; 
    margin-bottom: 10px; 
    border: 1px solid rgba(255, 255, 255, 0.2);
    overflow: hidden; 
    transition: all 0.2s ease;
}

.section-card:hover {
    transform: translateY(-2px); 
    box-shadow: 0 8px 25px rgba(31, 38, 135, 0.3);
}

.section-header {
    padding: 10px 15px; 
    font-weight: 600; 
    font-size: 0.85rem;
    color: white; 
    background: linear-gradient(135deg, 
        rgba(102, 126, 234, 0.8) 0%, 
        rgba(118, 75, 162, 0.8) 100%);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.section-content { 
    padding: 10px; 
}

.step-item {
    margin-bottom: 8px; 
    padding: 10px 12px; 
    background: rgba(255, 255, 255, 0.08);
    border-radius: 12px; 
    border-left: 3px solid #667eea;
    cursor: pointer; 
    transition: all 0.2s ease;
}

.step-item:hover { 
    background: rgba(255, 255, 255, 0.15);
    transform: translateX(3px);
}

.step-header {
    display: flex; 
    align-items: center; 
    margin-bottom: 6px;
}

.step-number {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white; 
    width: 22px; 
    height: 22px;
    border-radius: 50%; 
    display: flex; 
    align-items: center;
    justify-content: center; 
    font-weight: bold; 
    margin-right: 10px;
    font-size: 0.7rem;
}

.step-desc {
    font-weight: 500; 
    color: #fff; 
    font-size: 0.75rem; 
    flex: 1;
    text-shadow: 0 1px 2px rgba(0,0,0,0.2);
}

.command-block {
    background: rgba(45, 45, 45, 0.9); 
    backdrop-filter: blur(5px);
    color: #f8f8f2; 
    border-radius: 10px;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 0.65rem; 
    overflow-x: auto;
    position: relative; 
    margin: 6px 0; 
    padding: 0;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.command-block pre {
    margin: 0; 
    padding: 10px; 
    background: transparent;
    font-size: inherit; 
    line-height: 1.4;
}

.command-block code {
    padding: 0; 
    background: transparent; 
    color: inherit;
    text-align: left; 
    white-space: pre-wrap; 
    word-break: break-all;
    display: block;
}

.copy-btn {
    position: absolute; 
    top: 6px; 
    right: 6px;
    background: linear-gradient(135deg, #667eea, #764ba2); 
    color: white; 
    border: none;
    padding: 3px 8px; 
    border-radius: 6px; 
    cursor: pointer;
    font-size: 0.6rem; 
    z-index: 10;
    transition: all 0.2s ease;
}

.copy-btn:hover { 
    background: linear-gradient(135deg, #5a6fd8, #6a4190);
}

.tips {
    background: rgba(255, 255, 255, 0.15); 
    backdrop-filter: blur(10px);
    border-radius: 15px;
    padding: 12px; 
    margin-top: 12px;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.tips h3 {
    color: #667eea; 
    margin-bottom: 8px; 
    font-size: 0.8rem;
    font-weight: 600;
}

.tips ul { 
    padding-left: 18px; 
}

.tips li {
    margin-bottom: 5px; 
    line-height: 1.3; 
    font-size: 0.7rem;
    color: #fff;
    text-shadow: 0 1px 2px rgba(0,0,0,0.2);
}

.completed-step {
    opacity: 0.8; 
    border-left-color: #4caf50;
    background: rgba(76, 175, 80, 0.1);
}

.completed-step .step-number { 
    background: linear-gradient(135deg, #4caf50, #8bc34a);
}

.theme-switcher {
    position: fixed; 
    top: 15px; 
    right: 15px;
    background: rgba(255, 255, 255, 0.15); 
    backdrop-filter: blur(10px);
    border-radius: 20px; 
    padding: 6px; 
    box-shadow: 0 4px 15px rgba(31, 38, 135, 0.3);
    z-index: 1000;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.theme-btn {
    padding: 6px 12px; 
    border: none; 
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white; 
    border-radius: 15px; 
    cursor: pointer;
    font-size: 0.7rem; 
    transition: all 0.2s ease;
}

.theme-btn:hover { 
    background: linear-gradient(135deg, #5a6fd8, #6a4190);
}

/* 滚动条美化 */
::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
}

::-webkit-scrollbar-thumb {
    background: rgba(102, 126, 234, 0.6);
    border-radius: 8px;
}

::-webkit-scrollbar-thumb:hover {
    background: rgba(102, 126, 234, 0.8);
}
`;

// 注入样式
const styleElement = document.createElement('style');
styleElement.textContent = commonStyles;
document.head.appendChild(styleElement);

// ==================== 公共功能 ====================
window.CommonPlugin = {
    // 1. 主题管理
    themes: [
        { name: 'prism-tomorrow', label: '🌙暗色' },
        { name: 'prism', label: '☀️亮色' },
        { name: 'prism-okaidia', label: '🌃深黑' },
        { name: 'prism-twilight', label: '🌆黄昏' },
        { name: 'prism-coy', label: '🌅拂晓' }
    ],
    currentThemeIndex: 0,

    // 2. 切换主题
    switchTheme() {
        this.currentThemeIndex = (this.currentThemeIndex + 1) % this.themes.length;
        const theme = this.themes[this.currentThemeIndex];
        const link = document.getElementById('prism-theme');
        link.href = `https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/${theme.name}.min.css`;
        document.querySelector('.theme-btn').textContent = theme.label;
        localStorage.setItem('preferred-theme', theme.name);
    },

    // 3. 加载保存的主题
    loadTheme() {
        const savedTheme = localStorage.getItem('preferred-theme');
        if (savedTheme) {
            const themeIndex = this.themes.findIndex(t => t.name === savedTheme);
            if (themeIndex !== -1) {
                this.currentThemeIndex = themeIndex - 1;
                this.switchTheme();
            }
        }
    },

    // 4. 渲染安装指南 - 移除加载动画
    async renderGuide(config) {
        const container = document.getElementById('contentContainer');
        container.innerHTML = '';
        
        const completedSteps = await IDB.get('E_completed_steps', 'userdata') || {};
        let totalSteps = 0, completedCount = 0;
        
        config.sections.forEach((section, sectionIndex) => {
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'section-card';
            
            const header = document.createElement('div');
            header.className = 'section-header';
            header.textContent = `${sectionIndex + 1}. ${section.title}`;
            
            const contentDiv = document.createElement('div');
            contentDiv.className = 'section-content';
            
            section.steps.forEach(step => {
                totalSteps++;
                const stepKey = `section_${sectionIndex}_step_${step.number}`;
                const isCompleted = completedSteps[stepKey];
                if (isCompleted) completedCount++;
                
                const stepDiv = document.createElement('div');
                stepDiv.className = `step-item ${isCompleted ? 'completed-step' : ''}`;
                stepDiv.onclick = () => this.toggleStep(stepKey, stepDiv);
                
                const language = this.detectLanguage(step.command);
                stepDiv.innerHTML = `
                    <div class="step-header">
                        <div class="step-number">${step.number}</div>
                        <div class="step-desc">${step.description}</div>
                    </div>
                    <div class="command-block">
                        <button class="copy-btn" onclick="CommonPlugin.copyCommand(event, this)">复制</button>
                        <pre><code class="language-${language}">${this.escapeHtml(step.command)}</code></pre>
                    </div>
                `;
                
                contentDiv.appendChild(stepDiv);
            });
            
            sectionDiv.appendChild(header);
            sectionDiv.appendChild(contentDiv);
            container.appendChild(sectionDiv);
        });
        
        this.updateProgress(completedCount, totalSteps);
        
        // 立即高亮代码，不延迟
        if (typeof Prism !== 'undefined') {
            Prism.highlightAll();
        }
    },

    // 5. 检测代码语言
    detectLanguage(command) {
        if (command.includes('rm') || command.includes('mkdir') || 
            command.includes('cat') || command.includes('chmod') || 
            command.includes('sed') || command.includes('echo') ||
            command.includes('curl') || command.includes('jq') ||
            command.includes('shuf') || command.includes('FILE')) {
            return 'bash';
        }
        return 'bash';
    },

    // 6. 切换步骤完成状态
    async toggleStep(stepKey, stepElement) {
        const completedSteps = await IDB.get('E_completed_steps', 'userdata') || {};
        completedSteps[stepKey] = !completedSteps[stepKey];
        await IDB.put('E_completed_steps', completedSteps, 'userdata');
        
        if (completedSteps[stepKey]) {
            stepElement.classList.add('completed-step');
        } else {
            stepElement.classList.remove('completed-step');
        }
        
        const totalSteps = document.querySelectorAll('.step-item').length;
        const completedCount = document.querySelectorAll('.completed-step').length;
        this.updateProgress(completedCount, totalSteps);
    },

    // 7. 更新进度条
    updateProgress(completed, total) {
        const percentage = total > 0 ? (completed / total * 100) : 0;
        const progressBar = document.getElementById('progressBar');
        progressBar.style.width = percentage + '%';
    },

    // 8. 复制命令功能
    copyCommand(event, button) {
        event.stopPropagation();
        const codeElement = button.parentElement.querySelector('code');
        const commandText = codeElement.textContent || codeElement.innerText;
        
        navigator.clipboard.writeText(commandText).then(() => {
            const originalText = button.textContent;
            button.textContent = '已复制';
            button.style.background = 'linear-gradient(135deg, #4caf50, #8bc34a)';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '';
            }, 1500);
        }).catch(err => {
            console.error('复制失败:', err);
        });
    },

    // 9. HTML转义
    escapeHtml(text) {
        const map = {
            '&': '&amp;', '<': '&lt;', '>': '&gt;',
            '"': '&quot;', "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    },

    // 10. 保存浏览记录
    async saveViewHistory(pageName) {
        try {
            const history = await IDB.get('E_view_history', 'userdata') || [];
            const now = new Date().toISOString();
            history.unshift({ page: pageName, timestamp: now });
            
            if (history.length > 20) history.splice(20);
            await IDB.put('E_view_history', history, 'userdata');
        } catch (error) {
            console.error('保存浏览历史失败:', error);
        }
    },

    // 11. 显示错误信息
    showError(message) {
        document.getElementById('contentContainer').innerHTML = `
            <div style="text-align: center; padding: 40px; color: white;">
                <div style="font-size: 1.1rem; margin-bottom: 10px;">⚠️ ${message}</div>
                <div style="font-size: 0.75rem; opacity: 0.8; margin-bottom: 15px;">请检查网络连接或稍后重试</div>
                <button onclick="location.reload()" style="
                    padding: 8px 16px; 
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    border: none; 
                    color: white; 
                    border-radius: 20px;
                    cursor: pointer; 
                    font-size: 0.7rem;
                ">重新加载</button>
            </div>
        `;
    }
};

// 12. 全局函数，供HTML调用
function switchTheme() {
    CommonPlugin.switchTheme();
}
