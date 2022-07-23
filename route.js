/**
 rotes page
 */
const { sampleHandler } = require('./handlers/routeHandlers/sampleHandler');
const { aboutHandler } = require('./handlers/routeHandlers/aboutHandler');

const routes = {
    sample: sampleHandler,
    about: aboutHandler,
};
module.exports = routes;
