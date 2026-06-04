import uvicorn
from app.graph_api import app

uvicorn.run(
    app,
    host="0.0.0.0",
    port=8030
)
