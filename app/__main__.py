from . import socketio, app
socketio.run(app, debug=True, host='0.0.0.0', port=5000)
