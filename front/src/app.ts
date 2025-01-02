const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const front_socket = require('./sockets')

const app = express();
const PORT = process.env.PORT || 3000;
let username = 'Madame C';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine','pug');
app.use(cookieParser());
app.use(session({
    secret: '34SDgsdgspxyxoxmxuxmx132dfsG', // just a long random string
    resave: false,
    saveUninitialized: true
}));
//TODO not ok to expose whole nm
app.use('/scripts', express.static(path.join(__dirname, '../node_modules')));
app.use('/static', express.static(path.join(__dirname, '../static')));
app.use(compression());

app.get('/', (req: any, res: any) => {
  res.render('index', { name: username, sessionId: req.session.id });
});

app.listen(PORT);
console.log('frontend runs on port: ', PORT)