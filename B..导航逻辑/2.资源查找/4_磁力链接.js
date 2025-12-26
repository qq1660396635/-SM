// 磁力链接导航配置文件
window.magnetConfig = {
    /* --------------------- 站点列表 --------------------- */
    sites: [
        { name: 'Magnet Pics', url: 'https://magnet.pics/', icon: '🧲', description: '磁力图片搜索站点，提供丰富的图片资源' },
        { name: 'BT Dad', url: 'https://www.btdad.best', icon: '🎯', description: 'BT资源搜索，快速查找所需资源' },
        { name: '种子吧', url: 'https://zzb06.top/', icon: '🌱', description: '提供海量种子资源下载' },
        { name: '老牛BT', url: 'https://wap.laoniubt.cc/', icon: '🐂', description: '老牛BT资源站，提供优质BT资源下载' },
        { name: '磁力狗', url: 'https://clg2.clgapp1.xyz/', icon: '🐕', description: '磁力狗搜索站，快速查找磁力链接资源' }
    ],

    // 提供给主页面的接口，用于获取站点数据
    getAllSites: function() {
        return this.sites;
    }
};
