import express from 'express';
const router = express.Router();
import admin from '../firebase.js';
const db = admin.firestore();
import { FieldValue } from "firebase-admin/firestore"
import moment from 'moment';







router.post('/check/:key/:projectId/:customerId', async (req, res) => {

    const key = req.params.key;
    const customerId = req.params.customerId;
    const projectId = req.params.projectId;



    const customerRef = db.collection('customers').doc(customerId);
    let doc = await customerRef.get();
    let customerData = doc.data();
    let keys = customerData.keys;
    let keyData = keys.find(key => key.projectId === projectId);
    if (keyData != undefined) {
        if (keyData.apiKey === key && keyData.active === true && keyData.projectId === projectId) {
            console.log('autorizado');

            res.status(200).send({
                message: 'Authorized, welcome to the project page',
                status: 200,
                authorized: true,
            });
        }
    } else {
        console.log('buscado si tiene llave antigua');
        let oldKeys = customerData.oldKeys;
        let oldKeyData = oldKeys.find(key => key.projectId === projectId);
        if (oldKeyData.apiKey === key && oldKeyData.projectId === projectId) {
            console.log('su llave ha sido desactivada');

            res.status(401).send({
                status: 401,
                authorized: false,
                message: 'Su llave ha sido desactivada el ' + moment(oldKeyData.desactivatedAt).format('DD/MM/YYYY') + ', si desea reactivarla, por favor contacte al administrador',
            });
        } else {
            console.log('no autorizado');

            res.status(401).send({
                message: 'Unauthorized',
                status: 401, authorized: false
            });
        }
    }
    // if (keyData.apiKey === key && keyData.active === true && keyData.projectId === projectId) {
    //     console.log('autorizado');

    //     res.status(200).send({
    //         message: 'Authorized, welcome to the project page',
    //         status: 200,
    //         authorized: true,
    //     });
    // } else {
    //     console.log('buscado si tiene llave antigua');

    //     //buscar en oldKeys
    // let oldKeys = customerData.oldKeys;
    // let oldKeyData = oldKeys.find(key => key.projectId === projectId);
    // if (oldKeyData.apiKey === key && oldKeyData.projectId === projectId) {
    //     console.log('su llave ha sido desactivada');

    //     res.status(401).send({
    //         status: 401,
    //         authorized: false,
    //         message: 'Su llave ha sido desactivada el ' + moment(oldKeyData.desactivatedAt).format('DD/MM/YYYY') + ', si desea reactivarla, por favor contacte al administrador',
    //     });
    // } else {
    //         console.log('no autorizado');

    //         res.status(401).send({
    //             message: 'Unauthorized',
    //             status: 401, authorized: false
    //         });
    //     }
    // }

})


export default router;