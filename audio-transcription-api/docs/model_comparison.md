# Comparatif des modèles de transcription audio évalués sur Hugging Face Hub

## Objectif

Dans le cadre du développement de l'API de transcription audio, plusieurs modèles de reconnaissance vocale ont été étudiés afin de sélectionner le plus adapté aux contraintes du projet (précision, vitesse, consommation mémoire et compatibilité avec le matériel disponible).

Les deux solutions retenues pour l'étude comparative sont :

- **OpenAI Whisper**
- **SYSTRAN Faster-Whisper**

Le modèle finalement utilisé dans le projet est **Whisper Base**.

---

# 1. OpenAI Whisper

## Présentation

Whisper est une famille de modèles de reconnaissance automatique de la parole (Automatic Speech Recognition - ASR) développée par OpenAI.

Ces modèles sont capables de :

- Transcrire un audio en texte.
- Détecter automatiquement la langue.
- Traduire un audio vers l'anglais.
- Générer des timestamps.
- Reconnaître plus de 90 langues.

### Licence

**Apache License 2.0**

Cette licence autorise :

- l'utilisation commerciale ;
- la modification du code ;
- la redistribution ;
- l'intégration dans des projets professionnels.

---

## Les différents modèles Whisper

| Modèle | Paramètres | Vitesse | Précision | Utilisation |
|---------|-----------:|---------|-----------|-------------|
| Tiny | 39 M | Très rapide | Faible | Appareils peu puissants |
| Base | 74 M | Rapide | Bonne | Applications légères |
| Small | 244 M | Moyenne | Très bonne | API et applications web |
| Medium | 769 M | Plus lente | Excellente | Applications professionnelles |
| Large | 1550 M | Lente | Meilleure | Production et recherche |

---

## Capacités

- Reconnaissance vocale
- Détection automatique de langue
- Traduction
- Horodatage
- Support multilingue
- Bonne résistance au bruit

---

## Avantages

- Très bonne qualité
- Documentation officielle
- Intégration simple avec Transformers
- Large communauté

---

## Inconvénients

- Consommation mémoire importante
- Plus lent sur CPU
- Temps d'inférence supérieur à Faster-Whisper

---

# 2. Faster-Whisper

## Présentation

Faster-Whisper est une implémentation optimisée de Whisper développée par SYSTRAN.

Il utilise **CTranslate2**, ce qui permet d'obtenir les mêmes résultats de transcription tout en étant beaucoup plus rapide.

### Licence

**MIT License**

Cette licence permet :

- l'utilisation commerciale ;
- la modification ;
- la redistribution ;
- une intégration très simple dans des projets propriétaires.

---

## Les différents modèles Faster-Whisper

Les tailles correspondent aux modèles Whisper originaux.

| Modèle | Paramètres | Vitesse | Précision | Utilisation |
|---------|-----------:|---------|-----------|-------------|
| Tiny | 39 M | Très rapide | Faible | Temps réel |
| Base | 74 M | Très rapide | Bonne | API légères |
| Small | 244 M | Rapide | Très bonne | Applications web |
| Medium | 769 M | Rapide | Excellente | Production |
| Large-v3 | 1550 M | Rapide | Excellente | Production hautes performances |

---

## Capacités

- Transcription audio
- Détection automatique de langue
- Traduction
- Horodatage
- Quantification INT8
- Optimisation CPU
- Optimisation GPU

---

## Avantages

- Très rapide
- Faible consommation mémoire
- Excellentes performances CPU
- Adapté aux API REST

---

## Inconvénients

- Dépendance supplémentaire (CTranslate2)
- Documentation moins riche que Transformers

---

# Comparatif général

| Critère | Whisper | Faster-Whisper |
|----------|----------|----------------|
| Développeur | OpenAI | SYSTRAN |
| Licence | Apache 2.0 | MIT |
| Support multilingue | Oui | Oui |
| Détection automatique de langue | Oui | Oui |
| Traduction | Oui | Oui |
| Timestamps | Oui | Oui |
| CPU | Moyen | Excellent |
| GPU | Très bon | Excellent |
| Consommation mémoire | Élevée | Faible |
| Intégration avec Transformers | Native | Non |
| Backend | Transformers | CTranslate2 |

---

# Critères d'évaluation

Les modèles ont été évalués selon les critères suivants :

- précision de la transcription ;
- vitesse d'exécution ;
- consommation mémoire ;
- facilité d'intégration avec FastAPI ;
- licence ;
- documentation ;
- compatibilité CPU ;
- prise en charge du multilingue.

---

# Modèle retenu

Le modèle retenu pour ce projet est :

**Whisper Base (OpenAI)**

---

# Justification du choix

Whisper Base a été retenu pour les raisons suivantes :

- bon compromis entre précision et vitesse ;
- consommation mémoire raisonnable ;
- compatible avec un processeur (CPU), sans nécessiter de GPU ;
- intégration simple avec la bibliothèque Transformers ;
- prise en charge de nombreuses langues, dont le français et l'anglais ;
- capacité de détecter automatiquement la langue de l'audio.

Bien que Faster-Whisper soit plus rapide et plus optimisé, Whisper Base répondait pleinement aux besoins du projet et permettait une intégration plus simple avec l'écosystème Hugging Face Transformers.

---

# Conclusion

Les deux familles de modèles offrent une excellente qualité de transcription.

Whisper Base constitue un excellent compromis entre performances, précision et simplicité d'intégration.

Faster-Whisper est davantage destiné aux environnements de production où la rapidité d'exécution et la consommation mémoire sont des critères essentiels.