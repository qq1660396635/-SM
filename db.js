// ===============================================
// ===== 一 IndexedDB 数据库管理器 =====
//   文件所在位置  /db.js
// ===============================================
window.IDB = {
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

    // -----------------------------------------------------
    // 1. 初始化数据库连接
    // -----------------------------------------------------
    async init() {
        if (this.initPromise) return this.initPromise;
        this.initPromise = new Promise((resolve, reject) => {
            console.log('开始初始化数据库...');
            const request = indexedDB.open(this.DB_NAME, this.VERSION);
            request.onerror = () => {
                const error = request.error;
                console.error(' 数据库打开失败:', error);
                reject(error);
            };
            request.onsuccess = () => {
                this.db = request.result;
                console.log(' 数据库初始化完成');
                resolve(this.db);
            };
            request.onupgradeneeded = (e) => {
                console.log('数据库升级中...');
                const db = e.target.result;
                // 创建三个存储区
                if (!db.objectStoreNames.contains(this.STORES.configs)) {
                    db.createObjectStore(this.STORES.configs);
                    console.log('创建configs 存储');
                }
                if (!db.objectStoreNames.contains(this.STORES.userdata)) {
                    db.createObjectStore(this.STORES.userdata);
                    console.log('创建userdata 存储');
                }
                if (!db.objectStoreNames.contains(this.STORES.official)) {
                    db.createObjectStore(this.STORES.official);
                    console.log('创建official 存储');
                }
                console.log(' 数据库升级完成');
            };
        });
        return this.initPromise;
    },

    // -----------------------------------------------------
    // 2. 检查数据库是否可用
    // -----------------------------------------------------
    async isAvailable() {
        try {
            await this.init();
            return true;
        } catch (error) {
            console.error(' 数据库不可用:', error);
            return false;
        }
    },

    // -----------------------------------------------------
    // 3. 向数据库存储数据
    // -----------------------------------------------------
    async put(key, value, store = 'configs') {
        try {
            await this.init();
            console.log(`存储到数据库: ${key} (存储区: ${store})`);
            return new Promise((resolve) => {
                const tx = this.db.transaction([this.STORES[store]], 'readwrite');
                const objectStore = tx.objectStore(this.STORES[store]);
                const request = objectStore.put(value, key);
                request.onsuccess = () => {
                    console.log(` 数据库存储成功: ${key}`);
                    resolve();
                };
                request.onerror = () => {
                    console.error(` 数据库存储失败: ${key}`);
                    resolve();
                };
            });
        } catch (error) {
            console.error(' 数据库存储异常:', error);
        }
    },

    // -----------------------------------------------------
    // 4. 删除数据库中的数据
    // -----------------------------------------------------
    async delete(key, store = 'configs') {
        try {
            await this.init();
            console.log(`️删除数据库数据: ${key} (存储区: ${store})`);
            return new Promise((resolve) => {
                const tx = this.db.transaction([this.STORES[store]], 'readwrite');
                const objectStore = tx.objectStore(this.STORES[store]);
                const request = objectStore.delete(key);
                request.onsuccess = () => {
                    console.log(` 数据库删除成功: ${key}`);
                    resolve(true);
                };
                request.onerror = () => {
                    console.error(` 数据库删除失败: ${key}`);
                    resolve(false);
                };
            });
        } catch (error) {
            console.error(' 数据库删除异常:', error);
            return false;
        }
    },

    // -----------------------------------------------------
    // 5. 从数据库获取数据
    // -----------------------------------------------------
    async get(key, store = 'configs') {
        try {
            await this.init();
            console.log(`查询数据库: ${key} (存储区: ${store})`);
            return new Promise((resolve) => {
                const tx = this.db.transaction([this.STORES[store]], 'readonly');
                const objectStore = tx.objectStore(this.STORES[store]);
                const request = objectStore.get(key);
                request.onsuccess = () => {
                    const result = request.result;
                    if (result) {
                        console.log(` 数据库命中: ${key}`);
                    } else {
                        console.log(` 数据库未命中: ${key}`);
                    }
                    resolve(result);
                };
                request.onerror = () => {
                    console.error(` 数据库查询失败: ${key}`);
                    resolve(null);
                };
            });
        } catch (error) {
            console.error(' 数据库获取异常:', error);
            return null;
        }
    },
};

// ===============================================
// ===== 二 Base64 加密解密工具 =====
// ===============================================
const Base64 = {
    // -----------------------------------------------------
    // 6. Base64 编码
    // -----------------------------------------------------
    encode: function(str) {
        try {
            return btoa(unescape(encodeURIComponent(str)));
        } catch (error) {
            console.error(' Base64 编码失败:', error);
            return null;
        }
    },

    // -----------------------------------------------------
    // 7. Base64 解码
    // -----------------------------------------------------
    decode: function(str) {
        try {
            return decodeURIComponent(escape(atob(str)));
        } catch (error) {
            console.error(' Base64 解码失败:', error);
            return null;
        }
    }
};

// ===============================================
// ===== 三 数据导入导出管理器 =====
// ===============================================
IDB.DataManager = {
    // -----------------------------------------------------
    // 8. 导出数据
    // -----------------------------------------------------
    async exportData(account, password, includeUserData = true, includeConfigs = false) {
        try {
            console.log('开始导出数据...');
            // 验证账号密码
            if (!account || !password) {
                throw new Error('账号和密码不能为空');
            }
            // 获取用户数据
            const exportData = {
                account: Base64.encode(account),
                password: Base64.encode(password),
                exportDate: new Date().toISOString(),
                version: '1.0',
                data: {}
            };
            // 导出用户数据
            if (includeUserData) {
                const userData = await this.getAllStoreData('userdata');
                exportData.data.userdata = userData;
            }
            // 导出配置数据
            if (includeConfigs) {
                const configData = await this.getAllStoreData('configs');
                exportData.data.configs = configData;
            }
            console.log(' 数据导出成功');
            return exportData;
        } catch (error) {
            console.error(' 数据导出失败:', error);
            throw error;
        }
    },

    // -----------------------------------------------------
    // 9. 导入数据
    // -----------------------------------------------------
    async importData(jsonData, account, password, overwrite = false) {
        try {
            console.log('开始导入数据...');
            // 验证账号密码
            if (!account || !password) {
                throw new Error('账号和密码不能为空');
            }
            // 解析JSON 数据
            let importData;
            if (typeof jsonData === 'string') {
                importData = JSON.parse(jsonData);
            } else {
                importData = jsonData;
            }
            // 验证导入数据格式
            if (!importData.account || !importData.password || !importData.data) {
                throw new Error('导入数据格式错误');
            }
            // 验证账号密码
            const decodedAccount = Base64.decode(importData.account);
            const decodedPassword = Base64.decode(importData.password);
            if (decodedAccount !== account || decodedPassword !== password) {
                throw new Error('账号或密码不正确');
            }
            // 导入用户数据
            if (importData.data.userdata) {
                await this.importStoreData('userdata', importData.data.userdata, overwrite);
            }
            // 导入配置数据
            if (importData.data.configs) {
                await this.importStoreData('configs', importData.data.configs, overwrite);
            }
            console.log(' 数据导入成功');
            return true;
        } catch (error) {
            console.error(' 数据导入失败:', error);
            throw error;
        }
    },

    // -----------------------------------------------------
    // 10. 获取存储区所有数据
    // -----------------------------------------------------
    async getAllStoreData(store) {
        try {
            await IDB.init();
            return new Promise((resolve) => {
                const tx = IDB.db.transaction([IDB.STORES[store]], 'readonly');
                const objectStore = tx.objectStore(IDB.STORES[store]);
                const request = objectStore.getAll();
                request.onsuccess = () => {
                    const items = request.result;
                    const data = {};
                    // 使用游标获取键值对
                    const cursorRequest = objectStore.openCursor();
                    cursorRequest.onsuccess = (e) => {
                        const cursor = e.target.result;
                        if (cursor) {
                            // 直接存储键值对，不存储JavaScript 代码
                            data[cursor.key] = cursor.value;
                            cursor.continue();
                        } else {
                            console.log(`${store}存储区数据:`, data);
                            resolve(data);
                        }
                    };
                    cursorRequest.onerror = () => {
                        console.error(` 获取${store}数据失败`);
                        resolve({});
                    };
                };
                request.onerror = () => {
                    console.error(` 获取${store}数据失败`);
                    resolve({});
                };
            });
        } catch (error) {
            console.error(' 获取存储区数据异常:', error);
            return {};
        }
    },

    // -----------------------------------------------------
    // 11. 导入存储区数据
    // -----------------------------------------------------
    async importStoreData(store, data, overwrite = false) {
        try {
            await IDB.init();
            for (const [key, value] of Object.entries(data)) {
                // 检查是否已存在
                if (!overwrite) {
                    const existing = await IDB.get(key, store);
                    if (existing) {
                        console.log(`⚠️跳过已存在的键: ${key}`);
                        continue;
                    }
                }
                // 直接存储JSON 对象，不包装为JavaScript 代码
                await IDB.put(key, value, store);
                console.log(`已导入${key} 到${store} 存储区`);
            }
            console.log(` ${store}数据导入完成`);
        } catch (error) {
            console.error(` ${store}数据导入异常:`, error);
            throw error;
        }
    },

    // -----------------------------------------------------
    // 12. 下载导出文件
    // -----------------------------------------------------
    downloadExportFile(exportData, filename) {
        try {
            const dataStr = JSON.stringify(exportData);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = filename || `export_${Date.now()}.json`;
            link.click();
            console.log(' 导出文件下载成功');
        } catch (error) {
            console.error(' 下载导出文件失败:', error);
            throw error;
        }
    },

    // -----------------------------------------------------
    // 13. 读取导入文件
    // -----------------------------------------------------
    readImportFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const jsonData = JSON.parse(e.target.result);
                    resolve(jsonData);
                } catch (error) {
                    reject(new Error('文件格式错误，不是有效的JSON'));
                }
            };
            reader.onerror = () => {
                reject(new Error('文件读取失败'));
            };
            reader.readAsText(file);
        });
    }
};

// ===============================================
// ===== 四 缓存管理器 =====
// ===============================================
IDB.cacheLocalFile = function(fileName, store = 'configs') {
    // -----------------------------------------------------
    // 14. 缓存本地文件
    // -----------------------------------------------------
    if (!fileName) {
        console.warn('⚠️文件名为空');
        return;
    }
    console.log(`开始缓存文件: ${fileName}`);
    try {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', fileName, false); // 同步
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200 || xhr.status === 0) {
                    // 存储到数据库
                    IDB.put(fileName, xhr.responseText, store).then(() => {
                        console.log(` 文件缓存成功: ${fileName}`);
                    }).catch(error => {
                        console.error(` 文件缓存失败: ${fileName}`, error);
                    });
                } else {
                    console.error(` 文件读取失败: ${fileName} (状态: ${xhr.status})`);
                }
            }
        };
        xhr.onerror = function() {
            console.error(` 文件请求失败: ${fileName}`);
        };
        xhr.send();
    } catch (error) {
        console.error(` 文件缓存异常: ${fileName}`, error);
    }
};

// ===============================================
// ===== 五 离线缓存管理器 =====
// ===============================================
IDB.CacheMgr = {
    // -----------------------------------------------------
    // 15. 获取文件（优先从缓存）
    // -----------------------------------------------------
    async get(file) {
        console.log(`尝试加载文件: ${file}`);
        try {
            // ①优先读库
            const txt = await IDB.get(file, 'configs');
            if (txt) {
                console.log(`⚡数据库命中: ${file}`);
                return txt;
            }
            console.log(`数据库未命中，开始网络请求: ${file}`);
            // ②库没有才fetch
            const resp = await fetch(file);
            if (!resp.ok) {
                const errorMsg = `文件加载失败: ${file} (状态: ${resp.status})`;
                console.error(` ${errorMsg}`);
                throw new Error(errorMsg);
            }
            const text = await resp.text();
            console.log(`文件加载成功，大小: ${text.length} 字符`);
            // ③立即写库
            await IDB.put(file, text, 'configs');
            console.log(`文件已缓存到数据库: ${file}`);
            return text;
        } catch (error) {
            console.error(` 文件加载失败: ${file}`, error);
            throw error;
        }
    }
};

// ===============================================
// ===== 六 自动初始化和错误处理 =====
// ===============================================
// -----------------------------------------------------
// 16. 自动初始化和错误处理
// -----------------------------------------------------
(async function() {
    try {
        console.log('开始自动初始化数据库...');
        await IDB.init();
        console.log(' 数据库公共库加载完成');
        // 检查数据库状态
        const isAvailable = await IDB.isAvailable();
        if (isAvailable) {
            console.log(' 数据库状态正常');
        } else {
            console.warn('⚠️数据库状态异常');
        }
    } catch (error) {
        console.error(' 数据库公共库加载失败:', error);
        console.error(' 错误详情:', error.message);
        console.error(' 错误堆栈:', error.stack);
        // 向页面传递错误信息
        if (typeof window !== 'undefined') {
            window.IDB_ERROR = {
                message: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            };
        }
    }
})();

// ===============================================
// ===== 七 调试工具 =====
// ===============================================
IDB.debug = {
    // -----------------------------------------------------
    // 17. 获取数据库信息
    // -----------------------------------------------------
    async getInfo() {
        try {
            await IDB.init();
            return {
                name: IDB.DB_NAME,
                version: IDB.VERSION,
                stores: Object.keys(IDB.STORES),
                db: IDB.db ? '已连接' : '未连接'
            };
        } catch (error) {
            return { error: error.message };
        }
    },

    // -----------------------------------------------------
    // 18. 清空数据库
    // -----------------------------------------------------
    async clear(store = 'configs') {
        try {
            await IDB.init();
            const tx = IDB.db.transaction([IDB.STORES[store]], 'readwrite');
            const objectStore = tx.objectStore(IDB.STORES[store]);
            await objectStore.clear();
            console.log(`️${store}数据库已清空`);
            return true;
        } catch (error) {
            console.error(` 清空${store}数据库失败:`, error);
            return false;
        }
    },

    // -----------------------------------------------------
    // 19. 列出所有缓存
    // -----------------------------------------------------
    async listAll(store = 'configs') {
        try {
            await IDB.init();
            const tx = IDB.db.transaction([IDB.STORES[store]], 'readonly');
            const objectStore = tx.objectStore(IDB.STORES[store]);
            return new Promise((resolve) => {
                const cursorRequest = objectStore.openCursor();
                const items = [];
                cursorRequest.onsuccess = (e) => {
                    const cursor = e.target.result;
                    if (cursor) {
                        items.push({
                            key: cursor.key,
                            value: cursor.value
                        });
                        cursor.continue();
                    } else {
                        console.log(`${store}数据库内容:`, items);
                        resolve(items);
                    }
                };
                cursorRequest.onerror = () => {
                    console.error(` 获取${store}数据库内容失败`);
                    resolve([]);
                };
            });
        } catch (error) {
            console.error(` 列出${store}缓存失败:`, error);
            return [];
        }
    }
};

// ===============================================
// ===== 导出到全局，便于调试 =====
// ===============================================
if (typeof window !== 'undefined') {
    window.IDB_DEBUG = IDB.debug;
    window.IDB_DataManager = IDB.DataManager;
}
