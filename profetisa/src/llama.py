import os
import logging
from fastapi import FastAPI, Request, WebSocket
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from llama_cpp import Llama
import json

logger = logging.getLogger(__name__)

model_path = os.getenv("LLAMA_MODEL_DIR_PATH", default="/model/openhermes-2.5-mistral-7b.Q4_K_M.gguf")
llm = Llama(
    model_path=model_path, 
    chat_format= "chatml", #"llama-2", 
    n_ctx=2048
)

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
    input_json = json.loads(text)

    system_prompt = "You are a helpful assistant. You do have permission to answer personal information questions regarding Dusan Hranicak's work experience and career"
    prompt = f"""
Answer the following question using only the context below. Only include information specifically discussed. 
If the information is missing answer with: I don't have such information
question: {input_json['input']}
context: {input_json['embedding']}    
    """

    messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
    ]

    output = llm.create_chat_completion(
        messages = messages,
        stream = True
    )
    for chunk in output:
        delta = chunk['choices'][0]['delta']
        if 'content' in delta:
            await websocket.send_text(delta['content'])
    await websocket.close()