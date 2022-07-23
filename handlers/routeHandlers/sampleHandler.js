const handler = {};
handler.sampleHandler = (requestProperties, callBack) => {
    console.log(requestProperties);
    callBack(200, {
        message: 'sample url',
    });
};
module.exports = handler;
