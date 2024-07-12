# Use the official Python image from the Docker Hub
FROM python:3.10-slim

# Set the working directory
WORKDIR /app

# Install Python dependencies
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Install node and npm
RUN apt-get update && apt-get install -y nodejs npm

# Copy backend project files
COPY inkwell_backend/ .

# Copy frontend files
COPY inkwell-frontend/ /app/frontend

# Build frontend
WORKDIR /app/frontend
RUN npm install
RUN npm run build

# Move back to the main app directory
WORKDIR /app

# Collect static files
RUN python manage.py collectstatic --noinput

# Expose port 8000
EXPOSE 8000

# Run the application
CMD ["gunicorn", "inkwell_backend.wsgi:application", "--bind", "0.0.0.0:$PORT"]
