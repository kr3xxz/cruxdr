from fastapi import APIRouter, UploadFile
import os

router = APIRouter()

@router.post("/sigma/upload")
async def upload_sigma(file: UploadFile):

    path = f"/shared/sigma/{file.filename}"

    os.makedirs("/shared/sigma", exist_ok=True)

    with open(path, "wb") as f:
        f.write(await file.read())

    return {
        "status": "uploaded",
        "rule": file.filename
    }
