import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useWhiteboardStore, ComponentType } from '@/store/whiteboardStore';

const validTypes: ComponentType[] = [
  'title', 'box', 'arrow', 'highlight', 'character', 'indianCharacter',
  'device', 'gradientArrow', 'curvedArrow', 'foldedBox', 'codeBox', 'openPeep'
];

export function useTelegramCommands() {
  const addComponent = useWhiteboardStore((s) => s.addComponent);

  useEffect(() => {
    const channel = supabase
      .channel('whiteboard-commands')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'whiteboard_commands',
        },
        (payload) => {
          const row = payload.new as {
            component_type: string;
            props: Record<string, any>;
          };

          const type = row.component_type as ComponentType;
          if (validTypes.includes(type)) {
            addComponent(type, row.props);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [addComponent]);
}
