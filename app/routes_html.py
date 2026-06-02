# routes_html.py
# Description: HTML route handlers — SPA index page serving
# ====
import os
from fastapi import APIRouter
from fastapi.responses import HTMLResponse
from .config import FRONTEND_DIST_DIR

router_html = APIRouter()


@router_html.get('/')
async def index() -> HTMLResponse:
    with open(os.path.join(FRONTEND_DIST_DIR, 'index.html')) as f:
        return HTMLResponse(content=f.read())
