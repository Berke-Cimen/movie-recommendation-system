"""ML Service main module with FastAPI and Socket.IO support."""

import socketio
from fastapi import FastAPI

from app.api.routes import router

# Create Socket.IO server with ASGI async mode
sio = socketio.AsyncServer(async_mode="asgi")

# Create FastAPI app
app = FastAPI(title="Movie Recommendation ML Service")

# Include API routes
app.include_router(router, prefix="/api")


@sio.event
async def connect(sid, environ):
    """Handle client connection."""
    print(f"Client connected: {sid}")
    await sio.emit("connected", {"status": "connected"}, to=sid)


@sio.event
async def disconnect(sid):
    """Handle client disconnection."""
    print(f"Client disconnected: {sid}")


@sio.event
async def rating_received(sid, data):
    """Handle rating event from client."""
    print(f"Rating received from {sid}: {data}")
    await sio.emit("rating_acknowledged", {"status": "received", "data": data}, to=sid)


# Mount Socket.IO ASGI app
socket_app = socketio.ASGIApp(sio, app)

# For uvicorn: use socket_app as the application
app = socket_app
