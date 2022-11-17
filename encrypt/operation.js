const jwt_decode = require('jwt-decode');

module.exports = {
    decodeJwtResponse(credential){
        return (jwt_decode(credential));
    },
    RetrieveData(credential){
        const responsePayload = this.decodeJwtResponse(credential);
        return{
            ID:responsePayload.sub,
            FullName:responsePayload.name,
            ImageURL:responsePayload.picture,
            Email:responsePayload.email
        }
    }
}