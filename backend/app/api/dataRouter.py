import os
from pathlib import Path
from fastapi import APIRouter
from pydantic import BaseModel


router = APIRouter(prefix="/api/data", tags=["data"])


class CsvFilesResponse(BaseModel):
    csv_files: list[str]

@router.get("/csv-files", response_model=CsvFilesResponse)
async def list_csv_files():
    data_dir = Path("app/data")
    files = [
        f
        for f in os.listdir(data_dir)
        if os.path.isfile(os.path.join(data_dir, f)) and f.lower().endswith(".csv")
    ]
    return CsvFilesResponse(csv_files=files)
