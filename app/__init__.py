# __init__.py
# Description: FastAPI app factory that initializes the server, mounts static files, registers routes via APIRouter, starts the background cleanup thread, and initializes the database on startup
# ====
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import os

app = FastAPI(title="IntroChat")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static')
TEMPLATE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'templates')

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

templates = Jinja2Templates(directory=TEMPLATE_DIR)

from .routes import router
app.include_router(router)

from .tasks import start_cleanup_thread
start_cleanup_thread()

@app.on_event("startup")
async def on_startup():
    from .database import init_db
    from .config import DB_PATH
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    await init_db(DB_PATH)
