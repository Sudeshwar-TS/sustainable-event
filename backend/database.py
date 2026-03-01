from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from config import settings

engine = create_engine(settings.DATABASE_URL, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# utility: wait until database is accepting connections
# utility: wait until database is accepting connections
import time
from sqlalchemy.exc import OperationalError
from sqlalchemy import text

def wait_for_db(retries: int = 10, delay: float = 1.0):
    """Block until the database is ready or raise after retries."""
    attempt = 0
    while attempt < retries:
        try:
            with engine.connect() as connection:
                connection.execute(text("SELECT 1"))
            print("Database ready.")
            return
        except OperationalError:
            attempt += 1
            print(f"Database not ready. Retrying {attempt}/{retries}...")
            time.sleep(delay)

    # DO NOT raise OperationalError manually
    raise RuntimeError(f"Could not connect to database after {retries} attempts")

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
