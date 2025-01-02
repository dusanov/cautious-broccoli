FROM python:3.9
WORKDIR /code
ADD ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt
ADD ./docker-env /code/docker-env
COPY ./src /code/app
CMD ["uvicorn", "app.llama:app", "--host", "0.0.0.0", "--port", "8001", "--env-file", "docker-env", "--log-level","info", "--log-config","app/logging.conf"]