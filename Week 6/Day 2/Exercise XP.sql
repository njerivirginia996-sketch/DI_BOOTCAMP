-- Exercise 1: Items and customers

-- 1. All items, from lowest to highest price.
SELECT *
FROM items
ORDER BY price ASC;

-- 2. Items priced at 80 or more, from highest to lowest price.
SELECT *
FROM items
WHERE price >= 80
ORDER BY price DESC;

-- 3. The first three customers alphabetically by first name.
SELECT first_name, last_name
FROM customers
ORDER BY first_name ASC
LIMIT 3;

-- 4. All last names in reverse alphabetical order.
SELECT last_name
FROM customers
ORDER BY last_name DESC;


-- Exercise 2: dvdrental database

-- 1. All customer columns.
SELECT *
FROM customer;

-- 2. Customer names as full_name.
SELECT CONCAT(first_name, ' ', last_name) AS full_name
FROM customer;

-- 3. Unique account creation dates.
SELECT DISTINCT create_date
FROM customer;

-- 4. All customers, ordered by first name descending.
SELECT *
FROM customer
ORDER BY first_name DESC;

-- 5. Films ordered by rental rate from lowest to highest.
SELECT film_id, title, description, release_year, rental_rate
FROM film
ORDER BY rental_rate ASC;

-- 6. Addresses and phone numbers for customers in Texas.
SELECT address, phone
FROM address
WHERE district = 'Texas';

-- 7. Movies with film ID 15 or 150.
SELECT *
FROM film
WHERE film_id IN (15, 150);

-- 8. Check whether the favorite movie exists.
-- Favorite movie used here: Academy Dinosaur.
SELECT film_id, title, description, length, rental_rate
FROM film
WHERE title = 'Academy Dinosaur';

-- 9. Movies beginning with the first two letters of the favorite movie.
SELECT film_id, title, description, length, rental_rate
FROM film
WHERE title ILIKE 'Ac%';

-- 10. The ten cheapest movies.
SELECT *
FROM film
ORDER BY rental_rate ASC, film_id ASC
LIMIT 10;

-- 11. The next ten cheapest movies.
SELECT *
FROM film
ORDER BY rental_rate ASC, film_id ASC
LIMIT 10 OFFSET 10;

-- 12. Payments with the customer's name, ordered by customer ID.
SELECT c.first_name, c.last_name, p.amount, p.payment_date
FROM customer AS c
JOIN payment AS p ON p.customer_id = c.customer_id
ORDER BY c.customer_id ASC;

-- 13. Movies that are not present in inventory.
SELECT f.*
FROM film AS f
LEFT JOIN inventory AS i ON i.film_id = f.film_id
WHERE i.film_id IS NULL;

-- 14. The city and its country.
SELECT ci.city, co.country
FROM city AS ci
JOIN country AS co ON co.country_id = ci.country_id;

-- 15. Payments ordered by the staff member who processed them.
SELECT c.customer_id, c.first_name, c.last_name,
	   p.amount, p.payment_date
FROM customer AS c
JOIN payment AS p ON p.customer_id = c.customer_id
ORDER BY p.staff_id ASC;
