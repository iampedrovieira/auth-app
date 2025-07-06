
--Insert Some InitalUsers
INSERT INTO users (name, email, username, password_hash, token) VALUES
('Pedro','pedro@user.com','pedro_user',
'$2a$10$2s3zplGa8x4MUpwASc.YQeAmHBPwbzur8TtHMXAY9y6wIBr9a0DNW', null);

INSERT INTO users (name, email, username, password_hash, token) VALUES
('Owner','Owner@user.com','owner_user',
'$2a$10$2s3zplGa8x4MUpwASc.YQeAmHBPwbzur8TtHMXAY9y6wIBr9a0DNW', null);

INSERT INTO objects (name) VALUES
('object-1'),
('object-2'),
('object-3');

-- Insert user permissions
INSERT INTO user_permissions (user_id, object_id, permission_id) VALUES(
    (SELECT id FROM users WHERE username = 'pedro_user'),
    (SELECT id FROM objects WHERE name = 'object-1'),
    (SELECT id FROM permissions WHERE name = 'read')
);
INSERT INTO user_permissions (user_id, object_id, permission_id) VALUES(
    (SELECT id FROM users WHERE username = 'pedro_user'),
    (SELECT id FROM objects WHERE name = 'object-2'),
    (SELECT id FROM permissions WHERE name = 'update')
);

INSERT INTO user_permissions (user_id, object_id, permission_id) VALUES(
    (SELECT id FROM users WHERE username = 'pedro_user'),
    (SELECT id FROM objects WHERE name = 'object-3'),
    (SELECT id FROM permissions WHERE name = 'delete')
);

INSERT INTO user_permissions (user_id, object_id, permission_id) VALUES(
    (SELECT id FROM users WHERE username = 'owner_user'),
    (SELECT id FROM objects WHERE name = 'object-1'),
    (SELECT id FROM permissions WHERE name = 'read')
);
INSERT INTO user_permissions (user_id, object_id, permission_id) VALUES(
    (SELECT id FROM users WHERE username = 'owner_user'),
    (SELECT id FROM objects WHERE name = 'object-1'),
    (SELECT id FROM permissions WHERE name = 'update')
);

INSERT INTO user_permissions (user_id, object_id, permission_id) VALUES(
    (SELECT id FROM users WHERE username = 'owner_user'),
    (SELECT id FROM objects WHERE name = 'object-1'),
    (SELECT id FROM permissions WHERE name = 'delete')
);
