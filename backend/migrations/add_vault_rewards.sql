-- Add is_tokenized column to assets table
ALTER TABLE assets ADD COLUMN IF NOT EXISTS is_tokenized BOOLEAN DEFAULT FALSE;

-- Create vault_balances table to track user VAULT coin balances
CREATE TABLE IF NOT EXISTS vault_balances (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    balance INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create vault_rewards table to track VAULT coin rewards history
CREATE TABLE IF NOT EXISTS vault_rewards (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    reason VARCHAR(100) NOT NULL,
    asset_id UUID REFERENCES assets(id) ON DELETE SET NULL,
    token_id UUID REFERENCES tokens(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vault_balances_user_id ON vault_balances(user_id);
CREATE INDEX IF NOT EXISTS idx_vault_rewards_user_id ON vault_rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_assets_is_tokenized ON assets(is_tokenized);
CREATE INDEX IF NOT EXISTS idx_assets_owner_id ON assets(owner_id);
