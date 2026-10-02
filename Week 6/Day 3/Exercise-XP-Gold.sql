-- Exercise XP Gold: Relationships and queries
-- Continuation of Exercise XP.sql; run against the same PostgreSQL DVD Rental database.

-- Exercise 1: DVD Rentals

-- 1. Rentals that are still out.
-- return_date IS NULL means a rental has not yet been returned.
SELECT r.rental_id,
       c.customer_id,
       c.first_name,
       c.last_name,
       f.title,
       r.rental_date,
       r.return_date
FROM rental AS r
INNER JOIN inventory AS i ON i.inventory_id = r.inventory_id
INNER JOIN film AS f ON f.film_id = i.film_id
INNER JOIN customer AS c ON c.customer_id = r.customer_id
WHERE r.return_date IS NULL
ORDER BY r.rental_date;

-- 2. Customers with one or more rentals that have not been returned.
SELECT c.customer_id,
       c.first_name,
       c.last_name,
       COUNT(r.rental_id) AS outstanding_rentals
FROM customer AS c
INNER JOIN rental AS r ON r.customer_id = c.customer_id
WHERE r.return_date IS NULL
GROUP BY c.customer_id, c.first_name, c.last_name
ORDER BY outstanding_rentals DESC, c.last_name, c.first_name;

-- 3. Shortcut: DVD Rental's film_list view already combines films, categories,
-- and actors, so it can find Action films featuring Joe Swank in one query.
SELECT fid AS film_id, title, category, actors
FROM film_list
WHERE category = 'Action'
  AND actors ILIKE '%Joe Swank%'
ORDER BY title;


-- Exercise 2: Happy Halloween

-- 1. Total number of stores.
SELECT COUNT(*) AS store_count
FROM store;

-- City and country for each store.
SELECT s.store_id,
       ci.city,
       co.country
FROM store AS s
INNER JOIN address AS a ON a.address_id = s.address_id
INNER JOIN city AS ci ON ci.city_id = a.city_id
INNER JOIN country AS co ON co.country_id = ci.country_id
ORDER BY s.store_id;

-- 2-3. Available inventory viewing time per store.
-- An inventory item is excluded if its latest/current rental has no return date.
-- SUM(f.length) is in minutes; hours and days are derived from that total.
SELECT s.store_id,
       COUNT(i.inventory_id) AS available_inventory_items,
       COALESCE(SUM(f.length), 0) AS total_minutes,
       ROUND(COALESCE(SUM(f.length), 0)::numeric / 60, 2) AS total_hours,
       ROUND(COALESCE(SUM(f.length), 0)::numeric / 1440, 2) AS total_days
FROM store AS s
LEFT JOIN inventory AS i
       ON i.store_id = s.store_id
      AND NOT EXISTS (
          SELECT 1
          FROM rental AS r
          WHERE r.inventory_id = i.inventory_id
            AND r.return_date IS NULL
      )
LEFT JOIN film AS f ON f.film_id = i.film_id
GROUP BY s.store_id
ORDER BY s.store_id;

-- 4. Customers who live in a city where a store is located.
SELECT DISTINCT c.customer_id,
       c.first_name,
       c.last_name,
       customer_city.city
FROM customer AS c
INNER JOIN address AS customer_address ON customer_address.address_id = c.address_id
INNER JOIN city AS customer_city ON customer_city.city_id = customer_address.city_id
WHERE EXISTS (
    SELECT 1
    FROM store AS s
    INNER JOIN address AS store_address ON store_address.address_id = s.address_id
    WHERE store_address.city_id = customer_city.city_id
)
ORDER BY customer_city.city, c.last_name, c.first_name;

-- 5. Customers who live in a country where a store is located.
SELECT DISTINCT c.customer_id,
       c.first_name,
       c.last_name,
       customer_country.country
FROM customer AS c
INNER JOIN address AS customer_address ON customer_address.address_id = c.address_id
INNER JOIN city AS customer_city ON customer_city.city_id = customer_address.city_id
INNER JOIN country AS customer_country ON customer_country.country_id = customer_city.country_id
WHERE EXISTS (
    SELECT 1
    FROM store AS s
    INNER JOIN address AS store_address ON store_address.address_id = s.address_id
    INNER JOIN city AS store_city ON store_city.city_id = store_address.city_id
    WHERE store_city.country_id = customer_city.country_id
)
ORDER BY customer_country.country, c.last_name, c.first_name;

-- 6. Build a temporary safe-film list.
-- CHECK constraints reject horror categories and unsafe words in the title or description.
CREATE TEMP TABLE IF NOT EXISTS safe_film_list (
    film_id INTEGER PRIMARY KEY REFERENCES film(film_id),
    title TEXT NOT NULL,
    description TEXT,
    length INTEGER NOT NULL CHECK (length > 0),
    categories TEXT NOT NULL,
    CONSTRAINT safe_film_no_horror
        CHECK (categories !~* '(^|, )horror(,|$)'),
    CONSTRAINT safe_film_safe_title
        CHECK (title !~* '\m(beast|monster|ghost|dead|zombie|undead)\M'),
    CONSTRAINT safe_film_safe_description
        CHECK (COALESCE(description, '') !~* '\m(beast|monster|ghost|dead|zombie|undead)\M')
);

TRUNCATE TABLE safe_film_list;

INSERT INTO safe_film_list (film_id, title, description, length, categories)
SELECT f.film_id,
       f.title,
       f.description,
       f.length,
       COALESCE(STRING_AGG(DISTINCT cat.name, ', ' ORDER BY cat.name), '') AS categories
FROM film AS f
LEFT JOIN film_category AS fc ON fc.film_id = f.film_id
LEFT JOIN category AS cat ON cat.category_id = fc.category_id
GROUP BY f.film_id, f.title, f.description, f.length
HAVING NOT COALESCE(BOOL_OR(cat.name = 'Horror'), FALSE)
   AND f.title !~* '\m(beast|monster|ghost|dead|zombie|undead)\M'
   AND COALESCE(f.description, '') !~* '\m(beast|monster|ghost|dead|zombie|undead)\M';

-- Safe list with total runtime in minutes, hours, and days.
SELECT COUNT(*) AS safe_film_count,
       SUM(length) AS total_minutes,
       ROUND(SUM(length)::numeric / 60, 2) AS total_hours,
       ROUND(SUM(length)::numeric / 1440, 2) AS total_days
FROM safe_film_list;

-- Safe film titles and runtime.
SELECT film_id, title, categories, length AS runtime_minutes
FROM safe_film_list
ORDER BY title;

-- 7. Safe, available inventory runtime for each store, also in hours and days.
SELECT s.store_id,
       COUNT(sf.film_id) AS available_safe_inventory_items,
       COALESCE(SUM(sf.length), 0) AS total_minutes,
       ROUND(COALESCE(SUM(sf.length), 0)::numeric / 60, 2) AS total_hours,
       ROUND(COALESCE(SUM(sf.length), 0)::numeric / 1440, 2) AS total_days
FROM store AS s
LEFT JOIN inventory AS i
       ON i.store_id = s.store_id
      AND NOT EXISTS (
          SELECT 1
          FROM rental AS r
          WHERE r.inventory_id = i.inventory_id
            AND r.return_date IS NULL
      )
LEFT JOIN safe_film_list AS sf ON sf.film_id = i.film_id
GROUP BY s.store_id
ORDER BY s.store_id;