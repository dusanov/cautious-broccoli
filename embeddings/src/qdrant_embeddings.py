from fastapi import FastAPI, Request, Response
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from qdrant_client import QdrantClient
from bs4 import BeautifulSoup
from typing import List
import os

class ReturnItem(BaseModel):
        input : str
        embedding : List[str]

class ChatLog(BaseModel):
    message: str
    username: str
    sessionId: str

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

with open("cv.html","r", encoding="utf-8") as cv_html:
    soup = BeautifulSoup(cv_html, 'html.parser')
    divs = [ div.text  for div in soup.find_all('div') 
        if "title" not in div['name'] and "contact" not in div['name'] and "work-experience" not in div['name']]

qdrant_hostname = os.getenv("QDRANT_HOSTNAME", default="localhost")
client = QdrantClient(host=qdrant_hostname, port=6333)
client.add(
    collection_name="test_collection",
    documents=divs
)

print("======= cv collection created ========")

@app.get("/")
def home():
    return JSONResponse(content="=== embedder ===", media_type="application/json")

@app.post("/get-embeddings")
def get_embeddings(input: ChatLog):
    search_result = client.query(
        collection_name="test_collection",
        query_text=input.message,
        score_threshold=0.8, 
        limit=1
    )
    item = ReturnItem(input=input.message, embedding=[ item.document for item in search_result])
    return JSONResponse(content=item.__dict__, media_type="application/json")