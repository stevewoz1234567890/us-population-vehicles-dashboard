FROM tiangolo/uvicorn-gunicorn-fastapi:latest

COPY . /app
COPY ./requirements.txt /app/requirements.txt

RUN pip install -r /app/requirements.txt