from fastapi import UploadFile, HTTPException

# Liste des types MIME autorisés.
# Seuls les fichiers audio ayant l'un de ces formats
# pourront être envoyés à l'API.
ALLOWED_FORMATS = [
    "audio/wav",
    "audio/mpeg",
    "audio/mp3"
]


async def prepare_audio(file: UploadFile):
   

    # Récupère le type MIME du fichier envoyé
    # Exemple :
    # audio/mpeg pour un fichier .mp3
    # audio/wav pour un fichier .wav
    if file.content_type not in ALLOWED_FORMATS:

        # Si le format n'est pas dans la liste des formats autorisés,
        # on arrête immédiatement le traitement et on renvoie
        # une erreur HTTP 400 (Bad Request).
        raise HTTPException(
            status_code=400,
            detail="Format audio non supporté. Formats autorisés : mp3, wav."
        )

    # Si le fichier est valide, on le retourne afin qu'il
    # puisse être utilisé par la fonction de transcription.
    return file