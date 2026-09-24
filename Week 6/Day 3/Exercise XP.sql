-- ============================================
-- EXERCISE 1: DVD Rental
-- ============================================

-- 1. All languages
SELECT * FROM language;

-- 2. Films joined with their language (title, description, language name)
SELECT f.title, f.description, l.name AS language_name
FROM film f
JOIN language l ON f.language_id = l.language_id;

-- 3. All languages, even those with no films
SELECT f.title, f.description, l.name AS language_name
FROM language l
LEFT JOIN film f ON f.language_id = l.language_id;

-- 4. Create new_film table and add some films
CREATE TABLE new_film (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100)
);

INSERT INTO new_film (name) VALUES
('The Great Escape'),
('Midnight Run'),
('Ocean Drive');

-- 5. Create customer_review table
-- ON DELETE CASCADE ensures reviews are auto-deleted if their film is deleted
CREATE TABLE customer_review (
    review_id SERIAL PRIMARY KEY,
    film_id INTEGER NOT NULL REFERENCES new_film(id) ON DELETE CASCADE,
    language_id INTEGER REFERENCES language(language_id),
    title VARCHAR(100),
    score INTEGER CHECK (score BETWEEN 1 AND 10),
    review_text TEXT,
    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Add 2 reviews
-- NOTE: check your actual new_film ids and language ids before running this
-- (SELECT * FROM new_film; and SELECT * FROM language;)
INSERT INTO customer_review (film_id, language_id, title, score, review_text)
VALUES
(1, 1, 'Amazing!', 9, 'Loved every minute of this film.'),
(2, 1, 'Not bad', 6, 'Decent movie, worth a watch once.');

-- 7. Delete a film that has a review — check the cascade effect
SELECT * FROM customer_review;  -- view before delete

DELETE FROM new_film WHERE id = 1;

SELECT * FROM customer_review;  -- view after delete: the linked review should be gone


-- ============================================
-- EXERCISE 2: DVD Rental
-- ============================================

-- 1. Update the language of some films
-- Check available languages first
SELECT * FROM language;

UPDATE film
SET language_id = (SELECT language_id FROM language WHERE name = 'English')
WHERE film_id IN (1, 2, 3);

-- 2. Foreign keys on the customer table
-- customer references address(address_id) and store(store_id) --
-- meaning you must insert a valid address (and store) row BEFORE inserting a customer that points to it.
SELECT
    tc.constraint_name,
    kcu.column_name,
    ccu.table_name AS references_table,
    ccu.column_name AS references_column
FROM information_schema.table_constraints tc
JOIN