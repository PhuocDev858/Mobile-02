-- Add OTP columns to users table
USE myapp;

ALTER TABLE users ADD COLUMN IF NOT EXISTS otp VARCHAR(6);
ALTER TABLE users ADD COLUMN IF NOT EXISTS otp_expiry DATETIME;
