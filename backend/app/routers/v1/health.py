from fastapi import APIRouter
from typing import Dict, Any

router = APIRouter()


@router.get("")
def health_check() -> Dict[str, Any]:
    return {"status": "ok", "version": "1.0.0"}
