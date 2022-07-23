const handler = {};
handler.aboutHandler = (requestProperties, callBack) => {
    console.log(requestProperties);
    callBack(200, {
        message: 'About Handler',
    });
};
module.exports = handler;
