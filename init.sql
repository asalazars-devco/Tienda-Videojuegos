CREATE TABLE videojuegos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    precio REAL NOT NULL,
    imagen TEXT,
    stock INTEGER
);

CREATE TABLE ordenes (
	id SERIAL PRIMARY KEY,
	videojuegos_comprados JSONB,
	cantidad INTEGER,
	valor_total REAL,
	id_usuario INTEGER
);

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    rol VARCHAR(20)
);

INSERT INTO usuarios (id, nombre, email, password, rol)
VALUES (0, 'admin', 'admin@mail.com', '$2a$10$a33eoxzdLzRbtjUHyyDEEe4ngmoGlFrP.gTFr0Yyy3SrV/89uTjuO', 'admin');