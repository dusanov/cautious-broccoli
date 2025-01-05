import WebSocket from 'ws';
import * as pug from 'pug';
import { randomUUID } from 'crypto';

const wss = new WebSocket.Server({ port: 8080, path: '/ask' });
let uuid: string

wss.on('connection', (ws: WebSocket) => {
  console.log('Frontend connected');

  ws.on('message', (json_message: string) => {
    const message = JSON.parse(json_message)    
    //return message to ui as a question
    ws.send(pug.renderFile('./templates/question.pug',{text:message.message}))
    //open connection to profetisa
    const profetisa = new WebSocket('ws://localhost:8001/ws');    
    //profetisa events bellow    
    profetisa.on('open', () => {
        console.log('Connected to profetisa');
        //TODO: query embeddings
        // pass the message to profetisa
        profetisa.send(message.message);        
        //send the answer wrapper
        uuid = randomUUID()
        ws.send(pug.renderFile('./templates/answer_container.pug',{containerid:uuid}))    
      });
    profetisa.on('message', (message: string) => {
      // forward response from profetisa
      ws.send(pug.renderFile('./templates/answer.pug',{containerid:uuid,text:message}))    
    });    
    profetisa.on('close', () => {
      console.log('Disconnected from profetisa');
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