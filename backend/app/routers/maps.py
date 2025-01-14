from fastapi import APIRouter
from fastapi.responses import JSONResponse
import httpx
from bs4 import BeautifulSoup

router = APIRouter()

@router.get("/maps", tags=["maps"])
async def scrape_images(url: str):
  async with httpx.AsyncClient() as client:
    response = await client.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    images = [img['src'] for img in soup.find_all('img') if 'src' in img.attrs]

  return JSONResponse(content={"images": images})
