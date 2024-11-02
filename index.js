const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = '';
const API_URL = 'https://api.hubapi.com/crm/v3/objects/2-36355568';

const authHeader = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
};

const fetchData = async (id, qp) => {
    const urlPart = (id ? '/' + id : '') + (qp ? '?' + qp : '');
    let data = id ? {} : [];
    try {
        response = await axios.get(API_URL + urlPart, { headers: authHeader });
        if (id) {
            data = response.data?.properties || {};
        } else {
            data = response.data?.results.map((d) => d.properties) || [];
        }
    } catch (error) {
        console.error('Error', error);
    }
    return data;
}

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here
app.get('/', async (req, res) => {
    const data = await fetchData('', 'properties=name,manufacturer,model');
    res.render('homepage', { title: "Homepage", data: data });
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here
app.get('/update-cobj', async (req, res) => {
    const id = req.query.id || '';
    let data = {};
    if (id) {
        data = await fetchData(id, 'properties=name,manufacturer,model')
    }
    res.render('updates', { title: "Update Custom Object Form | Integrating With HubSpot I Practicum", id, ...data });
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here
app.post('/update-cobj', async (req, res) => {
    const reqObj = {
        url: API_URL + (req.body.id ? '/' + req.body.id : ''),
        method: req.body.id ? 'patch' : 'post',
        headers: authHeader,
        data: {
            properties: {
                name: req.body.name,
                manufacturer: req.body.manufacturer,
                model: req.body.model
            }
        }
    };
    try {
        await axios.request(reqObj);
        res.redirect('/');
    } catch (error) {
        console.log('Error', error);
    }
});

/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));