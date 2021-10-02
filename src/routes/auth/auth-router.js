const authRouter = require('express').Router();
const bcrypt = require('bcryptjs');
const logger = require('../../logger');
// middleware
const validInfo = require('../../middleware/validinfo');
const authorization = require('../../middleware/authorization');
// helpers
const createJwt = require('../../helpers/jwtGenerator');
const timestamp = require('../../helpers/timestamp');

// ^ Register a new user
// ^ And return a jwt to log them in right away
authRouter.post('/register', validInfo, async (req, res, next) => {
  try {
    // throw new Error('error is happening 832wka3###%');
    // ^ step #1: destructure the req.body (username, password)
    const { username, password } = req.body;

    const userCredentials = {
      username,
      password,
    };

    // for (const [key, value] of Object.entries(userCredentials)) {
    //   if (value == null) {
    //     logger.error(`${timestamp()} >> missing ${key} in request body`);
    //     return res.status(400).json({
    //       message: `Missing '${key}' in request body`,
    //     });
    //   }
    // }

    // if (!userCredentials.username || !userCredentials.password) {
    //   return res
    //     .status(400)
    //     .json({ message: 'cannot have blank values in request body' });
    // }

    // ^ step #2: check if user exists

    // ? connect to the database
    const data = req.app.get('db');

    // ? knex function to query if database contains username entered in req.body
    const checkIfUsernameExists = (db, username) => {
      return db('person')
        .where({ username })
        .first()
        .then((user) => !!user);
    };

    // ? how to do it without knex
    // const user = await SecurityPolicyViolationEvent.query("SELECT * FROM person WHERE username = $1", [username])

    const usernameAlreadyExists = await checkIfUsernameExists(data, username); // boolean

    // ? validate
    if (usernameAlreadyExists) {
      logger.error(
        `${timestamp()} >> "${username}" already exists in the database`
      );
      return res.status(401).json({ message: 'username already exists' });
    }

    // ^ step #3: bcrypt the user password
    const saltRound = 10; // how encrypted it's going to be
    const salt = await bcrypt.genSalt(saltRound);

    const bcryptPassword = await bcrypt.hash(password, salt);

    // ^ step #4: enter the new user into the database

    const newUser = {
      username,
      user_master_password: bcryptPassword,
    };

    // ? knex function to insert new user
    const insertUser = (db, newUser) => {
      return db
        .insert(newUser)
        .into('person')
        .returning('*')
        .then(([user]) => user);
    };
    const insertedNewUser = await insertUser(data, newUser);

    // ^ step #5: generating our jwt token

    const subject = insertedNewUser.username;
    const payload = {
      user_uid: insertedNewUser.user_uid,
      username: insertedNewUser.username,
    };
    const token = createJwt(subject, payload);

    res.json(token);
  } catch (error) {
    next(error);
  }
});
// ! ========================================================
// ^ Login Route
authRouter.post('/login', validInfo, async (req, res, next) => {
  try {
    // ^ step #1: Destructure the req.body
    const { username, password } = req.body;
    const loginInput = { username, password };

    for (const [key, value] of Object.entries(loginInput)) {
      if (value == null) {
        logger.error(`${timestamp()} >> missing ${key} in request body`);
        return res.status(400).json({
          message: `Missing '${key}' in request body`,
        });
      }
    }

    // ^ step #2: check if user doesn't ext, if not throw error

    // ? connect to the database
    const data = req.app.get('db');

    const getUser = (db, username) => {
      return db('person').where({ username }).first();
    };

    const dbUser = await getUser(data, loginInput.username);

    if (!dbUser) {
      logger.error(
        `${timestamp()} >> Incorrect username or password. Cannot login.`
      );
      return res
        .status(400)
        .json({ message: 'Incorrect username or password' });
    }
    // ^ step #3: check if incoming password === database password

    const validatePassword = (password, hash) => {
      return bcrypt.compare(password, hash); // returns boolean
    };
    const isValidPasswordMatch = await validatePassword(
      loginInput.password,
      dbUser.user_master_password
    );

    if (!isValidPasswordMatch) {
      logger.error(
        `${timestamp()} >> Incorrect username or password. Cannot login.`
      );
      return res
        .status(401)
        .json({ message: 'Incorrect username or password. Cannot login.' });
    }

    // ^ step #4: if pass the validation, return jwt
    const subject = dbUser.username;
    const payload = {
      user_uid: dbUser.user_uid,
      username: dbUser.username,
    };
    const token = await createJwt(subject, payload);

    res
      .status(201)
      .json({ message: `${dbUser.username} is logged in`, token: token });
  } catch (error) {
    next(error);
  }
});

// ! Next we need to create middleware that validates the token
// ! to access private routes for the logged in user

authRouter.get('/verified', authorization, async (req, res, next) => {
  try {
    res.json(true);
  } catch (error) {
    next(error);
  }
});

module.exports = authRouter;
