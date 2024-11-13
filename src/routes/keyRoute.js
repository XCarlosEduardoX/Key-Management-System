import express from 'express';
const router = express.Router();
import admin from '../firebase.js';
const db = admin.firestore();
import { FieldValue } from "firebase-admin/firestore"
import moment from 'moment';







router.post('/check/:apiKey/:projectId/:customerId', async (req, res) => {
    console.log('Revisando llave de acceso');

    const apiKey = req.params.apiKey;
    const customerId = req.params.customerId;
    const projectId = req.params.projectId;
    console.log('Revisando llave de acceso para el proyecto ' + projectId + ' del usuario ' + customerId + ' con la llave ' + apiKey);
    const customerRef = db.collection('customers').doc(customerId);
    let doc = await customerRef.get();
    let customerData = doc.data();
    let keys = customerData.keys;

    let keyData = keys.find(key => key.apiKey === apiKey);
    if (keyData != undefined) {
        if (keyData.apiKey === apiKey && keyData.active === true && keyData.projectId === projectId) {
            console.log('El usuario' + customerId + ' está autorizado');
            res.status(200).send({
                message: 'Authorized, welcome to the project page',
                status: 200,
                authorized: true,
            });
        } else {


        }
    } else {
        console.log('buscado si el usuario ' + customerId + ' tiene llave desactivada');
        let oldKeys = customerData.oldKeys;
        let oldKeysData = oldKeys.find(key => key.apiKey === apiKey && key.projectId === projectId);

        //mostrar solo los que regeneratedAt sean null

        if (oldKeysData != undefined) {
            res.status(401).send({
                status: 401,
                authorized: false,
                message: 'Su llave esta desactivada o regenerada, si desea reactivarla, por favor contacte al administrador',
            });
        } else {
            res.status(401).send({
                status: 401,
                authorized: false,
                message: 'Su llave no ha sido encontrada o ha sido regenerada, si desea reactivarla, por favor contacte al administrador',
            });
        }

        // res.status(401).send({
        //     status: 401,
        //     authorized: false,
        //     message: 'Su llave ha sido desactivada o regenerada el ' + moment(oldKey.desactivatedAt).format('DD/MM/YYYY') + ', si desea reactivarla, por favor contacte al administrador',
        // });
        // if (oldKey.apiKey === apiKey && oldKey.projectId === projectId) {
        //     console.log('La llave' + apiKey + 'para el proyecto ' + projectId + 'del usuario ' + customerId + ' está desactivada');

        // res.status(401).send({
        //     status: 401,
        //     authorized: false,
        //     message: 'Su llave ha sido desactivada o regenerada el ' + moment(oldKey.desactivatedAt).format('DD/MM/YYYY') + ', si desea reactivarla, por favor contacte al administrador',
        // });
        // } else {
        //     console.log('El usuario' + customerId + ' NO está autorizado');

        //     res.status(401).send({
        //         message: 'Unauthorized',
        //         status: 401, authorized: false
        //     });
        // }

    }





    // let keyData = keys.find(key => key.key === key);
    // if (keyData != undefined) {
    //     if (keyData.apiKey === key && keyData.active === true && keyData.projectId === projectId) {
    //         console.log('El usuario' + customerId + ' está autorizado');

    //         res.status(200).send({
    //             message: 'Authorized, welcome to the project page',
    //             status: 200,
    //             authorized: true,
    //         });
    //     }
    // } else {
    //     console.log('buscado si el usuario ' + customerId + ' tiene llave desactivada');
    //     let oldKeys = customerData.oldKeys;
    //     let oldKeyData = oldKeys.find(key => key.projectId === projectId);
    //     if (oldKeyData.apiKey === key && oldKeyData.projectId === projectId) {
    //         console.log('La llave' + key + 'para el proyecto ' + projectId + 'del usuario ' + customerId + ' ha sido desactivada');

    //         res.status(401).send({
    //             status: 401,
    //             authorized: false,
    //             message: 'Su llave ha sido desactivada o regenerada el ' + moment(oldKeyData.desactivatedAt).format('DD/MM/YYYY') + ', si desea reactivarla, por favor contacte al administrador',
    //         });
    //     } else {
    //         console.log('El usuario' + customerId + ' NO está autorizado');

    //         res.status(401).send({
    //             message: 'Unauthorized',
    //             status: 401, authorized: false
    //         });
    //     }
    // }


})


export default router;