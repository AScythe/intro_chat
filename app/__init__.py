# __init__.py
# Description: FastAPI app factory that registers routes, mounts SPA dist, starts the background cleanup thread, and initializes the database on startup
# ====
import logging
import os
import time
from collections import defaultdict

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
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

is_production = os.environ.get("ENV", "").lower() == "production"
if is_production:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5000"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

if is_production:
    RATE_LIMIT_WINDOW = 60
    RATE_LIMIT_MAX = 30
    _request_counts: dict[str, list[float]] = defaultdict(list)


    @app.middleware("http")
    async def rate_limit_middleware(request: Request, call_next):
        if request.method == "POST":
            client_ip = request.client.host if request.client else "unknown"
            now = time.time()
            window_start = now - RATE_LIMIT_WINDOW
            _request_counts[client_ip] = [t for t in _request_counts[client_ip] if t > window_start]
            if len(_request_counts[client_ip]) >= RATE_LIMIT_MAX:
                raise HTTPException(status_code=429, detail="Rate limit exceeded")
            _request_counts[client_ip].append(now)
        response = await call_next(request)
        return response


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
