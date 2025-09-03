# ------------ Base Image ------------
FROM python:3.11-slim

# ------------ Environment Variables ------------
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# ------------ Set Workdir ------------
WORKDIR /app

# ------------ Install System Dependencies ------------
RUN apt-get update && apt-get install -y \
    wget curl unzip gnupg \
    chromium-driver \
    chromium \
    libglib2.0-0 libnss3 libfontconfig1 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 \
    libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates \
    fonts-liberation libappindicator3-1 xdg-utils \
    && rm -rf /var/lib/apt/lists/*

# ------------ Copy Project Files ------------
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# ------------ Expose FastAPI Port ------------
EXPOSE 8000

# ------------ Run FastAPI ------------
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
