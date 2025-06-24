# pip install fastapi uvicorn openai-whisper
# install ffmpeg
# uvicorn audioApi:app --host 0.0.0.0 --port 8000
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import whisper, tempfile, os, re

app = FastAPI(
    title="Recipe Audio API",
    description="Transcribe WAV files to text",
)

model = whisper.load_model("base")

def format_ingredients(raw: str) -> str:
    cleaned = re.sub(r"[^A-Za-z\s]", " ", raw)
    tokens = cleaned.split()

    pairs = []
    for i in range(0, len(tokens) - 1, 2):
        ingredient = tokens[i].capitalize()
        unit       = tokens[i + 1].capitalize()
        pairs.append(f"{ingredient} {unit}")

    return ", ".join(pairs)

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
        formatted = format_ingredients(transcript)

        return JSONResponse({"text": formatted})
    finally:
        os.remove(tmp_path)
