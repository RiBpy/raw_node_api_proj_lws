const handler = {};
handler.notFoundHandler = (requestProperties, callBack) => {
    callBack(404, {
        message: 'URL not found',
    });
};
module.exports = handler;
