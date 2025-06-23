# pip install fastapi uvicorn openai-whisper
# uvicorn audioApi:app --host 0.0.0.0 --port 8000
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import whisper
import tempfile, os

app = FastAPI(
    title="Recipe Audio API",
    description="Transcribe WAV files to text",
)

# adjust model size: tiny, base, small, medium, large
model = whisper.load_model("base")


@app.post("/recipe/audio")
async def recipe_audio(file: UploadFile = File(...)):
    """
    Accept a single .wav file and return its transcription.
    """
    if file.content_type not in {"audio/wav", "audio/x-wav"}:
        raise HTTPException(status_code=415, detail="Only .wav files are supported.")

    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    try:
        result = model.transcribe(tmp_path)
        transcript = result["text"].strip()
        return JSONResponse([{"text": transcript}])
    finally:
        os.remove(tmp_path)
