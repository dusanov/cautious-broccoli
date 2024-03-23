import * as pug from 'pug'
import express from 'express'
import cors from 'cors';

const port = 3001
const app = express();

const corsOptions = {
    credentials: true,
    origin: ['http://localhost:3000', 'http://localhost:80'] 
};

app.use(cors(corsOptions));
app.get('/',(req,res) => {
  res.send(pug.renderFile('./templates/template.pug',{name:'madame C'}))
})
app.post('/',(req,res) => {
  res.send(pug.renderFile('./templates/template.pug',{name:'madame C'}))
})

app.listen(port, () => {
  console.log('La madama C BACK se está ejecutando en el puerto: ', port);
});