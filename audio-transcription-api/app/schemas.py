from pydantic import BaseModel


class Chunk(BaseModel):
    timestamp: tuple[float, float]
    text: str


class TranscriptionResponse(BaseModel):
    filename: str
    language: str
    text: str