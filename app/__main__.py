# __main__.py
# Description: Application entry point that launches the SocketIO server on 0.0.0.0:5000 with debug mode enabled
# ====

from . import socketio, app
socketio.run(app, debug=True, host='0.0.0.0', port=5000)
