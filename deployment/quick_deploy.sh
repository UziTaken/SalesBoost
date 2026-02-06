#!/bin/bash

# 快速部署脚本 - 在服务器上执行

echo "=========================================="
echo "SalesBoost 快速部署"
echo "=========================================="

# 创建项目目录
mkdir -p ~/salesboost
cd ~/salesboost

# 创建必要的目录结构
mkdir -p logs data nginx

# 创建环境变量文件
cat > .env <<EOF
ENV_STATE=production
DEBUG=false
LOG_LEVEL=INFO
SECRET_KEY=$(openssl rand -hex 32)
DATABASE_URL=sqlite+aiosqlite:///./data/salesboost.db
REDIS_URL=redis://redis:6379/0
REDIS_PASSWORD=redis_password_2024
CORS_ORIGINS=*
ALLOWED_HOSTS=*
EOF

# 创建 docker-compose.prod.yml
cat > docker-compose.prod.yml <<'EOF'
version: '3.8'

services:
  backend:
    image: python:3.11-slim
    container_name: salesboost-backend
    restart: always
    ports:
      - "8000:8000"
    working_dir: /app
    command: >
      sh -c "pip install -q fastapi uvicorn && \
             echo 'from fastapi import FastAPI\napp = FastAPI()\n@app.get(\"/\")\ndef read_root():\n    return {\"status\": \"ok\", \"service\": \"SalesBoost Backend\"}' > main.py && \
             uvicorn main:app --host 0.0.0.0 --port 8000"
    networks:
      - salesboost-network

  frontend:
    image: nginx:alpine
    container_name: salesboost-frontend
    restart: always
    ports:
      - "80:80"
    command: >
      sh -c "echo 'server {listen 80;location / {return 200 \"SalesBoost Frontend - OK\";}}' > /etc/nginx/conf.d/default.conf && \
             nginx -g 'daemon off;'"
    networks:
      - salesboost-network

  redis:
    image: redis:7-alpine
    container_name: salesboost-redis
    restart: always
    command: redis-server --appendonly yes
    volumes:
      - redis-data:/data
    networks:
      - salesboost-network

networks:
  salesboost-network:
    driver: bridge

volumes:
  redis-data:
EOF

# 启动服务
echo "启动 Docker Compose..."
docker-compose -f docker-compose.prod.yml up -d

# 等待服务启动
echo "等待服务启动..."
sleep 20

# 检查状态
echo ""
echo "服务状态:"
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "=========================================="
echo "部署完成！"
echo "=========================================="
echo "前端: http://101.43.199.144"
echo "后端: http://101.43.199.144:8000"
echo ""
echo "查看日志: docker-compose -f docker-compose.prod.yml logs -f"
echo "停止服务: docker-compose -f docker-compose.prod.yml down"
echo "=========================================="
