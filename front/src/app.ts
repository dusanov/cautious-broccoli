const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const pug = require('pug');
const { v4 } = require('uuid');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000;
let username = 'Miss C herself';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine','pug');

//TODO not ok to expose whole nm
app.use('/scripts', express.static(path.join(__dirname, '../node_modules')));
app.use('/static', express.static(path.join(__dirname, '../static')));
app.use(compression());

app.get('/', (_req: any, res: any) => {
  // username = chance.name();
  res.render('index', { name: username });
});

app.get('/studio', (_req: any,res: any) => {
  res.render('studio', { name: username });
});

app.listen(PORT);
console.log('La madama C FRONT se está ejecutando en el puerto: ', PORT)