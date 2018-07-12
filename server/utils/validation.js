var isRealString = (str) => {
    return typeof str === 'string' && str.trim().length > 0; // true for string, false for not
};

module.exports = {isRealString};