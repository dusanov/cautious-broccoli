FROM python:3.12-slim AS compile-image
RUN apt-get update
RUN apt-get install -y --no-install-recommends build-essential gcc

COPY requirements.txt .
RUN pip install --user -r requirements.txt

FROM python:3.12-slim AS build-image
COPY --from=compile-image /root/.local /root/.local
WORKDIR /code
ADD ./docker-env /code/docker-env
ADD ./cv.html /code/cv.html
COPY ./src /code/app

# Make sure scripts in .local are usable:
ENV PATH=/root/.local/bin:$PATH
EXPOSE 8000
EXPOSE 6333
CMD ["uvicorn", "app.qdrant_embeddings:app", "--host", "0.0.0.0", "--port", "8000", "--env-file", "docker-env"]