from pydantic import BaseModel

class NormalizedEvent(BaseModel):
    timestamp: str | None = None
    event_type: str | None = None
    user: str | None = None
    source_ip: str | None = None
    destination_ip: str | None = None
    asset: str | None = None
    action: str | None = None
    status: str | None = None
    category: str | None = None
    raw: str
