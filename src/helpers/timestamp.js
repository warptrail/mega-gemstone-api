const dayjs = require('dayjs');

const timestamp = () => dayjs().format('MMM-DD, YYYY - h:m a');

module.exports = timestamp;
