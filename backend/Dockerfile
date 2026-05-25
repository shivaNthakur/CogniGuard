# backend/Dockerfile
FROM python:3.11-slim
# Set working directory
WORKDIR /app
# Install system dependencies (needed for psycopg2 / asyncpg)
RUN apt-get update && apt-get install -y \
gcc libpq-dev curl \
&& rm -rf /var/lib/apt/lists/*
# Install Python dependencies first (better Docker layer caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
# Copy application code
COPY . .
# Expose port
EXPOSE 8000
# Health check — Docker will restart container if this fails
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
CMD curl -f http://localhost:8000/health || exit 1
# Start command
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
# For development with hot reload use:
# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# Run locally (without Docker):
# pip install -r requirements.txt
# uvicorn main:app --reload --port 8000
# Docs: http://localhost:8000/docs