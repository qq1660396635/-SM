// 1. 缩放插件 - 兼容rem和px版本
window.ZoomPlugin = {
  currentZoom: 100,
  MIN_ZOOM: 50,
  MAX_ZOOM: 150,
  ZOOM_STEP: 10,
  
  // 2. 初始化插件
  init() {
    this.createZoomControls();
    this.loadZoomLevel();
    this.addKeyboardSupport();
    this.applyZoom();
  },
  
  // 3. 创建缩放控制UI
  createZoomControls() {
    const zoomContainer = document.createElement('div');
    zoomContainer.className = 'zoom-plugin-container';
    zoomContainer.innerHTML = `
      <button class="zoom-btn zoom-in" title="放大">+</button>
      <div class="zoom-level">${this.currentZoom}%</div>
      <button class="zoom-btn zoom-out" title="缩小">−</button>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
      .zoom-plugin-container {
        position: fixed;
        bottom: 20px;  /* 修改为固定距离底部20px */
        right: 20px;   /* 修改为固定距离右边20px */
        display: flex;
        flex-direction: column;
        gap: 4px;
        z-index: 1000;
        align-items: center;
      }
      
      .zoom-btn {
        width: 32px;
        height: 32px;
        border: none;
        background: linear-gradient(135deg, #FF758C 0%, #FF7EB3 100%);
        color: white;
        border-radius: 50%;
        cursor: pointer;
        font-size: 16px;
        font-weight: 300;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        box-shadow: 0 2px 8px rgba(255, 117, 140, 0.25);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
      }
      
      .zoom-btn:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 12px rgba(255, 117, 140, 0.4);
      }
      
      .zoom-btn:active {
        transform: scale(0.95);
      }
      
      .zoom-btn:disabled {
        opacity: 0.4;
        cursor: not-allowed;
        transform: scale(1);
      }
      
      .zoom-btn:disabled:hover {
        box-shadow: 0 2px 8px rgba(255, 117, 140, 0.25);
      }
      
      .zoom-level {
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 2px 6px;
        border-radius: 10px;
        font-size: 11px;
        font-weight: 500;
        min-width: 32px;
        text-align: center;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        letter-spacing: 0.5px;
      }
      
      /* 移动端优化 */
      @media (max-width: 768px) {
        .zoom-plugin-container {
          right: 15px;  /* 移动端距离右边15px */
          bottom: 15px;  /* 移动端距离底部15px */
          gap: 3px;
        }
        
        .zoom-btn {
          width: 28px;
          height: 28px;
          font-size: 14px;
        }
        
        .zoom-level {
          font-size: 10px;
          padding: 1px 5px;
          min-width: 28px;
        }
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(zoomContainer);
    
    zoomContainer.querySelector('.zoom-in').addEventListener('click', () => this.zoomIn());
    zoomContainer.querySelector('.zoom-out').addEventListener('click', () => this.zoomOut());
  },
  
  // 4. 应用缩放
  applyZoom() {
    this.applyRemZoom();
    this.applyPxZoom();
    this.adjustCommandBlocks();
    this.updateButtonStates();
    this.updateZoomDisplay();
    this.saveZoomLevel();
  },
  
  // 5. 应用rem缩放
  applyRemZoom() {
    const root = document.documentElement;
    root.style.fontSize = `${this.currentZoom / 100}rem`;
  },
  
  // 6. 应用px缩放
  applyPxZoom() {
    const body = document.body;
    const scale = this.currentZoom / 100;
    
    body.style.transform = `scale(${scale})`;
    body.style.transformOrigin = 'top left';
    
    const inverseScale = 1 / scale;
    body.style.width = `${inverseScale * 100}%`;
    body.style.height = `${inverseScale * 100}vh`;
  },
  
  // 7. 调整命令块样式
  adjustCommandBlocks() {
    const commandBlocks = document.querySelectorAll('.command-block');
    commandBlocks.forEach(block => {
      if (this.currentZoom <= 70) {
        block.style.whiteSpace = 'nowrap';
        block.style.overflowX = 'auto';
        block.style.overflowY = 'hidden';
        block.style.scrollbarWidth = 'thin';
        block.style.maxHeight = 'auto';
      } else {
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
    try {
      if (window.IDB) {
        const savedZoom = await IDB.get('E_zoom_level', 'userdata');
        if (savedZoom && savedZoom >= this.MIN_ZOOM && savedZoom <= this.MAX_ZOOM) {
          this.currentZoom = savedZoom;
          setTimeout(() => this.applyZoom(), 100);
        }
      }
    } catch (error) {
      console.error('加载缩放级别失败:', error);
    }
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
