----------------------------------------
------ Access List Query
----------------------------------------
SELECT 
id,
name,
coalesce(
	(
		SELECT array_to_json(array_agg(row_to_json(x))) 
		FROM (
			SELECT u.id, u.name 
			FROM setr.users_areas ua 
			JOIN setr.users u ON u.id = ua.id_user 
			WHERE ua.id_area = areas.id
		) x
	),
'[]') AS authorized
FROM setr.areas
ORDER BY id DESC;



----------------------------------------
--- Rooms List Query
----------------------------------------
SELECT
r.id, 
r.name, 
count(b.id)::INTEGER AS bookings
FROM setr.rooms r
LEFT JOIN setr.bookings b ON r.id = b.id_room
GROUP BY r.id
ORDER BY bookings DESC



----------------------------------------
--- Bookings List Query
----------------------------------------
SELECT 
id,
(
	SELECT row_to_json(x) 
	FROM (
		SELECT u.id, u.name 
		FROM setr.users u 
		WHERE bookings.id_user = u.id
	) 
x) AS user,
(
	SELECT row_to_json(x) 
	FROM (
		SELECT r.id, r.name 
		FROM setr.rooms r 
		WHERE bookings.id_room = r.id
	) 
x) AS room,
start,
final,
AGE(final, start) AS duration,
description,
validated
FROM setr.bookings



----------------------------------------
--- Clocks List Query
----------------------------------------
SELECT
id,
(
	SELECT row_to_json(x) 
	FROM (
		SELECT u.id, u.name 
		FROM setr.users u 
		WHERE clocks.id_user = u.id
	) 
x) AS user,
direction,
datetime,
(
	SELECT row_to_json(x) 
	FROM (
		SELECT u.id, u.name 
		FROM setr.users u 
		WHERE clocks.log = u.id
	) 
x) AS log
FROM setr.clocks



----------------------------------------
--- Users List Query
----------------------------------------
SELECT
id,
(
	SELECT row_to_json(x) 
	FROM (
		SELECT ur.id, ur.name 
		FROM setr.user_roles ur 
		WHERE users.id_user_role = ur.id
	) 
x) AS role,
username,
name,
tag,
schedule,
coalesce(
	(
		SELECT array_to_json(array_agg(row_to_json(x))) 
		FROM (
			SELECT a.id, a.name 
			FROM setr.areas a 
			JOIN setr.users_areas ua ON a.id = ua.id_area 
			WHERE users.id = ua.id_user
		) 
	x), 
'[]') AS areas,
coalesce(
	(
		SELECT array_to_json(array_agg(row_to_json(x))) 
		FROM (
			SELECT c.id, c.direction, c.datetime 
			FROM setr.clocks c 
			WHERE users.id = c.id_user 
			LIMIT 4
		) 
	x), 
'[]') AS lastClocks,
coalesce(
	(
		SELECT array_to_json(array_agg(row_to_json(x))) 
		FROM (
			SELECT b.id, b.start, b.description 
			FROM setr.bookings b 
			WHERE users.id = b.id_user AND b.start >= NOW()::timestamp 
			ORDER BY b.start ASC
		) 
	x), 
'[]') AS nextBookings
FROM setr.users
WHERE status = 'status' AND id_user_role = 1
ORDER BY id ASC
