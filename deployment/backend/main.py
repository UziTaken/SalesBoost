from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from typing import Optional, List
import uvicorn

app = FastAPI(title="SalesBoost API", version="1.0.0")

# CORS 配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 数据模型
class User(BaseModel):
    id: Optional[int] = None
    username: str
    email: str
    role: str = "student"

# 内存数据库
users_db: List[User] = []
next_user_id = 1

@app.get("/", response_class=HTMLResponse)
async def root():
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>SalesBoost API</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
            h1 { color: #333; }
            .status { background: #d4edda; color: #155724; padding: 15px; border-radius: 5px; }
            .endpoint { background: #f8f9fa; padding: 10px; margin: 10px 0; border-left: 4px solid #007bff; }
        </style>
    </head>
    <body>
        <h1>🚀 SalesBoost API</h1>
        <div class="status">✅ API 服务正常运行</div>
        <h2>可用端点：</h2>
        <div class="endpoint">GET / - 此页面</div>
        <div class="endpoint">GET /health - 健康检查</div>
        <div class="endpoint">GET /api/users - 获取所有用户</div>
        <div class="endpoint">POST /api/users - 创建用户</div>
    </body>
    </html>
    """

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "SalesBoost Backend", "version": "1.0.0"}

@app.get("/api/users")
async def get_users():
    return {"users": users_db, "total": len(users_db)}

@app.post("/api/users")
async def create_user(user: User):
    global next_user_id
    user.id = next_user_id
    next_user_id += 1
    users_db.append(user)
    return {"message": "用户创建成功", "user": user}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
