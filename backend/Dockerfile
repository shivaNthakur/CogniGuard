# Use a lightweight Python base image
FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file first (optimizes Docker caching)
COPY requirements.txt .

# Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your application code into the container
COPY . .

# Expose port 8000 so Siddharth's docker-compose can route traffic to it
EXPOSE 8000

# The command to start your FastAPI server when the container runs
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]



# Run locally (without Docker):
# pip install -r requirements.txt
# uvicorn main:app --reload --port 8000
# Docs: http://localhost:8000/docs