import random
import redis
from config import settings

# Connect Redis
redis_client = redis.Redis(
    host=settings.REDIS_HOST,
    port=settings.REDIS_PORT,
    decode_responses=True
)

OTP_EXPIRY_SECONDS = 300  # 5 minutes


def generate_otp():
    return str(random.randint(100000, 999999))


def store_otp(phone: str, otp: str):
    redis_client.setex(f"otp:{phone}", OTP_EXPIRY_SECONDS, otp)


def verify_otp(phone: str, otp: str):
    stored = redis_client.get(f"otp:{phone}")

    if stored and stored == otp:
        redis_client.delete(f"otp:{phone}")
        return True

    return False
