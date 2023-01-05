--- Apaga o Schema e todos os seus dependentes
DROP SCHEMA IF EXISTS setr CASCADE;

--- Cria o Schema
CREATE SCHEMA IF NOT EXISTS setr AUTHORIZATION tbbcyxmeuvfpyt;

--- Cria as Tabelas
CREATE TABLE setr.user_roles(
	id							SERIAL,
	name						VARCHAR(50),
	permissions			JSON,
	control					BOOLEAN					DEFAULT false,
	access					BOOLEAN					DEFAULT false,
	CONSTRAINT user_roles_pk PRIMARY KEY(id)
);

CREATE TABLE setr.users(
	id							SERIAL,
	id_user_role		INT,
	username				VARCHAR(50),
	password				TEXT,
	name 						VARCHAR(50),
	tag							VARCHAR(50),
	schedule				VARCHAR(7),
	status					VARCHAR(20)			DEFAULT 'user', 
	CONSTRAINT users_pk PRIMARY KEY(id),
	CONSTRAINT users_uk UNIQUE(username)
);

CREATE TABLE setr.user_keys(
	id					SERIAL,
	id_user			INT,
	consumer		VARCHAR(250),
	secret			TEXT,
	CONSTRAINT user_keys_pk PRIMARY KEY(id)
);

CREATE TABLE setr.clocks(
	id					SERIAL,
	id_user			INT,
	direction		VARCHAR(50),
	datetime		TIMESTAMPTZ(0),
	log					INT,
	CONSTRAINT clocks_pk PRIMARY KEY(id)
);

CREATE TABLE setr.rooms(
	id			SERIAL,
	name		VARCHAR(50),
CONSTRAINT rooms_pk PRIMARY KEY(id)
);

CREATE TABLE setr.bookings(
	id						SERIAL,
	id_user				INT,
	id_room				INT,
	start					TIMESTAMPTZ(0),
	final					TIMESTAMPTZ(0),
	description		TEXT,
	validated			BOOLEAN 					DEFAULT false,
	CONSTRAINT bookings_pk PRIMARY KEY(id)
);

CREATE TABLE setr.areas(
	id			SERIAL,
	name		VARCHAR(50),
CONSTRAINT areas_pk PRIMARY KEY(id)
);

--- Cria as Relações
ALTER TABLE setr.users ADD CONSTRAINT user_role_users_fk FOREIGN KEY(id_user_role) REFERENCES setr.user_roles(id);
ALTER TABLE setr.user_keys ADD CONSTRAINT user_user_keys_fk FOREIGN KEY(id_user) REFERENCES setr.users(id);
ALTER TABLE setr.clocks ADD CONSTRAINT user_clocks_fk FOREIGN KEY(id_user) REFERENCES setr.users(id);
ALTER TABLE setr.clocks ADD CONSTRAINT log_clocks_fk FOREIGN KEY(log) REFERENCES setr.users(id);
ALTER TABLE setr.bookings ADD CONSTRAINT user_bookings_fk FOREIGN KEY(id_user) REFERENCES setr.users(id);
ALTER TABLE setr.bookings ADD CONSTRAINT room_bookings_fk FOREIGN KEY(id_room) REFERENCES setr.rooms(id);

--- Cria as Tabelas Associativas
CREATE TABLE setr.users_areas(
	id_user 		INT,
	id_area 		INT,
CONSTRAINT users_areas_pk PRIMARY KEY(id_user, id_area)
);

--- Cria as Relações das Tabelas Associativas
ALTER TABLE setr.users_areas ADD CONSTRAINT user_areas_fk FOREIGN KEY(id_user) REFERENCES setr.users(id);
ALTER TABLE setr.users_areas ADD CONSTRAINT area_users_fk FOREIGN KEY(id_area) REFERENCES setr.areas(id);

--- Insere os dados iniciais
INSERT INTO setr.user_roles(name, permissions, control, access) VALUES 
('Administradores', '{"access": {"clockIn": false, "clockOut": false, "area": false, "room": false}, "areas": {"list": true, "create": true, "read": true, "update": true, "destroy": true}, "bookings": {"list": true, "create": true, "read": true, "update": true, "destroy": true, "validate": true}, "clocks": {"list": true, "create": true, "read": true, "update": true, "destroy": true}, "rooms": {"list": true, "create": true, "read": true, "update": true, "destroy": true}, "users": {"list": true, "create": true, "read": true, "update": true, "destroy": true}}', 'true', 'true'),
('Utilizadores do Sistema', '{"access": {"clockIn": true, "clockOut": true, "area": true, "room": true}, "areas": {"list": false, "create": false, "read": false, "update": false, "destroy": false}, "bookings": {"list": false, "create": false, "read": false, "update": false, "destroy": false, "validate": false}, "clocks": {"list": false, "create": false, "read": false, "update": false, "destroy": false}, "rooms": {"list": false, "create": false, "read": false, "update": false, "destroy": false}, "users": {"list": false, "create": false, "read": false, "update": false, "destroy": false}}', 'false', 'false'),
('Supervisores', '{"access": {"clockIn": false, "clockOut": false, "area": false, "room": false}, "areas": {"list": true, "create": false, "read": true, "update": false, "destroy": false}, "bookings": {"list": true, "create": true, "read": true, "update": true, "destroy": true, "validate": true}, "clocks": {"list": true, "create": true, "read": true, "update": true, "destroy": true}, "rooms": {"list": true, "create": false, "read": true, "update": false, "destroy": false}, "users": {"list": true, "create": false, "read": true, "update": true, "destroy": false}}', 'true', 'true'),
('Funcionários', '{"access": {"clockIn": false, "clockOut": false, "area": false, "room": false}, "areas": {"list": false, "create": false, "read": false, "update": false, "destroy": false}, "bookings": {"list": true, "create": true, "read": true, "update": true, "destroy": true, "validate": false}, "clocks": {"list": true, "create": false, "read": false, "update": false, "destroy": false}, "rooms": {"list": true, "create": false, "read": true, "update": false, "destroy": false}, "users": {"list": false, "create": false, "read": true, "update": true, "destroy": false}} ', 'false', 'false');

INSERT INTO setr.users(id_user_role, username, password, name, tag, schedule, status) VALUES 
(1, 'rdantas', '$2b$10$ykHh0eO0UWEHWS8K70S1de4SOmvMDJa2frq2hTfdePDWjSBbbMHUe', 'Renato Dantas', 'eb7177bb', '0111110', 'user'),
(2, 'arduino', '', 'Arduino', '', '', 'system'),
(3, 'fmota', '$2b$10$YbHI9EAu1QXCn1rhUJzw6OSG5ZbLRQrO5nc8ey3axlD0UpEh1hZBG', 'Fábio Mota', 'eb7177bu', '0111110', 'user'),
(4, 'jmorais', '$2b$10$pnIImvJjnsIFKmwsH5.IFOe1CBlsjY86vOXdiUj6jV9HFntEQWZq6', 'João Morais', 'eb7177bc', '0111110', 'user'),
(4, 'jguedes', '$2b$10$069kitPOLStSBUoesC7Di.L8XkVtFsca8Gz7peH9kZiosL2ZyJkmC', 'Jorge Guedes', 'eb7177bg', '0011111', 'user'),
(4, 'bsara', '$2b$10$CkEisOvHvilPgUPHic5ykuNG9Yv7isZ1SH.8xbgb8bD9Fi6P1noNS', 'Benjamin da Sara', 'eb7177bt', '1111110', 'user');

INSERT INTO setr.user_keys(id_user, consumer, secret) VALUES
(1, '1blQ0D2KM2lPNAPB', '$2b$10$LXvyYKwyRTx9HcJjUd7Pi.c19ccteemvcxOQuY284U4XycBbwgUlO'),
(2, 'zzKn4iv6MUpCyCVb', '$2b$10$2tm5Oiz2SLMLCDoXdEm6dut/DGlK84xk0dj1yQiDjHGFbYMEZgJtK');
