const generateOtp = () =>
    Math.floor(Math.random() * 10000000);

module.exports = generateOtp