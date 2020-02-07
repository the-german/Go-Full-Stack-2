const jwt = require('jsonwebtoken');

exports.authentication = (request, response, next) => {
    try{
        const token =  request.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_SECRET_TOKEN');
        const userId = decodedToken.userId;
        if (request.body.userId && request.body.userId !== userId)
            throw 'User non valable !';
        else
            next();
    }catch (error) {
        response.status(401).json({ error: new Error( 'Auth problem' ) });
    }
};