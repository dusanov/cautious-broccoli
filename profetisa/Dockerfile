FROM python:3.12-slim AS compile-image
RUN apt-get update
RUN apt-get install -y --no-install-recommends build-essential gcc

COPY requirements.txt .
RUN pip install --user -r requirements.txt

# FROM python:3.12-slim AS build-image
# COPY --from=compile-image /root/.local /root/.local
WORKDIR /code
ADD ./docker-env /code/docker-env
COPY ./src /code/app
ENV PATH=/root/.local/bin:$PATH
CMD ["uvicorn", "app.llama:app", "--host", "0.0.0.0", "--port", "8001", "--env-file", "docker-env", "--log-level","info", "--log-config","app/logging.conf"]