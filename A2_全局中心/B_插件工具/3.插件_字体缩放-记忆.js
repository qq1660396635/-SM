// 1. 缩放插件 - 真正字体缩放版本
// 该插件通过调整根元素的字体大小来实现整个页面的缩放，
// 提供了UI控件、键盘快捷键以及本地存储功能。

// 2. 定义全局缩放插件对象
window.ZoomPlugin = {
  // 3. 当前缩放级别，默认为70%
  currentZoom: 90,
  // 4. 最小允许的缩放级别
  MIN_ZOOM: 50,
  // 5. 最大允许的缩放级别
  MAX_ZOOM: 150,
  // 6. 每次点击缩放按钮的步进值
  ZOOM_STEP: 10,
  
  // 7. 初始化函数：插件的入口点
  init() {
    // 8. 创建缩放控制UI
    this.createZoomControls();
    // 9. 加载本地存储的缩放级别
    this.loadZoomLevel();
    // 10. 添加键盘快捷键支持
    this.addKeyboardSupport();
  },
  
  // 11. 创建缩放控制UI界面（按钮和百分比显示）并添加样式
  createZoomControls() {
    // 12. 创建缩放控制容器
    const zoomContainer = document.createElement('div');
    zoomContainer.className = 'zoom-plugin-container';
    // 13. 设置容器内部HTML结构
    zoomContainer.innerHTML = `
      <button class="zoom-btn zoom-in" title="放大">+</button>
      <span class="zoom-level">${this.currentZoom}%</span>
      <button class="zoom-btn zoom-out" title="缩小">−</button>
    `;
    
    // 14. 创建<style>元素用于存放CSS
    const style = document.createElement('style');
    // 15. 定义UI控件的CSS样式
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
    
    // 16. 将CSS样式添加到文档头部
    document.head.appendChild(style);
    // 17. 将UI控件容器添加到文档body
    document.body.appendChild(zoomContainer);
    
    // 18. 为放大按钮绑定点击事件
    zoomContainer.querySelector('.zoom-in').addEventListener('click', () => this.zoomIn());
    // 19. 为缩小按钮绑定点击事件
    zoomContainer.querySelector('.zoom-out').addEventListener('click', () => this.zoomOut());
  },
  
  // 20. 应用缩放级别的核心函数
  applyZoom() {
    // 21. 获取文档的根元素（<html>）
    const root = document.documentElement;
    // 22. 通过设置根元素的fontSize来实现基于rem的缩放
    root.style.fontSize = `${this.currentZoom / 100}rem`;
    
    // 23. 调用函数以特殊处理命令块的显示
    this.adjustCommandBlocks();
    
    // 24. 更新放大/缩小按钮的可用状态
    this.updateButtonStates();
    // 25. 更新UI上显示的缩放百分比
    this.updateZoomDisplay();
    
    // 26. 将当前缩放级别保存到本地存储
    this.saveZoomLevel();
  },
  
  // 27. 调整命令块的显示样式，以适应不同的缩放级别
  adjustCommandBlocks() {
    // 28. 选取页面上所有class为'command-block'的元素
    const commandBlocks = document.querySelectorAll('.command-block');
    // 29. 遍历每一个命令块
    commandBlocks.forEach(block => {
      // 30. 判断当前缩放级别是否小于等于70%
      if (this.currentZoom <= 70) {
        // 31. 如果是，设置样式为单行显示并出现水平滚动条
        block.style.whiteSpace = 'nowrap';
        block.style.overflowX = 'auto';
        block.style.overflowY = 'hidden';
        block.style.scrollbarWidth = 'thin'; // Firefox
        block.style.maxHeight = 'auto';
      } else {
        // 32. 如果否，恢复为正常的自动换行显示
        block.style.whiteSpace = 'pre-wrap';
        block.style.overflowX = 'visible';
        block.style.overflowY = 'visible';
      }
    });
  },
  
  // 33. 放大函数：增加一级缩放
  zoomIn() {
    // 检查当前缩放是否小于最大值
    if (this.currentZoom < this.MAX_ZOOM) {
      this.currentZoom += this.ZOOM_STEP;
      this.applyZoom();
    }
  },
  
  // 34. 缩小函数：减少一级缩放
  zoomOut() {
    // 检查当前缩放是否大于最小值
    if (this.currentZoom > this.MIN_ZOOM) {
      this.currentZoom -= this.ZOOM_STEP;
      this.applyZoom();
    }
  },
  
  // 35. 更新缩放按钮的启用/禁用状态
  updateButtonStates() {
    // 36. 获取放大按钮并在达到最大缩放时禁用它
    const zoomInBtn = document.querySelector('.zoom-in');
    // 37. 获取缩小按钮并在达到最小缩放时禁用它
    const zoomOutBtn = document.querySelector('.zoom-out');
    
    if (zoomInBtn) zoomInBtn.disabled = this.currentZoom >= this.MAX_ZOOM;
    if (zoomOutBtn) zoomOutBtn.disabled = this.currentZoom <= this.MIN_ZOOM;
  },
  
  // 38. 更新UI上显示的缩放百分比文本
  updateZoomDisplay() {
    // 39. 获取显示百分比的span元素
    const zoomLevel = document.querySelector('.zoom-level');
    if (zoomLevel) {
      // 40. 更新其文本内容为当前缩放值
      zoomLevel.textContent = `${this.currentZoom}%`;
    }
  },
  
  // 41. 保存当前缩放级别到IndexedDB
  saveZoomLevel() {
    // 42. 检查全局IDB对象是否存在
    if (window.IDB) {
      // 43. 使用IDB的put方法保存数据
      IDB.put('E_zoom_level', this.currentZoom, 'userdata');
    }
  },
  
  // 44. 从IndexedDB异步加载保存的缩放级别
  async loadZoomLevel() {
    try {
      // 45. 检查全局IDB对象是否存在
      if (window.IDB) {
        // 46. 使用IDB的get方法获取数据
        const savedZoom = await IDB.get('E_zoom_level', 'userdata');
        // 47. 验证加载的缩放值是否在有效范围内
        if (savedZoom && savedZoom >= this.MIN_ZOOM && savedZoom <= this.MAX_ZOOM) {
          // 48. 如果有效，则设置为当前缩放级别
          this.currentZoom = savedZoom;
          // 49. 延迟100毫秒应用缩放，确保页面元素已渲染
          setTimeout(() => this.applyZoom(), 100);
        }
      }
    } catch (error) {
      // 50. 捕获并打印加载过程中可能出现的错误
      console.error('加载缩放级别失败:', error);
    }
  },
  
  // 51. 添加键盘快捷键支持
  addKeyboardSupport() {
    // 52. 在整个文档上监听键盘按下事件
    document.addEventListener('keydown', (e) => {
      // 53. 检查是否按下了Ctrl或Meta键（Mac的Cmd键）
      if (e.ctrlKey || e.metaKey) {
        // 54. 处理放大快捷键 (Ctrl/Cmd + +/=)
        if (e.key === '=' || e.key === '+') {
          e.preventDefault();
          this.zoomIn();
        // 55. 处理缩小快捷键 (Ctrl/Cmd + -)
        } else if (e.key === '-') {
          e.preventDefault();
          this.zoomOut();
        // 56. 处理重置快捷键 (Ctrl/Cmd + 0)
        } else if (e.key === '0') {
          e.preventDefault();
          this.currentZoom = 100;
          this.applyZoom();
        }
      }
    });
  }
};

// 57. 监听DOM内容加载完成事件
document.addEventListener('DOMContentLoaded', () => {
  // 58. DOM加载完成后，自动初始化缩放插件
  ZoomPlugin.init();
});
