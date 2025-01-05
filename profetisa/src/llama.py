import os
import logging
from fastapi import FastAPI, Request, WebSocket
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from llama_cpp import Llama

# logging.config.fileConfig('logging.conf', disable_existing_loggers=False)
logger = logging.getLogger(__name__)

model_path = os.getenv("LLAMA_MODEL_DIR_PATH", default="/model/llama-2-7b-chat.Q2_K.gguf")
llm = Llama(model_path=model_path, chat_format="llama-2")

# TODO constrain this
# origins = ['http://localhost:3001']
origins = ["*"]
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return JSONResponse(content="=== profetisa ===", media_type="application/json")

@app.websocket("/ws")
async def ask(websocket: WebSocket):
    await websocket.accept()
    text = await websocket.receive_text()
    # logger.info(f" == received: {text}")
    #TODO check this prompt format
    messages = [
    {"role": "system", "content": "You are a drunk russian fortune teller who speaks in riddles. At the beginning of the chat you will first ask for some information about the client."},
    {
        "role":"user",
        "content": f"{text}"
    }]    
    # while True:
    output = llm.create_chat_completion(
        messages = messages,
        stream = True
    )
    for chunk in output:
        delta = chunk['choices'][0]['delta']
        if 'role' in delta:
            logger.info(" ==== role ===== " + delta['role']) #, end=': ')
            # await websocket.send_text(delta['role'])
        elif 'content' in delta:
            await websocket.send_text(delta['content'])
    await websocket.close()