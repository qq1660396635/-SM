//==============================================
// Cordova 检票逻辑
//==============================================

// 创建全局命名空间，统一管理状态和方法
window.CordovaTicket = {
    ticket: false,
    time: null,
    
    /**
     * 通知侧边栏Cordova状态
     */
    notifySidebar: function() {
        const iframe = document.getElementById('sidebarFrame');
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage({
                type: 'cordovaReady',
                ticket: this.ticket, // 使用 this 指向当前对象
                time: this.time
            }, '*');
        }
    }
};

//==============================================
// 监听 Cordova 就绪事件
//==============================================
document.addEventListener('deviceready', function() {
    console.log('主页面收到 Cordova 票！');

    // 1. 直接更新命名空间内的状态
    window.CordovaTicket.ticket = true;
    window.CordovaTicket.time = new Date().toLocaleTimeString();

    // 2. 设置 localStorage，供其他页面查询
    localStorage.setItem('cordovaReady', 'true');
    localStorage.setItem('cordovaTime', window.CordovaTicket.time);

    // 3. 通知侧边栏 Cordova 已就绪
    window.CordovaTicket.notifySidebar();

}, false);
