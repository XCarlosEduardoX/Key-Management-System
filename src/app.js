import express from 'express';

import cors from 'cors';
import bodyParser from 'body-parser';

import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import 'dotenv/config'




import authRoute from './routes/authRoute.js';
import keyRoute from './routes/keyRoute.js';
import customerRoute from './routes/customerRoute.js';


const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const app = express();


// Configuración de EJS como motor de plantillas
app.set("view engine", "ejs");

// Configura el directorio de vistas
app.set("views", path.join(__dirname, "./views"));

//habilitar cors
app.use(cors());

//habilitar bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser()); // This middleware is needed to parse cookies in POST requests

app.use('/customer', customerRoute);
app.use("/auth", authRoute);
app.use('/key', keyRoute);

// Ruta principal
app.get("/", (req, res) => res.redirect("/auth/login"));
app.get("/login", (req, res) => res.redirect("/auth/login"));


// Ruta para manejar 404 - Página no encontrada
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Inicia el servidor
const PORT = process.env.PORT || 2077;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
