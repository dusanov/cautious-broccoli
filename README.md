# Claudia 0.1

Before first run:

`docker volume create --name mongodb_data_container`

## Embedding service

Before first run clone model inside embeddings folder:

    mkdir model  
    cd model  
    git clone https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2


to bring app up:

`
docker-compose up -d --build
`

bring down:

`
docker-compose down
`
