// 1. 缩放插件 - 兼容rem和px版本
window.ZoomPlugin = {
  currentZoom: 80,
  MIN_ZOOM: 50,
  MAX_ZOOM: 150,
  ZOOM_STEP: 10,
  
  // 2. 初始化插件
  init() {
    this.createZoomControls();
    this.loadZoomLevel();
    this.addKeyboardSupport();
    // 保证一上来就把缩放级别真正落到 DOM
    this.applyZoom();
  },
  
  // 3. 创建缩放控制UI
  createZoomControls() {
    const zoomContainer = document.createElement('div');
    zoomContainer.className = 'zoom-plugin-container';
    zoomContainer.innerHTML = `
      <button class="zoom-btn zoom-in" title="放大">+</button>
      <span class="zoom-level">${this.currentZoom}%</span>
      <button class="zoom-btn zoom-out" title="缩小">−</button>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
      .zoom-plugin-container {
        position: fixed;
        bottom: 15px;
        right: 15px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        z-index: 1000;
        align-items: center;
      }
      .zoom-btn {
        width: 35px;
        height: 35px;
        border: none;
        background: rgba(102, 126, 234, 0.9);
        color: white;
        border-radius: 50%;
        cursor: pointer;
        font-size: 18px;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      }
      .zoom-btn:hover {
        background: rgba(102, 126, 234, 1);
        transform: scale(1.1);
      }
      .zoom-btn:active {
        transform: scale(0.95);
      }
      .zoom-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .zoom-btn:disabled:hover {
        transform: scale(1);
      }
      .zoom-level {
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: bold;
        min-width: 35px;
        text-align: center;
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(zoomContainer);
    
    zoomContainer.querySelector('.zoom-in').addEventListener('click', () => this.zoomIn());
    zoomContainer.querySelector('.zoom-out').addEventListener('click', () => this.zoomOut());
  },
  
  // 4. 应用缩放
  applyZoom() {
    // 应用rem缩放
    this.applyRemZoom();
    
    // 应用px缩放
    this.applyPxZoom();
    
    // 特殊处理命令块
    this.adjustCommandBlocks();
    
    // 更新按钮状态和缩放显示
    this.updateButtonStates();
    this.updateZoomDisplay();
    
    // 保存缩放级别
    this.saveZoomLevel();
  },
  
  // 5. 应用rem缩放
  applyRemZoom() {
    // 设置根元素字体大小，实现rem缩放
    const root = document.documentElement;
    root.style.fontSize = `${this.currentZoom / 100}rem`;
  },
  
  // 6. 应用px缩放
  applyPxZoom() {
    // 使用 transform: scale() 来缩放整个 body，以兼容 px 单位
    const body = document.body;
    const scale = this.currentZoom / 100;
    
    // 应用缩放和变换原点
    body.style.transform = `scale(${scale})`;
    body.style.transformOrigin = 'top left';
    
    // 调整 body 的宽高以防止缩放后产生多余的空白区域
    // 因为 scale() 是视觉上的缩放，不会改变元素的实际布局尺寸
    // 所以我们需要反向调整其尺寸来适应视口
    const inverseScale = 1 / scale;
    body.style.width = `${inverseScale * 100}%`;
    body.style.height = `${inverseScale * 100}vh`;
  },
  
  // 7. 调整命令块样式
  adjustCommandBlocks() {
    const commandBlocks = document.querySelectorAll('.command-block');
    commandBlocks.forEach(block => {
      if (this.currentZoom <= 70) {
        // 小缩放时，命令显示为一行，添加滚动条
        block.style.whiteSpace = 'nowrap';
        block.style.overflowX = 'auto';
        block.style.overflowY = 'hidden';
        block.style.scrollbarWidth = 'thin'; // Firefox
        block.style.maxHeight = 'auto';
      } else {
        // 正常缩放时，恢复正常换行
        block.style.whiteSpace = 'pre-wrap';
        block.style.overflowX = 'visible';
        block.style.overflowY = 'visible';
      }
    });
  },
  
  // 8. 放大
  zoomIn() {
    if (this.currentZoom < this.MAX_ZOOM) {
      this.currentZoom += this.ZOOM_STEP;
      this.applyZoom();
    }
  },
  
  // 9. 缩小
  zoomOut() {
    if (this.currentZoom > this.MIN_ZOOM) {
      this.currentZoom -= this.ZOOM_STEP;
      this.applyZoom();
    }
  },
  
  // 10. 更新按钮状态
  updateButtonStates() {
    const zoomInBtn = document.querySelector('.zoom-in');
    const zoomOutBtn = document.querySelector('.zoom-out');
    
    if (zoomInBtn) zoomInBtn.disabled = this.currentZoom >= this.MAX_ZOOM;
    if (zoomOutBtn) zoomOutBtn.disabled = this.currentZoom <= this.MIN_ZOOM;
  },
  
  // 11. 更新缩放显示
  updateZoomDisplay() {
    const zoomLevel = document.querySelector('.zoom-level');
    if (zoomLevel) {
      zoomLevel.textContent = `${this.currentZoom}%`;
    }
  },
  
  // 12. 保存缩放级别
  saveZoomLevel() {
    if (window.IDB) {
      IDB.put('E_zoom_level', this.currentZoom, 'userdata');
    }
  },
  
  // 13. 加载缩放级别
  async loadZoomLevel() {
    // 以下代码被注释，以实现每次加载都强制从70%开始，忽略历史记录。
    // 如需恢复记忆功能，请取消注释。
    /*
    try {
      if (window.IDB) {
        const savedZoom = await IDB.get('E_zoom_level', 'userdata');
        if (savedZoom && savedZoom >= this.MIN_ZOOM && savedZoom <= this.MAX_ZOOM) {
          this.currentZoom = savedZoom;
          // 延迟应用，等待页面渲染完成
          setTimeout(() => this.applyZoom(), 100);
        }
      }
    } catch (error) {
      console.error('加载缩放级别失败:', error);
    }
    */
  },
  
  // 14. 添加键盘快捷键支持
  addKeyboardSupport() {
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === '=' || e.key === '+') {
          e.preventDefault();
          this.zoomIn();
        } else if (e.key === '-') {
          e.preventDefault();
          this.zoomOut();
        } else if (e.key === '0') {
          e.preventDefault();
          this.currentZoom = 100;
          this.applyZoom();
        }
      }
    });
  }
};

// 15. 自动初始化
document.addEventListener('DOMContentLoaded', () => {
  ZoomPlugin.init();
});
