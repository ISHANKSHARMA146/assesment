from pydantic_settings import BaseSettings
import json
import os


class Settings(BaseSettings):
    database_url: str
    cors_origins: list[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
    ]
    api_v1_prefix: str = "/api/v1"
    
    class Config:
        env_file = ".env"
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        cors_env = os.getenv("CORS_ORIGINS")
        if cors_env:
            try:
                self.cors_origins = json.loads(cors_env)
            except (json.JSONDecodeError, TypeError):
                self.cors_origins = [cors_env] if cors_env else self.cors_origins


settings = Settings()
