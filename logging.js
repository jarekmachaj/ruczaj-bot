function logger(){}

logger.prototype.settings = {
    logging: false
}

logger.prototype.log = function(msg, logType){
    if (this.settings.logging == false) return;

    switch (logType) {
        case "INFO" : console.log(msg);
        default : console.log(msg);
    }
}

var instance  = new logger();

module.exports = instance;
