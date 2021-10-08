const express = require('express');
const pdf = require('html-pdf');
const path = require('path');
const pdfTemplate = require('../../documents');
const timestamp = require('../../helpers/timestamp');
const logger = require('../../logger');

const WidgetService = require('./widget-service');
const authorization = require('../../middleware/authorization');
const validWidget = require('../../middleware/validWidget');
// * Init the widget router
const widgetRouter = express.Router();

// * GET all widgets
widgetRouter
  .route('/all')
  .all(authorization)
  .get(async (req, res, next) => {
    try {
      // call the db for array of all widgets
      const widgets = await WidgetService.getAllWidgets(
        req.app.get('db'),
        req.user.user_uid
      );

      // send the response
      res.json(widgets);
    } catch (err) {
      next(err);
    }
  });

//* Post a new widget
widgetRouter
  .route('/post')
  .all(authorization)
  .post(async (req, res, next) => {
    try {
      const { title, email, username, pswd, fullname, logo, color, other } =
        req.body;

      // * Validation
      const isBodyEmpty = (obj) => Object.keys(obj).length === 0;

      if (isBodyEmpty(req.body)) {
        return res.status(400).json({ error: 'request body is empty' });
      }

      // Validate keys all have values
      let checkObj = {
        title: false,
        email: false,
        pswd: false,
      };
      for (const [key, value] of Object.entries(req.body)) {
        if (key === 'email' || key === 'title' || key === 'pswd') {
          checkObj[key] = true;
        }
      }

      const bodyChecksOut = Object.keys(checkObj).every((k) => checkObj[k]);

      if (!bodyChecksOut) {
        return res
          .status(400)
          .json({ error: 'request body requires title, email and pswd' });
      }

      let newWidget = {
        w_title: title,
        w_email: email,
        w_username: username || '',
        w_pswd: pswd,
        w_fullname: fullname || '',
        w_logo: logo || '',
        w_color: color || '',
        w_other: other || '',
      };

      //WidgetService.insertWidget(req.app.get('db'), newWidget);
      for (const [key, value] of Object.entries(newWidget)) {
        if (value === null) {
          logger.error(`${timestamp} >> Missing ${key} in new widget`);
          return res.status(400).json({
            error: `Missing ${key} in new widget`,
          });
        }
      }

      // add the user id to the widget

      newWidget.user_uid = req.user.user_uid;

      // enter the new widget in the database
      const insertedWidget = await WidgetService.insertWidget(
        req.app.get('db'),
        newWidget
      );

      res.json(insertedWidget[0]);
    } catch (err) {
      next(err);
    }
  });

// * Get specific widget
widgetRouter.route('/single').get((req, res) => {
  res.send('please specify an id in the parameters (/api/widget/your-id-here)');
});

widgetRouter
  .route('/single/:id')
  .all(authorization)
  .get(validWidget, async (req, res, next) => {
    try {
      // validWidget handles the routing logic
      res.json(req.widget);
    } catch (err) {
      next(err);
    }
  })
  // * Delete specific widget

  .delete(validWidget, async (req, res, next) => {
    try {
      const { id } = req.params;
      if (id !== req.widget.w_uid) {
        res.status(400).json({ error: 'id mismatch' });
      }
      // * now we can delete the record
      const deleteWidget = await WidgetService.deleteWidget(
        req.app.get('db'),
        id,
        req.user.user_uid
      );

      // * if the database indicates nothing was deleted
      if (deleteWidget === 0) {
        logger.error(
          `${timestamp()} >> nothing was deleted from the database, record not found`
        );
        res.status(400).json({
          error:
            'Nothing was deleted from the database. Make sure you have entered the correct w_uid for the widget you are trying to delete',
        });
      }
      logger.info(
        `${timestamp()} >> widget #${id} has been deleted from the database`
      );
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  })

  // * Patch the record
  .patch(validWidget, async (req, res, next) => {
    try {
      // * Get the required fields from the request body
      const { title, email, username, pswd, fullname, logo, color, other } =
        req.body;

      const widgetToUpdate = {
        w_title: title,
        w_email: email,
        w_username: username,
        w_pswd: pswd,
        w_fullname: fullname,
        w_logo: logo,
        w_color: color,
        w_other: other,
      };

      // Check to see if any values have been updated, otherwise no need to fetch Patch
      const numberOfValues =
        Object.values(widgetToUpdate).filter(Boolean).length;
      if (numberOfValues === 0) {
        logger.error('nothing has changed, patch not needed');
        return res.status(400).json({
          error: {
            message: 'Request body must contain a changed value',
          },
        });
      }

      widgetToUpdate.user_uid = req.user.user_uid;

      const insertedWidgetUpdate = await WidgetService.updateWidget(
        req.app.get('db'),
        req.params.id,
        widgetToUpdate
      );

      res.json(insertedWidgetUpdate);
    } catch (err) {
      next(err);
    }
  });

// Post data from client to make pdf
widgetRouter.post('/create-pdf', (req, res) => {
  pdf
    .create(pdfTemplate(req.body), {
      width: '400px',
      printBackground: true,
    })
    .toFile('result.pdf', (err) => {
      if (err) {
        res.send(Promise.reject());
      }

      res.send(Promise.resolve());
    });
});

widgetRouter.get('/fetch-pdf', (req, res, next) => {
  try {
    const pathToPdf = path.join(__dirname, '../../../result.pdf');
    res.sendFile(pathToPdf);
  } catch (error) {
    next(error);
  }
});

module.exports = widgetRouter;
