-- Create the database
--CREATE DATABASE auth-api-ci-cd; not needed because the database is created in the docker-compose file

-- Connect to the database
--\c auth-api-ci-cd; not needed because the database is created in the docker-compose file

-- Create tables
CREATE TABLE public.users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL
);

CREATE TABLE public.auth_providers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE public.user_auth_providers (
    user_id INT REFERENCES public.users(id) ON DELETE CASCADE,
    provider_id INT REFERENCES public.auth_providers(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id, provider_id)
);


CREATE TABLE public.roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE public.user_roles (
    user_id INT REFERENCES public.users(id),
    role_id INT REFERENCES public.roles(id),
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE public.permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL
);

CREATE TABLE public.role_permissions (
    role_id INT REFERENCES public.roles(id),
    permission_id INT REFERENCES public.permissions(id),
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE public.objects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE public.user_permissions (
    user_id INT REFERENCES public.users(id) ON DELETE CASCADE,
    object_id INT REFERENCES public.objects(id) ON DELETE CASCADE,
    permission_id INT REFERENCES public.permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, object_id, permission_id)
);

-- Insert into permissions table
INSERT INTO permissions (name, description) VALUES
('read', 'Permission to read data'),
('write', 'Permission to write data'),
('delete', 'Permission to delete data'),
('update', 'Permission to update data'),
('add', 'Permission to add data user or permission on user'),
('remove', 'Permission to remove data user or permission on user');

--Insert into providers table
INSERT INTO auth_providers (name) VALUES
('google'),
('github');