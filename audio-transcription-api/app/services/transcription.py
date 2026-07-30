import os
import shutil
import uuid

# Bibliothèque permettant de détecter automatiquement
# la langue d'un texte transcrit.
from langdetect import detect, LangDetectException


# Dictionnaire permettant de convertir les codes de langue
# (fr, en, es...) en noms plus lisibles.
LANGUAGES = {
    "fr": "Français",
    "en": "Anglais",
    "es": "Espagnol",
    "de": "Allemand",
    "it": "Italien",
    "pt": "Portugais",
    "ar": "Arabe"
}


async def transcribe_audio(model, file):
  
    # Récupère l'extension du fichier (.mp3, .wav...)
    extension = os.path.splitext(file.filename)[1]

    # Génère un nom de fichier temporaire unique.
    # Exemple :
    # temp_4d2b6c7f-98c0-4a2d-b6b5-6f7d8e9c0a12.mp3
    temp_filename = f"temp_{uuid.uuid4()}{extension}"

    try:

        # Crée un fichier temporaire en mode écriture binaire ("wb")
        # puis copie le contenu du fichier envoyé dans ce fichier.
        with open(temp_filename, "wb") as buffer:
            shutil.copyfileobj(
                file.file,
                buffer
            )

        # Lance la transcription avec Whisper.
        # return_timestamps=True permet d'obtenir les timestamps
        # si le modèle les fournit.
        result = model(
            temp_filename,
            return_timestamps=True
        )

        # Récupère le texte complet transcrit.
        text = result["text"]

        # Détecte automatiquement la langue du texte transcrit.
        try:

            # Renvoie un code de langue (fr, en, es...)
            lang_code = detect(text)

            # Convertit le code en nom complet.
            # Si le code n'existe pas dans le dictionnaire,
            # on retourne directement le code.
            language = LANGUAGES.get(
                lang_code,
                lang_code
            )

        except LangDetectException:
            # Si la langue ne peut pas être détectée
            # (texte vide ou trop court), on indique "Inconnue".
            language = "Inconnue"

        # Construit la réponse de l'API.
        return {
            "filename": file.filename,
            "language": language,
            "text": text,
        }

    finally:

        # Cette partie est exécutée dans tous les cas
        # (succès ou erreur).

        # Vérifie que le fichier temporaire existe.
        if os.path.exists(temp_filename):

            # Supprime le fichier temporaire afin de ne pas
            # encombrer le disque.
            os.remove(temp_filename)