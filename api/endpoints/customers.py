"""
Customers API Endpoints - Customer Persona Management
"""
import logging
import uuid
from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db_session
from api.deps import audit_access, require_user
from api.auth_schemas import UserSchema as User

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/customers", tags=["customers"], dependencies=[Depends(require_user), Depends(audit_access)])


class CustomerCreate(BaseModel):
    name: str
    age: int
    job: str
    traits: List[str]
    avatar_color: str = "from-blue-200 to-blue-400"


class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    job: Optional[str] = None
    traits: Optional[List[str]] = None
    avatar_color: Optional[str] = None


class CustomerResponse(BaseModel):
    id: str
    name: str
    age: int
    job: str
    traits: List[str]
    description: str
    creator: str
    rehearsal_count: int
    last_rehearsal_time: str
    avatar_color: str


# In-memory storage for demo purposes (can be replaced with database)
_customers_store: dict[str, dict] = {
    "1": {
        "id": "1",
        "name": "刁元仁",
        "age": 27,
        "job": "电商/货品采购",
        "traits": ["已婚/怀孕1胎预产前"],
        "description": "27岁 · 已婚/怀孕1胎预产前 · 电商/货品采购",
        "creator": "张刚",
        "rehearsal_count": 0,
        "last_rehearsal_time": "今天 17:29",
        "avatar_color": "from-blue-200 to-blue-400",
    },
    "2": {
        "id": "2",
        "name": "上女士",
        "age": 35,
        "job": "金融/理财",
        "traits": ["有车", "公益爱好者"],
        "description": "35岁 · 金融/理财 · 有车 · 公益爱好者",
        "creator": "上芳",
        "rehearsal_count": 0,
        "last_rehearsal_time": "今天 15:20",
        "avatar_color": "from-purple-200 to-purple-400",
    },
    "3": {
        "id": "3",
        "name": "于宅",
        "age": 47,
        "job": "企业管理",
        "traits": ["经常在直播平台购物"],
        "description": "47岁 · 企业管理 · 经常在直播平台购物",
        "creator": "士芳",
        "rehearsal_count": 0,
        "last_rehearsal_time": "昨天 23:16",
        "avatar_color": "from-pink-200 to-pink-400",
    },
}


@router.get("", response_model=List[CustomerResponse])
async def list_customers(current_user: User = Depends(require_user)):
    """
    Get all customer personas
    """
    logger.info(f"User {current_user.email} fetching all customers")
    return list(_customers_store.values())


@router.get("/{customer_id}", response_model=CustomerResponse)
async def get_customer(customer_id: str, current_user: User = Depends(require_user)):
    """
    Get a specific customer by ID
    """
    if customer_id not in _customers_store:
        raise HTTPException(status_code=404, detail="Customer not found")
    return _customers_store[customer_id]


@router.post("", response_model=CustomerResponse, status_code=201)
async def create_customer(
    data: CustomerCreate,
    current_user: User = Depends(require_user),
    db: AsyncSession = Depends(get_db_session)
):
    """
    Create a new customer persona
    """
    customer_id = str(uuid.uuid4())
    description = f"{data.age}岁 · {data.job} · {' · '.join(data.traits)}"

    customer = {
        "id": customer_id,
        "name": data.name,
        "age": data.age,
        "job": data.job,
        "traits": data.traits,
        "description": description,
        "creator": current_user.email.split("@")[0],
        "rehearsal_count": 0,
        "last_rehearsal_time": "刚刚",
        "avatar_color": data.avatar_color,
    }

    _customers_store[customer_id] = customer
    logger.info(f"User {current_user.email} created customer {data.name}")

    return customer


@router.patch("/{customer_id}", response_model=CustomerResponse)
async def update_customer(
    customer_id: str,
    data: CustomerUpdate,
    current_user: User = Depends(require_user)
):
    """
    Update a customer persona
    """
    if customer_id not in _customers_store:
        raise HTTPException(status_code=404, detail="Customer not found")

    customer = _customers_store[customer_id]

    # Update fields
    if data.name is not None:
        customer["name"] = data.name
    if data.age is not None:
        customer["age"] = data.age
    if data.job is not None:
        customer["job"] = data.job
    if data.traits is not None:
        customer["traits"] = data.traits
    if data.avatar_color is not None:
        customer["avatar_color"] = data.avatar_color

    # Update description
    customer["description"] = f"{customer['age']}岁 · {customer['job']} · {' · '.join(customer['traits'])}"

    logger.info(f"User {current_user.email} updated customer {customer_id}")
    return customer


@router.delete("/{customer_id}")
async def delete_customer(
    customer_id: str,
    current_user: User = Depends(require_user)
):
    """
    Delete a customer persona
    """
    if customer_id not in _customers_store:
        raise HTTPException(status_code=404, detail="Customer not found")

    del _customers_store[customer_id]
    logger.info(f"User {current_user.email} deleted customer {customer_id}")

    return {"message": "Customer deleted successfully"}
