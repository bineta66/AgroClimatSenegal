from fastapi import FastAPI
from app.lifespan import lifespan
# Importe le routeur contenant les endpoints de transcription.
# On renomme router en transcription_router pour avoir un nom plus clair.
from app.routes.transcription import router as transcription_router



# Création de l'application FastAPI.
# Le paramètre lifespan indique à FastAPI :
# "Utilise cette fonction pour gérer le cycle de vie
# de mon application."
app = FastAPI(
    lifespan=lifespan
)

# Ajout des routes de transcription dans l'application.
app.include_router(
    transcription_router
)