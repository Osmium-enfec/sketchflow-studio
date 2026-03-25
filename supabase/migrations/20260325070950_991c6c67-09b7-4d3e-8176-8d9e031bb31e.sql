-- Table for whiteboard commands sent from Telegram
CREATE TABLE public.whiteboard_commands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id bigint NOT NULL,
  command_type text NOT NULL, -- 'add_component'
  component_type text NOT NULL, -- 'title', 'box', 'arrow', 'highlight', etc.
  props jsonb NOT NULL DEFAULT '{}',
  processed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.whiteboard_commands ENABLE ROW LEVEL SECURITY;

-- Anyone can read commands (needed for realtime subscription)
CREATE POLICY "Anyone can read commands" ON public.whiteboard_commands
  FOR SELECT USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.whiteboard_commands;