import * as pug from 'pug'
import express from 'express'
import expressWs from 'express-ws'
import cors from 'cors';
import * as http from 'http'

const bodyParser = require('body-parser');
const mongoose = require('./mongo/mongoose.js')

const PORT = process.env.PORT || 3001
const corsOptions = {
  credentials: true,
  origin: ['http://localhost:3000', 'http://localhost:80'] 
};

let app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine','pug');
const server = new http.Server(app)
const ws = expressWs(app);
// const ws = expressWs(app,server);
const askChannel  = ws.getWss();

ws.app.get('/',(req,res) => {
  res.send(pug.renderFile('./templates/holamundo.pug'))
})

ws.app.post("/ask", async (req,res) => {
  const data = await mongoose.Response.findOne({id:0})
  console.log('/ask post')
  res.send(pug.render(
      data.content,
      {name: 'Miss C herself'}
  ))  
})

ws.app.ws('/ask', async function(ws, req) {
  console.log('/ask ws  ')
  ws.on('message', async function(msg: any) {
    const whateva  = JSON.parse(msg);
    console.log('whateva', whateva)
    askChannel.clients.forEach(client => {
      client.send(pug.renderFile('./templates/question.pug',{text:whateva.message}))
    });    
    setTimeout(async function() {
      const data = await mongoose.Response.findOne({id:0})
      askChannel.clients.forEach(client => {
        client.send(pug.renderFile('./templates/answer.pug',{
           text: prepareResponse(data.content, {name: whateva.username})
      }))
      });              
    }, 1000);    
  });
});

function prepareResponse(content: String, parmams: any) {
  //TODO
  return "this is hardcode prepared response from mongo"
}

ws.app.listen(PORT, () => {
  console.log('La madama C BACK se está ejecutando en el puerto: ', PORT);
});
