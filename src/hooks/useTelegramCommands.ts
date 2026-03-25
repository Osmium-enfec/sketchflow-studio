import { useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useWhiteboardStore, ComponentType } from '@/store/whiteboardStore';

const validTypes: ComponentType[] = [
  'title', 'box', 'arrow', 'highlight', 'character', 'indianCharacter',
  'device', 'gradientArrow', 'curvedArrow', 'foldedBox', 'codeBox', 'openPeep'
];

export function useTelegramCommands() {
  const addComponentRef = useRef(useWhiteboardStore.getState().addComponent);
  
  // Keep ref updated
  useEffect(() => {
    return useWhiteboardStore.subscribe((state) => {
      addComponentRef.current = state.addComponent;
    });
  }, []);

  const processCommand = useCallback((componentType: string, props: Record<string, any>) => {
    const type = componentType as ComponentType;
    if (validTypes.includes(type)) {
      console.log('[Telegram] Adding component:', type, props);
      addComponentRef.current(type, props);
    }
  }, []);

  useEffect(() => {
    // Load unprocessed commands on mount
    const loadExisting = async () => {
      const { data, error } = await supabase
        .from('whiteboard_commands')
        .select('*')
        .eq('processed', false)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('[Telegram] Error loading commands:', error);
        return;
      }

      if (data && data.length > 0) {
        console.log('[Telegram] Processing', data.length, 'existing commands');
        for (const row of data) {
          processCommand(row.component_type, row.props as Record<string, any>);
        }
        
        // Mark as processed
        const ids = data.map((r) => r.id);
        await supabase
          .from('whiteboard_commands')
          .update({ processed: true })
          .in('id', ids);
      }
    };

    loadExisting();

    // Subscribe to new commands
    const channel = supabase
      .channel('whiteboard-commands-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'whiteboard_commands',
        },
        async (payload) => {
          const row = payload.new as {
            id: string;
            component_type: string;
            props: Record<string, any>;
          };

          console.log('[Telegram] Realtime command received:', row);
          processCommand(row.component_type, row.props);

          // Mark as processed
          await supabase
            .from('whiteboard_commands')
            .update({ processed: true })
            .eq('id', row.id);
        }
      )
      .subscribe((status) => {
        console.log('[Telegram] Realtime subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [processCommand]);
}
