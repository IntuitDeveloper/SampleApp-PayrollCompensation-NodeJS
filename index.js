import express from 'express';
import path, { dirname } from 'path';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import ejs from 'ejs';
import { fileURLToPath } from 'url';

import authRoutes from './routes/oauth-route.js';
import  employeeCompensationQuickBookRoutes from './routes/employee-compensation-routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));
app.engine('html', ejs.renderFile);

app.set('view engine', 'html');
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'pages')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

app.use('/api/auth', authRoutes);

app.use('/api/quickbook/employee', employeeCompensationQuickBookRoutes);

app.listen(PORT, () => {
    console.log('server up on PORT ', PORT);
});