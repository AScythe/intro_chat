# __main__.py
# Description: Application entry point that launches the Uvicorn ASGI server on 127.0.0.1:5000 with hot-reload enabled
# ====
import logging

logger = logging.getLogger(__name__)

import os
import uvicorn
from .config import HOST, PORT

reload_enabled = os.environ.get('UVICORN_RELOAD', 'true').lower() == 'true'
uvicorn.run("app:app", host=HOST, port=PORT, reload=reload_enabled)
