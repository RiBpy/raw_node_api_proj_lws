/**
 rotes page
 */
const { sampleHandler } = require('./handlers/routeHandlers/sampleHandler');
const { aboutHandler } = require('./handlers/routeHandlers/aboutHandler');

const routes = {
    sample: sampleHandler, //if hits in sample url the sampleHandler function will  be called.
    about: aboutHandler,
};
module.exports = routes;
