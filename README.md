# Claudia 0.1

## Before first run:

`docker volume create --name mongodb_data_container`

### Embedding service

Before first run clone model inside embeddings folder:

    mkdir model  
    cd model  
    git clone https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2


### Profetisa

Before first run under profetisa folder create model folder and download llama model into it:
  ```
  mkdir model
  cd model
  curl -L -O https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7b-chat.Q2_K.gguf
  ```
## Running

to bring app up:

`
docker-compose up -d --build
`

bring down:

`
docker-compose down
`
