// ===============================================
// IndexedDB 核心系统层
// 提供基础数据库操作能力
// ===============================================
window.IDB_CORE = {
    // 数据库配置
    DB_NAME: 'LiangAnUserCenterDB',
    VERSION: 1,
    STORES: {
        configs: 'configs', // 配置数据区
        userdata: 'userdata', // 用户数据区
        official: 'official' // 官方数据区
    },
    db: null,
    initPromise: null,

    // 初始化数据库连接
    async init() {
        if (this.initPromise) return this.initPromise;
        this.initPromise = new Promise((resolve, reject) => {
            console.log('🔄开始初始化数据库...');
            const request = indexedDB.open(this.DB_NAME, this.VERSION);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                console.log('✅ 数据库初始化完成');
                resolve(this.db);
            };
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                Object.values(this.STORES).forEach(storeName => {
                    if (!db.objectStoreNames.contains(storeName)) {
                        db.createObjectStore(storeName);
                        console.log(`📁 创建${storeName} 存储`);
                    }
                });
            };
        });
        return this.initPromise;
    },

    // 基础操作方法
    async operate(storeName, mode, operation) {
        await this.init();
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction([storeName], mode);
            const store = tx.objectStore(storeName);
            const request = operation(store);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    // 核心接口
    async put(key, value, store = 'configs') {
        return this.operate(store, 'readwrite', store => store.put(value, key));
    },

    async get(key, store = 'configs') {
        return this.operate(store, 'readonly', store => store.get(key));
    },

    async delete(key, store = 'configs') {
        return this.operate(store, 'readwrite', store => store.delete(key));
    },

    async isAvailable() {
        try {
            await this.init();
            return true;
        } catch (error) {
            console.error('❌ 数据库不可用:', error);
            return false;
        }
    }
};

// 自动初始化
(async function() {
    try {
        await IDB_CORE.init();
        console.log('🚀 数据库核心系统加载完成');
    } catch (error) {
        console.error('❌ 数据库核心系统加载失败:', error);
        if (typeof window !== 'undefined') {
            window.IDB_ERROR = {
                message: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            };
        }
    }
})();
