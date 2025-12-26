// ===============================================
// 工具箱核心 - 管理所有插件
// 功能：动态加载插件，提供UI控制面板，持久化配置，显示在线时长
// ===============================================
(function() {
  'use strict';

  // --- 配置区 ---
  const CONFIG = {
    // localStorage中存储配置的键名
    STORAGE_KEY: 'toolbox-plugin-config',
    // 强制插件（无法关闭）
    MANDATORY_PLUGINS: [
      { name: 'onlineTime', displayName: '在线时长 (核心)', path: '/A2_全局中心/B_插件工具/2.插件_在线时长.js' }
    ],
    // 可选插件列表
    OPTIONAL_PLUGINS: [
      { name: 'fontZoom', displayName: '字体缩放', path: './assets/plugins/font-zoom.js' },
      { name: 'bgChanger', displayName: '更换背景', path: '/A2_全局中心/B_插件工具/5.插件_更换背景.js' }
    ],
    // 可选插件的默认配置
    DEFAULT_OPTIONAL_CONFIG: {
      fontZoom: { enable: true, max: 32, min: 12 },
      bgChanger: { enable: true }
      // 在这里添加其他可选插件的默认配置
    }
  };

  // --- 工具箱UI管理 ---
  class ToolboxUI {
    constructor() {
      this.container = null;
      this.toggleBtn = null;
      this.panel = null;
      this.timeDisplay = null; // 🎯 新增：时间显示元素
      this.createUI();
      this.setupEventListeners(); // 🎯 新增：设置事件监听
    }

    createUI() {
      this.container = document.createElement('div');
      this.container.id = 'toolbox-container';
      this.container.style.cssText = `
        position: fixed; top: 10px; left: 10px; z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
      `;

      this.toggleBtn = document.createElement('button');
      this.toggleBtn.innerHTML = '⚙️';
      this.toggleBtn.title = '工具箱';
      this.toggleBtn.style.cssText = `
        background: transparent; border: 1px solid rgba(100, 100, 100, 0.3); border-radius: 8px;
        width: 44px; height: 44px; color: #555; font-size: 20px; cursor: pointer;
        display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      `;

      this.panel = document.createElement('div');
      this.panel.style.cssText = `
        position: absolute; top: 54px; left: 0; background: transparent;
        border: 1px solid rgba(100, 100, 100, 0.2); border-radius: 8px; padding: 15px;
        min-width: 220px; color: #333; display: none;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      `;
      
      // 🎯 新增：创建并添加时间显示元素到面板顶部
      this.timeDisplay = document.createElement('div');
      this.timeDisplay.id = 'toolbox-time-display';
      this.timeDisplay.style.cssText = `
        font-size: 16px; font-weight: bold; color: #555; text-align: center;
        padding: 10px 0; border-bottom: 1px solid rgba(100, 100, 100, 0.2);
        margin-bottom: 10px;
      `;
      this.timeDisplay.textContent = '时间 0时0分0秒';
      this.panel.appendChild(this.timeDisplay);

      this.container.appendChild(this.toggleBtn);
      this.container.appendChild(this.panel);
      document.body.appendChild(this.container);

      // 交互事件
      this.toggleBtn.addEventListener('click', () => this.togglePanel());
      this.toggleBtn.addEventListener('mouseenter', () => {
        this.toggleBtn.style.transform = 'scale(1.1)';
        this.toggleBtn.style.background = 'rgba(100, 100, 100, 0.1)';
      });
      this.toggleBtn.addEventListener('mouseleave', () => {
        this.toggleBtn.style.transform = 'scale(1)';
        this.toggleBtn.style.background = 'transparent';
      });
      // 点击外部关闭面板
      document.addEventListener('click', (e) => {
        if (!this.container.contains(e.target)) {
          this.panel.style.display = 'none';
        }
      });
    }

    // 🎯 新增：设置事件监听器
    setupEventListeners() {
        // 监听在线时长更新
        window.addEventListener('onlineTimeUpdate', (e) => {
            const data = e.detail;
            this.timeDisplay.textContent = `时间 ${data.hours}时${data.minutes}分${data.seconds}秒`;
        });

        // 监听里程碑事件并显示通知
        window.addEventListener('onlineTimeMilestone', (e) => {
            this.showNotification(e.detail.message);
        });
    }

    togglePanel() {
      this.panel.style.display = this.panel.style.display === 'none' ? 'block' : 'none';
    }

    // 添加强制插件信息（不可操作）
    addMandatoryPluginInfo(name, displayName) {
      const infoItem = document.createElement('div');
      infoItem.style.cssText = `
        display: flex; justify-content: space-between; align-items: center;
        padding: 10px 0; border-bottom: 1px solid rgba(100, 100, 100, 0.1);
        opacity: 0.7;
      `;
      const label = document.createElement('span');
      label.textContent = displayName;
      label.style.fontSize = '14px';
      const status = document.createElement('span');
      status.textContent = '已启用';
      status.style.fontSize = '12px';
      status.style.color = '#4CAF50';

      infoItem.appendChild(label);
      infoItem.appendChild(status);
      this.panel.appendChild(infoItem);
    }

    // 添加可选插件的开关
    addOptionalPluginToggle(name, displayName, config) {
      const pluginItem = document.createElement('div');
      pluginItem.style.cssText = `
        display: flex; justify-content: space-between; align-items: center;
        padding: 10px 0; border-bottom: 1px solid rgba(100, 100, 100, 0.1);
      `;

      const label = document.createElement('span');
      label.textContent = displayName;
      label.style.fontSize = '14px';

      const toggle = document.createElement('label');
      toggle.style.cssText = `position: relative; display: inline-block; width: 48px; height: 26px;`;

      const input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = config.enable;
      input.style.cssText = `opacity: 0; width: 0; height: 0;`;

      const slider = document.createElement('span');
      slider.style.cssText = `
        position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
        background-color: #ccc; transition: .4s; border-radius: 34px;
      `;
      slider.style.cssText += `
        &:before { position: absolute; content: ""; height: 18px; width: 18px;
        left: 4px; bottom: 4px; background-color: white; transition: .4s; border-radius: 50%; }
      `;

      input.addEventListener('change', () => {
        config.enable = input.checked;
        slider.style.backgroundColor = input.checked ? '#4CAF50' : '#ccc';
        window.ToolboxManager.togglePlugin(name, input.checked);
        window.ToolboxManager.saveConfig(); // 保存配置
      });

      slider.style.backgroundColor = config.enable ? '#4CAF50' : '#ccc';
      toggle.appendChild(input);
      toggle.appendChild(slider);

      pluginItem.appendChild(label);
      pluginItem.appendChild(toggle);
      this.panel.appendChild(pluginItem);
    }

    // 🎯 新增：显示通知（复用在线时长插件的样式）
    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: transparent; border: 1px solid rgba(100, 100, 100, 0.3);
            color: #333; padding: 15px 25px; border-radius: 12px;
            font-size: 1.1rem; font-weight: bold;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            z-index: 20000; opacity: 0; transition: opacity 0.5s ease;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => { notification.style.opacity = '1'; }, 100);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 500);
        }, 3000);
    }
  }

  // --- 工具箱管理器 ---
  window.ToolboxManager = {
    config: {},
    plugins: {},
    ui: null,

    init() {
      this.loadConfig(); // 1. 先加载持久化配置
      this.ui = new ToolboxUI();
      this.loadPlugins();
    },

    // 从localStorage加载配置
    loadConfig() {
      try {
        const savedConfig = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (savedConfig) {
          this.config = JSON.parse(savedConfig);
        }
      } catch (e) {
        console.error('Failed to load toolbox config:', e);
      }
      // 确保所有可选插件都有配置项
      for (const p of CONFIG.OPTIONAL_PLUGINS) {
        if (!this.config[p.name]) {
          this.config[p.name] = CONFIG.DEFAULT_OPTIONAL_CONFIG[p.name] || { enable: false };
        }
      }
    },

    // 保存配置到localStorage
    saveConfig() {
      try {
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(this.config));
      } catch (e) {
        console.error('Failed to save toolbox config:', e);
      }
    },

    // 动态加载所有插件
    loadPlugins() {
      // 1. 加载强制插件
      CONFIG.MANDATORY_PLUGINS.forEach(p => {
        this.ui.addMandatoryPluginInfo(p.name, p.displayName);
        this.loadScript(p.path);
      });

      // 2. 加载可选插件
      CONFIG.OPTIONAL_PLUGINS.forEach(p => {
        this.loadScript(p.path, () => {
          const plugin = window[`plugin_${p.name}`];
          if (plugin) {
            this.plugins[p.name] = plugin;
            this.ui.addOptionalPluginToggle(p.name, p.displayName, this.config[p.name]);
            if (this.config[p.name].enable) {
              plugin.start(this.config[p.name]);
            }
          }
        });
      });
    },

    // 加载单个脚本的辅助函数
    loadScript(src, callback) {
      const script = document.createElement('script');
      script.src = src;
      script.onload = callback;
      document.head.appendChild(script);
    },

    // 切换可选插件状态
    togglePlugin(name, enable) {
      const plugin = this.plugins[name];
      if (!plugin) return;

      if (enable) {
        plugin.start(this.config[name]);
      } else {
        if (plugin.stop) plugin.stop();
      }
    }
  };

  // --- 初始化 ---
  // 等待DOM加载完成后初始化工具箱
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.ToolboxManager.init();
    });
  } else {
    window.ToolboxManager.init();
  }

})();
