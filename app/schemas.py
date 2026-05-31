# schemas.py
# Description: Pydantic request models for API endpoint validation — event creation, user join, room assignment, availability toggle, and connection exchange
# ====
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

from pydantic import BaseModel


class CreateEventRequest(BaseModel):
    name: str

class JoinEventRequest(BaseModel):
    username: str | None = None
    linkedin_url: str | None = ''
    slack_handle: str | None = ''

class SetUserRoomRequest(BaseModel):
    room_id: str

class SetAvailabilityRequest(BaseModel):
    available: bool

class ExchangeConnectionRequest(BaseModel):
    user_id: str
    wants_to_connect: bool
