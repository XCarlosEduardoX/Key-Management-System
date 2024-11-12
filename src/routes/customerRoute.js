import express from 'express';
const router = express.Router();
import admin from '../firebase.js';
const db = admin.firestore();
import { FieldValue } from "firebase-admin/firestore"
import moment from 'moment';


import verifyToken from '../middlewares/verifyToken.js';

import customerController from '../controllers/customerController.js';

import generateKey from '../methods/generateKey.js';




router.use(verifyToken);  // Esto asegurará que todas las rutas de /customer estén protegidas


router.get('/add-customer', (req, res) => {
    res.render('customer/showAddCustomerPage', { pagina: 'Agregar cliente', autenticado: true, user: req.user });
});

router.post("/add-customer", customerController.addCustomer);


router.get('/check-customer/:customerId', async (req, res) => {

    const customerId = req.params.customerId;
    const customerRef = db.collection('customers').doc(customerId);
    let doc = await customerRef.get();
    let customerData = doc.data();

    res.render('customer/showCustomerDataPage', { customerData: customerData, autenticado: true, user: req.user, moment: moment });
});

router.put('/activate-key/:customerId', async (req, res) => {
    const customerId = req.params.customerId;

    const customerRef = db.collection('customers').doc(customerId);
    let doc = await customerRef.get();


    await customerRef.update({ keys: FieldValue.arrayUnion(generateKey()) });
    res.status(200).send('Key activated');


  
});

router.put('/desactivate-key/:customerId/:projectId', async (req, res) => {
    const projectId = req.params.projectId;
    const customerId = req.params.customerId;



    const customerRef = db.collection('customers').doc(customerId);
    let doc = await customerRef.get();
    let customerData = doc.data();

    let keys = customerData.keys;


    let key = keys.find(key => key.projectId === projectId);
    await customerRef.update({ keys: FieldValue.arrayRemove(key) })
    key.desactivatedAt = moment().format();
    key.active = false;
    let oldKey = key;
    await customerRef.update({ oldKeys: FieldValue.arrayUnion(oldKey) })


    res.status(200).send('Key desactivated');

});

router.put('/reactivate-key/:customerId/:projectId', async (req, res) => {
    const projectId = req.params.projectId;
    const customerId = req.params.customerId;



    const customerRef = db.collection('customers').doc(customerId);
    let doc = await customerRef.get();
    let customerData = doc.data();
    let oldKeys = customerData.oldKeys;

    let oldkey = oldKeys.find(key => key.projectId === projectId);
    await customerRef.update({ oldKeys: FieldValue.arrayRemove(oldkey) })
    oldkey.reactivatedAt = moment().format();
    oldkey.active = true;
    oldKeys.desactivatedAt = null;
    await customerRef.update({ keys: FieldValue.arrayUnion(oldkey) })


    // let keys = customerData.keys;


    // let key = keys.find(key => key.projectId === projectId);
    // await customerRef.update({ keys: FieldValue.arrayRemove(key) })
    // key.desactivatedAt = moment().format();
    // key.active = false;
    // let oldKey = key;
    // await customerRef.update({ oldKeys: FieldValue.arrayUnion(oldKey) })


    res.status(200).send('Key desactivated');

});


router.get('/all-customers', async (req, res) => {
    const customersRef = db.collection('customers');
    let customers = [];
    let querySnapshot = await customersRef.get();
    querySnapshot.forEach(doc => {
        customers.push(doc.data());
    });
    res.render('customer/showAllCustomersPage', { customers: customers, autenticado: true, user: req.user, moment: moment });

});










export default router;