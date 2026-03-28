
-- Fix 1: Remove overly permissive public INSERT policy on whiteboard_commands
-- and replace with service-role-only insert (service role bypasses RLS anyway,
-- so we just drop the permissive public policy)
DROP POLICY IF EXISTS "Service role can insert" ON public.whiteboard_commands;
DROP POLICY IF EXISTS "Anyone can update commands" ON public.whiteboard_commands;

-- Restrict INSERT to authenticated users only (service role bypasses RLS regardless)
CREATE POLICY "Authenticated users can insert commands"
  ON public.whiteboard_commands
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Restrict UPDATE to authenticated users only
CREATE POLICY "Authenticated users can update commands"
  ON public.whiteboard_commands
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Fix 2: Remove overly broad SELECT on telegram_messages
-- Since no client code reads this table, restrict to service role only
DROP POLICY IF EXISTS "Authenticated users can read messages" ON public.telegram_messages;
