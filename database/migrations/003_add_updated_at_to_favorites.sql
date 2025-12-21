
-- Add updated_at column to user_favorites if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_favorites' AND column_name = 'updated_at') THEN
        ALTER TABLE public.user_favorites ADD COLUMN updated_at TIMESTAMPTZ DEFAULT now();
    END IF;
END $$;

-- Create or replace the function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_favorites_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create the trigger
DROP TRIGGER IF EXISTS update_user_favorites_updated_at ON public.user_favorites;
CREATE TRIGGER update_user_favorites_updated_at
    BEFORE UPDATE ON public.user_favorites
    FOR EACH ROW
    EXECUTE PROCEDURE update_user_favorites_updated_at();
