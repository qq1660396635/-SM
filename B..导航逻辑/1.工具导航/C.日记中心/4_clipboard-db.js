// ===============================================
// 剪贴板数据库操作封装
// 所有数据存储在用户区域，变量名以D_开头
// ===============================================

const ClipboardDB = {
    // 系统卡片和用户卡片
    systemCards: [],
    userCards: [],

    // 初始化数据库
    async init() {
        try {
            // 等待数据库中心准备好
            await this.waitForDB();
            
            // 初始化创建时间
            await this.initCreatedTime();
            
            console.log('✅ 剪贴板数据库初始化完成');
        } catch (error) {
            console.error('❌ 剪贴板数据库初始化失败:', error);
        }
    },

    // 等待数据库中心准备好
    waitForDB() {
        return new Promise((resolve) => {
            const checkDB = () => {
                if (typeof DB !== 'undefined') {
                    console.log('✅ DB 已准备好，开始初始化剪贴板数据库');
                    resolve();
                } else {
                    console.log('⏳ 等待 DB 加载中...');
                    setTimeout(checkDB, 100); // 每 100ms 检查一次
                }
            };
            checkDB();
        });
    },

    // 加载卡片数据
    async loadCards() {
        try {
            // 先加载配置文件并缓存到系统存储区
            await this.loadAndCacheConfigFile();
            
            // 然后从数据库加载数据
            await this.loadSystemCards();
            await this.loadUserCards();
            
            console.log('✅ 卡片数据加载完成');
        } catch (error) {
            console.error('❌ 加载卡片数据失败:', error);
        }
    },

    // 加载并缓存配置文件
    async loadAndCacheConfigFile() {
        try {
            // 先检查系统存储区是否已有配置
            const cachedConfig = await DB.get({
                store: 'official',
                key: 'clipboard_system_cards'
            });
            
            if (cachedConfig) {
                this.systemCards = cachedConfig;
                console.log('系统存储区已有配置文件');
                return;
            }
            
            // 系统存储区没有，则加载配置文件
            if (typeof defaultCards !== 'undefined' && Array.isArray(defaultCards)) {
                this.systemCards = [...defaultCards];
                // 缓存到系统存储区
                await DB.set({
                    store: 'official',
                    key: 'clipboard_system_cards',
                    value: this.systemCards
                });
                console.log('配置文件已加载并缓存到系统存储区');
            } else {
                this.systemCards = [];
            }
        } catch (error) {
            console.error('加载配置文件失败:', error);
            this.systemCards = [];
        }
    },

    // 加载系统卡片
    async loadSystemCards() {
        try {
            // 从系统存储区读取
            const cachedData = await DB.get({
                store: 'official',
                key: 'clipboard_system_cards'
            });
            
            if (cachedData) {
                this.systemCards = cachedData;
                console.log('从系统存储区加载剪贴板数据');
            } else {
                this.systemCards = [];
            }
        } catch (error) {
            console.error('加载系统卡片失败:', error);
            this.systemCards = [];
        }
    },

    // 加载用户卡片
    async loadUserCards() {
        try {
            // 从用户存储区读取
            const userData = await DB.get({
                store: CONFIG.STORE,
                key: CONFIG.KEYS.D_CLIPBOARD_CARDS
            });
            
            if (userData) {
                this.userCards = userData;
                console.log('从用户存储区加载剪贴板数据');
            } else {
                this.userCards = [];
            }
        } catch (error) {
            console.error('加载用户卡片失败:', error);
            this.userCards = [];
        }
    },

    // 保存用户卡片到数据库
    async saveUserCards() {
        try {
            await DB.set({
                store: CONFIG.STORE,
                key: CONFIG.KEYS.D_CLIPBOARD_CARDS,
                value: this.userCards
            });
            
            // 更新卡片总数
            await DB.set({
                store: CONFIG.STORE,
                key: CONFIG.KEYS.D_CARDS_COUNT,
                value: this.userCards.length
            });
            
            // 更新修改时间
            await DB.set({
                store: CONFIG.STORE,
                key: CONFIG.KEYS.D_UPDATED_TIME,
                value: new Date().toISOString()
            });
            
            console.log('用户卡片已保存到数据库');
        } catch (error) {
            console.error('保存用户卡片失败:', error);
            throw error;
        }
    },

    // 保存系统卡片到数据库
    async saveSystemCards() {
        try {
            await DB.set({
                store: 'official',
                key: 'clipboard_system_cards',
                value: this.systemCards
            });
            
            console.log('系统卡片已保存到数据库');
        } catch (error) {
            console.error('保存系统卡片失败:', error);
            throw error;
        }
    },

    // 保存所有卡片（用户和系统）
    async saveAllCards() {
        try {
            // 保存用户卡片
            await this.saveUserCards();
            
            // 保存系统卡片
            await this.saveSystemCards();
            
            console.log('所有卡片已保存到数据库');
        } catch (error) {
            console.error('保存所有卡片失败:', error);
            throw error;
        }
    },

    // 从allCards更新userCards
    updateUserCardsFromAll(allCards) {
        this.userCards = allCards.filter(card => !this.systemCards.includes(card));
    },

    // 获取当前页码
    async getCurrentPage() {
        try {
            const page = await DB.get({
                store: CONFIG.STORE,
                key: CONFIG.KEYS.D_CURRENT_PAGE
            });
            return page || 1;
        } catch (error) {
            console.error('获取当前页码失败:', error);
            return 1;
        }
    },

    // 保存当前页码
    async saveCurrentPage(page) {
        try {
            await DB.set({
                store: CONFIG.STORE,
                key: CONFIG.KEYS.D_CURRENT_PAGE,
                value: page
            });
        } catch (error) {
            console.error('保存当前页码失败:', error);
        }
    },

    // 获取分页大小
    async getPageSize() {
        try {
            const size = await DB.get({
                store: CONFIG.STORE,
                key: CONFIG.KEYS.D_PAGE_SIZE
            });
            return size || CONFIG.PAGINATION.CARDS_PER_PAGE;
        } catch (error) {
            console.error('获取分页大小失败:', error);
            return CONFIG.PAGINATION.CARDS_PER_PAGE;
        }
    },

    // 设置分页大小
    async setPageSize(size) {
        try {
            await DB.set({
                store: CONFIG.STORE,
                key: CONFIG.KEYS.D_PAGE_SIZE,
                value: size
            });
        } catch (error) {
            console.error('设置分页大小失败:', error);
        }
    },

    // 获取创建时间
    async getCreatedTime() {
        try {
            const time = await DB.get({
                store: CONFIG.STORE,
                key: CONFIG.KEYS.D_CREATED_TIME
            });
            return time || new Date().toISOString();
        } catch (error) {
            console.error('获取创建时间失败:', error);
            return new Date().toISOString();
        }
    },

    // 初始化创建时间
    async initCreatedTime() {
        try {
            const existing = await DB.get({
                store: CONFIG.STORE,
                key: CONFIG.KEYS.D_CREATED_TIME
            });
            
            if (!existing) {
                await DB.set({
                    store: CONFIG.STORE,
                    key: CONFIG.KEYS.D_CREATED_TIME,
                    value: new Date().toISOString()
                });
            }
        } catch (error) {
            console.error('初始化创建时间失败:', error);
        }
    }
};
