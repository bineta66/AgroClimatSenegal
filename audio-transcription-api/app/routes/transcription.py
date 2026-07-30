# Importe les classes nécessaires de FastAPI.
from fastapi import APIRouter, UploadFile, File, Request

# Importe le schéma de réponse de l'API.
from app.schemas import TranscriptionResponse

# Importe la fonction qui vérifie le format du fichier audio.
from app.utils.audio import prepare_audio

# Importe la fonction qui effectue la transcription.
from app.services.transcription import transcribe_audio


# Création d'un routeur FastAPI.
# Il permet de regrouper les routes liées à la transcription.
router = APIRouter()


# Déclaration de la route POST /transcribe.
# response_model indique que la réponse devra respecter
# la structure définie dans TranscriptionResponse.
@router.post(
    "/transcribe",
    response_model=TranscriptionResponse
)
async def transcribe(
    request: Request,
    file: UploadFile = File(...)
):
    """
    Reçoit un fichier audio, le valide,
    lance la transcription avec Whisper
    puis retourne le résultat.
    """

    # Vérifie que le fichier envoyé est bien un format audio autorisé.
    # Si ce n'est pas le cas, une erreur HTTP 400 est renvoyée.
    await prepare_audio(file)

    # Récupère le modèle Whisper chargé au démarrage
    # de l'application grâce au lifespan.
    model = request.app.state.transcriber

    # Lance la transcription du fichier audio.
    result = await transcribe_audio(
        model,
        file
    )

    # Retourne le résultat au client.
    # FastAPI le convertit automatiquement en JSON
    # et vérifie qu'il respecte TranscriptionResponse.
    return result