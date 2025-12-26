// ===============================================
// 在线时长全局插件（持久化版本- 修仙风格版）
// 功能：跨页面持续计时，数据持久化，通过事件通知UI更新
//
// 使用方法：
// <!-- 引入数据库管理器-->
// <script src="/db.js"></script>
// <!-- 引入在线时长插件（只需要这一行！）-->
// <script src="/A2_全局中心/B_插件工具/2.插件_在线时长.js"></script>
// 注意：确保路径正确，且在每个页面都引入。
//
// 修复问题：
// 1. 静态路由跳进来立即计时，无需切换APP
// 2. 退出APP 后不会继续后台计时，使用时间戳方案
// 3. (新) UI由外部工具箱接管，本插件仅负责计时和通信
// ===============================================
(function() {
  'use strict';

  // ===============================================
  // 配置参数
  // ===============================================
  const CONFIG = {
    // 存储配置
    STORAGE_KEY: 'D_GLOBAL_ONLINE_TIME',
    LAST_ALIVE_KEY: 'onlineLastAlive', // 修复：存储最后活跃时间戳而不是累计秒数
    // 自动保存间隔（秒）
    AUTO_SAVE_INTERVAL: 300,
    // 更新显示间隔（毫秒）
    DISPLAY_UPDATE_INTERVAL: 1000,
    // 离线超时阈值（毫秒）- 超过这个时间认为是新会话
    OFFLINE_TIMEOUT: 5 * 60 * 1000 // 5 分钟
  };

  // ===============================================
  // 全局状态管理
  // ===============================================
  window.D_GLOBAL_ONLINE_TIME = window.D_GLOBAL_ONLINE_TIME || {
    startTime: null,
    totalSeconds: 0,
    lastSavedTime: 0,
    isActive: false,
    lastActiveTime: Date.now()
  };

  // ===============================================
  // 核心计时器类（修复版）
  // ===============================================
  class OnlineTimer {
    constructor() {
      this.updateTimer = null;
      this.saveTimer = null;
      this.isPageVisible = true;
      this.init();
    }

    async init() {
      // 等待数据库初始化
      if (window.IDB) {
        await window.IDB.init();
        // 加载保存的数据
        await this.loadFromDatabase();
        // 🔥修复1: 加载上次活跃时间戳，计算离线时间
        await this.loadLastAlive();
      }
      // 修复1: 设置页面可见性监听
      this.setupVisibilityListener();
      // 设置页面卸载监听
      this.setupUnloadListener();
      // 启动计时器
      this.startTimers();
      // 设置跨页面通信
      this.setupCrossPageCommunication();
      // 🔥修复1: 初始化时主动判断页面可见性
      this.initializeVisibilityState();
      console.log('在线时长插件初始化完成');
    }

    async loadFromDatabase() {
      try {
        if (window.IDB) {
          const savedData = await window.IDB.get(CONFIG.STORAGE_KEY, 'userdata');
          if (savedData) {
            window.D_GLOBAL_ONLINE_TIME = savedData;
            console.log('已加载在线时长数据:', savedData);
          }
        }
      } catch (error) {
        console.error('加载在线时长失败:', error);
      }
    }

    // 🔥修复2: 加载上次活跃时间戳，计算离线时间
    async loadLastAlive() {
      try {
        if (window.IDB) {
          const lastAlive = await window.IDB.get(CONFIG.LAST_ALIVE_KEY, 'userdata');
          const now = Date.now();
          if (lastAlive && (now - lastAlive < CONFIG.OFFLINE_TIMEOUT)) {
            // 合理区间：把离线这段时间"算"进去
            const offlineSeconds = Math.floor((now - lastAlive) / 1000);
            if (offlineSeconds > 0) {
              window.D_GLOBAL_ONLINE_TIME.totalSeconds += offlineSeconds;
              console.log(`已补算离线时间: ${offlineSeconds} 秒(${Math.floor(offlineSeconds/60)}分钟)`);
            }
          } else {
            // 太久没回来，视为新会话
            console.log('检测到长时间离线，视为新会话');
            // 可以选择清零或保留旧值，这里选择保留旧值
            // window.D_GLOBAL_ONLINE_TIME.totalSeconds = 0;
          }
        }
      } catch (error) {
        console.error('加载上次活跃时间失败:', error);
      }
    }

    async saveToDatabase() {
      try {
        if (window.IDB) {
          await window.IDB.put(CONFIG.STORAGE_KEY, window.D_GLOBAL_ONLINE_TIME, 'userdata');
          console.log('在线时长已保存');
        }
      } catch (error) {
        console.error('保存在线时长失败:', error);
      }
    }

    // 🔥修复2: 保存最后活跃时间戳而不是累计秒数
    async saveLastAlive() {
      try {
        if (window.IDB) {
          const timestamp = Date.now();
          await window.IDB.put(CONFIG.LAST_ALIVE_KEY, timestamp, 'userdata');
          console.log('最后活跃时间已记录:', new Date(timestamp).toLocaleTimeString());
        }
      } catch (error) {
        console.error('保存最后活跃时间失败:', error);
      }
    }

    // 🔥修复1: 初始化时主动判断页面可见性
    initializeVisibilityState() {
      // 主动判断：如果当前就是可见，立刻开始计时
      if (document.visibilityState === 'visible' && !window.D_GLOBAL_ONLINE_TIME.isActive) {
        console.log('页面初始状态为可见，立即开始计时');
        this.handlePageVisible();
      } else if (document.visibilityState === 'hidden') {
        console.log('页面初始状态为隐藏，等待可见事件');
        this.handlePageHidden();
      }
    }

    setupVisibilityListener() {
      // 监听页面可见性变化
      document.addEventListener('visibilitychange', () => {
        this.handleVisibilityChange();
      });
      // 监听窗口焦点变化
      window.addEventListener('focus', () => {
        this.handlePageFocus();
      });
      window.addEventListener('blur', () => {
        this.handlePageBlur();
      });
    }

    handleVisibilityChange() {
      const isVisible = !document.hidden;
      if (isVisible !== this.isPageVisible) {
        this.isPageVisible = isVisible;
        if (isVisible) {
          this.handlePageVisible();
        } else {
          this.handlePageHidden();
        }
      }
    }

    handlePageVisible() {
      console.log('页面变为可见');
      window.D_GLOBAL_ONLINE_TIME.isActive = true;
      window.D_GLOBAL_ONLINE_TIME.lastActiveTime = Date.now();
      // 立即保存活跃状态和最后活跃时间
      this.saveToDatabase();
      this.saveLastAlive();
      // 通知其他页面
      this.notifyOtherPages('page-visible');
    }

    handlePageHidden() {
      console.log('页面变为隐藏');
      window.D_GLOBAL_ONLINE_TIME.isActive = false;
      // 立即保存当前状态和最后活跃时间
      this.saveToDatabase();
      this.saveLastAlive();
      // 通知其他页面
      this.notifyOtherPages('page-hidden');
    }

    handlePageFocus() {
      if (!this.isPageVisible) {
        this.handlePageVisible();
      }
    }

    handlePageBlur() {
      if (this.isPageVisible) {
        this.handlePageHidden();
      }
    }

    setupUnloadListener() {
      // 页面卸载时保存数据
      window.addEventListener('beforeunload', () => {
        this.cleanup();
      });
      // 页面隐藏时保存数据（移动端兼容）
      window.addEventListener('pagehide', () => {
        this.cleanup();
      });
    }

    setupCrossPageCommunication() {
      // 使用Storage API 进行跨页面通信
      window.addEventListener('storage', (e) => {
        if (e.key === 'online-timer-sync') {
          const message = JSON.parse(e.newValue);
          this.handleCrossPageMessage(message);
        }
      });
    }

    handleCrossPageMessage(message) {
      if (message.type === 'timer-update') {
        // 同步其他页面的计时数据
        if (message.data.totalSeconds > window.D_GLOBAL_ONLINE_TIME.totalSeconds) {
          window.D_GLOBAL_ONLINE_TIME = message.data;
          console.log('已同步其他页面的在线时长数据');
          // 同步后也需要更新UI
          this.updateDisplay();
        }
      }
    }

    notifyOtherPages(eventType) {
      const message = {
        type: 'timer-update',
        event: eventType,
        data: window.D_GLOBAL_ONLINE_TIME,
        timestamp: Date.now()
      };
      try {
        localStorage.setItem('online-timer-sync', JSON.stringify(message));
        // 清除消息以避免重复处理
        setTimeout(() => {
          localStorage.removeItem('online-timer-sync');
        }, 100);
      } catch (error) {
        console.error('跨页面通信失败:', error);
      }
    }

    startTimers() {
      // 更新显示计时器
      this.updateTimer = setInterval(() => {
        this.updateDisplay();
      }, CONFIG.DISPLAY_UPDATE_INTERVAL);
      // 自动保存计时器
      this.saveTimer = setInterval(() => {
        this.autoSave();
      }, CONFIG.AUTO_SAVE_INTERVAL * 1000);
    }

    // 🎯 核心修改：不再更新UI，而是触发事件
    updateDisplay() {
      if (window.D_GLOBAL_ONLINE_TIME.isActive) {
        const now = Date.now();
        const sessionElapsed = window.D_GLOBAL_ONLINE_TIME.totalSeconds +
          Math.floor((now - window.D_GLOBAL_ONLINE_TIME.lastActiveTime) / 1000);
        
        const hours = Math.floor(sessionElapsed / 3600);
        const minutes = Math.floor((sessionElapsed % 3600) / 60);
        const secs = sessionElapsed % 60;

        const timeData = { hours, minutes, seconds: secs, totalSeconds: sessionElapsed };

        // 触发自定义事件，通知UI更新
        window.dispatchEvent(new CustomEvent('onlineTimeUpdate', { detail: timeData }));

        // 检查里程碑（可选）
        this.checkMilestones(sessionElapsed);
      }
    }

    checkMilestones(seconds) {
      const milestones = [3600, 7200, 10800, 14400, 18000, 21600, 25200, 28800, 32400]; // 1-9 小时
      const currentMilestone = milestones.find(m => seconds >= m && seconds < m + 60);
      if (currentMilestone && !window.D_GLOBAL_ONLINE_TIME[`milestone_${currentMilestone}`]) {
        window.D_GLOBAL_ONLINE_TIME[`milestone_${currentMilestone}`] = true;
        const hours = currentMilestone / 3600;
        // 触发自定义事件，通知UI显示里程碑
        window.dispatchEvent(new CustomEvent('onlineTimeMilestone', { 
            detail: { hours: hours, seconds: currentMilestone, message: `🎊恭喜！在线满${hours}小时，道行精进！` }
        }));
      }
    }

    autoSave() {
      if (window.D_GLOBAL_ONLINE_TIME.isActive) {
        const now = Date.now();
        const currentSeconds = this.getOnlineTime();
        // 更新总时长
        window.D_GLOBAL_ONLINE_TIME.totalSeconds = currentSeconds;
        window.D_GLOBAL_ONLINE_TIME.lastActiveTime = now;
        window.D_GLOBAL_ONLINE_TIME.lastSavedTime = currentSeconds;
        // 保存到数据库和最后活跃时间
        this.saveToDatabase();
        this.saveLastAlive();
        // 通知其他页面
        this.notifyOtherPages('auto-save');
      }
    }

    cleanup() {
      // 清理计时器
      if (this.updateTimer) {
        clearInterval(this.updateTimer);
      }
      if (this.saveTimer) {
        clearInterval(this.saveTimer);
      }
      // 最终保存
      const currentSeconds = this.getOnlineTime();
      window.D_GLOBAL_ONLINE_TIME.totalSeconds = currentSeconds;
      window.D_GLOBAL_ONLINE_TIME.lastActiveTime = Date.now();
      this.saveToDatabase();
      this.saveLastAlive(); // 🔥修复2: 最后活跃时间
      console.log('在线时长插件已清理');
    }

    // 公共API
    getOnlineTime() {
      if (window.D_GLOBAL_ONLINE_TIME.isActive) {
        const now = Date.now();
        const sessionElapsed = window.D_GLOBAL_ONLINE_TIME.totalSeconds +
          Math.floor((now - window.D_GLOBAL_ONLINE_TIME.lastActiveTime) / 1000);
        return sessionElapsed;
      }
      return window.D_GLOBAL_ONLINE_TIME.totalSeconds;
    }

    // 新增：添加秒数方法
    addSeconds(seconds) {
      if (seconds > 0) {
        window.D_GLOBAL_ONLINE_TIME.totalSeconds += seconds;
        window.D_GLOBAL_ONLINE_TIME.lastSavedTime = window.D_GLOBAL_ONLINE_TIME.totalSeconds;
        console.log(`已添加${seconds} 秒到在线时长`);
      }
    }

    reset() {
      window.D_GLOBAL_ONLINE_TIME = {
        startTime: Date.now(),
        totalSeconds: 0,
        lastSavedTime: 0,
        isActive: true,
        lastActiveTime: Date.now()
      };
      // 清空持久化的最后活跃时间
      if (window.IDB) {
        window.IDB.put(CONFIG.LAST_ALIVE_KEY, Date.now(), 'userdata');
        this.saveToDatabase();
      }
      // 重置后立即更新UI
      this.updateDisplay();
    }
  }

  // ===============================================
  // 初始化插件
  // ===============================================
  // 确保只初始化一次
  if (!window.D_GLOBAL_ONLINE_TIMER_INSTANCE) {
    // 等待DOM 加载完成
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        window.D_GLOBAL_ONLINE_TIMER_INSTANCE = new OnlineTimer();
        // 初始化完成后，设置持久化监听
        setupPersistenceListeners();
      });
    } else {
      window.D_GLOBAL_ONLINE_TIMER_INSTANCE = new OnlineTimer();
      // 初始化完成后，设置持久化监听
      setupPersistenceListeners();
    }
  }

  // ===============================================
  // 持久化监听器设置（修复版）
  // ===============================================
  function setupPersistenceListeners() {
    // 页面可见性变化时保存最后活跃时间
    document.addEventListener('visibilitychange', () => {
      if (window.D_GLOBAL_ONLINE_TIMER_INSTANCE) {
        // 🔥修复2: 不管是显示还是隐藏，都要保存最后活跃时间
        window.D_GLOBAL_ONLINE_TIMER_INSTANCE.saveLastAlive();
      }
    });
    // 页面刷新/关闭前保存
    window.addEventListener('beforeunload', () => {
      if (window.D_GLOBAL_ONLINE_TIMER_INSTANCE) {
        window.D_GLOBAL_ONLINE_TIMER_INSTANCE.saveLastAlive();
      }
    });
    // 页面隐藏时保存（移动端兼容）
    window.addEventListener('pagehide', () => {
      if (window.D_GLOBAL_ONLINE_TIMER_INSTANCE) {
        window.D_GLOBAL_ONLINE_TIMER_INSTANCE.saveLastAlive();
      }
    });
  }

  // ===============================================
  // 全局API
  // ===============================================
  window.OnlineTimer = {
    getOnlineTime: () => {
      return window.D_GLOBAL_ONLINE_TIMER_INSTANCE ?
        window.D_GLOBAL_ONLINE_TIMER_INSTANCE.getOnlineTime() : 0;
    },
    reset: () => {
      if (window.D_GLOBAL_ONLINE_TIMER_INSTANCE) {
        window.D_GLOBAL_ONLINE_TIMER_INSTANCE.reset();
      }
    },
    getFormattedTime: () => {
      const seconds = window.OnlineTimer.getOnlineTime();
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      if (hours > 0) {
        return `${hours}时${minutes}分${secs}秒`;
      } else if (minutes > 0) {
        return `${minutes}分${secs}秒`;
      } else {
        return `${secs}秒`;
      }
    },
    // 新增：添加秒数API
    addSeconds: (seconds) => {
      if (window.D_GLOBAL_ONLINE_TIMER_INSTANCE) {
        window.D_GLOBAL_ONLINE_TIMER_INSTANCE.addSeconds(seconds);
      }
    },
    // 新增：获取离线时间（用于调试）
    getOfflineTime: async () => {
      if (window.IDB && window.D_GLOBAL_ONLINE_TIMER_INSTANCE) {
        const lastAlive = await window.IDB.get(CONFIG.LAST_ALIVE_KEY, 'userdata');
        return lastAlive ? Date.now() - lastAlive : 0;
      }
      return 0;
    }
  };
})();
