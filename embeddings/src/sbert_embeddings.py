import os
from sentence_transformers import SentenceTransformer, util
from fastapi import FastAPI, Request, Response
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch
import numpy as np
from pymongo import MongoClient 

from typing import List

class ReturnItem(BaseModel):
    def __init__(self, input: str, embedding: List[float]):
        self.input = input
        self.embedding = embedding

class ChatLog(BaseModel):
    message: str
    username: str
    sessionId: str


model_path = os.getenv("E_MODEL_DIR_PATH", default="./model/all-MiniLM-L6-v2")
model = SentenceTransformer(model_path)
mongo = MongoClient("mongodb://user1:user1@mongo:27017/claudia") 

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
print(" === embedder === ")

@app.get("/")
def home():
    return JSONResponse(content="=== embedder ===", media_type="application/json")

# TODO input should be post body not query param
@app.post("/get-embeddings")
def get_embeddings(input: str):
    print("get embeddings, input:",input)
    embedding = model.encode(input)
    item = ReturnItem(input=input, embedding=embedding.tolist())
    return JSONResponse(content=item.__dict__, media_type="application/json")

@app.post("/get-similar")
def get_embeddings(input: ChatLog):
    print("get similar:", input)
    query_embedding = model.encode(input.message, convert_to_tensor=True)
    session_logs = np.array( 
        list(mongo.claudia.logs.find({"username": input.username, "sessionId":input.sessionId}))
    )
    print(" --- session logs size:", len(session_logs))
    if len(session_logs) > 0:
        corpus = [log['input'] for log in session_logs ]
        corpus_embeddings = [log['embedding'] for log in session_logs ]
        top_k = min(5, len(corpus))
        cos_scores = util.cos_sim(query_embedding, corpus_embeddings)[0]
        top_results = torch.topk(cos_scores, k=top_k)
        insert_log(input, query_embedding)
        return JSONResponse(
            content= [ {"input":corpus[idx], "score":"%.4f" % float(score)} for score, idx in zip(top_results[0], top_results[1])], 
            media_type="application/json", status_code=200)
    else:
        insert_log(input, query_embedding)
        return Response(content=None,status_code=204)
    
def insert_log(input, embedding):
    mongo.claudia.logs.insert_one({
            "username": input.username, 
            "sessionId":input.sessionId, 
            "type":"QUESTION",
            "input":input.message,
            "embedding":list(embedding.numpy().astype(float))
        })    