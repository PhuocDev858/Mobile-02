-- Fix null createdAt and updatedAt in products table
USE myapp;

UPDATE products 
SET created_at = NOW() 
WHERE created_at IS NULL;

UPDATE products 
SET updated_at = created_at 
WHERE updated_at IS NULL;
