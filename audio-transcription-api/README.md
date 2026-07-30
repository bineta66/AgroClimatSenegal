# Audio Transcription API

API de transcription audio développée avec **FastAPI** et **OpenAI Whisper Base**. Cette API permet de transcrire un fichier audio en texte et de détecter automatiquement la langue de la transcription.

---

# Fonctionnalités

- Transcription audio en texte
- Détection automatique de la langue
- Validation des formats audio
- API REST avec FastAPI
- Documentation Swagger intégrée

---

# Technologies utilisées

- Python 3.12
- FastAPI
- Uvicorn
- Transformers
- PyTorch
- OpenAI Whisper Base
- LangDetect
- FFmpeg

---

# Installation

## 1. Cloner le projet

```bash
git clone https://github.com/votre-utilisateur/audio-transcription-api.git
cd audio-transcription-api
```

---

## 2. Créer un environnement virtuel

### Linux / macOS

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### Windows

```bash
python -m venv .venv
.venv\Scripts\activate
```

---

## 3. Installer les dépendances Python

```bash
pip install -r requirements.txt
```

---

# Installation des outils de traitement audio

Le modèle Whisper utilise **FFmpeg** pour lire différents formats audio (MP3, WAV, FLAC, OGG, etc.).

## Ubuntu / Debian

```bash
sudo apt update
sudo apt install ffmpeg
```

Vérifier l'installation :

```bash
ffmpeg -version
```

---

## Windows

Télécharger FFmpeg :

https://ffmpeg.org/download.html

Ajouter le dossier **bin** de FFmpeg dans la variable d'environnement **PATH**.

Vérifier :

```bash
ffmpeg -version
```

---

## macOS

```bash
brew install ffmpeg
```

---

# Configuration

Créer un fichier **.env**

```env
MODEL_NAME=openai/whisper-base
DEVICE=cpu
```

---

# Lancer le serveur

```bash
uvicorn app.main:app --reload
```

Le serveur démarre sur :

```
http://127.0.0.1:8000
```

---

# Documentation de l'API

Swagger UI

```
http://127.0.0.1:8000/docs
```

ReDoc

```
http://127.0.0.1:8000/redoc
```

---

# Endpoint disponible

## POST /transcribe

Permet de transcrire un fichier audio.

### Paramètre

| Nom | Type | Description |
|------|------|-------------|
| file | UploadFile | Fichier audio (mp3, wav) |

---

# Exemple avec Swagger

1. Ouvrir

```
http://127.0.0.1:8000/docs
```

2. Cliquer sur **POST /transcribe**

3. Cliquer sur **Try it out**

4. Choisir un fichier audio

5. Cliquer sur **Execute**

---

# Exemple avec cURL

```bash
curl -X POST "http://127.0.0.1:8000/transcribe" \
-F "file=@audio.mp3"
```

---

# Exemple avec Postman

- Méthode : **POST**
- URL :

```
http://127.0.0.1:8000/transcribe
```

Body

- sélectionner **form-data**
- clé :

```
file
```

- type :

```
File
```

- choisir un fichier audio

Cliquer sur **Send**.

---

# Exemple de réponse

```json
{
    "filename": "bonjour.mp3",
    "language": "Français",
    "text": "Bonjour, je m'appelle Bineta."
}
```

---

# Formats audio acceptés

- MP3
- WAV

---

# Structure du projet

```
audio-transcription-api/
│
├── app/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── config.py
│   ├── lifespan.py
│   ├── schemas.py
│   └── main.py
│
├── .env
├── requirements.txt
├── README.md
└── .gitignore
```

---

# Auteur

**Bineta Badiane**