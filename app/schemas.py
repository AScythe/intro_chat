# schemas.py
# Description: Pydantic request models for API endpoint validation — event creation, user join, room assignment, availability toggle, and connection exchange
# ====
from pydantic import BaseModel
from typing import Optional

class CreateEventRequest(BaseModel):
    name: str

class JoinEventRequest(BaseModel):
    username: Optional[str] = None
    linkedin_url: Optional[str] = ''
    slack_handle: Optional[str] = ''

class SetUserRoomRequest(BaseModel):
    room_id: str

class SetAvailabilityRequest(BaseModel):
    available: bool

class ExchangeConnectionRequest(BaseModel):
    user_id: str
    wants_to_connect: bool
