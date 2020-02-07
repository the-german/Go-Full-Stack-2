const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Thing = require('./models/Thing');

mongoose.connect("mongodb+srv://admin:bouzen3@cluster0-m4ytm.mongodb.net/test?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(()=> console.log('Connection to MongoDB success'))
.catch(()=> console.log('Connection Failed'));


const app = express();

app.use((request, response, next) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(bodyParser.json());

app.post('/api/stuff', (request, response, next) => {
    // In the front in, we already have and ID, we have to delete it dor secure
    delete request.body._id;
    const thing = new Thing({
       // title: request.body.title, ==== We're gonna use a shortcut of javascript =====
        ...request.body
    });
    thing.save()
    .then(() => response.status(201).json({ message: 'Object save succesfully' }))
    .catch(error => response.status(400).json({ error }));
    //next();
});
app.put('/api/stuff/:id', (request, response, next) => {
    Thing.updateOne({ _id: request.params.id }, { ...request.body, _id: request.params.id })
    .then(() => response.status(201).json({ message: 'Update succesfully' }))
    .catch(error => response.status(400).json({ error }));

});
app.delete('/api/stuff/:id', (request, response, next) => {
    Thing.deleteOne({ _id: request.params.id })
    .then(() => response.status(200).json({ message: 'Delete Successfully' }))
    .catch(error => response.status(400).json({ error }));
});

app.get('/api/stuff/:id', (request, response, next) => {
    Thing.findOne({ _id: request.params.id })
    .then(thing => response.status(200).json(thing))
    .catch(error => response.status(404).json({ error }));
});
app.get('/api/stuff', (request, response, next) => {

    Thing.find()
    .then(things => response.status(200).json(things))
    .catch(error => response.status(400).json({ error }));
  });
module.exports = app;
