from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.routers import hello, client
from app.core.db import prisma
from app.core.auth_middleware import AuthMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
  print("Server Start...")
  await prisma.connect()
  print("Prisma connected.")
  yield
  print("Server Down...")
  await prisma.disconnect()
  print("Prisma disconnected.")

app = FastAPI(lifespan=lifespan)

app.add_middleware(AuthMiddleware)

app.include_router(hello.router)
app.include_router(client.router)
