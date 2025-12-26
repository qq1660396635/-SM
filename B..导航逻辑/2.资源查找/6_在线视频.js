// 磁力链接导航配置文件
window.magnetConfig = {
    /* --------------------- 站点列表 --------------------- */
    sites: [
        { name: '无窝', url: 'https://xm1.cc/', icon: '🎬', description: '在线影视资源网站，提供最新电影和电视剧' },
        { name: '南华教育', url: 'https://nanhuajiaoyu.com/', icon: '🎓', description: '南华教育官方网站，提供教育相关资讯和资源' },
        { name: '步步点影', url: 'https://www.bbdyhd.com/', icon: '🍿', description: '高清影视点播平台，海量影片随心看' },
        { name: 'VS影视', url: 'https://www.vsyy520.cc/', icon: '🎞️', description: 'VS影视，热门电影、电视剧在线观看' },
        { name: '好看电影网', url: 'http://m.fzltjj.com/', icon: '🎁', description: '综合资源分享论坛，发现更多精彩内容' }
    ],

    /* --------------------- 背景渐变 --------------------- */
    gradients: [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
        'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
    ],

    /* --------------------- 游动动画配置 --------------------- */
    animation: {
        duration: 25,
        amplitude: 30,
        speed: 0.5
    },

    /* --------------------- 公共方法 --------------------- */
    getAllSites() {
        return new Promise((resolve) => {
            // 模拟异步加载
            setTimeout(() => {
                resolve(this.sites);
            }, 300);
        });
    },

    getRandomGradient() {
        return this.gradients[Math.floor(Math.random() * this.gradients.length)];
    },

    async checkSiteExists(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch (error) {
            return true; // 对于跨域请求，默认返回true
        }
    },

    async getAvailableSites() {
        const availableSites = [];
        for (const site of this.sites) {
            if (await this.checkSiteExists(site.url)) {
                availableSites.push(site);
            }
        }
        return availableSites;
    }
};
