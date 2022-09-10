const handler = {};
handler.sampleHandler = (requestProperties, callBack) => {
    console.log(requestProperties);
    callBack(200, {
        // statuscode and payload;
        message: 'sample url',
    });
};
module.exports = handler;
