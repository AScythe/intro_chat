# handlers.py [CLEANUP]
# Description: HTTP exception handlers for the FastAPI app — SPA catch-all for client-side routing
# ====
import os
from fastapi import Request, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from .config import FRONTEND_DIST_DIR


async def spa_catch_all(request: Request, exc: HTTPException) -> HTMLResponse | JSONResponse:
    if not request.url.path.startswith('/api/') and request.url.path != '/ws':
        frontend_index_path = os.path.join(FRONTEND_DIST_DIR, 'index.html')
        with open(frontend_index_path) as f:
            return HTMLResponse(content=f.read())
    return JSONResponse(status_code=404, content={'detail': 'Not found'})
