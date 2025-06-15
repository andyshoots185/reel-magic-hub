
-- 1. Watch Party (party table, participants, chat messages)

CREATE TABLE IF NOT EXISTS public.watch_parties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  movie_id bigint NOT NULL,
  invite_code text UNIQUE NOT NULL,
  host_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.watch_party_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  party_id uuid REFERENCES public.watch_parties(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  joined_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.watch_party_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  party_id uuid REFERENCES public.watch_parties(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.watch_parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_party_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_party_messages ENABLE ROW LEVEL SECURITY;

-- RLS: Only host or participant can select
CREATE POLICY "select_parties_host_or_participant" ON public.watch_parties
  FOR SELECT USING (host_id = auth.uid() OR id IN (
    SELECT party_id FROM public.watch_party_participants WHERE user_id = auth.uid()
  ));

CREATE POLICY "join_party" ON public.watch_party_participants
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "see_parties_im_in" ON public.watch_party_participants
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "insert_chat" ON public.watch_party_messages
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "see_chat_for_my_parties" ON public.watch_party_messages
  FOR SELECT USING (party_id IN (
    SELECT party_id FROM public.watch_party_participants WHERE user_id = auth.uid()
  ));

-- 2. Ratings & Reviews
CREATE TABLE IF NOT EXISTS public.movie_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  movie_id bigint NOT NULL,
  user_id uuid NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  review text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.movie_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "my_reviews" ON public.movie_reviews
  FOR SELECT USING (true);
CREATE POLICY "insert_own_review" ON public.movie_reviews
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "update_own_review" ON public.movie_reviews
  FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "delete_own_review" ON public.movie_reviews
  FOR DELETE USING (user_id = auth.uid());

-- 3. Comments (if desired, can later restrict SELECT to premium)
CREATE TABLE IF NOT EXISTS public.movie_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  movie_id bigint NOT NULL,
  user_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.movie_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "see_comments" ON public.movie_comments
  FOR SELECT USING (true);
CREATE POLICY "insert_own_comment" ON public.movie_comments
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "delete_own_comment" ON public.movie_comments
  FOR DELETE USING (user_id = auth.uid());

-- 4. Following/friendship system
CREATE TABLE IF NOT EXISTS public.user_friends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  friend_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_friends ENABLE ROW LEVEL SECURITY;
CREATE POLICY "select_my_friends" ON public.user_friends
  FOR SELECT USING (user_id = auth.uid() OR friend_id = auth.uid());
CREATE POLICY "insert_friend_request" ON public.user_friends
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "update_my_friendships" ON public.user_friends
  FOR UPDATE USING (user_id = auth.uid() OR friend_id = auth.uid());
CREATE POLICY "delete_my_friendships" ON public.user_friends
  FOR DELETE USING (user_id = auth.uid() OR friend_id = auth.uid());

