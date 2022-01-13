# Gemstone Cryochamber API

<img src="infocryo.png" width="400" >

## Introduction

This is the backend portion of my password vault full-stack application.

Users may create an account and log in to access their various internet account information. Currently there is no mechanism of deleting or editing a user account without manually truncating your database. The database used is PostgreSQL and uses JWT for user authentication

**Disclaimer & Warning:**
This is a practice portfolio piece and is not intended to guarantee the security of anything stored in the database. Although I did take every precaution within my current level of ability and understanding when it comes to user authentication and database encryption, I am sure somebody out there could find a way to break in.

I am no security expert, so if anybody finds any fatal flaw in the way I implemented this JWT-based authentication system, please feel free to fork this project and improve upon it. I would be most interested in learning more on how to make it better and more secure.

Note that the pdf-generating feature will download a basic pdf with plain text to your computer that may contain sensitive information. It is advised to open that pdf in a client that allows you to export a password protected format to keep in your records, and then delete the original pdf.

I take no responsibility if the data stored in your clone of this API is compromised in any way. **Use at your own risk.**

## Installation

1. Clone this repo to a local directory of your choice. Advised to be in the same parent directory as the client, but not necessary.
2. Make sure you have Node.js & PostgreSQL installed. Create a new database called "cryochamber"
3. From the repo directory, open the Postgres CLI and then run `\i db/create-db.sql` to initialize the database. Note: the sql file will Insert a demo user and widget which can be removed from the sql file if you wish.
4. Change the `example.env` filename to `.env` in order to use locally specific environment variables. Inside the file change the following:
   - `DB_URL` --> To the appropriate connection string to the cryochamber database
   - `JWT_SECRET` --> A unique complex string known only to the authorized user
   - `PORT` --> (Optional) The local host port to run the server
5. In the main directory CLI run `npm install` to install all project dependencies.

## Starting the Server

Make sure your PostgreSQL database is running by entering `pg_ctl start` in your terminal.

In the project directory root CLI run:
`npm start`
Then server will be accessible at localhost:8000 or the port you specified in the `.env` file.

To run the server in developer mode via nodemon run:
`npm run dev`

At this point, keep your server running while running up the Gemstone Cryochamber client. There you will be able to get, post, patch, and delete your accounts as well as export them to pdf formatl If not installed, clone and set up the client reposotory that can be found at this url:
[https://github.com/warptrail/mega-gemstone](https://github.com/warptrail/mega-gemstone)

## Endpoints

Private endpoints require a valid token to be included in the header of the request. A Token can be acquired after successfully login.

**Auth Endpoints**

POST `/api/auth/register`

Registers a new user

Request body must contain valid username and password.

POST `api/auth/login`

Logs in to an existing user

Request body must contain valid username and password.

GET `api/auth/verified`

Verifies the user is authorized when accessing other private endpoints.

Requires authorization middleware.

POST `api/auth/refresh`

Tokens are set to expire after a short duration, this endpoint refreshes the token and extends the duration of the
expire time.

**Dashboard Endpoints**

GET `api/dashboard`

Gets the user's username and unique identifier to populate the dashboard greeting.

Requires authorization middleware.

**Widget Endpoints**

All endpoints require authorization middleware. The name "widget" was chosen to be vague in the code on purpose. A widget equates to an app or website account to store login information.

GET `api/widget/all`

Gets all widgets sorted by date-created.

GET `api/widget/all/name`

Gets all widgets sorted in alphabetical order.

POST `api/widget/post`

Create a new widget. Request body must contain: title, email and pswd.

Request Body Format:

`{title, email, username, pswd, fullname, logo, color, other}`

(Note: logo and color values are not implemented into the client yet and may be left blank)

GET `api/widget/single/:id`

Gets a specific widget where the w_uid matches the :id parameter.

DELETE `api/widget/single/:id`

Deletes a specific widget where the w_uid matches the :id parameter.

PATCH `api/widget/single/:id`

Edits the body of a specific widget where the w_uid matches the :id parameter.

POST `api/widget/create-pdf`

This endpoint sends the decrypted information of all the widgets back to the server to generate a temporary pdf file that has all the information for the users accounts in plain text. This endpoint is designed to be launched first, followed by the next endpoint:

GET `api/widget/fetch-pdf`

Once the pdf file is created from the previous endpoint, this one downloads it to the client and then uses the Node fs module to delete the pdf file from the server directory.

## Stack

The PERN Stack

- PostgreSQL
- Express.js
- React
- Node

## Credits

[Ryan Whitmore @warptrail](https://ryanwhitmore.dev/)

> Written with [StackEdit](https://stackedit.io/).
