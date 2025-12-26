// ===============================================
// 便签应用配置文件
// 所有数据存储在用户区域，变量名以D_开头
// ===============================================

// 🎯 核心配置：存储区域和变量名（提取到最上方）
const CONFIG = {
    // 存储区域配置 - 全部存储在用户区域
    STORE: 'userdata',  // 统一存储在用户数据区
    
    // 变量名配置 - 全部以D_开头
    KEYS: {
        D_NOTES_LIST: 'D_notes_list',        // 便签列表
        D_CURRENT_PAGE: 'D_current_page',    // 当前页码
        D_NOTES_COUNT: 'D_notes_count',      // 便签总数
        D_PAGE_SIZE: 'D_page_size',          // 分页大小
        D_LAST_BACKUP: 'D_last_backup',      // 最后备份时间
        D_CREATED_TIME: 'D_created_time',    // 创建时间
        D_UPDATED_TIME: 'D_updated_time'     // 更新时间
    },
    
    // 分页配置
    PAGINATION: {
        NOTES_PER_PAGE: 12,  // 每页显示数量
        MAX_PAGE_BUTTONS: 5  // 最大页码按钮数
    }
};

// ===============================================
// 数据库操作封装
// ===============================================
const NotesDB = {
    // 获取便签列表
    async getNotes() {
        try {
            const notes = await DB.get({
                store: CONFIG.STORE,
                key: CONFIG.KEYS.D_NOTES_LIST
            });
            return notes || [];
        } catch (error) {
            console.error('获取便签列表失败:', error);
            return [];
        }
    },

    // 保存便签列表
    async saveNotes(notes) {
        try {
            await DB.set({
                store: CONFIG.STORE,
                key: CONFIG.KEYS.D_NOTES_LIST,
                value: notes
            });
            
            // 更新便签总数
            await DB.set({
                store: CONFIG.STORE,
                key: CONFIG.KEYS.D_NOTES_COUNT,
                value: notes.length
            });
            
            // 更新修改时间
            await DB.set({
                store: CONFIG.STORE,
                key: CONFIG.KEYS.D_UPDATED_TIME,
                value: new Date().toISOString()
            });
        } catch (error) {
            console.error('保存便签列表失败:', error);
        }
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
            return size || CONFIG.PAGINATION.NOTES_PER_PAGE;
        } catch (error) {
            console.error('获取分页大小失败:', error);
            return CONFIG.PAGINATION.NOTES_PER_PAGE;
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

// ===============================================
// 业务逻辑
// ===============================================
let currentPage = 1;
let notes = [];

// 初始化
async function init() {
    // 初始化创建时间
    await NotesDB.initCreatedTime();
    
    await loadNotes();
    await loadCurrentPage();
    renderNotes();
}

// 从数据库加载笔记
async function loadNotes() {
    notes = await NotesDB.getNotes();
}

// 加载当前页码
async function loadCurrentPage() {
    currentPage = await NotesDB.getCurrentPage();
}

// 渲染笔记列表
async function renderNotes() {
    const notesList = document.getElementById('notesList');
    const pagination = document.getElementById('pagination');
    const emptyState = document.getElementById('emptyState');
    
    if (notes.length === 0) {
        notesList.innerHTML = '';
        pagination.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    // 获取分页大小
    const notesPerPage = await NotesDB.getPageSize();
    
    // 计算分页
    const totalPages = Math.ceil(notes.length / notesPerPage);
    const startIndex = (currentPage - 1) * notesPerPage;
    const endIndex = startIndex + notesPerPage;
    const currentNotes = notes.slice(startIndex, endIndex);
    
    // 渲染笔记
    notesList.innerHTML = currentNotes.map((note, index) => `
        <div class="note-item" onclick="editNote(${startIndex + index})">
            <div class="note-text">${escapeHtml(note.text)}</div>
            <div class="note-time">${formatTime(note.time)}</div>
            <span class="delete-btn" onclick="event.stopPropagation(); deleteNote(${startIndex + index})">×</span>
        </div>
    `).join('');
    
    // 渲染分页
    if (totalPages > 1) {
        let paginationHTML = `
            <button class="page-btn" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>上一页</button>
        `;
        
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
                paginationHTML += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
            } else if (i === currentPage - 3 || i === currentPage + 3) {
                paginationHTML += `<span class="page-info">...</span>`;
            }
        }
        
        paginationHTML += `
            <button class="page-btn" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>下一页</button>
        `;
        
        pagination.innerHTML = paginationHTML;
    } else {
        pagination.innerHTML = '';
    }
}

// 切换页面
async function changePage(page) {
    const notesPerPage = await NotesDB.getPageSize();
    const totalPages = Math.ceil(notes.length / notesPerPage);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    await NotesDB.saveCurrentPage(currentPage);
    renderNotes();
    window.scrollTo(0, 0);
}

// 显示添加模态框
function showAddModal() {
    document.getElementById('addModal').classList.add('show');
    document.getElementById('noteInput').value = '';
    document.getElementById('noteInput').focus();
}

// 隐藏添加模态框
function hideAddModal() {
    document.getElementById('addModal').classList.remove('show');
}

// 保存笔记
async function saveNote() {
    const input = document.getElementById('noteInput');
    const text = input.value.trim();
    
    if (!text) {
        input.focus();
        return;
    }
    
    const newNote = {
        text: text,
        time: new Date().getTime()
    };
    
    notes.unshift(newNote);
    await NotesDB.saveNotes(notes);
    
    currentPage = 1;
    await NotesDB.saveCurrentPage(currentPage);
    
    renderNotes();
    hideAddModal();
}

// 编辑笔记
function editNote(index) {
    const note = notes[index];
    document.getElementById('noteInput').value = note.text;
    document.getElementById('addModal').classList.add('show');
    document.getElementById('noteInput').focus();
    
    // 临时修改保存按钮的行为
    const saveBtn = document.querySelector('.modal-btn-save');
    saveBtn.onclick = async function() {
        const text = document.getElementById('noteInput').value.trim();
        if (text) {
            notes[index].text = text;
            notes[index].time = new Date().getTime();
            await NotesDB.saveNotes(notes);
            renderNotes();
            hideAddModal();
            saveBtn.onclick = saveNote; // 恢复原始行为
        }
    };
}

// 删除笔记
async function deleteNote(index) {
    if (confirm('确定要删除这条便签吗？')) {
        notes.splice(index, 1);
        await NotesDB.saveNotes(notes);
        
        // 调整当前页码
        const notesPerPage = await NotesDB.getPageSize();
        const totalPages = Math.ceil(notes.length / notesPerPage);
        if (currentPage > totalPages && totalPages > 0) {
            currentPage = totalPages;
            await NotesDB.saveCurrentPage(currentPage);
        }
        
        renderNotes();
    }
}

// 格式化时间
function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        if (hours === 0) {
            const minutes = Math.floor(diff / (1000 * 60));
            return minutes === 0 ? '刚刚' : `${minutes}分钟前`;
        }
        return `${hours}小时前`;
    } else if (days === 1) {
        return '昨天';
    } else if (days < 7) {
        return `${days}天前`;
    } else {
        return `${date.getMonth() + 1}月${date.getDate()}日`;
    }
}

// HTML转义
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// 键盘事件
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        hideAddModal();
    } else if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        showAddModal();
    }
});

// 点击模态框外部关闭
document.getElementById('addModal').addEventListener('click', function(e) {
    if (e.target === this) {
        hideAddModal();
    }
});

// 等待数据库中心准备好
function waitForDBAndInit() {
    if (typeof DB !== 'undefined') {
        console.log('✅ DB 已准备好，开始初始化应用');
        init();
    } else {
        console.log('⏳ 等待 DB 加载中...');
        setTimeout(waitForDBAndInit, 100); // 每 100ms 检查一次
    }
}

// 启动轮询
document.addEventListener('DOMContentLoaded', waitForDBAndInit);
