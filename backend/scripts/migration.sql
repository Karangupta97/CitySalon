-- Migration: Create users table for authentication system

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone_number VARCHAR(50),
  password_hash VARCHAR(255) NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(255),
  verification_token_expires_at TIMESTAMP WITH TIME ZONE,
  reset_token VARCHAR(255),
  reset_token_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index on email for fast lookups during authentication
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Index on verification_token for fast lookup during verification
CREATE INDEX IF NOT EXISTS idx_users_verification_token ON users(verification_token);

-- Index on reset_token for fast lookup during password resets
CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users(reset_token);
