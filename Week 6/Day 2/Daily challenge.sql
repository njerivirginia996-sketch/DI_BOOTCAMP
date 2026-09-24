-- Setup: create and populate FirstTab
CREATE TABLE FirstTab (
     id integer, 
     name VARCHAR(10)
);

INSERT INTO FirstTab VALUES
(5,'Pawan'),
(6,'Sharlee'),
(7,'Krish'),
(NULL,'Avtaar');

SELECT * FROM FirstTab;

-- Setup: create and populate SecondTab
CREATE TABLE SecondTab (
    id integer 
);

INSERT INTO SecondTab VALUES
(5),
(NULL);

SELECT * FROM SecondTab;


-- Q1: Expected output -> 0
-- Subquery returns (NULL), which poisons the NOT IN comparison for every row.
SELECT COUNT(*) 
FROM FirstTab AS ft 
WHERE ft.id NOT IN ( SELECT id FROM SecondTab WHERE id IS NULL );


-- Q2: Expected output -> 2
-- Subquery returns (5), a clean list with no NULL. Excludes id=5 and id=NULL; keeps id=6 and id=7.
SELECT COUNT(*) 
FROM FirstTab AS ft 
WHERE ft.id NOT IN ( SELECT id FROM SecondTab WHERE id = 5 );


-- Q3: Expected output -> 0
-- Subquery returns (5, NULL), which contains a NULL and poisons the comparison for every row.
SELECT COUNT(*) 
FROM FirstTab AS ft 
WHERE ft.id NOT IN ( SELECT id FROM SecondTab );


-- Q4: Expected output -> 2
-- Subquery returns (5), a clean list with no NULL. Same result as Q2.
SELECT COUNT(*) 
FROM FirstTab AS ft 
WHERE ft.id NOT IN ( SELECT id FROM SecondTab WHERE id IS NOT NULL );