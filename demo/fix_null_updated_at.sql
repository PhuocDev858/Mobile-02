-- Fix null updated_at in products table
USE myapp;

UPDATE products 
SET updated_at = created_at 
WHERE updated_at IS NULL;
