# Claudia 0.1 - Dusanov embedded resume gpt

Talk to my resume :) 
Exercise in RAG embedding, htmx, node and python

## Before first run:

After cloning the project:

### Profetisa

Before first run, under profetisa folder create model folder and download llm model into it ( 4.1G ):
  ```
  mkdir model
  cd model
  wget -c https://huggingface.co/TheBloke/OpenHermes-2.5-Mistral-7B-GGUF/resolve/main/openhermes-2.5-mistral-7b.Q4_K_M.gguf
  ```
## Running

to bring app up:

`
docker-compose up -d --build
`

Please note that it will take a while to build everything ( 713.1s on my box ). Also, on the first run embedder service will start the download of embedding model / library so it will be unresponsive on first couple of requests.

Embeddings can be monitored by looking at the logs:

`
docker logs claudia-front --follow
`

To bring everything down:

`
docker-compose down
`

### Example question
`
What period and what did Dusan work on at the Smartcat doo company from Novi Sad ?
`