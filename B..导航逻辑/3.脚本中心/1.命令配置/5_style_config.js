// 样式配置文件
const styleConfig = {
    css: `
        :root {
            --bg-color: #1a1a1a;
            --text-color: #e0e0e0;
            --border-color: #333;
            --highlight-color: #007bff;
            --code-bg: #2d2d2d;
            --card-bg: #242424;
        }

        [data-theme="light"] {
            --bg-color: #f5f5f5;
            --text-color: #333;
            --border-color: #ddd;
            --highlight-color: #0066cc;
            --code-bg: #f8f8f8;
            --card-bg: #fff;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: var(--bg-color);
            color: var(--text-color);
            transition: all 0.3s ease;
            line-height: 1.6;
            height: 100vh;
            overflow: hidden;
        }

        .container {
            max-width: 100%;
            height: 100vh;
            display: flex;
            flex-direction: column;
            padding: 0.625rem;
        }

        .header {
            text-align: center;
            padding: 0.625rem;
            background: var(--card-bg);
            border-radius: 0.5rem;
            margin-bottom: 0.625rem;
            box-shadow: 0 0.0625rem 0.3125rem rgba(0,0,0,0.1);
        }

        .header h1 {
            font-size: 1.5em;
            margin-bottom: 0.3125rem;
            color: var(--highlight-color);
        }

        .progress-bar {
            width: 100%;
            height: 0.25rem;
            background: var(--border-color);
            border-radius: 0.125rem;
            overflow: hidden;
            margin-top: 0.5rem;
        }

        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--highlight-color), #00ff88);
            transition: width 0.3s ease;
            border-radius: 0.125rem;
        }

        .main-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .controls {
            display: flex;
            gap: 0.625rem;
            margin-bottom: 0.625rem;
            flex-wrap: wrap;
        }

        .search-box {
            flex: 1;
            min-width: 12.5rem;
        }

        .search-input {
            width: 100%;
            padding: 0.5rem 0.75rem;
            border: 0.0625rem solid var(--border-color);
            border-radius: 0.25rem;
            background: var(--card-bg);
            color: var(--text-color);
            font-size: 0.875rem;
        }

        .file-list-container {
            flex: 1;
            background: var(--card-bg);
            border-radius: 0.5rem;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        .file-list-header {
            padding: 0.625rem;
            background: var(--bg-color);
            border-bottom: 0.0625rem solid var(--border-color);
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .file-list {
            flex: 1;
            overflow-y: auto;
            padding: 0.3125rem;
        }

        .file-item {
            padding: 0.75rem;
            margin: 0.1875rem 0;
            background: var(--bg-color);
            border-radius: 0.25rem;
            cursor: pointer;
            transition: all 0.2s ease;
            border-left: 0.1875rem solid transparent;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .file-item:hover {
            background: var(--highlight-color);
            color: white;
            transform: translateX(0.1875rem);
        }

        .file-item.active {
            background: var(--highlight-color);
            color: white;
            border-left-color: #00ff88;
        }

        .file-info {
            flex: 1;
        }

        .file-name {
            font-weight: bold;
            margin-bottom: 0.125rem;
        }

        .file-meta {
            font-size: 0.75rem;
            opacity: 0.7;
        }

        .file-size {
            font-size: 0.75rem;
            color: var(--highlight-color);
            white-space: nowrap;
        }

        /* 弹窗样式 */
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        }

        .modal.active {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .modal-content {
            background: var(--card-bg);
            width: 95%;
            height: 90%;
            max-width: 75rem;
            border-radius: 0.5rem;
            display: flex;
            flex-direction: column;
            animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
            from { transform: translateY(3.125rem); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        .modal-header {
            padding: 0.9375rem;
            background: var(--bg-color);
            border-bottom: 0.0625rem solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .modal-title {
            font-weight: bold;
            color: var(--highlight-color);
        }

        .modal-close {
            background: var(--highlight-color);
            color: white;
            border: none;
            padding: 0.5rem 0.9375rem;
            border-radius: 0.25rem;
            cursor: pointer;
            font-size: 1rem;
        }

        .modal-body {
            flex: 1;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        .content-area {
            flex: 1;
            background: var(--code-bg);
            padding: 1.25rem;
            overflow-y: auto;
            font-family: 'Courier New', monospace;
            font-size: 0.875rem;
            line-height: 1.6;
            white-space: pre-wrap;
            word-wrap: break-word;
        }

        .modal-navigation {
            padding: 0.9375rem;
            background: var(--bg-color);
            border-top: 0.0625rem solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .nav-button {
            background: var(--highlight-color);
            color: white;
            border: none;
            padding: 0.625rem 1.25rem;
            border-radius: 0.25rem;
            cursor: pointer;
            font-size: 0.875rem;
            transition: all 0.3s ease;
        }

        .nav-button:hover:not(:disabled) {
            background: #0056b3;
        }

        .nav-button:disabled {
            background: #666;
            cursor: not-allowed;
            opacity: 0.5;
        }

        .theme-switcher {
            position: fixed;
            top: 0.625rem;
            right: 0.625rem;
            z-index: 999;
        }

        .theme-btn {
            background: var(--highlight-color);
            color: white;
            border: none;
            padding: 0.5rem 0.75rem;
            border-radius: 1.25rem;
            cursor: pointer;
            font-size: 1rem;
            transition: all 0.3s ease;
            box-shadow: 0 0.125rem 0.5rem rgba(0,0,0,0.2);
        }

        .theme-btn:hover {
            transform: scale(1.1);
        }

        .stats {
            display: flex;
            gap: 0.9375rem;
            align-items: center;
            font-size: 0.875rem;
        }

        .stat-item {
            display: flex;
            align-items: center;
            gap: 0.3125rem;
        }

        .stat-value {
            font-weight: bold;
            color: var(--highlight-color);
        }

        .loading {
            text-align: center;
            padding: 1.875rem;
            font-size: 1rem;
        }

        .loading-spinner {
            border: 0.1875rem solid var(--border-color);
            border-top: 0.1875rem solid var(--highlight-color);
            border-radius: 50%;
            width: 1.875rem;
            height: 1.875rem;
            animation: spin 1s linear infinite;
            margin: 0 auto 0.9375rem;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* 响应式设计 */
        @media (max-width: 48rem) {
            .container {
                padding: 0.3125rem;
            }
            
            .header h1 {
                font-size: 1.2em;
            }
            
            .controls {
                flex-direction: column;
                gap: 0.3125rem;
            }
            
            .modal-content {
                width: 100%;
                height: 100%;
                border-radius: 0;
            }
            
            .file-item {
                padding: 0.5rem;
            }
            
            .content-area {
                padding: 0.9375rem;
                font-size: 0.8125rem;
            }
        }
    `,
    
    // 反转义函数，修复\n显示问题
    unescapeContent: function(content) {
        return content
            .replace(/\\n/g, '\n')
            .replace(/\\r/g, '\r')
            .replace(/\\t/g, '\t')
            .replace(/\\"/g, '"')
            .replace(/\\\\/g, '\\');
    }
};
