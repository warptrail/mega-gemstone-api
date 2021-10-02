require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const logger = require('./logger');
const timestamp = require('./helpers/timestamp');
const { NODE_ENV } = require('./config');
const errorHandler = require('./error-handler');
// const userRouter = require('./routes/user/user-router');
const authRouter = require('./routes/auth/auth-router');
const dashboardRouter = require('./routes/dashboard/dashboard-router');

const app = express();

//^ Determine the node environment for morgan
const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';

// middleware
app.use(express.json()); // json body parser for POST requests
app.use(
  morgan(NODE_ENV === 'production' ? 'tiny' : 'common', {
    skip: () => NODE_ENV === 'test',
  })
);
app.use(cors());
app.use(helmet());

// ^ ROUTES
app.get('/', (req, res) => {
  // const timestamp = dayjs().format('MMM-DD, YYYY - h:m a');
  logger.info(`${timestamp()} >> Congratulations, the server is running!`);
  res.send('Hello, Mr. Freeze');
});

// register, login & verify
app.use('/api/auth', authRouter);

// dashboard
app.use('/api/dashboard', dashboardRouter);

app.use(errorHandler);

module.exports = app;
