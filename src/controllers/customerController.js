import admin from '../firebase.js';
const db = admin.firestore();
import keygen from 'keygen';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

import generateKey from '../methods/generateKey.js';
import { FieldValue } from "firebase-admin/firestore"



export default {

    // showCustomerDataPage: (req, res) => {
    //     res.render("showCustomerDataPage");
    // },
    // showAddCustomerPage: (req, res) => {
    //     res.render("showAddCustomerPage");
    // },
    addCustomer: async (req, res) => {
        let data = req.body;
        let customerData = {
            name: data.name,
            email: data.email,
            phone: data.phone,
            description: data.description,
            createdAt: moment().format(),
            keys: FieldValue.arrayUnion(generateKey()),
            oldKeys: [],
            customerId: uuidv4()
        };


        let customerRef = db.collection('customers').doc(customerData.customerId);
        await customerRef.set(customerData);

        //mandar status 200
        //ir a la pagina de mostrar datos del cliente
        res.redirect(`/customer/check-customer/${customerData.customerId}`);







    },



};