// ===============================================
// IndexedDB 扩展功能层
// 提供高级功能和业务逻辑
// ===============================================
window.IDB_EXT = {
    // Base64 加密解密工具
    Base64: {
        // 1. Base64编码函数
        encode: function(str) {
            try {
                return btoa(unescape(encodeURIComponent(str)));
            } catch (error) {
                console.error('❌ Base64 编码失败:', error);
                return null;
            }
        },

        // 2. Base64解码函数
        decode: function(str) {
            try {
                return decodeURIComponent(escape(atob(str)));
            } catch (error) {
                console.error('❌ Base64 解码失败:', error);
                return null;
            }
        }
    },

    // 数据导入导出管理器
    DataManager: {
        // 3. 导出数据函数 - 支持对象参数
        async exportData(params) {
            try {
                // 兼容旧参数格式
                let account, password, includeUserData, includeConfigs;
                
                if (typeof params === 'object') {
                    account = params.account;
                    password = params.password;
                    includeUserData = params.includeUserData !== false; // 默认true
                    includeConfigs = params.includeConfigs === true; // 默认false
                } else {
                    // 旧格式: exportData(account, password, includeUserData, includeConfigs)
                    account = arguments[0];
                    password = arguments[1];
                    includeUserData = arguments[2] !== false;
                    includeConfigs = arguments[3] === true;
                }
                
                console.log('📤 开始导出数据...');
                if (!account || !password) {
                    throw new Error('账号和密码不能为空');
                }
                
                const exportData = {
                    account: IDB_EXT.Base64.encode(account),
                    password: IDB_EXT.Base64.encode(password),
                    exportDate: new Date().toISOString(),
                    version: '1.0',
                    data: {}
                };

                if (includeUserData) {
                    const userData = await this.getAllStoreData('userdata');
                    exportData.data.userdata = userData;
                }
                if (includeConfigs) {
                    const configData = await this.getAllStoreData('configs');
                    exportData.data.configs = configData;
                }
                
                console.log('✅ 数据导出成功');
                return exportData;
            } catch (error) {
                console.error('❌ 数据导出失败:', error);
                throw error;
            }
        },

        // 4. 导入数据函数 - 支持对象参数
        async importData(params) {
            try {
                // 兼容旧参数格式
                let jsonData, account, password, overwrite;
                
                if (typeof params === 'object') {
                    jsonData = params.jsonData;
                    account = params.account;
                    password = params.password;
                    overwrite = params.overwrite === true; // 默认false
                } else {
                    // 旧格式: importData(jsonData, account, password, overwrite)
                    jsonData = arguments[0];
                    account = arguments[1];
                    password = arguments[2];
                    overwrite = arguments[3] === true;
                }
                
                console.log('📥 开始导入数据...');
                if (!account || !password) {
                    throw new Error('账号和密码不能为空');
                }

                let importData = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
                
                if (!importData.account || !importData.password || !importData.data) {
                    throw new Error('导入数据格式错误');
                }

                const decodedAccount = IDB_EXT.Base64.decode(importData.account);
                const decodedPassword = IDB_EXT.Base64.decode(importData.password);
                
                if (decodedAccount !== account || decodedPassword !== password) {
                    throw new Error('账号或密码不正确');
                }

                if (importData.data.userdata) {
                    await this.importStoreData('userdata', importData.data.userdata, overwrite);
                }
                if (importData.data.configs) {
                    await this.importStoreData('configs', importData.data.configs, overwrite);
                }
                
                console.log('✅ 数据导入成功');
                return true;
            } catch (error) {
                console.error('❌ 数据导入失败:', error);
                throw error;
            }
        },

        // 5. 获取存储区所有数据
        async getAllStoreData(store) {
            try {
                return new Promise((resolve) => {
                    IDB_CORE.operate(store, 'readonly', store => {
                        const cursorRequest = store.openCursor();
                        const data = {};
                        cursorRequest.onsuccess = (e) => {
                            const cursor = e.target.result;
                            if (cursor) {
                                data[cursor.key] = cursor.value;
                                cursor.continue();
                            } else {
                                console.log(`📋 ${store}存储区数据:`, data);
                                resolve(data);
                            }
                        };
                        cursorRequest.onerror = () => resolve({});
                    });
                });
            } catch (error) {
                console.error('❌ 获取存储区数据异常:', error);
                return {};
            }
        },

        // 6. 导入存储区数据
        async importStoreData(store, data, overwrite = false) {
            try {
                for (const [key, value] of Object.entries(data)) {
                    if (!overwrite) {
                        const existing = await IDB_CORE.get(key, store);
                        if (existing) {
                            console.log(`⚠️ 跳过已存在的键: ${key}`);
                            continue;
                        }
                    }
                    await IDB_CORE.put(key, value, store);
                    console.log(`💾 已导入${key} 到${store} 存储区`);
                }
                console.log(`✅ ${store}数据导入完成`);
            } catch (error) {
                console.error(`❌ ${store}数据导入异常:`, error);
                throw error;
            }
        },

        // 7. 下载导出文件
        downloadExportFile(exportData, filename) {
            try {
                const dataStr = JSON.stringify(exportData);
                const dataBlob = new Blob([dataStr], { type: 'application/json' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(dataBlob);
                link.download = filename || `export_${Date.now()}.json`;
                link.click();
                console.log('✅ 导出文件下载成功');
            } catch (error) {
                console.error('❌ 下载导出文件失败:', error);
                throw error;
            }
        },

        // 8. 读取导入文件
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
                reader.onerror = () => reject(new Error('文件读取失败'));
                reader.readAsText(file);
            });
        }
    },

    // 缓存管理器
    // 9. 缓存本地文件
    cacheLocalFile: function(fileName, store = 'configs') {
        if (!fileName) {
            console.warn('⚠️ 文件名为空');
            return;
        }
        console.log(`🔄 开始缓存文件: ${fileName}`);
        try {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', fileName, false);
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200 || xhr.status === 0) {
                        IDB_CORE.put(fileName, xhr.responseText, store).then(() => {
                            console.log(`✅ 文件缓存成功: ${fileName}`);
                        }).catch(error => {
                            console.error(`❌ 文件缓存失败: ${fileName}`, error);
                        });
                    } else {
                        console.error(`❌ 文件读取失败: ${fileName} (状态: ${xhr.status})`);
                    }
                }
            };
            xhr.onerror = function() {
                console.error(`❌ 文件请求失败: ${fileName}`);
            };
            xhr.send();
        } catch (error) {
            console.error(`❌ 文件缓存异常: ${fileName}`, error);
        }
    },

    // 离线缓存管理器
    CacheMgr: {
        // 10. 获取缓存文件
        async get(file) {
            console.log(`🔄 尝试加载文件: ${file}`);
            try {
                const txt = await IDB_CORE.get(file, 'configs');
                if (txt) {
                    console.log(`⚡ 数据库命中: ${file}`);
                    return txt;
                }
                
                console.log(`🌐 数据库未命中，开始网络请求: ${file}`);
                const resp = await fetch(file);
                if (!resp.ok) {
                    throw new Error(`文件加载失败: ${file} (状态: ${resp.status})`);
                }
                
                const text = await resp.text();
                console.log(`📥 文件加载成功，大小: ${text.length} 字符`);
                await IDB_CORE.put(file, text, 'configs');
                console.log(`💾 文件已缓存到数据库: ${file}`);
                return text;
            } catch (error) {
                console.error(`❌ 文件加载失败: ${file}`, error);
                throw error;
            }
        }
    },

    // 调试工具
    debug: {
        // 11. 获取数据库信息
        async getInfo() {
            try {
                await IDB_CORE.init();
                return {
                    name: IDB_CORE.DB_NAME,
                    version: IDB_CORE.VERSION,
                    stores: Object.keys(IDB_CORE.STORES),
                    db: IDB_CORE.db ? '已连接' : '未连接'
                };
            } catch (error) {
                return { error: error.message };
            }
        },

        // 12. 清空数据库
        async clear(store = 'configs') {
            try {
                await IDB_CORE.init();
                const tx = IDB_CORE.db.transaction([IDB_CORE.STORES[store]], 'readwrite');
                const objectStore = tx.objectStore(IDB_CORE.STORES[store]);
                await objectStore.clear();
                console.log(`🗑️ ${store}数据库已清空`);
                return true;
            } catch (error) {
                console.error(`❌ 清空${store}数据库失败:`, error);
                return false;
            }
        },

        // 13. 列出所有数据
        async listAll(store = 'configs') {
            try {
                await IDB_CORE.init();
                return new Promise((resolve) => {
                    const tx = IDB_CORE.db.transaction([IDB_CORE.STORES[store]], 'readonly');
                    const objectStore = tx.objectStore(IDB_CORE.STORES[store]);
                    const cursorRequest = objectStore.openCursor();
                    const items = [];
                    cursorRequest.onsuccess = (e) => {
                        const cursor = e.target.result;
                        if (cursor) {
                            items.push({ key: cursor.key, value: cursor.value });
                            cursor.continue();
                        } else {
                            console.log(`📋 ${store}数据库内容:`, items);
                            resolve(items);
                        }
                    };
                    cursorRequest.onerror = () => {
                        console.error(`❌ 获取${store}数据库内容失败`);
                        resolve([]);
                    };
                });
            } catch (error) {
                console.error(`❌ 列出${store}缓存失败:`, error);
                return [];
            }
        }
    }
};

// 导出到全局，便于调试
if (typeof window !== 'undefined') {
    window.IDB_DEBUG = IDB_EXT.debug;
    window.IDB_DataManager = IDB_EXT.DataManager;
}
