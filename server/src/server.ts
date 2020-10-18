import express from 'express'
import path from 'path';
import 'express-async-errors';
import errorHandler from './errors/hundler';
import cors from 'cors';

// Chamando nosso arquivo de conexão com o database
import './database/connection';
import routes from './routes';

const app = express();

app.use(cors());
// Configuração do Express
app.use(express.json());
app.use(routes);
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use(errorHandler);


app.listen(3333);