// styleConfig.js - 样式配置文件
(function() {
    // 动态注入所有CSS样式
    const css = `
        * {margin: 0; padding: 0; box-sizing: border-box;}
        body {background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);min-height: 100vh; padding: 10px; position: relative; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #ffffff; overflow-x: hidden;}
        .container {max-width: 1200px; margin: 0 auto; position: relative; z-index: 1;}
        header {text-align: center; margin-bottom: 5px; color: #ffffff; position: relative; padding-top: 40px;}
        h1 {font-size: 1.8rem; margin-bottom: 8px;color: #ffffff; font-weight: 700; letter-spacing: 1px;}
        .user-menu-btn {position: fixed; left: 20px; top: 20px; background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2); color: #ffffff; padding: 8px 15px; border-radius: 30px; cursor: pointer; font-size: 12px; transition: all 0.3s ease; display: flex; align-items: center; gap: 6px; z-index: 1001; font-weight: 500;}
        .user-menu-btn:hover {background: rgba(255, 255, 255, 0.25); transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);}
        .user-avatar {width: 24px; height: 24px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(255, 255, 255, 0.3);}
        .search-container {background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(7px); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 8px; padding: 10px; margin-bottom: 10px; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);}
        .search-box {position: relative; max-width: 400px; margin: 0 auto;}
        .search-input {width: 100%; padding: 8px 40px 8px 15px; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 20px; font-size: 12px; transition: all 0.3s ease; background: rgba(255, 255, 255, 0.05); color: #ffffff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; height: 32px;}
        .search-input:focus {outline: none; border-color: rgba(255, 255, 255, 0.4); background: rgba(255, 255, 255, 0.1); box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);}
        .search-input::placeholder {color: rgba(255, 255, 255, 0.6);}
        .search-icon {position: absolute; right: 15px; top: 50%; transform: translateY(-50%); color: rgba(255, 255, 255, 0.7); pointer-events: none; font-size: 14px;}
        .games-grid {display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 12px; margin-bottom: 10px; padding-top: 10px;}
        .game-card {background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 10px; padding: 15px 10px; text-decoration: none; color: #ffffff; transition: all 0.3s ease; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1); position: relative; overflow: hidden; display: flex; flex-direction: column; align-items: center; text-align: center; height: 90px;}
        .game-card::before {content: ""; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, #4facfe, #00f2fe); transform: scaleX(0); transition: transform 0.3s ease;}
        .game-card:hover {transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2); background: rgba(255, 255, 255, 0.12);}
        .game-card:hover::before {transform: scaleX(1);}
        .game-number {display: inline-block; background: rgba(79, 172, 254, 0.2); border: 1px solid rgba(79, 172, 254, 0.4); color: #ffffff; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: 600; margin-bottom: 8px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;}
        .game-name {font-size: 13px; font-weight: 600; color: #ffffff; line-height: 1.2;}
        .pagination-wrapper {display: flex; justify-content: center; align-items: center; gap: 8px; margin: 20px 0; flex-wrap: wrap;}
        .pagination {display: flex; justify-content: center; align-items: center; gap: 6px; flex-wrap: wrap;}
        .pagination button {padding: 6px 10px; border: 1px solid rgba(255, 255, 255, 0.2); background: rgba(255, 255, 255, 0.1); color: #ffffff; border-radius: 6px; cursor: pointer; font-weight: 500; transition: all 0.3s ease; min-width: 28px; font-size: 12px;}
        .pagination button:hover:not(:disabled) {background: rgba(255, 255, 255, 0.2); transform: translateY(-2px); box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);}
        .pagination button.active {background: linear-gradient(135deg, #4facfe, #00f2fe); border-color: transparent; box-shadow: 0 3px 10px rgba(79, 172, 254, 0.3);}
        .pagination button:disabled {opacity: 0.4; cursor: not-allowed;}
        .pagination span {color: rgba(255, 255, 255, 0.7); font-size: 12px; margin: 0 3px;}
        .no-results {text-align: center; color: rgba(255, 255, 255, 0.7); padding: 30px; font-size: 14px;}
        .toast {position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%) translateY(100px); background: rgba(0, 0, 0, 0.8); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); color: #ffffff; padding: 12px 20px; border-radius: 8px; font-size: 13px; font-weight: 500; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2); opacity: 0; transition: all 0.3s ease; z-index: 3000; max-width: 80%; text-align: center;}
        .toast.show {transform: translateX(-50%) translateY(0); opacity: 1;}
        .sidebar-overlay {position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); z-index: 1999; opacity: 0; visibility: hidden; transition: all 0.3s ease;}
        .sidebar-overlay.active {opacity: 1; visibility: visible;}
        .sidebar-container {position: fixed; top: 0; left: -60%; width: 60%; height: 100%; z-index: 2000; transition: all 0.3s ease; box-shadow: 5px 0 25px rgba(0, 0, 0, 0.2); background: rgba(255, 255, 255, 0.95);}
        .sidebar-container.active {left: 0;}
        #bgInput {display: none;}
        .skeleton {background: linear-gradient(90deg, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.05) 75%); background-size: 200% 100%; animation: skeleton-loading 1.5s infinite;}
        @keyframes skeleton-loading {0% { background-position: 200% 0; } 100% { background-position: -200% 0; }}
        .skeleton-block {background: rgba(255, 255, 255, 0.08); border-radius: 4px;}
        
        /* 导航卡片样式 - 前4个粉色，第5个及之后绿色 */
        .game-card[data-category="navigation"]:nth-child(-n+4) {
            background: linear-gradient(135deg, rgba(255, 182, 193, 0.3), rgba(255, 105, 180, 0.2));
            border: 1px solid rgba(255, 182, 193, 0.5);
        }
        .game-card[data-category="navigation"]:nth-child(-n+4):hover {
            background: linear-gradient(135deg, rgba(255, 182, 193, 0.4), rgba(255, 105, 180, 0.3));
            box-shadow: 0 8px 20px rgba(255, 105, 180, 0.3);
        }
        .game-card[data-category="navigation"]:nth-child(-n+4)::before {
            background: linear-gradient(90deg, #ff69b4, #ff1493);
        }
        .game-card[data-category="navigation"]:nth-child(-n+4) .game-number {
            background: rgba(255, 105, 180, 0.3);
            border: 1px solid rgba(255, 105, 180, 0.5);
        }
        
        .game-card[data-category="navigation"]:nth-child(n+5) {
            background: linear-gradient(135deg, rgba(144, 238, 144, 0.3), rgba(50, 205, 50, 0.2));
            border: 1px solid rgba(144, 238, 144, 0.5);
        }
        .game-card[data-category="navigation"]:nth-child(n+5):hover {
            background: linear-gradient(135deg, rgba(144, 238, 144, 0.4), rgba(50, 205, 50, 0.3));
            box-shadow: 0 8px 20px rgba(50, 205, 50, 0.3);
        }
        .game-card[data-category="navigation"]:nth-child(n+5)::before {
            background: linear-gradient(90deg, #32cd32, #228b22);
        }
        .game-card[data-category="navigation"]:nth-child(n+5) .game-number {
            background: rgba(50, 205, 50, 0.3);
            border: 1px solid rgba(50, 205, 50, 0.5);
        }
        
        @media(max-width: 768px) {h1 { font-size: 1.5rem; } .games-grid { grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 10px; } .sidebar-container { width: 70%; left: -70%; } header { padding-top: 35px; }}
        @media(max-width: 480px) {.games-grid { grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 8px; } .sidebar-container { width: 85%; left: -85%; } header { padding-top: 30px; } .user-menu-btn { left: 15px; top: 15px; font-size: 11px; padding: 6px 12px; } .game-card { height: 80px; padding: 12px 8px; } .game-name { font-size: 11px; }}
    `;
    
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // 样式相关的JS函数
    window.loadSavedBackground = function() {
        const savedBg = localStorage.getItem('userBackground');
        if (savedBg && savedBg !== 'undefined' && savedBg !== 'null') {
            document.body.style.backgroundImage = `url(${savedBg})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center center';
            document.body.style.backgroundRepeat = 'no-repeat';
            document.body.style.backgroundAttachment = 'fixed';
            window.hasUserBackground = true;
        } else {
            window.hasUserBackground = false;
        }
    };

    window.handleBgUpload = function(event) {
        const file = event.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            window.showToast('请选择有效的图片文件');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            window.showToast('图片大小不能超过5MB');
            return;
        }
        const reader = new FileReader();
        reader.onload = function(e) {
            const bgData = e.target.result;
            localStorage.setItem('userBackground', bgData);
            window.hasUserBackground = true;
            document.body.style.backgroundImage = `url(${bgData})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center center';
            document.body.style.backgroundRepeat = 'no-repeat';
            document.body.style.backgroundAttachment = 'fixed';
            window.showToast('背景更换成功!');
        };
        reader.onerror = function() {
            window.showToast('图片读取失败，请重试');
        };
        reader.readAsDataURL(file);
        event.target.value = "";
    };
})();
