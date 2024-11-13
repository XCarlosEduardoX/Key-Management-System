import express from 'express';
const router = express.Router();
import admin from '../firebase.js';
const db = admin.firestore();
import { FieldValue } from "firebase-admin/firestore"
import moment from 'moment';
import keygen from 'keygen';


import verifyToken from '../middlewares/verifyToken.js';

import customerController from '../controllers/customerController.js';

import generateKey from '../methods/generateKey.js';




router.use(verifyToken);  // Esto asegurará que todas las rutas de /customer estén protegidas


router.get('/add-customer', (req, res) => {
    res.render('customer/showAddCustomerPage', { pagina: 'Agregar cliente', autenticado: true, user: req.user });
});

router.post("/add-customer", customerController.addCustomer);


router.get('/add-project/:customerId', (req, res) => {
    let customerId = req.params.customerId;
    res.render('customer/showAddProjectPage', { pagina: 'Agregar proyecto', autenticado: true, user: req.user, customerId: customerId });
});

router.post("/add-project/:customerId", customerController.addProject);













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

router.put('/desactivate-key/:customerId/:apiKey', async (req, res) => {
    const apiKey = req.params.apiKey;
    const customerId = req.params.customerId;



    const customerRef = db.collection('customers').doc(customerId);
    let doc = await customerRef.get();
    let customerData = doc.data();

    let keys = customerData.keys;


    let key = keys.find(key => key.apiKey === apiKey);
    await customerRef.update({ keys: FieldValue.arrayRemove(key) })
    key.desactivatedAt = moment().format();
    key.active = false;
    let oldKey = key;
    await customerRef.update({ oldKeys: FieldValue.arrayUnion(oldKey) })


    res.status(200).send('Key desactivated');

});

router.put('/reactivate-key/:customerId/:apiKey', async (req, res) => {
    const apiKey = req.params.apiKey;
    const customerId = req.params.customerId;



    const customerRef = db.collection('customers').doc(customerId);
    let doc = await customerRef.get();
    let customerData = doc.data();
    let oldKeys = customerData.oldKeys;

    let oldkey = oldKeys.find(key => key.apiKey === apiKey);
    await customerRef.update({ oldKeys: FieldValue.arrayRemove(oldkey) })
    oldkey.reactivatedAt = moment().format();
    oldkey.active = true;
    oldKeys.desactivatedAt = null;
    await customerRef.update({ keys: FieldValue.arrayUnion(oldkey) })

    res.status(200).send('Key reactivated');

});

router.put('/regenerate-key/:customerId/:apiKey', async (req, res) => {
    const apiKey = req.params.apiKey;
    const customerId = req.params.customerId;



    const customerRef = db.collection('customers').doc(customerId);
    let doc = await customerRef.get();
    let customerData = doc.data();
    let keys = customerData.keys;


    let key = keys.find(key => key.apiKey === apiKey);
    await customerRef.update({ keys: FieldValue.arrayRemove(key), })

    key.active = false;
    key.desactivatedAt = moment().format();
    key.regeneratedAt = moment().format();
    await customerRef.update({ oldKeys: FieldValue.arrayUnion(key) })


    key.apiKey = keygen.url();
    key.active = true;
    key.activatedAt = moment().format();
    key.desactivatedAt = null;
    key.reactivatedAt = null;
    key.regeneratedAt = null;
    await customerRef.update({ keys: FieldValue.arrayUnion(key) })


    res.status(200).send('Key regenerated');

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