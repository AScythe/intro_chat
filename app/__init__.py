# __init__.py
# Description: FastAPI app factory that registers routes, mounts SPA dist, starts the background cleanup thread, and initializes the database on startup
# ====
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI(title="IntroChat")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIST_DIR = os.path.join(BASE_DIR, 'frontend', 'dist')

from .routes import router
app.include_router(router)

FRONTEND_ASSETS_DIR = os.path.join(FRONTEND_DIST_DIR, 'assets')
if os.path.isdir(FRONTEND_ASSETS_DIR):
    app.mount("/assets", StaticFiles(directory=FRONTEND_ASSETS_DIR), name="frontend_assets")

if os.path.isdir(FRONTEND_DIST_DIR):
    from fastapi.responses import HTMLResponse
    frontend_index_path = os.path.join(FRONTEND_DIST_DIR, 'index.html')

    @app.exception_handler(404)
    async def spa_catch_all(request, exc):
        if not request.url.path.startswith('/api/') and request.url.path != '/ws':
            with open(frontend_index_path) as f:
                return HTMLResponse(content=f.read())
        from fastapi.responses import JSONResponse
        return JSONResponse(status_code=404, content={'detail': 'Not found'})

from .tasks import start_cleanup_thread
start_cleanup_thread()

@app.on_event("startup")
async def on_startup():
    from .database import init_db
    from .config import DB_PATH
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    await init_db(DB_PATH)
