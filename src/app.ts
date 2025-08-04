import express from 'express';
import dotenv from 'dotenv';
import contactRoutes from './routes/contact.routes.js';

dotenv.config();

const app = express();
app.use(express.json());

app.get('/', (_, res) => {
    res.send({ message: 'it works? it works. yay!' });
});

app.use('/identify', contactRoutes);

export default app;