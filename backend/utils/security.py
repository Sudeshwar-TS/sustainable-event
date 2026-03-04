from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt
from config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password: str):
    if not password:
        raise ValueError("Password cannot be empty")

    # Force max 72 bytes for bcrypt
    password_bytes = password.encode("utf-8")[:72]
    password_clean = password_bytes.decode("utf-8", errors="ignore")

    return pwd_context.hash(password_clean)


def verify_password(plain_password: str, hashed_password: str):
    plain_password_bytes = plain_password.encode("utf-8")[:72]
    plain_password_clean = plain_password_bytes.decode("utf-8", errors="ignore")

    return pwd_context.verify(plain_password_clean, hashed_password)


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None
