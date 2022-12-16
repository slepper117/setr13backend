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
	name 				VARCHAR(50),
	tag					VARCHAR(50),
	schedule		VARCHAR(7),
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
	author				INT,
	room					INT,
	start 				TIMESTAMPTZ(0),
	final					TIMESTAMPTZ(0),
	description 	TEXT,
	validated 		BOOLEAN 					DEFAULT false,
	CONSTRAINT bookings_pk PRIMARY KEY(id)
);

CREATE TABLE setr.areas(
	id 			SERIAL,
	name 		VARCHAR(50),
CONSTRAINT areas_pk PRIMARY KEY(id)
);

--- Cria Relações
ALTER TABLE setr.users ADD CONSTRAINT user_role_fk FOREIGN KEY(user_role) REFERENCES setr.user_roles(id);
ALTER TABLE setr.clocks ADD CONSTRAINT user_clock_fk FOREIGN KEY(id_user) REFERENCES setr.users(id);
ALTER TABLE setr.bookings ADD CONSTRAINT author_fk FOREIGN KEY(author) REFERENCES setr.users(id);
ALTER TABLE setr.bookings ADD CONSTRAINT room_fk FOREIGN KEY(room) REFERENCES setr.rooms(id);

--- Cria Tabelas Associativas
CREATE TABLE setr.users_areas(
	id_user 		INT,
	id_area 		INT,
CONSTRAINT users_areas_pk PRIMARY KEY(id_user, id_area)
);

--- Cria Relações
ALTER TABLE setr.users_areas ADD CONSTRAINT user_area_fk FOREIGN KEY(id_user) REFERENCES setr.users(id);
ALTER TABLE setr.users_areas ADD CONSTRAINT area_user_fk FOREIGN KEY(id_area) REFERENCES setr.areas(id);


--- Insert Data
INSERT INTO setr.user_roles(name) VALUES 
('Administrador'),
('Supervisor'),
('Funcionário');

INSERT INTO setr.users(user_role, username, password, name, tag, schedule) VALUES 
(1, 'administrador', '$2b$10$wYHL4eiJoqED0IYZIqr3kuz72P6IrMlsUPKs6fn6K/RdKGsh.LDC6', 'Administrador', 'eb:71:77:bb', '0111110'),
(2, 'supervisor', '$2b$10$ZBCVPchyqBf/FdUer.tDFOmU8fkhp8F1apHoTPFD0taxSIYxjjub.', 'Supervisor', 'eb:71:77:bu', '0111110'),
(3, 'funcionario1', '$2b$10$Jl1cqCLJt9SAHS5M5/TtOeR3Xd3co.uiYXZ1Z6SrYBX0QQkQFaCti', 'Funcionário 1', 'eb:71:77:bc', '0111110'),
(3, 'funcionario2', '$2b$10$MZejZGfN79G0l2uqdkNLq.qEcodPVmaGfmuZdFLg6BMro8MnSZvT.', 'Funcionário 2', 'eb:71:77:bg', '0011111'),
(3, 'funcionario3', '$2b$10$U0ePB//72Sso4.WQUICtSOMByfTMjZ92SmifDGJpIn7e32tWf012O', 'Funcionário 3', 'eb:71:77:bt', '1111110');

INSERT INTO setr.rooms(name) VALUES 
('Sala de Reuniões 1'),
('Sala de Reuniões 2'),
('Sala de Reuniões 3');

INSERT INTO setr.bookings(room, author, start, final, description, validated) VALUES 
(1, 1, '2022-12-14T09:00:00.000Z', '2022-12-14T10:00:00.000Z', 'Reuniao com XPTO 1, sala 1', 'true'),
(1, 1, '2022-12-14T09:00:00.000Z', '2022-12-20T10:00:00.000Z', 'Reuniao com XPTO 1, sala 1', 'true'),
(1, 1, '2022-12-14T11:00:00.000Z', '2022-12-14T11:30:00.000Z', 'Reuniao com XPTO 2, sala 1', 'true'),
(2, 1, '2022-12-14T11:00:00.000Z', '2022-12-14T11:45:00.000Z', 'Reuniao com XPTO 1, sala 2', 'false');

INSERT INTO setr.areas(name) VALUES 
('Sala dos Servidores');

INSERT INTO setr.users_areas(id_user, id_area) VALUES 
(1, 1),
(5, 1);