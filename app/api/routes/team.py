"""
Team Collaboration API

团队协作功能API - 排行榜、知识分享、团队挑战

Author: Claude (Anthropic)
Date: 2026-02-05
"""

from datetime import datetime, timedelta
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel, Field

from app.api.middleware import User, get_current_user, get_current_admin_user

router = APIRouter(prefix="/api/team", tags=["team"])


# ============================================
# 数据模型
# ============================================

class TeamMember(BaseModel):
    """团队成员"""
    id: str
    name: str
    email: str
    avatar: Optional[str] = None
    role: str = "member"  # member, admin
    joined_at: str


class LeaderboardEntry(BaseModel):
    """排行榜条目"""
    rank: int
    user_id: str
    user_name: str
    avatar: Optional[str] = None
    score: float
    practice_count: int
    improvement_rate: float
    badges: List[str] = []


class BestPractice(BaseModel):
    """最佳实践"""
    id: str
    title: str
    description: str
    author_id: str
    author_name: str
    conversation_id: str
    tags: List[str]
    likes: int
    created_at: str


class TeamChallenge(BaseModel):
    """团队挑战"""
    id: str
    title: str
    description: str
    start_date: str
    end_date: str
    participants: int
    status: str  # upcoming, active, completed
    prize: Optional[str] = None


class TeamStats(BaseModel):
    """团队统计"""
    total_members: int
    active_members: int
    total_practices: int
    avg_score: float
    top_skills: List[str]
    improvement_trend: List[float]


# ============================================
# 排行榜
# ============================================

@router.get("/leaderboard", response_model=List[LeaderboardEntry])
async def get_leaderboard(
    period: str = "week",  # week, month, quarter, all
    limit: int = 50,
    user: User = Depends(get_current_user),
):
    """
    获取团队排行榜

    Args:
        period: 时间周期
        limit: 返回数量
        user: 当前用户

    Returns:
        排行榜列表
    """
    # TODO: 从数据库查询排行榜数据

    # 临时返回模拟数据
    return [
        LeaderboardEntry(
            rank=1,
            user_id="user1",
            user_name="张三",
            score=95.5,
            practice_count=45,
            improvement_rate=15.2,
            badges=["🏆", "🔥", "⭐"],
        ),
        LeaderboardEntry(
            rank=2,
            user_id="user2",
            user_name="李四",
            score=92.3,
            practice_count=38,
            improvement_rate=12.8,
            badges=["🔥", "⭐"],
        ),
        LeaderboardEntry(
            rank=3,
            user_id="user3",
            user_name="王五",
            score=89.7,
            practice_count=42,
            improvement_rate=10.5,
            badges=["⭐"],
        ),
    ]


@router.get("/leaderboard/me")
async def get_my_rank(
    period: str = "week",
    user: User = Depends(get_current_user),
):
    """
    获取我的排名

    Args:
        period: 时间周期
        user: 当前用户

    Returns:
        我的排名信息
    """
    # TODO: 查询用户排名

    return {
        "rank": 15,
        "score": 78.5,
        "practice_count": 25,
        "improvement_rate": 8.3,
        "percentile": 65,  # 超过65%的用户
        "next_rank_gap": 2.5,  # 距离下一名的分数差距
    }


# ============================================
# 最佳实践分享
# ============================================

@router.get("/best-practices", response_model=List[BestPractice])
async def get_best_practices(
    tag: Optional[str] = None,
    limit: int = 20,
    user: User = Depends(get_current_user),
):
    """
    获取最佳实践列表

    Args:
        tag: 标签筛选
        limit: 返回数量
        user: 当前用户

    Returns:
        最佳实践列表
    """
    # TODO: 从数据库查询

    return [
        BestPractice(
            id="bp1",
            title="如何处理价格异议",
            description="客户说太贵时的3种有效应对话术",
            author_id="user1",
            author_name="张三",
            conversation_id="conv123",
            tags=["价格谈判", "异议处理"],
            likes=45,
            created_at="2026-02-01T10:00:00Z",
        ),
    ]


@router.post("/best-practices")
async def share_best_practice(
    conversation_id: str,
    title: str,
    description: str,
    tags: List[str],
    user: User = Depends(get_current_user),
):
    """
    分享最佳实践

    Args:
        conversation_id: 对话ID
        title: 标题
        description: 描述
        tags: 标签
        user: 当前用户

    Returns:
        创建的最佳实践
    """
    # TODO: 保存到数据库

    return {
        "success": True,
        "id": "bp_new",
        "message": "分享成功！",
    }


@router.post("/best-practices/{practice_id}/like")
async def like_best_practice(
    practice_id: str,
    user: User = Depends(get_current_user),
):
    """
    点赞最佳实践

    Args:
        practice_id: 实践ID
        user: 当前用户

    Returns:
        点赞结果
    """
    # TODO: 更新点赞数

    return {
        "success": True,
        "likes": 46,
    }


# ============================================
# 团队挑战
# ============================================

@router.get("/challenges", response_model=List[TeamChallenge])
async def get_challenges(
    status: Optional[str] = None,
    user: User = Depends(get_current_user),
):
    """
    获取团队挑战列表

    Args:
        status: 状态筛选
        user: 当前用户

    Returns:
        挑战列表
    """
    # TODO: 从数据库查询

    return [
        TeamChallenge(
            id="challenge1",
            title="本周销售冲刺",
            description="完成10次高质量练习，争夺周冠军",
            start_date="2026-02-03T00:00:00Z",
            end_date="2026-02-09T23:59:59Z",
            participants=25,
            status="active",
            prize="🏆 冠军奖杯 + 200积分",
        ),
    ]


@router.post("/challenges")
async def create_challenge(
    title: str,
    description: str,
    start_date: str,
    end_date: str,
    prize: Optional[str] = None,
    admin: User = Depends(get_current_admin_user),
):
    """
    创建团队挑战（仅管理员）

    Args:
        title: 标题
        description: 描述
        start_date: 开始时间
        end_date: 结束时间
        prize: 奖励
        admin: 管理员用户

    Returns:
        创建的挑战
    """
    # TODO: 保存到数据库

    return {
        "success": True,
        "id": "challenge_new",
        "message": "挑战创建成功！",
    }


@router.post("/challenges/{challenge_id}/join")
async def join_challenge(
    challenge_id: str,
    user: User = Depends(get_current_user),
):
    """
    加入团队挑战

    Args:
        challenge_id: 挑战ID
        user: 当前用户

    Returns:
        加入结果
    """
    # TODO: 记录参与

    return {
        "success": True,
        "message": "已加入挑战！",
    }


# ============================================
# 团队统计
# ============================================

@router.get("/stats", response_model=TeamStats)
async def get_team_stats(
    period: str = "week",
    user: User = Depends(get_current_user),
):
    """
    获取团队统计数据

    Args:
        period: 时间周期
        user: 当前用户

    Returns:
        团队统计
    """
    # TODO: 计算统计数据

    return TeamStats(
        total_members=50,
        active_members=35,
        total_practices=450,
        avg_score=82.5,
        top_skills=["需求挖掘", "异议处理", "成交技巧"],
        improvement_trend=[75.0, 78.5, 80.2, 82.5],
    )


# ============================================
# 实时对战（WebSocket）
# ============================================

class ConnectionManager:
    """WebSocket连接管理器"""

    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            await connection.send_json(message)


manager = ConnectionManager()


@router.websocket("/battle/{room_id}")
async def battle_websocket(websocket: WebSocket, room_id: str):
    """
    实时对战WebSocket

    Args:
        websocket: WebSocket连接
        room_id: 房间ID
    """
    await manager.connect(websocket)

    try:
        while True:
            # 接收消息
            data = await websocket.receive_json()

            # 广播给房间内所有用户
            await manager.broadcast({
                "room_id": room_id,
                "type": data.get("type"),
                "data": data.get("data"),
                "timestamp": datetime.now().isoformat(),
            })

    except WebSocketDisconnect:
        manager.disconnect(websocket)


# ============================================
# 管理员仪表板
# ============================================

@router.get("/admin/dashboard")
async def get_admin_dashboard(
    admin: User = Depends(get_current_admin_user),
):
    """
    获取管理员仪表板数据

    Args:
        admin: 管理员用户

    Returns:
        仪表板数据
    """
    # TODO: 聚合团队数据

    return {
        "overview": {
            "total_members": 50,
            "active_today": 28,
            "total_practices_today": 85,
            "avg_score_today": 83.2,
        },
        "top_performers": [
            {"name": "张三", "score": 95.5, "practices": 45},
            {"name": "李四", "score": 92.3, "practices": 38},
        ],
        "struggling_members": [
            {"name": "赵六", "score": 65.2, "practices": 12},
        ],
        "skill_gaps": [
            {"skill": "异议处理", "avg_score": 72.5},
            {"skill": "成交技巧", "avg_score": 75.8},
        ],
        "activity_trend": [
            {"date": "2026-02-01", "practices": 75},
            {"date": "2026-02-02", "practices": 82},
            {"date": "2026-02-03", "practices": 78},
            {"date": "2026-02-04", "practices": 85},
        ],
    }


@router.get("/admin/members", response_model=List[TeamMember])
async def get_team_members(
    admin: User = Depends(get_current_admin_user),
):
    """
    获取团队成员列表（仅管理员）

    Args:
        admin: 管理员用户

    Returns:
        成员列表
    """
    # TODO: 从数据库查询

    return [
        TeamMember(
            id="user1",
            name="张三",
            email="zhangsan@example.com",
            role="member",
            joined_at="2026-01-15T10:00:00Z",
        ),
    ]
