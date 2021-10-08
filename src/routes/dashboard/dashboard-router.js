// ? a protected route that needs authorization from a registered user
const dashboardRouter = require('express').Router();
const authorization = require('../../middleware/authorization');

dashboardRouter.get('/', authorization, async (req, res, next) => {
  try {
    const userId = req.user.user_uid;
    const data = req.app.get('db');

    const getUserById = (db, userId) => {
      return db('person')
        .select('username')
        .where({ user_uid: userId })
        .first();
    };
    const user = await getUserById(data, userId);
    // console.log(user.user_uid, 'req.user');
    console.log(user);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = dashboardRouter;
