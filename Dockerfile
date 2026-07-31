# Use a lightweight Python base image
FROM python:3.10-slim

# Prevent Python from writing .pyc files and enable unbuffered logging
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory inside the container
WORKDIR /app

# Copy dependency requirements first (to leverage Docker layer caching)
COPY requirements.txt .

# Install dependencies without cache to keep container size small
RUN pip install --no-cache-dir -r requirements.txt

# Copy all project files into the container
COPY . .

# Set default port for Google Cloud Run
ENV PORT=8080

# Run Flask backend via Gunicorn WSGI server
CMD exec gunicorn --bind 0.0.0.0:$PORT --workers 1 --threads 8 --timeout 0 api.index:app