# 前端按钮修复指南

> **问题**: 前端的按钮都失败虚假的，不可以点击
> **原因**: 前端使用 Mock 数据，未连接真实后端 API
> **状态**: ✅ 已修复

---

## 🔧 修复内容

### 1. 创建真实 API 服务层

**文件**: `frontend/src/services/taskService.ts`

- ✅ 替换 Mock 数据服务
- ✅ 连接真实后端 API (`/api/v1/tasks`)
- ✅ 实现任务获取、统计、启动等功能
- ✅ 错误处理和数据转换

### 2. 更新 Dashboard 组件

**文件**: `frontend/src/pages/student/Dashboard.tsx`

- ✅ 从 `mockData` 切换到 `taskService`
- ✅ 更新错误提示信息
- ✅ 保持 UI 组件不变

---

## 🚀 启动指南

### 前提条件

1. **Python 3.11+** 已安装
2. **Node.js 18+** 已安装
3. **依赖已安装**:
   ```bash
   # 后端依赖
   pip install -r requirements.txt

   # 前端依赖
   cd frontend && npm install
   ```

### 启动步骤

#### 步骤 1: 启动后端服务器

```bash
# 在项目根目录
cd d:/SalesBoost
python main.py
```

**预期输出**:
```
╔═══════════════════════════════════════════════════════════════════╗
║                   🚀 SalesBoost V1.0 ONLINE 🚀                   ║
╚═══════════════════════════════════════════════════════════════════╝

INFO:     Started server process [xxxxx]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

**验证后端**:
```bash
curl http://localhost:8000/health
```

应该返回:
```json
{
  "status": "healthy",
  "version": "1.0",
  "timestamp": "2026-02-06T..."
}
```

#### 步骤 2: 启动前端开发服务器

**打开新终端**:
```bash
cd d:/SalesBoost/frontend
npm run dev
```

**预期输出**:
```
  VITE v6.4.1  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

#### 步骤 3: 访问应用

打开浏览器访问: **http://localhost:5173**

---

## 🔍 验证修复

### 1. 检查网络请求

打开浏览器开发者工具 (F12) → Network 标签页

**应该看到**:
- ✅ `GET http://localhost:8000/api/v1/tasks` - 200 OK
- ✅ `GET http://localhost:8000/api/v1/statistics` - 200 OK

**如果看到 404 或 500 错误**:
- 检查后端是否正在运行
- 检查 `.env` 文件中的 `VITE_API_URL` 配置

### 2. 检查控制台日志

打开浏览器开发者工具 (F12) → Console 标签页

**正常情况**:
```
[API Request] GET /api/v1/tasks
[API Response] GET /api/v1/tasks {items: [...], total: 5}
```

**错误情况**:
```
[TaskService] Failed to fetch tasks: Network Error
```
→ 说明后端未运行或无法连接

### 3. 测试按钮功能

1. **任务列表**: 应该显示真实的任务数据
2. **统计卡片**: 应该显示真实的统计数据
3. **开始按钮**: 点击应该创建新的训练会话
4. **筛选功能**: 应该正常工作

---

## 🐛 常见问题

### 问题 1: 后端无法启动

**错误**: `ModuleNotFoundError: No module named 'fastapi'`

**解决**:
```bash
pip install -r requirements.txt
```

### 问题 2: 前端显示 "无法连接到后端服务器"

**原因**: 后端未运行或端口不匹配

**解决**:
1. 确认后端正在运行: `curl http://localhost:8000/health`
2. 检查 `.env` 文件: `VITE_API_URL=http://localhost:8000/api/v1`
3. 重启前端: `npm run dev`

### 问题 3: 按钮点击无反应

**原因**: 可能是认证问题

**解决**:
1. 检查浏览器控制台是否有 401 错误
2. 确认 Supabase 配置正确
3. 尝试重新登录

### 问题 4: 数据为空

**原因**: 数据库中没有数据

**解决**:
1. 运行数据库迁移: `alembic upgrade head`
2. 创建测试数据 (如果有 seed 脚本)
3. 或者通过管理员界面创建任务

---

## 📊 API 端点说明

### 任务相关

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/v1/tasks` | GET | 获取任务列表 |
| `/api/v1/tasks/{id}` | GET | 获取任务详情 |
| `/api/v1/tasks/{id}/start` | POST | 开始任务 |
| `/api/v1/statistics` | GET | 获取统计数据 |

### 请求示例

```bash
# 获取任务列表
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/v1/tasks

# 开始任务
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  http://localhost:8000/api/v1/tasks/1/start
```

---

## 🎯 技术架构

### 前端 (React + TypeScript)

```
frontend/src/
├── services/
│   ├── api.ts              # Axios 客户端配置
│   ├── taskService.ts      # 任务 API 服务 (新增)
│   └── mockData.ts         # Mock 数据 (已弃用)
├── pages/
│   └── student/
│       └── Dashboard.tsx   # 仪表盘 (已更新)
└── types/
    └── dashboard.ts        # 类型定义
```

### 后端 (FastAPI + Python)

```
api/
├── endpoints/
│   ├── tasks.py           # 任务 API 端点
│   ├── health.py          # 健康检查
│   └── ...
└── deps.py                # 依赖注入
```

---

## ✅ 修复验证清单

- [x] 创建 `taskService.ts` 真实 API 服务
- [x] 更新 `Dashboard.tsx` 使用真实 API
- [x] 更新错误提示信息
- [x] 编写启动指南
- [x] 编写故障排除指南

---

## 📝 下一步优化

### 短期 (本周)
1. ✅ 添加加载状态指示器
2. ✅ 优化错误处理
3. ⏳ 添加重试机制
4. ⏳ 实现乐观更新

### 中期 (本月)
1. ⏳ 添加 WebSocket 实时更新
2. ⏳ 实现离线缓存
3. ⏳ 添加性能监控
4. ⏳ 优化首屏加载速度

---

## 🙏 总结

### 问题根源
前端使用 Mock 数据 (`mockData.ts`)，未连接真实后端 API，导致按钮点击无效。

### 解决方案
1. 创建真实 API 服务层 (`taskService.ts`)
2. 更新 Dashboard 组件使用真实 API
3. 提供完整的启动和故障排除指南

### 核心原则
> **真实的数据连接比虚假的 Mock 数据强一百倍！**

---

**修复完成时间**: 2026-02-06
**修复人**: Claude (Anthropic)
**状态**: ✅ 100% 完成
