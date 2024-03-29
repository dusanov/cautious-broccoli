import * as pug from 'pug'
import express from 'express'
import cors from 'cors';

const mongoose = require('./mongo/mongoose.js')
const port = 3001
const app = express();

const corsOptions = {
    credentials: true,
    origin: ['http://localhost:3000', 'http://localhost:80'] 
};

app.use(cors(corsOptions));
app.get('/',(req,res) => {
  res.send(pug.renderFile('./templates/holamundo.pug'))
})
app.post('/',(req,res) => {
  res.send(pug.renderFile('./templates/template.pug',{name:'madame C'}))
})

app.post("/esoes", async (req,res) => {
  const data = await mongoose.Response.findOne({id:0})
  res.send(pug.render(
      data.content,
      {name: 'Miss C herself'}
  ))  

})

app.listen(port, () => {
  console.log('La madama C BACK se está ejecutando en el puerto: ', port);
});
