// ===============================================
// 全局数据导出/导入模块
// ===============================================

// ===============================================
// 配置区域 - 存储区域映射
// ===============================================
const STORE_CONFIG = {
    // 存储区域映射配置
    // key: 界面下拉框的值
    // value: 对应的导出配置
    all: {
        includeUserData: true,
        includeConfigs: true,
        description: '全部数据（用户数据 + 配置数据）'
    },
    userdata: {
        includeUserData: true,
        includeConfigs: false,
        description: '仅用户数据'
    },
    configs: {
        includeUserData: false,
        includeConfigs: true,
        description: '仅配置数据'
    },
    official: {
        includeUserData: true,
        includeConfigs: true,
        description: '官方数据（实际导出用户数据+配置数据）'
    }
};

// ===============================================
// 1. 获取IDB对象的辅助函数
// ===============================================
function getIDB() {
    // 修改：返回window.DB而非window.IDB
    if (typeof window.DB !== 'undefined') {
        return window.DB;
    }
    if (typeof window.parent !== 'undefined' && typeof window.parent.DB !== 'undefined') {
        return window.parent.DB;
    }
    if (typeof parent !== 'undefined' && typeof parent.DB !== 'undefined') {
        return parent.DB;
    }
    return null;
}

// ===============================================
// 2. 模态框控制(导出/导入功能需要调用)
// ===============================================
function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

// ===============================================
// 3. 文件导出功能 - 支持对象参数
// ===============================================
async function executeFileExport() {
    const account = document.getElementById('exportAccount').value.trim();
    const password = document.getElementById('exportPassword').value.trim();
    const store = document.getElementById('fileStore').value;

    if (!account || !password) {
        parent.postMessage({ 
            type: 'showToast', 
            message: '请输入账号和密码' 
        }, '*');
        return;
    }

    try {
        const IDB = getIDB();
        if (!IDB) {
            throw new Error('IDB数据库未加载');
        }

        // 从配置中获取导出参数
        const exportConfig = STORE_CONFIG[store] || STORE_CONFIG.all;
        console.log(`📤 导出配置: ${exportConfig.description}`);

        // 修改：使用新的对象参数格式
        const exportData = await IDB.exportData({
            account: account,
            password: password,
            includeUserData: exportConfig.includeUserData,
            includeConfigs: exportConfig.includeConfigs
        });

        const fileName = `数据备份_${Date.now()}.json`;
        const content = JSON.stringify(exportData, null, 2);

        // 检查localStorage中的cordova状态
        const cordovaStatus = localStorage.getItem('cordovaReady');
        if (cordovaStatus === 'true') {
            // Cordova环境导出
            let cordovaObj = window.cordova || window.parent.cordova;
            if (cordovaObj && cordovaObj.file && cordovaObj.file.externalRootDirectory) {
                const resolveLocalFileSystemURL = window.resolveLocalFileSystemURL || 
                    window.parent.resolveLocalFileSystemURL || 
                    (cordovaObj && cordovaObj.file && cordovaObj.file.resolveLocalFileSystemURL);
                if (resolveLocalFileSystemURL) {
                    const downloadPath = cordovaObj.file.externalRootDirectory + "Download/";
                    resolveLocalFileSystemURL(downloadPath, function (dirEntry) {
                        dirEntry.getFile(fileName, { 
                            create: true, 
                            exclusive: false 
                        }, function (fileEntry) {
                            fileEntry.createWriter(function (writer) {
                                writer.onwriteend = function () {
                                    parent.postMessage({ 
                                        type: 'showToast', 
                                        message: `文件已导出: ${fileName}` 
                                    }, '*');
                                    alert(`导出成功！\n文件名:${fileName}\n位置:手机存储/Download/`);
                                };
                                writer.onerror = function () {
                                    parent.postMessage({ 
                                        type: 'showToast', 
                                        message: '导出失败' 
                                    }, '*');
                                };
                                writer.write(content);
                            });
                        });
                    });
                    return;
                }
            }
        }

        // 浏览器下载
        try {
            const blob = new Blob([content], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            parent.postMessage({ 
                type: 'showToast', 
                message: `文件已下载:${fileName}` 
            }, '*');
        } catch (e) {
            parent.postMessage({ 
                type: 'showToast', 
                message: '浏览器下载失败' 
            }, '*');
        }

        // 清空账号密码
        document.getElementById('exportAccount').value = '';
        document.getElementById('exportPassword').value = '';
    } catch (error) {
        console.error('导出失败:', error);
        parent.postMessage({ 
            type: 'showToast', 
            message: `导出失败:${error.message}` 
        }, '*');
    }
}

// ===============================================
// 4. 文件导入功能 - 支持对象参数
// ===============================================
async function executeFileImport() {
    const account = document.getElementById('importAccount').value.trim();
    const password = document.getElementById('importPassword').value.trim();
    const fileInput = document.getElementById('importFile');
    const overwrite = document.getElementById('overwriteFile').checked;
    const file = fileInput.files[0];

    if (!account || !password) {
        parent.postMessage({ 
            type: 'showToast', 
            message: '请输入账号和密码' 
        }, '*');
        return;
    }
    if (!file) {
        parent.postMessage({ 
            type: 'showToast', 
            message: '请选择文件' 
        }, '*');
        return;
    }

    try {
        const importData = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    resolve(data);
                } catch (error) {
                    reject(new Error('文件格式错误'));
                }
            };
            reader.onerror = () => reject(new Error('文件读取失败'));
            reader.readAsText(file);
        });

        // 修改：使用新的对象参数格式
        const IDB = getIDB();
        if (!IDB) {
            throw new Error('IDB数据库未加载');
        }
        await IDB.importData({
            jsonData: importData,
            account: account,
            password: password,
            overwrite: overwrite
        });

        parent.postMessage({ 
            type: 'showToast', 
            message: '导入成功' 
        }, '*');
        closeModal('fileImportModal');
        fileInput.value = '';

        // 清空账号密码
        document.getElementById('importAccount').value = '';
        document.getElementById('importPassword').value = '';
    } catch (error) {
        console.error('导入失败:', error);
        parent.postMessage({ 
            type: 'showToast', 
            message: `导入失败:${error.message}` 
        }, '*');
    }
}
