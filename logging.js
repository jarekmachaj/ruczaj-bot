var exports = module.exports = {};

var settings = {
    logging: false
}

function log(msg, logType){
    if (settings.logging == false) return;

    switch (logType) {
        case "INFO" : console.log(msg);
        default : console.log(msg);
    }
}

console.log('Logger starts');

exports.settings = settings;
exports.log = log;
