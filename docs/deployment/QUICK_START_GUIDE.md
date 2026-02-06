# SalesBoost 快速部署指南

**服务器:** 106.53.168.252
**部署时间:** 约10分钟
**部署方案:** 快速开始（自建数据库、本地存储）

---

## 🚀 一键部署步骤

### 第1步：连接到服务器

在你的本地电脑打开终端（Windows用PowerShell或CMD），执行：

```bash
ssh root@106.53.168.252
# 输入密码: Nanyanglane001
```

### 第2步：上传部署文件

**方式A：使用SCP上传（推荐）**

在本地电脑执行：
```bash
# 上传部署脚本
scp d:\SalesBoost\scripts\deployment\quick_deploy.sh root@106.53.168.252:/root/

# 上传环境配置
scp d:\SalesBoost\env.production root@106.53.168.252:/root/

# 上传整个项目（如果还没上传）
scp -r d:\SalesBoost root@106.53.168.252:/opt/
```

**方式B：使用Git克隆（如果代码在GitHub）**

在服务器上执行：
```bash
cd /opt
git clone https://github.com/yourusername/salesboost.git
cd salesboost
```

### 第3步：执行自动化部署

在服务器上执行：
```bash
# 进入部署目录
cd /root

# 添加执行权限
chmod +x quick_deploy.sh

# 运行部署脚本
bash quick_deploy.sh
```

### 第4步：等待完成

脚本会自动完成以下操作：
- ✅ 更新系统
- ✅ 安装PostgreSQL数据库
- ✅ 安装Redis缓存
- ✅ 安装Python 3.11
- ✅ 安装Node.js
- ✅ 安装Nginx
- ✅ 配置防火墙
- ✅ 安装项目依赖
- ✅ 初始化数据库
- ✅ 启动服务
- ✅ 配置反向代理

**预计时间：10分钟**

---

## 🎉 部署完成后

### 访问地址
- **前端:** http://106.53.168.252:3000
- **API:** http://106.53.168.252:8000
- **API文档:** http://106.53.168.252:8000/docs

### 默认管理员账号
- **邮箱:** admin@salesboost.local
- **密码:** Admin@2026

### 测试功能
1. 打开浏览器访问 http://106.53.168.252:3000
2. 使用管理员账号登录
3. 开始第一次销售训练！

---

## 📊 服务管理命令

### 查看服务状态
```bash
# 查看后端状态
systemctl status salesboost-backend

# 查看前端状态
systemctl status salesboost-frontend
```

### 查看日志
```bash
# 查看后端日志
journalctl -u salesboost-backend -f

# 查看前端日志
journalctl -u salesboost-frontend -f

# 查看Nginx日志
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### 重启服务
```bash
# 重启后端
systemctl restart salesboost-backend

# 重启前端
systemctl restart salesboost-frontend

# 重启Nginx
systemctl restart nginx
```

### 停止服务
```bash
# 停止后端
systemctl stop salesboost-backend

# 停止前端
systemctl stop salesboost-frontend
```

---

## 🔧 常见问题

### Q1: 部署失败怎么办？
```bash
# 查看详细错误日志
journalctl -u salesboost-backend -n 100
journalctl -u salesboost-frontend -n 100
```

### Q2: 如何更新代码？
```bash
cd /opt/salesboost
git pull origin main

# 重启服务
systemctl restart salesboost-backend
systemctl restart salesboost-frontend
```

### Q3: 如何备份数据库？
```bash
# 备份数据库
sudo -u postgres pg_dump salesboost > /root/salesboost_backup_$(date +%Y%m%d).sql

# 恢复数据库
sudo -u postgres psql salesboost < /root/salesboost_backup_20260205.sql
```

### Q4: 如何修改配置？
```bash
# 编辑环境变量
vim /opt/salesboost/.env

# 重启服务使配置生效
systemctl restart salesboost-backend
```

### Q5: 端口被占用怎么办？
```bash
# 查看端口占用
netstat -tulpn | grep 8000
netstat -tulpn | grep 3000

# 杀死占用进程
kill -9 <PID>
```

---

## 🔐 安全建议

### 1. 修改默认密码
```bash
# 修改数据库密码
sudo -u postgres psql
ALTER USER salesboost WITH PASSWORD 'your_new_password';

# 修改Redis密码
vim /etc/redis/redis.conf
# 找到 requirepass 修改密码
systemctl restart redis-server

# 修改管理员密码
# 登录系统后在设置中修改
```

### 2. 配置防火墙
```bash
# 只允许特定IP访问
ufw allow from YOUR_IP to any port 22
ufw allow from YOUR_IP to any port 8000
ufw allow from YOUR_IP to any port 3000
```

### 3. 启用HTTPS（推荐）
```bash
# 安装Certbot
apt-get install -y certbot python3-certbot-nginx

# 申请SSL证书（需要域名）
certbot --nginx -d yourdomain.com
```

---

## 📈 性能优化

### 1. 增加Worker数量
```bash
# 编辑后端服务
vim /etc/systemd/system/salesboost-backend.service

# 修改 --workers 参数
ExecStart=/opt/salesboost/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 8

# 重启服务
systemctl daemon-reload
systemctl restart salesboost-backend
```

### 2. 配置Nginx缓存
```bash
# 编辑Nginx配置
vim /etc/nginx/sites-available/salesboost

# 添加缓存配置
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=1g inactive=60m;
```

### 3. 优化数据库
```bash
# 编辑PostgreSQL配置
vim /etc/postgresql/*/main/postgresql.conf

# 增加连接数和缓存
max_connections = 200
shared_buffers = 256MB
effective_cache_size = 1GB

# 重启PostgreSQL
systemctl restart postgresql
```

---

## 📞 获取帮助

如果遇到问题：
1. 查看日志文件
2. 检查服务状态
3. 查看本文档的常见问题部分
4. 联系技术支持

---

**祝部署顺利！🎉**
