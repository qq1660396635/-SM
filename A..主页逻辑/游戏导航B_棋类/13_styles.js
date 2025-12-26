// 动态生成CSS样式
(function() {
    const styles = `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 10px;
            overflow-x: hidden;
        }

        .header {
            text-align: center;
            color: white;
            margin-bottom: 15px;
            width: 100%;
            position: relative;
        }

        .header h1 {
            font-size: 28px;
            margin-bottom: 8px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            background: linear-gradient(45deg, #fff, #e0e0e0);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .stats {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-bottom: 10px;
            flex-wrap: wrap;
        }

        .stat-item {
            background: rgba(255,255,255,0.15);
            padding: 8px 15px;
            border-radius: 20px;
            backdrop-filter: blur(10px);
            font-size: 14px;
            color: white;
            font-weight: 500;
            border: 1px solid rgba(255,255,255,0.2);
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .game-container {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
            max-width: 100%;
            width: 100%;
            max-width: 380px;
            border: 1px solid rgba(255,255,255,0.3);
            position: relative;
            animation: slideIn 0.5s ease-out;
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .board {
            display: grid;
            grid-template-columns: repeat(8, 1fr);
            grid-template-rows: repeat(8, 1fr);
            gap: 0;
            aspect-ratio: 1;
            width: 100%;
            border: 4px solid #2c3e50;
            border-radius: 12px;
            overflow: hidden;
            margin-bottom: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        .square {
            position: relative;
            aspect-ratio: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .square.light {
            background: #f8f8f8;
            border: 1px solid rgba(0,0,0,0.05);
        }

        .square.dark {
            background: #2c2c2c;
            border: 1px solid rgba(0,0,0,0.1);
        }

        .square.selected {
            background: linear-gradient(135deg, #4caf50, #45a049) !important;
            box-shadow: inset 0 0 15px rgba(76,175,80,0.6);
            transform: scale(1.02);
        }

        .square.valid-move {
            background: linear-gradient(135deg, #81c784, #66bb6a) !important;
            animation: pulse 1s infinite;
            box-shadow: inset 0 0 10px rgba(129,199,132,0.8);
        }

        @keyframes pulse {
            0% {
                opacity: 0.7;
                transform: scale(0.98);
            }
            50% {
                opacity: 1;
                transform: scale(1.02);
            }
            100% {
                opacity: 0.7;
                transform: scale(0.98);
            }
        }

        .piece {
    width: 85%;
    height: 85%;
    border-radius: 50%;
    position: relative;
    transition: all 0.3s ease;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    background: transparent;
    box-shadow: none;
    border: none;
}

.piece.player::after {
    content: '🦖';
}

.piece.ai::after {
    content: '✈';
}

.piece.king::after {
    content: '👑';
}

.piece:hover {
    transform: scale(1.15);
}


        /* 玩家棋子 - 纯蓝色 */
        .piece.player {
            background: #4169E1;
            border: 2px solid #1E3A8A;
        }

        /* AI棋子 - 纯橙色 */
        .piece.ai {
            background: #FF6B35;
            border: 2px solid #C73E1D;
        }

        .piece.king::after {
            content: '👑';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 20px;
            color: #FFD700;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
            font-weight: bold;
        }

        .piece:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        }

        .controls {
            display: flex;
            gap: 12px;
            justify-content: center;
            flex-wrap: wrap;
            margin-bottom: 15px;
        }

        .btn {
            padding: 12px 24px;
            border: none;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            color: white;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .btn-secondary {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
        }

        .btn:active {
            transform: translateY(0);
        }

        .status {
            text-align: center;
            margin-top: 15px;
            padding: 12px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 15px;
            font-weight: 600;
            min-height: 45px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .thinking {
            animation: thinking 1.5s infinite;
        }

        @keyframes thinking {
            0%, 100% {
                opacity: 1;
            }
            50% {
                opacity: 0.5;
            }
        }

        @media (max-width: 380px) {
            .header h1 {
                font-size: 20px;
            }
            .stat-item {
                font-size: 12px;
                padding: 6px 12px;
            }
            .piece.king::after {
                font-size: 16px;
            }
            .game-container {
                padding: 15px;
            }
            .controls {
                gap: 8px;
            }
            .btn {
                padding: 10px 18px;
                font-size: 13px;
            }
        }

        /* 添加一些额外的美化效果 */
        .game-container::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: linear-gradient(45deg, #667eea, #764ba2, #f093fb, #f5576c);
            border-radius: 20px;
            z-index: -1;
            opacity: 0.7;
            filter: blur(10px);
        }
    `;

    // 创建style元素并添加到head中
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
})();
