-- ^ act_id | act_usr_id | act_name | act_username | act_email | act_password | act_color | act_logo | act_other

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ? \dx
-- See extenstions installed for database

CREATE TABLE person (
  user_uid UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
  username VARCHAR(50) NOT NULL UNIQUE,
  user_master_password VARCHAR NOT NULL
);


CREATE TABLE account (
  act_uid UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
  act_title VARCHAR(50) NOT NULL,
  act_email VARCHAR(50) NOT NULL,
  act_password VARCHAR(50) NOT NULL,
  act_username VARCHAR(50),
  act_name VARCHAR(50),
  act_logo VARCHAR(50),
  act_color VARCHAR(15),
  act_other VARCHAR(150),
  user_uid UUID REFERENCES "person"(user_uid) ON DELETE CASCADE NOT NULL
);

--! Inserts 

INSERT INTO person 
	(user_uid, username, user_master_password)
	VALUES (
    'd213bf24-9fa6-4fce-9347-9abd15115895',
		'roy',
		'1234'
  );

INSERT INTO account (act_title, act_email, act_username, act_password, act_name, user_uid) VALUES (
	'Myspace',
	'roy@email.com',
	'roythedinosaur',
	'dino1234',
	'roy catman',
	'd213bf24-9fa6-4fce-9347-9abd15115895'
);
