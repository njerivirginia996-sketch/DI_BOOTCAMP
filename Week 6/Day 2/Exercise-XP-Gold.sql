-- Exercise XP Gold: UPDATE, DELETE, foreign keys, and INNER JOIN

-- Exercise 1: DVD Rental

-- 1. Count films for each rating.
SELECT rating, COUNT(*) AS film_count
FROM film
GROUP BY rating
ORDER BY rating;

-- 2. List all films rated G or PG-13.
SELECT film_id, title, rating, length, rental_rate
FROM film
WHERE rating IN ('G', 'PG-13')
ORDER BY title ASC;

-- 3. G or PG-13 films under two hours and under $3.00 to rent.
SELECT film_id, title, rating, length, rental_rate
FROM film
WHERE rating IN ('G', 'PG-13')
  AND length < 120
  AND rental_rate < 3.00
ORDER BY title ASC;

-- 4. Find the selected customer's current details before updating.
SELECT customer_id, first_name, last_name, email, address_id
FROM customer
WHERE customer_id = 1;

-- Sample details for customer 1. Replace these values with your own before running.
UPDATE customer
SET first_name = 'Virginia',
    last_name = 'Njeri',
    email = 'virginia.njeri@example.com'
WHERE customer_id = 1;

-- 5. Find the customer's current address before changing it.
SELECT a.address_id, a.address, a.address2, a.district, a.postal_code, a.phone
FROM address AS a
JOIN customer AS c ON c.address_id = a.address_id
WHERE c.customer_id = 1;

-- Example replacement address. Replace it with your address or another sample address.
UPDATE address
SET address = '123 Example Street',
    address2 = NULL,
    district = 'Example District',
    postal_code = '00000',
    phone = '555-0100'
WHERE address_id = (
    SELECT address_id
    FROM customer
    WHERE customer_id = 1
);


-- Exercise 2: Students

-- Update Lea and Marc Benichou to the same birth date.
UPDATE students
SET birth_date = DATE '1998-11-02'
WHERE (first_name = 'Lea' AND last_name = 'Benichou')
   OR (first_name = 'Marc' AND last_name = 'Benichou');

-- Correct David's last name.
UPDATE students
SET last_name = 'Guez'
WHERE first_name = 'David'
  AND last_name = 'Grez';

-- Delete Lea Benichou.
DELETE FROM students
WHERE first_name = 'Lea'
  AND last_name = 'Benichou';

-- Count all students after the updates and deletion.
SELECT COUNT(*) AS student_count
FROM students;

-- Count students born after January 1, 2000.
SELECT COUNT(*) AS students_born_after_2000_01_01
FROM students
WHERE birth_date > DATE '2000-01-01';

-- Add a grade column if it does not already exist.
ALTER TABLE students
ADD COLUMN IF NOT EXISTS math_grade INTEGER;

-- Assign math grades by student ID.
UPDATE students
SET math_grade = 80
WHERE id = 1;

UPDATE students
SET math_grade = 90
WHERE id IN (2, 4);

UPDATE students
SET math_grade = 40
WHERE id = 6;

-- Count students whose math grade is greater than 83.
SELECT COUNT(*) AS students_above_83
FROM students
WHERE math_grade > 83;

-- Add a second Omer Simpson record with the existing student's birth date and a grade of 70.
INSERT INTO students (first_name, last_name, birth_date, math_grade)
SELECT 'Omer', 'Simpson', birth_date, 70
FROM students
WHERE first_name = 'Omer'
  AND last_name = 'Simpson'
ORDER BY id
LIMIT 1;

-- Count recorded math grades per student name.
SELECT first_name, last_name, COUNT(math_grade) AS total_grade
FROM students
GROUP BY first_name, last_name
ORDER BY last_name, first_name;

-- Sum all math grades.
SELECT SUM(math_grade) AS sum_of_math_grades
FROM students;


-- Exercise 3: Items and customers

-- item_id is nullable so a purchase can be recorded before its item is known.
CREATE TABLE IF NOT EXISTS purchases (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    item_id INTEGER REFERENCES items(id),
    quantity_purchased INTEGER NOT NULL CHECK (quantity_purchased > 0)
);

-- Scott Scott bought one fan.
INSERT INTO purchases (customer_id, item_id, quantity_purchased)
VALUES (
    (SELECT id FROM customers WHERE first_name = 'Scott' AND last_name = 'Scott' ORDER BY id LIMIT 1),
    (SELECT id FROM items WHERE LOWER(item_name) = 'fan' ORDER BY id LIMIT 1),
    1
);

-- Melanie Johnson bought ten large desks.
INSERT INTO purchases (customer_id, item_id, quantity_purchased)
VALUES (
    (SELECT id FROM customers WHERE first_name = 'Melanie' AND last_name = 'Johnson' ORDER BY id LIMIT 1),
    (SELECT id FROM items WHERE LOWER(item_name) = 'large desk' ORDER BY id LIMIT 1),
    10
);

-- Greg Jones bought two small desks.
INSERT INTO purchases (customer_id, item_id, quantity_purchased)
VALUES (
    (SELECT id FROM customers WHERE first_name = 'Greg' AND last_name = 'Jones' ORDER BY id LIMIT 1),
    (SELECT id FROM items WHERE LOWER(item_name) = 'small desk' ORDER BY id LIMIT 1),
    2
);

-- 1. All purchases by themselves.
-- This shows IDs and quantities, but not customer or item names; joins add that context.
SELECT *
FROM purchases
ORDER BY id;

-- 2. Purchases joined with customer names.
SELECT p.id, c.first_name, c.last_name, p.item_id, p.quantity_purchased
FROM purchases AS p
INNER JOIN customers AS c ON c.id = p.customer_id
ORDER BY p.id;

-- 3. Purchases made by customer ID 5.
SELECT p.id, p.customer_id, p.item_id, p.quantity_purchased
FROM purchases AS p
WHERE p.customer_id = 5
ORDER BY p.id;

-- 4. Purchases for large desks and small desks.
SELECT p.id, i.item_name, p.quantity_purchased
FROM purchases AS p
INNER JOIN items AS i ON i.id = p.item_id
WHERE LOWER(i.item_name) IN ('large desk', 'small desk')
ORDER BY p.id;

-- Show the customers who have purchased an item.
SELECT c.first_name, c.last_name, i.item_name
FROM purchases AS p
INNER JOIN customers AS c ON c.id = p.customer_id
INNER JOIN items AS i ON i.id = p.item_id
ORDER BY c.last_name, c.first_name, i.item_name;

-- A customer can be referenced without an item because item_id is nullable.
-- The foreign key is checked only when item_id contains a non-NULL value.
INSERT INTO purchases (customer_id, item_id, quantity_purchased)
VALUES (5, NULL, 1);

SELECT *
FROM purchases
WHERE customer_id = 5
  AND item_id IS NULL;