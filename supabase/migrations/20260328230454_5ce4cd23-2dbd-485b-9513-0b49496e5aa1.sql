DROP POLICY IF EXISTS "Anyone can read commands" ON public.whiteboard_commands;
DROP POLICY IF EXISTS "Authenticated users can insert commands" ON public.whiteboard_commands;
DROP POLICY IF EXISTS "Authenticated users can update commands" ON public.whiteboard_commands;
DROP TABLE IF EXISTS public.whiteboard_commands;