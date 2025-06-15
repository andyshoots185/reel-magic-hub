
-- Create orders table to track one-off movie payments & rentals
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_session_id TEXT UNIQUE,
  movie_id BIGINT, -- refers to purchased/rented movie
  amount INTEGER,             -- Amount charged (in cents)
  currency TEXT DEFAULT 'usd',
  status TEXT,                -- e.g., 'pending', 'paid', 'failed'
  access_expires_at TIMESTAMPTZ, -- for rentals
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row-Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Policy: Only see your own orders
CREATE POLICY "select_own_orders" ON public.orders
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "insert_own_orders" ON public.orders
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "update_own_orders" ON public.orders
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "delete_own_orders" ON public.orders
  FOR DELETE
  USING (user_id = auth.uid());

