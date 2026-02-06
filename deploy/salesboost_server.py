from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import uuid
from datetime import datetime
from typing import List
from pydantic import BaseModel

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=['*'], allow_credentials=True, allow_methods=['*'], allow_headers=['*'])

class CustomerCreate(BaseModel):
    name: str
    age: int
    job: str
    traits: List[str]
    avatar_color: str = "from-blue-200 to-blue-400"

customers = [
    {'id':'1','name':'刁元仁','age':27,'job':'电商/货品采购','traits':['已婚/怀孕1胎预产前'],'description':'27岁·已婚/怀孕1胎预产前·电商/货品采购','creator':'张刚','rehearsal_count':0,'last_rehearsal_time':'今天','avatar_color':'from-blue-200 to-blue-400'},
    {'id':'2','name':'上女士','age':35,'job':'金融/理财','traits':['有车','公益爱好者'],'description':'35岁·金融/理财·有车·公益爱好者','creator':'上芳','rehearsal_count':0,'last_rehearsal_time':'今天','avatar_color':'from-purple-200 to-purple-400'},
    {'id':'3','name':'于宅','age':47,'job':'企业管理','traits':['经常在直播平台购物'],'description':'47岁·企业管理·经常在直播平台购物','creator':'士芳','rehearsal_count':0,'last_rehearsal_time':'昨天','avatar_color':'from-pink-200 to-pink-400'},
    {'id':'4','name':'张小姐','age':29,'job':'设计师','traits':['注重生活品质和物欲'],'description':'29岁·设计师·注重生活品质和物欲','creator':'王邦','rehearsal_count':0,'last_rehearsal_time':'12月15日','avatar_color':'from-orange-200 to-orange-400'},
    {'id':'5','name':'樊理想','age':28,'job':'新媒体运营','traits':['经常熬夜','追求效率'],'description':'28岁·新媒体运营·经常熬夜·追求效率','creator':'李鹏','rehearsal_count':0,'last_rehearsal_time':'12月14日','avatar_color':'from-teal-200 to-teal-400'},
]

@app.get('/')
def root():
    return {'name':'SalesBoost','version':'1.0.0'}

@app.get('/health')
def health():
    return {'status':'ok','timestamp':datetime.now().isoformat()}

@app.get('/health/live')
def health_live():
    return {'status':'healthy','timestamp':datetime.now().isoformat()}

@app.get('/api/v1/customers')
def get_customers():
    return customers

@app.post('/api/v1/customers')
def create_customer(data: CustomerCreate):
    cid=str(uuid.uuid4())
    desc=f"{data['age']}岁·{data['job']}·{'·'.join(data['traits'])}"
    customer={'id':cid,'name':data.name,'age':data.age,'job':data.job,'traits':data.traits,'description':desc,'creator':'当前用户','rehearsal_count':0,'last_rehearsal_time':'刚刚','avatar_color':data.avatar_color}
    customers.append(customer)
    return customer

@app.delete('/api/v1/customers/{cid}')
def delete_customer(cid: str):
    global customers
    customers=[c for c in customers if c['id']!=cid]
    return {'message':'deleted'}

@app.websocket('/ws/chat')
async def ws_endpoint(websocket: WebSocket):
    await websocket.accept()
    await websocket.send_json({'type':'ai_message','content':'您好！我是您的AI销售教练。我们可以进行销售技巧训练。','timestamp':datetime.now().isoformat()})
    try:
        while True:
            d=await websocket.receive_json()
            await websocket.send_json({'type':'ai_message','content':f"我收到了：{d.get('content','')}。让我们继续练习！","timestamp":datetime.now().isoformat()})
    except:
        pass

if __name__ == '__main__':
    uvicorn.run(app,host='0.0.0.0',port=8000)
