-- Allow anonymous updates to mark commands as processed
CREATE POLICY "Anyone can update commands" ON public.whiteboard_commands
  FOR UPDATE USING (true) WITH CHECK (true);

-- Allow service role inserts (already allowed via bypass, but explicit for clarity)  
CREATE POLICY "Service role can insert" ON public.whiteboard_commands
  FOR INSERT WITH CHECK (true);