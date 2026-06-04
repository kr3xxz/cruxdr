from fastapi import APIRouter, UploadFile, File
from app.store.rules import sigma_rules
from app.core.loader import SigmaLoader
import os

router = APIRouter()

@router.post("/upload")
async def upload_rule(
    file: UploadFile = File(...)
):

    path = f"app/rules/{file.filename}"

    with open(path, "wb") as f:
        f.write(await file.read())

    sigma_rules.clear()

    SigmaLoader.load_rules()

    return {
        "message": "uploaded",
        "file": file.filename
    }
