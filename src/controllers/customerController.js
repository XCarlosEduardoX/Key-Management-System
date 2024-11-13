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

            createdAt: moment().format(),
            keys: [],
            oldKeys: [],
            customerId: uuidv4()
        };

        let customerRef = db.collection('customers').doc(customerData.customerId);

        await customerRef.set(customerData);

        //mandar status 200
        //ir a la pagina de mostrar datos del cliente
        res.redirect(`/customer/add-project/${customerData.customerId}`);







    },

    addProject: async (req, res) => {
        let data = req.body;
        console.log(data);
        
        let customerId = req.params.customerId;
        let projectData = {
            projectName: data.name,
            description: data.description,
            apiKey: keygen.url(),
            active: true,
            activatedAt: moment().format(),
            desactivatedAt: null,
            projectId: uuidv4(),
            reactivatedAt: null,
            regeneratedAt: null
        };
        console.log(customerId);
        console.log(projectData);
        let customerRef = db.collection('customers').doc(customerId);

        await customerRef.update({ keys: FieldValue.arrayUnion(projectData) });
        res.redirect(`/customer/check-customer/${customerId}`);


    }



};