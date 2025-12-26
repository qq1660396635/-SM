// ==================== 注入公共样式 ====================
const commonStyles = `
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh; padding: 5px; color: #333; overflow-x: hidden;
}
.container { max-width: 100%; margin: 0 auto; }
.header {
    text-align: center; color: white; margin-bottom: 8px; padding: 5px;
}
.header h1 {
    font-size: 1.2rem; font-weight: 600; margin-bottom: 3px;
    text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}
.header p { font-size: 0.6rem; opacity: 0.9; }
.progress-bar {
    background: rgba(255,255,255,0.2); border-radius: 8px;
    height: 6px; margin: 5px 0; overflow: hidden;
}
.progress-fill {
    background: #4caf50; height: 100%; width: 0%;
    transition: width 0.3s ease;
}
.section-card {
    background: white; border-radius: 8px; margin-bottom: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden;
    transition: transform 0.2s;
}
.section-card:hover {
    transform: translateY(-1px); box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}
.section-header {
    padding: 6px 10px; font-weight: 600; font-size: 0.8rem;
    color: white; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.section-content { padding: 8px; }
.step-item {
    margin-bottom: 6px; padding: 6px 8px; background: #f8f9fa;
    border-radius: 6px; border-left: 3px solid #667eea;
    cursor: pointer; transition: all 0.2s;
}
.step-item:hover { background: #f0f1f3; }
.step-header {
    display: flex; align-items: center; margin-bottom: 4px;
}
.step-number {
    background: #667eea; color: white; width: 20px; height: 20px;
    border-radius: 50%; display: flex; align-items: center;
    justify-content: center; font-weight: bold; margin-right: 8px;
    font-size: 0.7rem;
}
.step-desc {
    font-weight: 500; color: #333; font-size: 0.7rem; flex: 1;
}
.command-block {
    background: #2d2d2d; color: #f8f8f2; border-radius: 4px;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 0.65rem; overflow-x: auto;
    position: relative; margin: 0; padding: 0;
}
.command-block pre {
    margin: 0; padding: 8px; background: transparent;
    text-shadow: none; font-size: inherit; line-height: 1.4;
}
.command-block code {
    padding: 0; background: transparent; color: inherit;
    text-align: left; white-space: pre-wrap; word-break: break-all;
    display: block;
}
.copy-btn {
    position: absolute; top: 2px; right: 2px;
    background: #667eea; color: white; border: none;
    padding: 2px 6px; border-radius: 3px; cursor: pointer;
    font-size: 0.6rem; z-index: 10;
}
.copy-btn:hover { background: #5a6fd8; }
.loading {
    display: flex; justify-content: center; align-items: center;
    height: 150px; color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}
.loading-spinner {
    width: 30px; height: 30px; border: 3px solid rgba(255,255,255,0.3);
    border-top: 3px solid white; border-radius: 50%;
    animation: spin 1s linear infinite; margin-right: 10px;
}
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
.tips {
    background: rgba(255,255,255,0.95); border-radius: 8px;
    padding: 8px; margin-top: 10px;
}
.tips h3 {
    color: #667eea; margin-bottom: 6px; font-size: 0.75rem;
}
.tips ul { padding-left: 15px; }
.tips li {
    margin-bottom: 4px; line-height: 1.3; font-size: 0.65rem;
}
.completed-step {
    opacity: 0.7; border-left-color: #4caf50;
}
.completed-step .step-number { background: #4caf50; }
.theme-switcher {
    position: fixed; top: 15px; right: 15px;
    background: rgba(255,255,255,0.9); border-radius: 20px;
    padding: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    z-index: 1000;
}
.theme-btn {
    padding: 5px 10px; border: none; background: #667eea;
    color: white; border-radius: 15px; cursor: pointer;
    font-size: 0.7rem; transition: all 0.2s;
}
.theme-btn:hover { background: #5a6fd8; }
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

    // 4. 渲染安装指南
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
        Prism.highlightAll();
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
        document.getElementById('progressBar').style.width = percentage + '%';
    },

    // 8. 复制命令功能
    copyCommand(event, button) {
        event.stopPropagation();
        const codeElement = button.parentElement.querySelector('code');
        const commandText = codeElement.textContent || codeElement.innerText;
        
        navigator.clipboard.writeText(commandText).then(() => {
            const originalText = button.textContent;
            button.textContent = '已复制!';
            button.style.background = '#4caf50';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '#667eea';
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
            <div class="loading" style="flex-direction: column; gap: 10px;">
                <div style="color: #ff6b6b; font-size: 1rem;">⚠️${message}</div>
                <div style="font-size: 0.7rem;">请检查网络连接或稍后重试</div>
                <button onclick="location.reload()" style="
                    padding: 6px 12px; background: rgba(255,255,255,0.2);
                    border: 1px solid white; color: white; border-radius: 15px;
                    cursor: pointer; margin-top: 8px; font-size: 0.7rem;
                ">重新加载</button>
            </div>
        `;
    }
};

// 12. 全局函数，供HTML调用
function switchTheme() {
    CommonPlugin.switchTheme();
}
