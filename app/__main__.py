# __main__.py
# Description: Application entry point that launches the Uvicorn ASGI server on 127.0.0.1:5000 with hot-reload enabled
# ====
import logging

logger = logging.getLogger(__name__)

import uvicorn
from .config import HOST, PORT

uvicorn.run("app:app", host=HOST, port=PORT, reload=True)
