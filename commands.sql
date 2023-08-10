CREATE TABLE blogs (
  id     SERIAL PRIMARY KEY,
  author TEXT,
  url    TEXT NOT null,
  title  TEXT NOT null,
  likes  INTEGER DEFAULT 0 NOT NULL
);

INSERT INTO blogs (
  author,
  url,
  title
) VALUES (
  'Michael "Monty" Widenius',
  'https://www.mysql.com/',
  'MySQL was created by Monty along with a few swedes'
);

INSERT INTO blogs (
  author,
  url,
  title
) VALUES (
  'Prof. Michael Stonebreaker',
  'https://www.postgresql.org/',
  'From POSTGRES to PostgreSQL'
);
