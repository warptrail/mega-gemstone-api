-- ^ act_id | act_usr_id | act_name | act_username | act_email | act_password | act_color | act_logo | act_other

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ? \dx
-- See extenstions installed for database

CREATE TABLE person (
  user_uid UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
  username VARCHAR(50) NOT NULL UNIQUE,
  user_master_password VARCHAR NOT NULL
);


CREATE TABLE widget (
  w_uid UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
  w_title VARCHAR(50) NOT NULL,
  w_email VARCHAR(50) NOT NULL,
  w_username VARCHAR(50),
  w_pswd VARCHAR(50) NOT NULL,
  w_fullname VARCHAR(50),
  w_logo VARCHAR(50) DEFAULT 'webLink',
  w_color VARCHAR(15) DEFAULT 'darkBlue',
  w_other VARCHAR(150),
  w_created_at TIMESTAMPTZ DEFAULT Now(),
  user_uid UUID REFERENCES "person"(user_uid) ON DELETE CASCADE NOT NULL
);

--! Inserts 

INSERT INTO person 
	(user_uid, username, user_master_password)
	VALUES (
    'd213bf24-9fa6-4fce-9347-9abd15115895',
		'james',
		'$2a$10$LEidBMx0TI8vxUEtQJ5teuXTX5CtqWUsh1dXjcAapzVh8srb0UgIC'
  );

INSERT INTO widget (w_title, w_email, w_username, w_pswd, w_fullname, user_uid) VALUES (
	'Myspace',
	'james@myspace.com',
	'james-the-dinosaur',
	'dino1234',
	'James Bashir',
	'd213bf24-9fa6-4fce-9347-9abd15115895'
);
