//==============================================
// 快捷便签数据导出模块
//==============================================

//==============================================
// 配置区域 - 便签存储映射
//==============================================
const NOTES_EXPORT_CONFIG = {
    // 便签数据存储配置
    STORE: 'userdata',
    KEYS: {
        // 便签列表数据
        D_NOTES_LIST: {
            key: 'D_notes_list',
            description: '便签列表数组'
        },
        // 当前页码
        D_CURRENT_PAGE: {
            key: 'D_current_page',
            description: '当前显示页码'
        },
        // 便签总数
        D_NOTES_COUNT: {
            key: 'D_notes_count',
            description: '便签总数量'
        },
        // 每页大小
        D_PAGE_SIZE: {
            key: 'D_page_size',
            description: '每页显示数量'
        },
        // 最后备份时间
        D_LAST_BACKUP: {
            key: 'D_last_backup',
            description: '最后备份时间'
        },
        // 创建时间
        D_CREATED_TIME: {
            key: 'D_created_time',
            description: '便签创建时间'
        },
        // 更新时间
        D_UPDATED_TIME: {
            key: 'D_updated_time',
            description: '最后更新时间'
        }
    }
};

//==============================================
// 1. CSS 样式注入
//==============================================
const notesStyles = `
<style>
/* 便签数据导出按钮样式 */
.notes-data-center-item {
    display: flex;
    align-items: center;
    padding: 12px 15px;
    background-color: #f8f9fa;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s, transform 0.2s;
}
.notes-data-center-item:hover {
    background-color: #e9ecef;
    transform: translateY(-2px);
}
.notes-data-center-item .menu-icon {
    color: #6c757d;
    margin-right: 12px;
}
.notes-data-center-item .menu-name {
    font-size: 14px;
    color: #333;
}
/* 便签专属模态框- z-index 更高*/
.notes-modal {
    display: none;
    position: fixed;
    z-index: 10001; /* 比普通modal的9999高*/
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0,0,0,0.5);
    backdrop-filter: blur(5px);
}
.notes-modal-content {
    background-color: #fefefe;
    margin: 10% auto;
    padding: 0;
    border-radius: 12px;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    animation: modalFadeIn 0.3s ease-out;
}
@keyframes modalFadeIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
}
.notes-modal-header, .notes-modal-footer {
    padding: 20px;
    border-bottom: 1px solid #eee;
}
.notes-modal-footer {
    border-top: 1px solid #eee;
    border-bottom: none;
    text-align: right;
}
.notes-modal-title {
    font-size: 18px;
    font-weight: bold;
    color: #333;
}
.notes-modal-body {
    padding: 20px;
}
.notes-btn-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.notes-btn {
    padding: 12px 15px;
    width: 100%;
    border: none;
    border-radius: 8px;
    background-color: #007bff;
    color: white;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.2s;
}
.notes-btn:hover {
    background-color: #0056b3;
}
.notes-btn.secondary {
    background-color: #6c757d;
}
.notes-btn.secondary:hover {
    background-color: #5a6268;
}
.notes-btn.danger {
    background-color: #dc3545;
}
.notes-btn.danger:hover {
    background-color: #c82333;
}
</style>
`;
document.head.insertAdjacentHTML('beforeend', notesStyles);

//==============================================
// 2. DOM 元素创建与插入
//==============================================
function createNotesDataCenterUI() {
    // 创建“便签数据导出”按钮HTML
    const buttonHTML = `
        <div class="menu-item notes-data-center-item" onclick="showNotesModal()">
            <div class="menu-icon"><i class="fas fa-sticky-note"></i></div>
            <div class="menu-name">便签数据导出</div>
        </div>
    `;
    
    // 创建模态框HTML
    const modalHTML = `
    <div id="notesDataModal" class="notes-modal">
        <div class="notes-modal-content">
            <div class="notes-modal-header">
                <div class="notes-modal-title">便签数据导出</div>
            </div>
            <div class="notes-modal-body">
                <div class="notes-btn-group">
                    <button class="notes-btn" onclick="exportCleanedNotes()">
                        <i class="fas fa-magic"></i> 数据清洗后导出
                    </button>
                    <button class="notes-btn secondary" onclick="showRawExportAuth()">
                        <i class="fas fa-file-export"></i> 原始数据导出
                    </button>
                    <button class="notes-btn danger" onclick="showRawImportAuth()">
                        <i class="fas fa-file-import"></i> 原始数据导入
                    </button>
                </div>
                <!-- 身份验证区域(默认隐藏) -->
                <div id="notesAuthSection" style="display: none; margin-top: 20px; border-top: 1px solid #eee; padding-top: 20px;">
                    <div class="auth-section">
                        <div class="auth-title">身份验证</div>
                        <div class="form-group">
                            <label class="form-label">账号</label>
                            <input type="text" class="form-input" id="notesAccount" placeholder="请输入账号">
                        </div>
                        <div class="form-group">
                            <label class="form-label">密码</label>
                            <input type="password" class="form-input" id="notesPassword" placeholder="请输入密码">
                        </div>
                    </div>
                    <div class="form-group">
                        <button class="notes-btn" id="notesConfirmBtn">确认</button>
                    </div>
                </div>
            </div>
            <div class="notes-modal-footer">
                <button class="modal-btn modal-btn-secondary" onclick="closeNotesModal()">关闭</button>
            </div>
        </div>
    </div>
    `;
    
    // 找到“数据导出中心”卡片的 .menu-grid，并在其中追加新按钮
    const dataExportGrid = document.getElementById('dataExportGrid');
    if (dataExportGrid) {
        dataExportGrid.insertAdjacentHTML('beforeend', buttonHTML);
    } else {
        console.error('未找到 ID 为 "dataExportGrid" 的容器，请检查HTML结构。');
    }
    
    // 插入模态框到body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

//==============================================
// 3. 模态框控制
//==============================================
function showNotesModal() {
    document.getElementById('notesDataModal').style.display = 'block';
    // 重置验证区域
    document.getElementById('notesAuthSection').style.display = 'none';
    document.getElementById('notesConfirmBtn').onclick = null;
}

function closeNotesModal() {
    document.getElementById('notesDataModal').style.display = 'none';
}

//==============================================
// 4. 通用文件下载函数（支持Cordova和浏览器）
//==============================================
function downloadFile(content, fileName, successMessage, mimeType = 'application/json') {
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
                                    message: successMessage || `文件已导出: ${fileName}` 
                                }, '*');
                                // Cordova Toast提示
                                if (window.plugins && window.plugins.toast) {
                                    window.plugins.toast.showLongBottom(`文件已保存到 存储/Download/${fileName}`);
                                } else {
                                    alert(`导出成功！\n文件名:${fileName}\n位置:手机存储/Download/`);
                                }
                            };
                            writer.onerror = function () {
                                parent.postMessage({ 
                                    type: 'showToast', 
                                    message: '导出失败' 
                                }, '*');
                            };
                            // 确保content是字符串或Blob
                            const dataToWrite = (typeof content === 'string') ? content : new Blob([content], { type: mimeType });
                            writer.write(dataToWrite);
                        });
                    });
                });
                return;
            }
        }
    }

    // 浏览器下载（兜底）
    try {
        const blob = new Blob([content], { type: mimeType });
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
            message: successMessage || `文件已下载:${fileName}` 
        }, '*');
    } catch (e) {
        parent.postMessage({ 
            type: 'showToast', 
            message: '浏览器下载失败' 
        }, '*');
    }
}

//==============================================
// 5. 导出/导入逻辑
//==============================================

// 5.1 数据清洗后导出
async function exportCleanedNotes() {
    try {
        const IDB = getIDB();
        if (!IDB) throw new Error('IDB 数据库未加载');
        
        // 使用全局导出API获取所有userdata数据
        const allUserData = await IDB.exportData({
            account: 'temp',
            password: 'temp',
            includeUserData: true,
            includeConfigs: false
        });
        
        // 从全局数据中提取便签列表
        const notesListKey = NOTES_EXPORT_CONFIG.KEYS.D_NOTES_LIST.key;
        const notes = allUserData.data.userdata[notesListKey] || [];
        
        // 检查是否有数据
        if (!notes || notes.length === 0) {
            parent.postMessage({ 
                type: 'showToast', 
                message: '没有便签数据可导出' 
            }, '*');
            return;
        }
        
        // 按照新格式处理数据
        const formattedNotes = notes.map((note, index) => {
            const timeStr = new Date(note.time).toLocaleString('zh-CN');
            const fullText = note.text || '';
            const lines = fullText.split('\n');
            
            const title = lines[0].trim(); // 第一行作为标题
            const content = lines.slice(1).join('\n').trim(); // 剩余部分作为内容
            
            // 构建单个便签的字符串
            let noteString = `${index + 1}. ${title} ${timeStr}`;
            if (content) { // 只有在内容存在时才添加内容行
                noteString += `\n${content}`;
            }
            return noteString;
        });
        
        const finalContent = formattedNotes.join('\n\n');
        const fileName = `便签清洗数据_${Date.now()}.txt`;
        
        // 使用通用下载函数，并指定文本类型
        downloadFile(finalContent, fileName, `清洗数据已导出: ${fileName}`, 'text/plain;charset=utf-8');
        
        closeNotesModal();
    } catch (error) {
        console.error('清洗导出失败:', error);
        parent.postMessage({ 
            type: 'showToast', 
            message: `导出失败: ${error.message}` 
        }, '*');
    }
}

// 5.2 显示原始导出的身份验证
function showRawExportAuth() {
    const authSection = document.getElementById('notesAuthSection');
    authSection.style.display = 'block';
    const confirmBtn = document.getElementById('notesConfirmBtn');
    confirmBtn.textContent = '导出';
    confirmBtn.className = 'notes-btn';
    confirmBtn.onclick = executeRawNotesExport;
}

// 5.3 执行原始数据导出
async function executeRawNotesExport() {
    const account = document.getElementById('notesAccount').value.trim();
    const password = document.getElementById('notesPassword').value.trim();
    
    if (!account || !password) {
        parent.postMessage({ 
            type: 'showToast', 
            message: '请输入账号和密码' 
        }, '*');
        return;
    }
    
    try {
        const IDB = getIDB();
        if (!IDB) throw new Error('IDB 数据库未加载');
        
        // 使用全局导出API获取所有userdata数据
        const allUserData = await IDB.exportData({
            account: account,
            password: password,
            includeUserData: true,
            includeConfigs: false
        });
        
        // 从全局数据中筛选出便签相关的键
        const notesKeys = Object.values(NOTES_EXPORT_CONFIG.KEYS).map(item => item.key);
        const notesData = {};
        let hasData = false;
        
        for (const key of notesKeys) {
            if (allUserData.data.userdata && allUserData.data.userdata[key] !== undefined) {
                notesData[key] = allUserData.data.userdata[key];
                hasData = true;
            }
        }
        
        // 检查是否有数据
        if (!hasData) {
            parent.postMessage({ 
                type: 'showToast', 
                message: '没有便签数据可导出' 
            }, '*');
            return;
        }
        
        // 构造符合便签格式的导出数据
        const exportData = {
            account: allUserData.account,
            password: allUserData.password,
            exportDate: allUserData.exportDate,
            version: allUserData.version,
            data: {
                userdata: notesData
            }
        };
        
        const fileName = `便签原始数据_${Date.now()}.json`;
        const content = JSON.stringify(exportData, null, 2);
        
        // 使用通用下载函数
        downloadFile(content, fileName, `原始数据已导出: ${fileName}`);
        
        closeNotesModal();
    } catch (error) {
        console.error('原始导出失败:', error);
        parent.postMessage({ 
            type: 'showToast', 
            message: `导出失败: ${error.message}` 
        }, '*');
    }
}

// 5.4 显示原始导入的身份验证
function showRawImportAuth() {
    const authSection = document.getElementById('notesAuthSection');
    authSection.style.display = 'block';
    const confirmBtn = document.getElementById('notesConfirmBtn');
    confirmBtn.textContent = '导入';
    confirmBtn.className = 'notes-btn danger';
    confirmBtn.onclick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => executeRawNotesImport(e.target.files[0]);
        input.click();
    };
}

// 5.5 执行原始数据导入
async function executeRawNotesImport(file) {
    if (!file) return;
    
    const account = document.getElementById('notesAccount').value.trim();
    const password = document.getElementById('notesPassword').value.trim();
    
    if (!account || !password) {
        parent.postMessage({ 
            type: 'showToast', 
            message: '请输入账号和密码' 
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
        
        const IDB = getIDB();
        if (!IDB) throw new Error('IDB 数据库未加载');
        
        // 使用全局导入API
        await IDB.importData({
            jsonData: importData,
            account: account,
            password: password,
            overwrite: true
        });
        
        parent.postMessage({ 
            type: 'showToast', 
            message: '便签数据导入成功！' 
        }, '*');
        
        closeNotesModal();
    } catch (error) {
        console.error('原始导入失败:', error);
        parent.postMessage({ 
            type: 'showToast', 
            message: `导入失败: ${error.message}` 
        }, '*');
    }
}

//==============================================
// 6. 初始化
//==============================================
window.addEventListener('DOMContentLoaded', createNotesDataCenterUI);
