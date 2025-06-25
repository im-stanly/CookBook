FROM python:3.11-slim AS runtime

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
 && apt-get install -y --no-install-recommends ffmpeg git \
 && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir --upgrade pip \
 && pip install --no-cache-dir \
        "fastapi" \
        "uvicorn[standard]" \
        "openai-whisper" \
        "python-multipart"

RUN python - <<'PY'
import whisper; whisper.load_model("base")
PY

WORKDIR /app
COPY audioApi.py .

EXPOSE 8000

CMD ["uvicorn", "audioApi:app", "--host", "0.0.0.0", "--port", "8000"]