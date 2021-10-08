const logger = require('../logger');
const timestamp = require('../helpers/timestamp');
const WidgetService = require('../routes/widget/widget-service');

module.exports = async function (req, res, next) {
  // * get the id of the widget you want to select
  const { id } = req.params;

  // * if no id in parameter, res 400
  if (!id) {
    logger.error(`${timestamp()} >> no parameter entered to retrieve a widget`);
    return res.status(400).json({ message: 'no parameter detected' });
  }

  // * query the db to check if the currently logged in user has access to the record in question
  const widget = await WidgetService.getSpecificWidget(
    req.app.get('db'),
    id,
    req.user.user_uid
  );

  // * if no widget or the res contains an error, res 400
  if (!widget) {
    logger.error(`${timestamp()} >> widget ${id} does not exist for this user`);
    return res.status(400).json({ message: 'no widget found' });
  }
  if (widget.hasOwnProperty('error')) {
    return res.status(400).json(widget);
  }
  // * If for some reason the user_uid on the widget does not equal the logged in user
  if (req.user.user_uid !== widget.user_uid) {
    logger.error(`${timestamp()} >> user denied access to this record`);
    return res
      .status(400)
      .json({ error: 'this user is unauthorized to access this record' });
  }

  req.widget = widget;

  next();
};
