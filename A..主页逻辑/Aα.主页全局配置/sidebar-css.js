// sidebar-css.js - 侧边栏样式配置文件
(function() {
    // 动态注入所有CSS样式
    const css = `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            color: #495057;
            height: 100vh;
            overflow-y: auto;
            position: relative;
        }
        .top-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 20px;
            background: #ffffff;
            border-bottom: 1px solid #e9ecef;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            position: sticky;
            top: 0;
            z-index: 100;
        }
        .user-status {
            font-size: 14px;
            padding: 8px 16px;
            background: linear-gradient(135deg, #4a90e2, #5cb85c);
            color: white;
            border-radius: 20px;
            font-weight: 500;
            box-shadow: 0 2px 8px rgba(74, 144, 226, 0.3);
        }
        .button-group {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .sidebar-btn {
            background: #ffffff;
            border: 1px solid #e9ecef;
            color: #495057;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            font-size: 16px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }
        .sidebar-btn:hover {
            background: linear-gradient(135deg, #4a90e2, #5cb85c);
            color: white;
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(74, 144, 226, 0.4);
        }
        .user-profile-section {
            padding: 24px;
            background: #ffffff;
            margin: 16px;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
            position: relative;
            text-align: center;
        }
        .avatar-container {
            margin-bottom: 20px;
            position: relative;
        }
        .sidebar-avatar {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            object-fit: cover;
            border: 4px solid #ffffff;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .sidebar-avatar:hover {
            transform: scale(1.05);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
        .username-container {
            margin-bottom: 20px;
        }
        .sidebar-username {
            font-size: 1.3rem;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 10px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: inline-block;
            padding: 8px 20px;
            border-radius: 25px;
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
        }
        .sidebar-username:hover {
            background: linear-gradient(135deg, #4a90e2, #5cb85c);
            color: white;
            transform: translateY(-2px);
        }
        .username-input {
            width: 80%;
            padding: 12px 16px;
            border: 2px solid #e9ecef;
            border-radius: 25px;
            font-size: 1rem;
            text-align: center;
            display: none;
            background: #f8f9fa;
            color: #495057;
            transition: all 0.3s ease;
        }
        .username-input:focus {
            border-color: #4a90e2;
            outline: none;
            box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
        }
        .username-actions {
            display: none;
            justify-content: center;
            gap: 10px;
            margin-top: 12px;
        }
        .signature-container {
            margin: 20px 0;
        }
        .signature-label {
            font-size: 12px;
            color: #6c757d;
            margin-bottom: 8px;
            display: block;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .signature {
            background: #f8f9fa;
            padding: 12px 16px;
            border-radius: 12px;
            font-size: 14px;
            color: #495057;
            min-height: 44px;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 1px solid #e9ecef;
        }
        .signature:hover {
            background: #e9ecef;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        .signature-input {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e9ecef;
            border-radius: 12px;
            font-size: 14px;
            display: none;
            background: #f8f9fa;
            color: #495057;
            transition: all 0.3s ease;
        }
        .signature-input:focus {
            border-color: #5cb85c;
            outline: none;
            box-shadow: 0 0 0 3px rgba(92, 184, 92, 0.2);
        }
        .signature-actions {
            display: none;
            justify-content: center;
            gap: 10px;
            margin-top: 12px;
        }
        .btn-save, .btn-cancel {
            padding: 10px 20px;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .btn-save {
            background: linear-gradient(135deg, #5cb85c, #4cae4c);
            color: white;
        }
        .btn-cancel {
            background: #e9ecef;
            color: #6c757d;
        }
        .btn-save:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(92, 184, 92, 0.3);
        }
        .btn-cancel:hover {
            background: #dee2e6;
            transform: translateY(-2px);
        }
        .menu-section {
            padding: 20px;
            margin: 0 16px 16px;
            background: #ffffff;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
        }
        .menu-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 2px solid #e9ecef;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .menu-title::before {
            content: '▶';
            color: #4a90e2;
            font-size: 0.8rem;
        }
        .menu-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
        }
        .menu-item {
            background: #f8f9fa;
            padding: 16px;
            border-radius: 12px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 1px solid #e9ecef;
        }
        .menu-item:hover {
            background: linear-gradient(135deg, #4a90e2, #5cb85c);
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }
        .menu-item:hover .menu-icon {
            color: white;
            transform: scale(1.1);
        }
        .menu-item:hover .menu-name {
            color: white;
        }
        .menu-icon {
            font-size: 24px;
            margin-bottom: 8px;
            color: #4a90e2;
            transition: all 0.3s ease;
        }
        .menu-name {
            font-size: 13px;
            color: #495057;
            font-weight: 500;
            transition: all 0.3s ease;
        }
        #avatarInput {
            display: none;
        }
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            backdrop-filter: blur(5px);
        }
        .modal-content {
            background: #ffffff;
            padding: 24px;
            border-radius: 16px;
            width: 90%;
            max-width: 400px;
            margin: 10% auto;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        }
        .modal-header {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 16px;
            border-bottom: 1px solid #e9ecef;
        }
        .modal-title {
            font-size: 1.2rem;
            color: #2c3e50;
            font-weight: 600;
        }
        .modal-body {
            margin-bottom: 20px;
        }
        .form-group {
            margin-bottom: 16px;
        }
        .form-label {
            display: block;
            margin-bottom: 6px;
            font-size: 13px;
            color: #6c757d;
            font-weight: 500;
        }
        .form-input {
            width: 100%;
            padding: 12px;
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            color: #495057;
            font-size: 14px;
            transition: all 0.3s ease;
        }
        .form-input:focus {
            outline: none;
            border-color: #4a90e2;
            box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
        }
        .form-textarea {
            width: 100%;
            min-height: 100px;
            padding: 12px;
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            color: #495057;
            font-size: 13px;
            resize: vertical;
            transition: all 0.3s ease;
        }
        .form-textarea:focus {
            outline: none;
            border-color: #5cb85c;
            box-shadow: 0 0 0 3px rgba(92, 184, 92, 0.2);
        }
        .copy-btn {
            width: 100%;
            padding: 12px;
            background: linear-gradient(135deg, #4a90e2, #5cb85c);
            border: none;
            border-radius: 8px;
            color: white;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
        }
        .copy-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(74, 144, 226, 0.3);
        }
        .modal-footer {
            display: flex;
            gap: 12px;
            justify-content: center;
        }
        .modal-btn {
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
            min-width: 100px;
        }
        .modal-btn-primary {
            background: linear-gradient(135deg, #4a90e2, #5cb85c);
            color: white;
        }
        .modal-btn-secondary {
            background: #e9ecef;
            color: #6c757d;
        }
        .modal-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .cordova-status {
            padding: 12px;
            margin: 16px;
            border-radius: 12px;
            text-align: center;
            font-size: 13px;
            font-weight: 500;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        .cordova-ready {
            background: linear-gradient(135deg, #d4edda, #c3e6cb);
            border: 1px solid #c3e6cb;
            color: #155724;
        }
        .cordova-waiting {
            background: linear-gradient(135deg, #fff3cd, #ffeeba);
            border: 1px solid #ffeeba;
            color: #856404;
        }
        .cordova-browser {
            background: linear-gradient(135deg, #d1ecf1, #bee5eb);
            border: 1px solid #bee5eb;
            color: #0c5460;
        }
        .cordova-error {
            background: linear-gradient(135deg, #f8d7da, #f5c6cb);
            border: 1px solid #f5c6cb;
            color: #721c24;
        }
        .auth-section {
            background: #f8f9fa;
            padding: 16px;
            border-radius: 12px;
            margin-bottom: 16px;
            border: 1px solid #e9ecef;
        }
        .auth-title {
            font-size: 14px;
            font-weight: 600;
            color: #495057;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .auth-title::before {
            content: '🔐';
            font-size: 16px;
        }
        @media(max-width: 480px) {
            .menu-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 8px;
            }
            .menu-item {
                padding: 12px;
            }
            .menu-icon {
                font-size: 20px;
                margin-bottom: 6px;
            }
            .menu-name {
                font-size: 11px;
            }
            .user-profile-section {
                padding: 16px;
            }
            .sidebar-avatar {
                width: 80px;
                height: 80px;
            }
            .sidebar-username {
                font-size: 1.1rem;
            }
            .top-bar {
                padding: 12px 16px;
            }
            .user-status {
                font-size: 12px;
                padding: 6px 12px;
            }
            .sidebar-btn {
                width: 36px;
                height: 36px;
                font-size: 14px;
            }
            .button-group {
                gap: 8px;
            }
            .modal-content {
                width: 95%;
                margin: 15% auto;
                padding: 16px;
            }
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
})();
