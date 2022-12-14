DROP SCHEMA IF EXISTS setr CASCADE;

CREATE SCHEMA IF NOT EXISTS setr AUTHORIZATION tbbcyxmeuvfpyt;

CREATE TABLE setr.user_roles(
	id 			SERIAL,
	name 		VARCHAR(50),
	CONSTRAINT user_roles_pk PRIMARY KEY(id)
);

CREATE TABLE setr.users(
	id					SERIAL,
	user_role		INT,
	username		VARCHAR(50),
	password		TEXT,
	tag					VARCHAR(50),
	schedule		VARCHAR(50),
	CONSTRAINT users_pk PRIMARY KEY(id),
	CONSTRAINT users_uk UNIQUE(username)
);

CREATE TABLE setr.clocks(
	id 					SERIAL,
	id_user 		INT,
	direction 	VARCHAR(50),
	datetime 		TIMESTAMPTZ(0),
	CONSTRAINT clocks_pk PRIMARY KEY(id)
);

CREATE TABLE setr.rooms(
id 			SERIAL,
name 		VARCHAR(50),
CONSTRAINT rooms_pk PRIMARY KEY(id)
);

CREATE TABLE setr.bookings(
	id 						SERIAL,
	room					INT,
	author				INT,
	datetime 			TIMESTAMPTZ(0),
	duration 			INT,
	description 	TEXT,
	auth 					BOOLEAN,
	CONSTRAINT bookings_pk PRIMARY KEY(id)
);

--- Cria Relações
ALTER TABLE setr.users ADD CONSTRAINT user_role_fk FOREIGN KEY(user_role) REFERENCES setr.user_roles(id);
ALTER TABLE setr.clocks ADD CONSTRAINT user_clock_fk FOREIGN KEY(id_user) REFERENCES setr.users(id);
ALTER TABLE setr.bookings ADD CONSTRAINT author_fk FOREIGN KEY(author) REFERENCES setr.users(id);
ALTER TABLE setr.bookings ADD CONSTRAINT room_fk FOREIGN KEY(room) REFERENCES setr.rooms(id);

--- Insert Data
INSERT INTO setr.user_roles(name) VALUES 
('Administrador'),
('Supervisor'),
('Funcionário');

INSERT INTO setr.users(user_role, username, password, tag, schedule) VALUES 
(1, 'administrador', 'password', 'eb:71:77:bb', '1111100'),
(2, 'supervisor', 'password', 'eb:71:77:bu', '1111100'),
(3, 'funcionario1', 'password', 'eb:71:77:bc', '1010111'),
(3, 'funcionario2', 'password', 'eb:71:77:bg', '1110011'),
(3, 'funcionario3', 'password', 'eb:71:77:bt', '0011111');

INSERT INTO setr.rooms(name) VALUES 
('Sala de Reuniões 1'),
('Sala de Reuniões 2'),
('Sala de Reuniões 3');

INSERT INTO setr.bookings(room, author, datetime, duration, description, auth) VALUES 
(1, 1, '2022-12-14T09:00:00.000Z', 60, 'Reuniao com XPTO 1, sala 1', 'true'),
(1, 1, '2022-12-14T11:00:00.000Z', 30, 'Reuniao com XPTO 2, sala 1', 'true'),
(2, 1, '2022-12-14T11:00:00.000Z', 45, 'Reuniao com XPTO 1, sala 2', 'false');