# Importe asynccontextmanager.
# Il permet de créer une fonction qui gère le cycle de vie
from contextlib import asynccontextmanager
from transformers import pipeline
from app.config import MODEL_NAME
# Le décorateur @asynccontextmanager transforme cette fonction
# en gestionnaire de cycle de vie FastAPI.
@asynccontextmanager
async def lifespan(app):
    print("Chargement du modèle Whisper...")
    app.state.transcriber = pipeline(
        "automatic-speech-recognition",
        model=MODEL_NAME
    )
    # Message affiché quand le modèle est prêt.
    print("Modèle Whisper chargé.")
    # yield représente le moment où l'application commence
    # réellement à accepter les requêtes.
    # Pendant que l'API fonctionne :
    # app.state.transcriber contient Whisper
    # Exemple :
    # request.app.state.transcriber(audio)
    yield
    # Cette partie est exécutée quand l'application s'arrête.
    
    print("Arrêt de l'application.")