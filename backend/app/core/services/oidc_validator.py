import os
from app.core.services.oidc_key import OIDCKeyService
from jose import jwt, JWTError
from cryptography.hazmat.primitives import serialization

class OIDCValidatorService:
  def __init__(self, oidc_key_service: OIDCKeyService):
    self.oidc_key = oidc_key_service

  def verify(self, token: str):
    try:
      public_key = self.oidc_key.get_public_key(token)

      if not public_key:
        raise ValueError("Public key not found")

      public_key_pem = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
      )

      # EC公開鍵から JWT の署名を検証
      payload = jwt.decode(
        token,
        public_key_pem,
        algorithms=[os.getenv("OIDC_ID_TOKEN_ALG", "ES256")],
        audience=os.getenv("OIDC_CLIENT_ID"),
        issuer=os.getenv("OIDC_ISSUER"),
      )

      return payload
    except JWTError as error:
      raise ValueError(f"Token verification failed: {str(error)}")
