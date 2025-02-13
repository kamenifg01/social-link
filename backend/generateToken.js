const jwt = require('jsonwebtoken');

const payload = { id: 1 }; // Remplacez par les données que vous souhaitez inclure
const secret = 'V3ryC0mpl3xAndS3cur3S3cretK3y'; // Remplacez par votre secret
const token = jwt.sign(payload, secret, { expiresIn: '1h' });

console.log('Token généré :', token);