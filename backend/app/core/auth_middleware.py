from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from jose import JWTError
from app.core.services.oidc_key import OIDCKeyService
from app.core.services.oidc_validator import OIDCValidatorService

class AuthMiddleware(BaseHTTPMiddleware):
  def __init__(self, app):
    super().__init__(app)
    oidc_key = OIDCKeyService()
    self.oidc_validator = OIDCValidatorService(oidc_key)

  async def dispatch(self, request: Request, call_next):
    # swagger ui からのアクセスは認証なし
    referer = request.headers.get("Referer", "No Referer")
    if "/docs" in referer or "/redoc" in referer or "http://localhost:8000/docs" in str(request.url) or "http://localhost:8000/redoc" in str(request.url):
      return await call_next(request)

    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
      raise HTTPException(status_code=401, detail="Token is required")

    token = auth_header.split(" ")[1]
    if not isinstance(token, str):
      raise HTTPException(status_code=403, detail="Invalid token type")

    try:
      payload = self.oidc_validator.verify(token)
      request.state.user = payload
    except JWTError as error:
      raise HTTPException(status_code=403, detail=f"Token verification failed: {str(error)}")

    response = await call_next(request)
    return response
