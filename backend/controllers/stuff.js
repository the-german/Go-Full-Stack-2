const Thing = require('../models/Thing');
const fs = require('fs');

exports.createThing = (request, response, next) => {
    const thingObeject = JSON.parse(request.body.thing);
    // In the front in, we already have and ID, we have to delete it dor secure
     delete thingObeject._id;
    const thing = new Thing({
       // title: request.body.title, ==== We're gonna use a shortcut of javascript =====
        ...thingObeject,
        imageUrl: `${request.protocol}://${request.get('host')}/images/${request.file.filename}`
    });
    thing.save()
    .then(() => response.status(201).json({ message: 'Object save succesfully' }))
    .catch(error => response.status(400).json({ error }));
    //next();
};

exports.modifyThing = (request, response, next) => {

    const thingObeject = request.file ?
    {
        ...JSON.parse(request.body.thing),
        imageUrl: `${request.protocol}://${request.get('host')}/images/${request.file.filename}`

    } : {...request.body };
    Thing.updateOne({ _id: request.params.id }, { ...thingObeject, _id: request.params.id })
    .then(() => response.status(201).json({ message: 'Update succesfully' }))
    .catch(error => response.status(400).json({ error }));

};

exports.deleteThing = (request, response, next) => {
    Thing.findOne({ _id: request.params.id })
    .then( thing => {
        const filename = thing.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            Thing.deleteOne({ _id: request.params.id })
            .then(() => response.status(200).json({ message: 'Delete Successfully' }))
            .catch(error => response.status(400).json({ error }));
        });
    })
    .catch(error => response.status(500).json({ error }));

    
};

exports.getOneThing =  (request, response, next) => {
    Thing.findOne({ _id: request.params.id })
    .then(thing => response.status(200).json(thing))
    .catch(error => response.status(404).json({ error }));
};

exports.getAllThings = (request, response, next) => {

    Thing.find()
    .then(things => response.status(200).json(things))
    .catch(error => response.status(400).json({ error }));
};