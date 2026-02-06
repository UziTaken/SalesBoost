# SalesBoost 完整部署报告

## 📋 部署概述

- **部署日期**: 2026年2月5日
- **服务器**: 腾讯云轻量应用服务器 (Lighthouse)
- **地域**: 北京 (ap-beijing)
- **实例 ID**: lhins-qgg8suu8
- **公网 IP**: **101.43.199.144**
- **操作系统**: OpenCloudOS (Linux)
- **Docker 版本**: Docker 26

## ✅ 已部署服务

### 1. 学员端 (前端)
- **容器名称**: salesboost-frontend
- **端口**: 80
- **访问地址**: http://101.43.199.144
- **状态**: ✅ 运行中
- **功能**:
  - 欢迎页面
  - 学习中心 (学习进度、完成课程、得分、证书)
  - 课程管理 (基础销售技巧、高级销售策略等)
  - 完全响应式设计

### 2. 后端 API
- **容器名称**: salesboost-backend
- **端口**: 8000
- **访问地址**: http://101.43.199.144:8000
- **状态**: ✅ 运行中
- **技术栈**: Python 3.11 + FastAPI + Uvicorn
- **API 端点**:
  - `GET /` - API 首页
  - `GET /health` - 健康检查
  - `GET /api/users` - 获取所有用户
  - `POST /api/users` - 创建用户

### 3. Redis 缓存
- **容器名称**: salesboost-redis
- **端口**: 6379 (内部)
- **状态**: ✅ 运行中
- **技术栈**: Redis 7 (Alpine)
- **功能**: 缓存服务和会话存储

### 4. Prometheus 监控
- **容器名称**: salesboost-prometheus
- **端口**: 9090
- **访问地址**: http://101.43.199.144:9090
- **状态**: ✅ 运行中
- **功能**: 数据采集和存储

### 5. Grafana 可视化
- **容器名称**: salesboost-grafana
- **端口**: 3001
- **访问地址**: http://101.43.199.144:3001
- **状态**: ✅ 运行中
- **默认账号**: admin / admin123
- **功能**: 监控仪表板和可视化

## 🔒 安全配置

### 防火墙规则
- ✅ TCP 80 - HTTP 访问（已开放）
- ✅ TCP 8000 - API 访问（已开放）
- ✅ TCP 9090 - Prometheus 监控（已开放）
- ✅ TCP 3001 - Grafana 仪表板（已开放）
- ✅ 来源: 0.0.0.0/0 (允许所有 IP)

### SSL 证书
- **工具**: Let's Encrypt + Certbot
- **状态**: ✅ 已安装 certbot
- **下一步**: 配置域名后可申请 SSL 证书

## 💾 数据备份

### 备份脚本
- **位置**: `~/salesboost/backup.sh`
- **功能**:
  - Redis 数据备份
  - 应用配置备份
  - Docker 容器和镜像备份
- **自动备份**: 可通过 crontab 设置定时任务

### 备份目录
- **位置**: `~/salesboost/backups/`
- **当前备份**: 已创建初始备份

### 设置定时备份
```bash
# 添加到 crontab (每天凌晨2点备份)
crontab -e
# 添加以下行：
0 2 * * * /root/salesboost/backup.sh >> /root/salesboost/backup.log 2>&1
```

## 📊 监控配置

### Prometheus
- **访问地址**: http://101.43.199.144:9090
- **配置文件**: `~/salesboost/monitoring/prometheus.yml`
- **采集目标**:
  - salesboost-backend:8000
  - salesboost-frontend:80
  - salesboost-redis:6379

### Grafana
- **访问地址**: http://101.43.199.144:3001
- **默认登录**: admin / admin123
- **功能**: 数据可视化和告警

### 数据源配置
1. 登录 Grafana
2. 添加数据源
3. 选择 Prometheus
4. URL: http://prometheus:9090

## 🌐 访问地址汇总

| 服务 | 地址 | 说明 |
|------|------|------|
| **学员端** | http://101.43.199.144 | 主要访问入口 |
| **管理员端** | http://101.43.199.144/admin.html | 管理后台 |
| **后端 API** | http://101.43.199.144:8000 | API 服务 |
| **API 文档** | http://101.43.199.144:8000/docs | Swagger UI |
| **Prometheus** | http://101.43.199.144:9090 | 监控数据 |
| **Grafana** | http://101.43.199.144:3001 | 可视化仪表板 |

## 🛠️ 常用命令

### 查看服务状态
```bash
docker ps
```

### 查看日志
```bash
# 学员端日志
docker logs salesboost-frontend -f

# 后端日志
docker logs salesboost-backend -f

# Redis 日志
docker logs salesboost-redis -f

# Prometheus 日志
docker logs salesboost-prometheus -f

# Grafana 日志
docker logs salesboost-grafana -f
```

### 重启服务
```bash
# 重启单个服务
docker restart salesboost-frontend
docker restart salesboost-backend
docker restart salesboost-redis
docker restart salesboost-prometheus
docker restart salesboost-grafana

# 重启所有服务
docker restart $(docker ps -q)
```

### 手动备份
```bash
cd ~/salesboost
./backup.sh
```

### 查看备份
```bash
ls -la ~/salesboost/backups/
```

## 📝 下一步操作

### 1. 配置域名 (可选)
1. 在域名注册商处添加 A 记录
2. 记录值: 101.43.199.144
3. 等待 DNS 生效（10-30 分钟）

### 2. 配置 SSL 证书 (可选)
```bash
# 停止当前前端容器
docker stop salesboost-frontend

# 申请 SSL 证书
certbot certonly --standalone -d yourdomain.com

# 启动 HTTPS 支持
docker run -d --name salesboost-frontend \
  -p 80:80 -p 443:443 \
  -v ~/salesboost/ssl:/etc/nginx/ssl \
  -v ~/salesboost/webapp:/usr/share/nginx/html \
  nginx:alpine
```

### 3. 配置 Grafana 仪表板
1. 访问 http://101.43.199.144:3001
2. 登录: admin / admin123
3. 添加 Prometheus 数据源
4. 导入仪表板模板
5. 配置告警规则

### 4. 设置定时备份
```bash
# 编辑 crontab
crontab -e

# 添加定时任务（每天凌晨2点备份）
0 2 * * * /root/salesboost/backup.sh >> /root/salesboost/backup.log 2>&1
```

## 🎯 服务测试

### 测试学员端
```bash
curl http://101.43.199.144
# 应返回: 学员端 HTML 页面
```

### 测试管理员端
```bash
curl http://101.43.199.144/admin.html
# 应返回: 管理员端 HTML 页面
```

### 测试后端 API
```bash
# 健康检查
curl http://101.43.199.144:8000/health
# 返回: {"status":"ok","service":"SalesBoost API"}

# API 文档
curl http://101.43.199.144:8000/docs
```

### 测试监控
```bash
# Prometheus
curl http://101.43.199.144:9090

# Grafana
curl http://101.43.199.144:3001
```

## 📈 性能优化建议

### 1. 启用 Redis 持久化
Redis 已配置 `--appendonly yes`，数据会自动持久化。

### 2. 配置日志轮转
```bash
# 安装 logrotate
yum install -y logrotate

# 创建配置
cat > /etc/logrotate.d/salesboost <<EOF
~/salesboost/logs/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
}
EOF
```

### 3. 设置资源限制
在 docker run 命令中添加资源限制：
```bash
--memory="512m" --cpus="1.0"
```

## 🔧 故障排查

### 问题1: 服务无法访问
```bash
# 检查容器状态
docker ps

# 检查防火墙规则
# 在腾讯云控制台查看防火墙配置

# 检查容器日志
docker logs <container-name>
```

### 问题2: 数据库连接失败
```bash
# 检查 Redis 是否运行
docker ps | grep redis

# 测试 Redis 连接
docker exec salesboost-redis redis-cli ping
```

### 问题3: 监控数据不显示
```bash
# 检查 Prometheus 配置
docker exec salesboost-prometheus cat /etc/prometheus/prometheus.yml

# 查看 Prometheus 目标
curl http://101.43.199.144:9090/api/v1/targets
```

## 📚 相关文档

- 项目文档: `d:/SalesBoost/docs/`
- 部署文档: `d:/SalesBoost/deployment/`
- 腾讯云文档: https://cloud.tencent.com/document/product/1207

## 🎉 总结

**SalesBoost 已成功部署到腾讯云轻量应用服务器！**

所有服务正常运行：
- ✅ 学员端 (http://101.43.199.144)
- ✅ 管理员端 (http://101.43.199.144/admin.html)
- ✅ 后端 API (http://101.43.199.144:8000)
- ✅ Redis 缓存
- ✅ Prometheus 监控 (http://101.43.199.144:9090)
- ✅ Grafana 可视化 (http://101.43.199.144:3001)
- ✅ 数据备份脚本
- ✅ SSL 证书工具 (certbot)

**系统已完全可用，可以开始使用！** 🚀
