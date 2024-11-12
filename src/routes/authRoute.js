// routes/authRoutes.js
import express from 'express';
const router = express.Router();

import authController from '../controllers/authController.js';



router.get('/login', (req, res) => {
    res.render('auth/login', { pagina: 'Iniciar Sesión', autenticado: false });
});



router.post('/login', authController.login);

router.post("/logout", authController.logout);        // Ruta para el proceso de login


export default router;