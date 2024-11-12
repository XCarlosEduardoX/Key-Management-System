

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

const firebaseConfig = {
    apiKey: "AIzaSyCxfvH6RH3qR25EGjdfB83Yv5F1EbNl528",
    authDomain: "key-generator-b0381.firebaseapp.com",
    projectId: "key-generator-b0381",
    storageBucket: "key-generator-b0381.firebasestorage.app",
    messagingSenderId: "258745895745",
    appId: "1:258745895745:web:9b9f8ee25d8e97c6aeefc0"
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
