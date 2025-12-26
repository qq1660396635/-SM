// ===============================================
// 剪贴板应用配置文件
// 所有数据存储在用户区域，变量名以D_开头
// ===============================================

// 🎯 核心配置：存储区域和变量名（提取到最上方）
const CONFIG = {
    // 存储区域配置 - 全部存储在用户区域
    STORE: 'userdata',  // 统一存储在用户数据区
    
    // 变量名配置 - 全部以D_开头
    KEYS: {
        D_CLIPBOARD_CARDS: 'D_clipboard_cards',        // 剪贴板卡片列表
        D_CURRENT_PAGE: 'D_current_page',              // 当前页码
        D_CARDS_COUNT: 'D_cards_count',                // 卡片总数
        D_PAGE_SIZE: 'D_page_size',                    // 分页大小
        D_LAST_BACKUP: 'D_last_backup',                // 最后备份时间
        D_CREATED_TIME: 'D_created_time',              // 创建时间
        D_UPDATED_TIME: 'D_updated_time'               // 更新时间
    },
    
    // 分页配置
    PAGINATION: {
        CARDS_PER_PAGE: 12,  // 每页显示数量
        MAX_PAGE_BUTTONS: 5  // 最大页码按钮数
    }
};

// 剪贴板默认配置
const defaultCards = [
    {
        name: "打包",
        content: 'bash "/storage/emulated/0/Download/OnePlus Share/03 - 个人测试/常用工具转安卓/常用脚本/C_11月部分脚本/2. 安卓相关/3.1 H5一键打包APP脚本［保存运行］稳定版.bash"',
        timestamp: new Date().toISOString()
    },
    {
        name: "网页渲染",
        content: "提示词 + 案例 + 书籍", 
        timestamp: new Date().toISOString()
    },
    {
        name: "性能优化建议",
        content: `优化建议（针对「离线路由 + 大量数据 + 每次都加载」的场景）：
1. 只挂必要数据：首屏只挂前 50 条，剩余按需加载（滚动/点击更多）。
2. 缓存解析结果：用 localStorage 缓存洗牌后的结果，避免每次都重新洗牌。
3. 延迟渲染：首屏只渲染 20 条，剩余用 setTimeout 分批渲染。
4. 避免深拷贝：不要每次都 [...siteB, ...siteC, ...siteD]，提前合并好。
5. 可选：IndexedDB：如果数据更大（10 万条），用 IndexedDB 存储，避免内存膨胀。`,
        timestamp: new Date().toISOString()
    },
    {
        name: "读源码",
        content: `实现，读源码，读函数
维护，改bug，性能优化`,
        timestamp: new Date().toISOString()
    },
    {
        name: "lin文章",
        content: `听到,进程-2-1`,
        timestamp: new Date().toISOString()
    }
];
