require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
// Helpers & Middleware
const logger = require('./logger');
const timestamp = require('./helpers/timestamp');
const { NODE_ENV } = require('./config');
const errorHandler = require('./error-handler');

// The Express Routers
const authRouter = require('./routes/auth/auth-router');
const dashboardRouter = require('./routes/dashboard/dashboard-router');
const widgetRouter = require('./routes/widget/widget-router');

// ^ Init the App
const app = express();

//^ Determine the node environment for morgan
const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';

// setup middleware
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
  res.send(
    `Hello, Stranger. It is currently ${timestamp()}. The clock is ticking...`
  );
});

// register, login & verify
app.use('/api/auth', authRouter);

// dashboard
app.use('/api/dashboard', dashboardRouter);

// widget
app.use('/api/widget', widgetRouter);

// error handling middleware
app.use(errorHandler);

module.exports = app;
