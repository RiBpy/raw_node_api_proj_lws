/**
 rotes page
 */
const { sampleHandler } = require('./handlers/routeHandlers/sampleHandler');
const { aboutHandler } = require('./handlers/routeHandlers/aboutHandler');
const { userHandler } = require('./handlers/routeHandlers/userHandler');
const { tokenHandler } = require('./handlers/routeHandlers/tokenHandler');

const routes = {
    sample: sampleHandler, //if hits in sample url the sampleHandler function will  be called.
    about: aboutHandler,
    user:userHandler,
    token:tokenHandler,
};
module.exports = routes;
