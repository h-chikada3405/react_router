from fastapi import APIRouter

router = APIRouter()

@router.get("/hello", tags=["hello"])
async def hello():
  return {'hello': 'hello world'}
