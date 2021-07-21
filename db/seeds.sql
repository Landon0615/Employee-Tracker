USE employee_trackerDB; 

INSERT INTO department (name)
VALUES ('Sales'),
       ('Technician'),
       ('Parts')
       ('Finance'),
       

INSERT INTO role 
    (title,salary,department_id)
VALUES 
    ('Sales Manager', 145000, 1),
    ('Sales Person', 75000, 1),

    ('Shop Foreman', 110000, 2),
    ('Automotive Technician', 85000, 2),

    ('Parts Manager', 102000, 3),
    ('Parts Desk', 55000,3),

    ('Finance Manager', 152000,4),
    ('Accountant', 105000, 4);

INSERT INTO employee 
    (first_name,last_name,role_id,manager_id)
VALUES 
    ('Chris', 'Bob', 1, NULL),
    ('Jen', 'Fro', 2, 1),
    ('Fred', 'Decks', 3, NULL),
    ('Sarah', 'June', 4, 3),
    ('Randal', 'Socks', 5, NULL),
    ('Ben', 'Chuck', 6, 5),
    ('Frodo', 'Dun', 7, NULL),
    ('Tosh', 'Karen', 8, 7);