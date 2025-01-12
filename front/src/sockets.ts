import WebSocket from 'ws';
import * as pug from 'pug';
import { randomUUID } from 'crypto';

const ws = new WebSocket.Server({ port: 8080, path: '/ask' });
let uuid: string

ws.on('connection', (ws: WebSocket) => {
  console.log('Frontend connected');

  ws.on('message', (json_message: string) => {
    const message = JSON.parse(json_message)    
    //return message to ui as a question
    ws.send(pug.renderFile('./templates/question.pug',{text:message.message}))
    
    const profetisa = new WebSocket('ws://profetisa:8001/ws');    
    profetisa.on('open', () => {
        console.log('Connected to profetisa');
        uuid = randomUUID()
        //query embeddings
        fetch('http://embedder:8000/get-embeddings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: json_message
        })
        .then(response => response.json())
        .then(data => {
          console.log('Embeddings:', data);
          // pass the message to profetisa
          profetisa.send(JSON.stringify(data)); 
          //send the answer wrapper
          ws.send(pug.renderFile('./templates/answer_container.pug',{containerid:uuid}))
        })
        .catch(error => {
          console.error('Error fetching embeddings:', error);
          // pass the message to profetisa anyway
          profetisa.send(JSON.stringify({"input":message.message,"embedding":[]}));
          ws.send(pug.renderFile('./templates/answer_container.pug',{containerid:uuid}))          
        });
      });
    profetisa.on('message', (message: string) => {
      // forward response from profetisa
      ws.send(pug.renderFile('./templates/answer.pug',{containerid:uuid,text:message}))
    });    
    profetisa.on('close', () => {
      console.log('Disconnected from profetisa');
      ws.send(pug.renderFile('./templates/answer_done.pug'))
    });    
    profetisa.on( 'error', (error) => {
        console.log(`There's been an profetisa error: ${error}`);
        //close div (if opened) and send error
    });          
  });

  ws.on('close', () => {
    console.log('Frontend disconnected');
  });

  ws.on( 'error', (error) => {
    console.log(`There's been an frontend socket error: ${error}`);
  });  
});