"""
User-related database models

用户相关的数据库模型
- UserProfile: 用户基本信息
- UserOnboarding: 新手引导状态
- UserPreferences: 用户偏好设置

Author: Claude (Anthropic)
Date: 2026-02-06
"""

from datetime import datetime
from typing import Optional

from sqlalchemy import JSON, Boolean, Column, DateTime, Integer, String, Text
from sqlalchemy.orm import relationship

from models.base import Base


class UserProfile(Base):
    """用户档案表"""

    __tablename__ = "user_profiles"

    id = Column(String(36), primary_key=True, index=True)  # Supabase UUID
    email = Column(String(255), unique=True, nullable=False, index=True)
    full_name = Column(String(255))
    avatar_url = Column(String(512))
    role = Column(String(50), default="user", nullable=False)  # user, admin, manager
    department = Column(String(100))
    position = Column(String(100))
    phone = Column(String(50))

    # 状态
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)

    # 时间戳
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    last_login_at = Column(DateTime)

    # 关系
    onboarding = relationship("UserOnboarding", back_populates="user", uselist=False, cascade="all, delete-orphan")
    preferences = relationship("UserPreferences", back_populates="user", uselist=False, cascade="all, delete-orphan")

    def __repr__(self):
        return f"<UserProfile(id={self.id}, email={self.email}, role={self.role})>"


class UserOnboarding(Base):
    """用户新手引导状态表"""

    __tablename__ = "user_onboarding"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(36), nullable=False, unique=True, index=True)

    # 引导状态
    is_complete = Column(Boolean, default=False, nullable=False)
    current_step = Column(Integer, default=0, nullable=False)
    total_steps = Column(Integer, default=5, nullable=False)

    # 完成/跳过信息
    completed_at = Column(DateTime)
    skipped_at = Column(DateTime)
    skip_reason = Column(String(255))

    # 引导数据（JSON格式存储已完成的步骤等）
    completed_steps = Column(JSON, default=list)
    metadata = Column(JSON, default=dict)

    # 时间戳
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # 关系
    user = relationship("UserProfile", back_populates="onboarding")

    def __repr__(self):
        return f"<UserOnboarding(user_id={self.user_id}, is_complete={self.is_complete}, step={self.current_step})>"


class UserPreferences(Base):
    """用户偏好设置表"""

    __tablename__ = "user_preferences"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(36), nullable=False, unique=True, index=True)

    # 自定义客户画像（JSON数组）
    custom_personas = Column(JSON, default=list)

    # AI教练风格设置（JSON对象）
    coach_style = Column(JSON, default=dict)

    # 训练难度设置（JSON对象）
    training_difficulty = Column(JSON, default=dict)

    # 数据导出设置（JSON对象）
    data_export_settings = Column(JSON, default=dict)

    # 通知设置（JSON对象）
    notification_settings = Column(JSON, default=dict)

    # 界面设置（JSON对象）
    ui_settings = Column(JSON, default=dict)

    # 其他偏好设置
    language = Column(String(10), default="zh-CN")
    timezone = Column(String(50), default="Asia/Shanghai")
    theme = Column(String(20), default="light")

    # 时间戳
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # 关系
    user = relationship("UserProfile", back_populates="preferences")

    def __repr__(self):
        return f"<UserPreferences(user_id={self.user_id}, language={self.language}, theme={self.theme})>"


class TeamMember(Base):
    """团队成员表"""

    __tablename__ = "team_members"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(36), nullable=False, index=True)
    team_id = Column(String(36), nullable=False, index=True)

    # 成员信息
    role = Column(String(50), default="member")  # leader, member, observer
    join_date = Column(DateTime, default=datetime.utcnow, nullable=False)

    # 统计数据
    total_trainings = Column(Integer, default=0)
    total_score = Column(Integer, default=0)
    average_score = Column(Integer, default=0)
    best_score = Column(Integer, default=0)

    # 排名数据
    team_rank = Column(Integer)
    global_rank = Column(Integer)

    # 时间戳
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<TeamMember(user_id={self.user_id}, team_id={self.team_id}, role={self.role})>"


class TeamLeaderboard(Base):
    """团队排行榜表"""

    __tablename__ = "team_leaderboard"

    id = Column(Integer, primary_key=True, autoincrement=True)
    team_id = Column(String(36), nullable=False, index=True)

    # 团队信息
    team_name = Column(String(255), nullable=False)
    manager_name = Column(String(255))
    member_count = Column(Integer, default=0)

    # 统计数据
    total_trainings = Column(Integer, default=0)
    average_score = Column(Integer, default=0)
    growth_rate = Column(Integer, default=0)  # 提升百分比

    # 排名
    rank = Column(Integer, index=True)
    previous_rank = Column(Integer)

    # 优势和弱势（JSON数组）
    advantages = Column(JSON, default=list)
    weaknesses = Column(JSON, default=list)
    recommendations = Column(JSON, default=list)

    # 时间戳
    period_start = Column(DateTime, nullable=False)
    period_end = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<TeamLeaderboard(team_id={self.team_id}, rank={self.rank}, score={self.average_score})>"


class UserAchievement(Base):
    """用户成就表"""

    __tablename__ = "user_achievements"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(36), nullable=False, index=True)

    # 成就信息
    achievement_type = Column(String(50), nullable=False)  # training_count, high_score, streak, etc.
    achievement_name = Column(String(255), nullable=False)
    achievement_description = Column(Text)
    achievement_icon = Column(String(255))

    # 进度
    current_value = Column(Integer, default=0)
    target_value = Column(Integer, nullable=False)
    is_completed = Column(Boolean, default=False)

    # 奖励
    reward_points = Column(Integer, default=0)
    reward_badge = Column(String(255))

    # 时间戳
    unlocked_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<UserAchievement(user_id={self.user_id}, name={self.achievement_name}, completed={self.is_completed})>"
