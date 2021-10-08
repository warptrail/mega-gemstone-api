const dayjs = require('dayjs');

const timestamp = () => dayjs().format('MMM-DD, YYYY - h:mm a');

module.exports = timestamp;
