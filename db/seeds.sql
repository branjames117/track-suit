INSERT INTO departments (name) VALUES
  ('Counter-Intelligence'),
  ('Terrorism'),
  ('Revenge'),
  ('Extortion');

INSERT INTO roles (title, salary, department_id) VALUES
  ('Spy Hunter', 80000, 1),
  ('Honey Pot', 78000, 1),
  ('Hijacker', 65000, 2),
  ('Sharpshooter', 95000, 2),
  ('Logistician', 90000, 2),
  ('Blackmailer', 100000, 3),
  ('Burglar', 50000, 4),
  ('Heist Master', 120000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
  ('Ernst', 'Blofeld', 5, NULL),
  ('Friedrich', 'Koenig', 6, 1),
  ('Vesper', 'Lynd', 2, 1),
  ('Raoul', 'Silva', 8, 1),
  ('Jean', 'Duran', 7, 1),
  ('Yusef', 'Kabira', 1, 1),
  ('Dominic', 'Greene', 6, 1);