# maksymalnie 60 sekund lub 10 MB
# pip install SpeechRecognition
# uvicorn audioApiNoModel:app --host 0.0.0.0 --port 8000
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import speech_recognition as sr
import tempfile, os

app = FastAPI(title="Recipe Audio API (SR edition)")

@app.post("/recipe/audio")
async def recipe_audio(file: UploadFile = File(...)):
    if file.content_type not in {"audio/wav", "audio/x-wav"}:
        raise HTTPException(415, "Only .wav files are supported.")

    contents = await file.read()
    recognizer = sr.Recognizer()

    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
        tmp.write(contents)
        tmp_path = tmp.name

    try:
        with sr.AudioFile(tmp_path) as source:
            audio = recognizer.record(source)

        transcript = recognizer.recognize_google(audio)           # FREE, 60-s cap
        # transcript = recognizer.recognize_sphinx(audio)         # OFF-LINE, needs pocketsphinx
        # transcript = recognizer.recognize_vosk(audio)           # OFF-LINE, needs vosk

        return JSONResponse([{"text": transcript}])
    except sr.UnknownValueError:
        raise HTTPException(422, "Could not understand audio.")
    except sr.RequestError as e:
        raise HTTPException(503, f"Speech service error: {e}")
    finally:
        os.remove(tmp_path)

