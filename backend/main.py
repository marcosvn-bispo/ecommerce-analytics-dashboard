from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import dashboard, users

app = FastAPI(title="E-commerce Analytics API V4 (Masterpiece)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrando os modulos divididos
app.include_router(dashboard.router, prefix="/api", tags=["dashboard"])
app.include_router(users.router, prefix="/api/users", tags=["users"])

if __name__ == "__main__":
    import uvicorn
    # Importante usar 'main:app' para o hot-reload funcionar melhor com modulos
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
