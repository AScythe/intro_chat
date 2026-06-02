# __init__.py [CLEANUP]
# Description: FastAPI app factory that registers routes, mounts SPA dist, starts the background cleanup thread, and initializes the database on startup
# ====
import logging
import os

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from .config import BASE_DIR, FRONTEND_DIST_DIR, DB_PATH
from .routes_html import router_html
from .routes_api import router_api
from .routes_ws import router_ws
from .tasks import start_cleanup_thread
from .database import init_db
from .handlers import spa_catch_all

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

app = FastAPI(title="IntroChat")

app.include_router(router_html)
app.include_router(router_api)
app.include_router(router_ws)

FRONTEND_ASSETS_DIR = os.path.join(FRONTEND_DIST_DIR, 'assets')
if os.path.isdir(FRONTEND_ASSETS_DIR):
    app.mount("/assets", StaticFiles(directory=FRONTEND_ASSETS_DIR), name="frontend_assets")

if os.path.isdir(FRONTEND_DIST_DIR):
    app.add_exception_handler(404, spa_catch_all)

start_cleanup_thread()

@app.on_event("startup")
async def on_startup() -> None:
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    await init_db(DB_PATH)
