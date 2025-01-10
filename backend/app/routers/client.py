from fastapi import APIRouter

router = APIRouter()

@router.get("/client", tags=["client"])
async def get_all_client():

  return {'users': 'worlsd'}
