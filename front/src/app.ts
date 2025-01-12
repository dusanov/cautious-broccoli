import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import './sockets';

const app = express();
const PORT = process.env.PORT || 3000;
const title = "Hello Llama"
const username = 'Usuaria Feliz';

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

app.get('/', (req: express.Request, res: express.Response) => {
  res.render('index', { title:title, name: username, sessionId: req.session!.id });
});

app.get('/studio', (req: express.Request, res: express.Response) => {
  res.render('studio', { name: username, sessionId: req.session!.id });
});

app.listen(PORT);
console.log('frontend runs on port: ', PORT)