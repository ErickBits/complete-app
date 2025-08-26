import express from 'express';
import 'dotenv/config';
import route from './routes/main_routes.js';
import { connectDB } from './config/db_conection.js';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/bread_network', route);

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT , () => {
    console.log('server is running 💻💾💾');
});