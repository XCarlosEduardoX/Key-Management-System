

// Enviar el token de vuelta al cliente
// res.status(200).send({
//     user: userCredential.user,
//     token: token,  // Aquí envías el token de Firebase
//     message: "Login successful",
//     redirect: "/customer/add-customer"
// });

// controllers/authController.js
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import 'dotenv/config'

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default {
    login: async (req, res) => {
        let data = req.body;
        let email = data.email;
        let password = data.password;

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            const token = await userCredential.user.getIdToken();

            // Establecer la cookie con el token
            res.cookie('_token', token, {
                httpOnly: true,

            }).redirect('/customer/all-customers');


        } catch (error) {
            console.log(error);

            res.status(400).send(error);
        }
    },

    logout: async (req, res) => {
        console.log('logout');
        try {
            await signOut(auth);

            // Borrar la cookie con el token
            res.clearCookie('_token', {
                httpOnly: true,
            }).redirect('/auth/login');
        } catch (error) {
            console.log(error);
            res.status(500).send('Error al cerrar sesión');
        }
    },


}
