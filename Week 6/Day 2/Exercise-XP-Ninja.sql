-- Exercise XP Ninja: Bonus Public Database
-- Assumes the public customers, items, and purchases tables from Exercise-XP-Gold.sql.

-- 1. The last two customers alphabetically (A-Z), displayed in A-Z order.
SELECT first_name, last_name
FROM (
    SELECT first_name, last_name
    FROM customers
    ORDER BY first_name DESC, last_name DESC
    LIMIT 2
) AS last_two_customers
ORDER BY first_name ASC, last_name ASC;

-- 2. Keep Scott's purchase for the join comparison, but unlink it from his customer row.
-- This differs from literally deleting the purchase: a deleted purchase cannot appear in a join.
UPDATE purchases
SET customer_id = NULL
WHERE customer_id IN (
    SELECT id
    FROM customers
    WHERE first_name = 'Scott'
      AND last_name = 'Scott'
);

-- Delete Scott from customers. purchases.customer_id permits NULL, so the order remains.
DELETE FROM customers
WHERE first_name = 'Scott'
  AND last_name = 'Scott';

-- 3. Scott no longer exists in customers; this query returns no rows.
SELECT id, first_name, last_name
FROM customers
WHERE first_name = 'Scott'
  AND last_name = 'Scott';

-- 4. LEFT JOIN keeps every purchase, including Scott's unlinked order.
-- The customer name columns for that order are NULL (blank in many query viewers).
SELECT p.id AS purchase_id,
       c.first_name,
       c.last_name,
       p.item_id,
       p.quantity_purchased
FROM purchases AS p
LEFT JOIN customers AS c ON c.id = p.customer_id
ORDER BY p.id;

-- 5. INNER JOIN keeps only purchases with a matching customer.
-- Scott's unlinked order is excluded.
SELECT p.id AS purchase_id,
       c.first_name,
       c.last_name,
       p.item_id,
       p.quantity_purchased
FROM purchases AS p
INNER JOIN customers AS c ON c.id = p.customer_id
ORDER BY p.id;