-- ============================================
-- PART I: One-to-One relationship
-- ============================================

-- 1. Create Customer and Customer_profile tables
CREATE TABLE Customer (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50) NOT NULL
);

CREATE TABLE Customer_profile (
    id SERIAL PRIMARY KEY,
    isLoggedIn BOOLEAN DEFAULT false,
    customer_id INTEGER UNIQUE REFERENCES Customer(id)
);
-- UNIQUE on customer_id is what enforces the "One to One" relationship:
-- without it, one customer could have multiple profile rows (a One-to-Many).

-- 2. Insert customers
INSERT INTO Customer (first_name, last_name) VALUES
('John', 'Doe'),
('Jerome', 'Lalu'),
('Lea', 'Rive');

-- 3. Insert customer profiles using subqueries
INSERT INTO Customer_profile (isLoggedIn, customer_id)
VALUES (true, (SELECT id FROM Customer WHERE first_name = 'John' AND last_name = 'Doe'));

INSERT INTO Customer_profile (isLoggedIn, customer_id)
VALUES (false, (SELECT id FROM Customer WHERE first_name = 'Jerome' AND last_name = 'Lalu'));

-- 4a. First names of logged-in customers (INNER JOIN — only customers with a matching profile)
SELECT c.first_name
FROM Customer c
JOIN Customer_profile cp ON cp.customer_id = c.id
WHERE cp.isLoggedIn = true;

-- 4b. All customers' first_name and isLoggedIn, including those with no profile (LEFT JOIN)
SELECT c.first_name, cp.isLoggedIn
FROM Customer c
LEFT JOIN Customer_profile cp ON cp.customer_id = c.id;

-- 4c. Count of customers that are NOT logged in
-- (includes customers with isLoggedIn = false AND customers with no profile at all,
--  since Lea has no profile and therefore isn't "logged in" either)
SELECT COUNT(*)
FROM Customer c
LEFT JOIN Customer_profile cp ON cp.customer_id = c.id
WHERE cp.isLoggedIn IS NOT TRUE;


-- ============================================
-- PART II: Many-to-Many relationship
-- ============================================

-- 1. Create Book table
CREATE TABLE Book (
    book_id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    author VARCHAR(100) NOT NULL
);

-- 2. Insert books
INSERT INTO Book (title, author) VALUES
('Alice In Wonderland', 'Lewis Carroll'),
('Harry Potter', 'J.K Rowling'),
('To kill a mockingbird', 'Harper Lee');

-- 3. Create Student table, age capped at 15 via CHECK constraint
CREATE TABLE Student (
    student_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    age INTEGER CHECK (age <= 15)
);

-- 4. Insert students
INSERT INTO Student (name, age) VALUES
('John', 12),
('Lera', 11),
('Patrick', 10),
('Bob', 14);

-- 5. Create Library junction table (Many-to-Many)
CREATE TABLE Library (
    book_fk_id INTEGER REFERENCES Book(book_id) ON DELETE CASCADE ON UPDATE CASCADE,
    student_fk_id INTEGER REFERENCES Student(student_id) ON DELETE CASCADE ON UPDATE CASCADE,
    borrowed_date DATE,
    PRIMARY KEY (book_fk_id, student_fk_id)
);
-- NOTE: a composite PK on (book_fk_id, student_fk_id) means a given student
-- can't borrow the exact same book twice as separate rows. If your data needs
-- to allow that (e.g. same student borrows the same book on two different dates),
-- the PK would need to include borrowed_date too, or use a surrogate SERIAL PK instead.

-- 6. Insert borrow records using subqueries
INSERT INTO Library (book_fk_id, student_fk_id, borrowed_date)
VALUES (
    (SELECT book_id FROM Book WHERE title = 'Alice In Wonderland'),
    (SELECT student_id FROM Student WHERE name = 'John'),
    '2022-02-15'
);

INSERT INTO Library (book_fk_id, student_fk_id, borrowed_date)
VALUES (
    (SELECT book_id FROM Book WHERE title = 'To kill a mockingbird'),
    (SELECT student_id FROM Student WHERE name = 'Bob'),
    '2021-03-03'
);

INSERT INTO Library (book_fk_id, student_fk_id, borrowed_date)
VALUES (
    (SELECT book_id FROM Book WHERE title = 'Alice In Wonderland'),
    (SELECT student_id FROM Student WHERE name = 'Lera'),
    '2021-05-23'
);

INSERT INTO Library (book_fk_id, student_fk_id, borrowed_date)
VALUES (
    (SELECT book_id FROM Book WHERE title = 'Harry Potter'),
    (SELECT student_id FROM Student WHERE name = 'Bob'),
    '2021-08-12'
);

-- 7a. All columns from the junction table
SELECT * FROM Library;

-- 7b. Student name + book title of borrowed books
SELECT s.name, b.title
FROM Library l
JOIN Student s ON s.student_id = l.student_fk_id
JOIN Book b ON b.book_id = l.book_fk_id;

-- 7c. Average age of children who borrowed "Alice In Wonderland"
SELECT AVG(s.age) AS avg_age
FROM Library l
JOIN Student s ON s.student_id = l.student_fk_id
JOIN Book b ON b.book_id = l.book_fk_id
WHERE b.title = 'Alice In Wonderland';

-- 7d. Delete a student — what happens to the junction table?
-- ON DELETE CASCADE on student_fk_id means any Library rows referencing that
-- student are automatically deleted too, rather than blocking the delete.
SELECT * FROM Library WHERE student_fk_id = (SELECT student_id FROM Student WHERE name = 'Bob');
-- view before delete: should show 2 rows (Bob borrowed 2 books)

DELETE FROM Student WHERE name = 'Bob';

SELECT * FROM Library WHERE student_fk_id = (SELECT student_id FROM Student WHERE name = 'Bob');
-- view after delete: should return 0 rows — cascade removed Bob's borrow records