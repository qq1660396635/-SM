一  全局在线时长
全局在其他文件中使用全局在线时长变量D_GLOBAL_ONLINE_TIME的方法：
1. **直接访问变量**：
```javascript
// 访问全局变量
const onlineTime = window.D_GLOBAL_ONLINE_TIME;
```
2. **从数据库加载**：
```javascript
// 加载在线时长数据
async function loadOnlineTime() {
    try {
        const savedData = await IDB.get('D_GLOBAL_ONLINE_TIME', 'userdata');
        if (savedData) {
            window.D_GLOBAL_ONLINE_TIME = savedData;
        }
    } catch (error) {
        console.error('加载在线时长失败:', error);
    }
}
```
3. **更新和保存**：
```javascript
// 更新在线时长并保存
async function updateOnlineTime() {
    // 修改数据
    window.D_GLOBAL_ONLINE_TIME.totalSeconds += 60;
    
    // 保存到数据库
    try {
        await IDB.put('D_GLOBAL_ONLINE_TIME', window.D_GLOBAL_ONLINE_TIME, 'userdata');
    } catch (error) {
        console.error('保存在线时长失败:', error);
    }
}
```
4. **注意事项**：
   - 确保在使用前已加载/db.js
   - 变量结构：{startTime, totalSeconds, lastSavedTime}
   - 数据存储在userdata存储区，键名为'D_GLOBAL_ONLINE_TIME'




二，全局在线时长问题
你这个问题，“在线时长突然从几秒变成几小时”，是典型的全局状态污染或计时器未正确清理导致的时间跳跃。

---

✅ 问题本质
你在两个页面之间切换，共用了同一个全局变量 `window.D_GLOBAL_ONLINE_TIME`，但：

- 计时器没有清理；
- 时间戳未重置；
- 多个页面同时计时；
- 页面切换时未正确暂停/恢复；

导致时间被重复累加或时间差被放大，出现“几秒变几小时”的异常。

---

✅ 解决方案（立即生效）

✅ 1. 页面切换时销毁并重建计时器
在每个页面加载时，重新初始化计时器，并清理上一个页面的计时器。

```js
let onlineTimer = null;

function startOnlineTimer() {
  // 清理旧计时器
  if (onlineTimer) {
    clearInterval(onlineTimer);
  }

  // 启动新计时器
  onlineTimer = setInterval(() => {
    updateOnlineTimeDisplay();
  }, 1000);
}

// 页面加载时启动
window.addEventListener('DOMContentLoaded', () => {
  startOnlineTimer();
});

// 页面卸载时清理
window.addEventListener('beforeunload', () => {
  clearInterval(onlineTimer);
});
```

---

✅ 2. 避免重复累加时间
你现在的逻辑是：

```js
const elapsed = window.D_GLOBAL_ONLINE_TIME.totalSeconds + 
  Math.floor((now - window.D_GLOBAL_ONLINE_TIME.startTime) / 1000);
```

⚠️ 如果 `startTime` 是上一个页面留下的，而 `totalSeconds` 是已经累加过的，就会导致时间重复计算。

✅ 正确做法是：每个页面只记录自己打开的时间，不依赖全局 `startTime`。

---

✅ 3. 每个页面独立计时，只保存总时长
改为：

```js
// 页面打开时记录时间
const pageStartTime = Date.now();

// 每秒钟更新显示
setInterval(() => {
  const pageElapsed = Math.floor((Date.now() - pageStartTime) / 1000);
  const totalElapsed = (window.D_GLOBAL_ONLINE_TIME.totalSeconds || 0) + pageElapsed;
  updateOnlineTimeDisplay(totalElapsed);
}, 1000);

// 页面卸载时，把本次时长加到总时长中
window.addEventListener('beforeunload', () => {
  const pageElapsed = Math.floor((Date.now() - pageStartTime) / 1000);
  window.D_GLOBAL_ONLINE_TIME.totalSeconds += pageElapsed;
  saveOnlineTime();
});
```

---

✅ 4. 可选：页面切换时暂停计时
如果你用了 `visibilitychange` API，可以在页面不可见时暂停计时：

```js
let hiddenStart = null;

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    hiddenStart = Date.now();
  } else if (hiddenStart) {
    const hiddenTime = Date.now() - hiddenStart;
    window.D_GLOBAL_ONLINE_TIME.totalSeconds += Math.floor(hiddenTime / 1000);
    hiddenStart = null;
  }
});
```

---

✅ 总结一句话

> 每个页面只记录自己打开的时间，卸载时累加到总时长，避免共享计时器或时间戳。

---

✅ 你现在的代码哪里改？
你这段逻辑是罪魁祸首：

```js
const elapsed = window.D_GLOBAL_ONLINE_TIME.totalSeconds +
  Math.floor((now - window.D_GLOBAL_ONLINE_TIME.startTime) / 1000);
```

✅ 改成：

```js
const pageElapsed = Math.floor((Date.now() - pageStartTime) / 1000);
const elapsed = (window.D_GLOBAL_ONLINE_TIME.totalSeconds || 0) + pageElapsed;
```

---

✅ 最终效果
- 切换页面不再时间跳跃；
- 不再几秒变几小时；
- 每个页面独立计时，安全累加；
- 不污染全局状态；

---

如果你愿意，我可以给你一段完整修复后的计时模块，直接替换你现在的 `updateOnlineTime()` 逻辑。