// ===============================================
// 数据库中心 - 统一入口
// 整合系统核心和用户扩展
// ===============================================
(function() {
    // 动态加载依赖
    async function loadScript(src) {
        return new Promise(resolve => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            document.head.appendChild(script);
        });
    }

    // 初始化数据库中心
    async function initDBCenter() {
        try {
            // 加载依赖
            await loadScript('/A2_全局中心/A_数据中心/1-DB系统层级.js');
            await loadScript('/A2_全局中心/A_数据中心/2-DB拓展.js');
            
            // 暴露统一接口
            window.DB = {
                // 核心操作接口
                set: async ({ store, key, value }) => {
                    return IDB_CORE.put(key, value, store);
                },
                
                get: async ({ store, key }) => {
                    return IDB_CORE.get(key, store);
                },
                
                delete: async ({ store, key }) => {
                    return IDB_CORE.delete(key, store);
                },

                // 存储区域常量（提取到顶部）
                STORES: {
                    CONFIGS: 'configs',
                    USERDATA: 'userdata',
                    OFFICIAL: 'official'
                },

                // 高级功能
                clear: (store) => IDB_EXT.debug.clear(store),
                getAll: (store) => IDB_EXT.debug.listAll(store),
                
                // 数据管理
                exportData: (account, password, options) => 
                    IDB_EXT.DataManager.exportData(account, password, options),
                importData: (jsonData, account, password, overwrite) => 
                    IDB_EXT.DataManager.importData(jsonData, account, password, overwrite),
                
                // 缓存管理
                cacheFile: (fileName, store) => 
                    IDB_EXT.cacheLocalFile(fileName, store),
                getFile: (file) => 
                    IDB_EXT.CacheMgr.get(file),
                
                // 调试工具
                getInfo: () => IDB_EXT.debug.getInfo(),
                debug: IDB_EXT.debug
            };

            console.log('🚀 数据库中心初始化完成');
        } catch (error) {
            console.error('❌ 数据库中心初始化失败:', error);
        }
    }

    // 自动初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDBCenter);
    } else {
        initDBCenter();
    }
})();
