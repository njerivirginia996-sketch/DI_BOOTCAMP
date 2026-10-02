-- Daily Challenge: Product orders and items

-- 1-2. One product order can contain many item rows.
-- Each item row belongs to exactly one order through its NOT NULL foreign key.
CREATE TABLE IF NOT EXISTS product_orders (
    order_id SERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS items (
    item_id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES product_orders(order_id) ON DELETE CASCADE,
    item_name VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0)
);

-- 3. Return the total line price for an order (unit price multiplied by quantity).
-- Returns zero when the order has no item rows.
CREATE OR REPLACE FUNCTION order_total(p_order_id INTEGER)
RETURNS NUMERIC
LANGUAGE SQL
STABLE
AS $$
    SELECT COALESCE(SUM(i.quantity * i.price), 0)
    FROM items AS i
    WHERE i.order_id = p_order_id;
$$;

-- Example: show every order and its total.
SELECT po.order_id,
       order_total(po.order_id) AS total_price
FROM product_orders AS po
ORDER BY po.order_id;


-- Bonus: users have many orders; each order may belong to one user.
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE
);

ALTER TABLE product_orders
ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL;

-- Return an order's total only when that order belongs to the supplied user.
-- A valid order with no items totals zero; an invalid order/user pair returns NULL.
CREATE OR REPLACE FUNCTION user_order_total(
    p_order_id INTEGER,
    p_user_id INTEGER
)
RETURNS NUMERIC
LANGUAGE SQL
STABLE
AS $$
    SELECT CASE
        WHEN EXISTS (
            SELECT 1
            FROM product_orders AS po
            WHERE po.order_id = p_order_id
              AND po.user_id = p_user_id
        ) THEN (
            SELECT COALESCE(SUM(i.quantity * i.price), 0)
            FROM items AS i
            WHERE i.order_id = p_order_id
        )
        ELSE NULL::NUMERIC
    END;
$$;

-- Example: show each assigned user's order total.
SELECT po.order_id,
       po.user_id,
       user_order_total(po.order_id, po.user_id) AS total_price
FROM product_orders AS po
WHERE po.user_id IS NOT NULL
ORDER BY po.user_id, po.order_id;