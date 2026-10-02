-- Exercise XP Ninja: Children's DVD waitlist
-- Continuation of the DVD Rental exercises in Exercise XP.sql and Exercise-XP-Gold.sql.

-- 1. Children's films with at least one available inventory copy.
-- An inventory copy is available if it has never been rented or its rental was returned.
SELECT f.film_id,
       f.title,
       f.rating,
       f.length
FROM film AS f
WHERE f.rating IN ('G', 'PG')
  AND EXISTS (
      SELECT 1
      FROM inventory AS i
      WHERE i.film_id = f.film_id
        AND NOT EXISTS (
            SELECT 1
            FROM rental AS r
            WHERE r.inventory_id = i.inventory_id
              AND r.return_date IS NULL
        )
  )
ORDER BY f.title;

-- 2. Create a waitlist for children waiting for a film.
-- film_id references the requested DVD; customer_id references the adult account
-- managing the request. The child's own name is stored separately.
CREATE TABLE IF NOT EXISTS kids_movie_waitlist (
    waitlist_id SERIAL PRIMARY KEY,
    film_id INTEGER NOT NULL REFERENCES film(film_id),
    customer_id INTEGER NOT NULL REFERENCES customer(customer_id),
    child_first_name VARCHAR(50) NOT NULL,
    child_last_name VARCHAR(50) NOT NULL,
    requested_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (film_id, customer_id, child_first_name, child_last_name)
);

-- 3. Add sample children to the first G/PG film, using the first customer as
-- the adult account. ON CONFLICT makes this test data safe to insert repeatedly.
INSERT INTO kids_movie_waitlist (
    film_id,
    customer_id,
    child_first_name,
    child_last_name
)
SELECT sample_film.film_id,
       sample_customer.customer_id,
       sample_child.child_first_name,
       sample_child.child_last_name
FROM (
    SELECT film_id
    FROM film
    WHERE rating IN ('G', 'PG')
    ORDER BY title
    LIMIT 1
) AS sample_film
CROSS JOIN (
    SELECT customer_id
    FROM customer
    ORDER BY customer_id
    LIMIT 1
) AS sample_customer
CROSS JOIN (
    VALUES
        ('Avery', 'Example'),
        ('Jordan', 'Example'),
        ('Riley', 'Example')
) AS sample_child(child_first_name, child_last_name)
ON CONFLICT (film_id, customer_id, child_first_name, child_last_name) DO NOTHING;

-- Waiting-list size for every G/PG film, including films with nobody waiting.
SELECT f.film_id,
       f.title,
       COUNT(w.waitlist_id) AS children_waiting
FROM film AS f
LEFT JOIN kids_movie_waitlist AS w ON w.film_id = f.film_id
WHERE f.rating IN ('G', 'PG')
GROUP BY f.film_id, f.title
ORDER BY children_waiting DESC, f.title;