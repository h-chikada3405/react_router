import os
import base64
import requests
from cryptography.hazmat.primitives.asymmetric import ec
from cachetools import TTLCache
from typing import Optional
from jose import jwt, JWTError

class OIDCKeyService:
  def __init__(self):
    # キャッシュの有効期限を12時間に設定
    self.cache = TTLCache(maxsize=1, ttl=12 * 60 * 60)
    self.issuer = os.getenv("OIDC_ISSUER")
    if not self.issuer:
      raise ValueError("OIDC_ISSUER is not set")

  def _get_jwk_url(self) -> str:
    return f"{self.issuer}/oauth/keys"

  def _fetch_public_keys(self) -> dict:
    try:
      response = requests.get(self._get_jwk_url())
      response.raise_for_status()
      return response.json()
    except requests.exceptions.RequestException as error:
      raise ValueError(f"Failed to fetch JWK: {str(error)}")

  def _build_ec_public_key(self, jwk: dict) -> ec.EllipticCurvePublicKey:
    """
    EC公開鍵をJWKから構築
    """
    x = base64.urlsafe_b64decode(jwk["x"] + '==')
    y = base64.urlsafe_b64decode(jwk["y"] + '==')

    curve = ec.SECP256R1()
    encoded_point = b'\x04' + x + y

    try:
      public_key = ec.EllipticCurvePublicKey.from_encoded_point(curve, encoded_point)
    except ValueError as error:
      raise ValueError("Unsupported elliptic curve point type") from error

    return public_key

  def _get_or_build_keys(self) -> dict:
    """
    JWKから公開鍵を構築し、キャッシュに格納
    """
    # キャッシュにすでに構築済みの公開鍵があればそれを返す
    if "public_keys" in self.cache:
      return self.cache["public_keys"]

    # JWKを取得して公開鍵を構築
    jwks = self._fetch_public_keys()
    keys = jwks.get("keys", [])

    public_keys = {}
    for key in keys:
      if key["kty"] == "EC":
        public_key = self._build_ec_public_key(key)
        public_keys[key["kid"]] = public_key

    # 構築済み公開鍵をキャッシュ
    self.cache["public_keys"] = public_keys
    return public_keys

  def get_public_key(self, token: str) -> Optional[ec.EllipticCurvePublicKey]:
    """
    JWTトークンからKIDを抽出し、それに対応する公開鍵を返却
    """
    try:
      # JWTのヘッダー部分をデコードしてKIDを取得
      decoded_header = jwt.get_unverified_header(token)
      kid = decoded_header.get("kid")
      if not kid:
        raise ValueError("KID not found in JWT header")

      # 公開鍵を取得
      public_keys = self._get_or_build_keys()
      public_key = public_keys.get(kid)
      if not public_key:
        raise ValueError(f"Public key for KID {kid} not found")

      return public_key
    except JWTError as error:
      raise ValueError(f"Failed to decode JWT: {str(error)}")
