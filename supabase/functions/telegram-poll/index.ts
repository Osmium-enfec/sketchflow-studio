import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/telegram';
const MAX_RUNTIME_MS = 55_000;
const MIN_REMAINING_MS = 5_000;

const AI_SYSTEM_PROMPT = `You are an AI that converts natural language into whiteboard component commands.

Available component types: title, box, arrow, highlight, character, device, gradientArrow, curvedArrow, foldedBox, codeBox, openPeep

For each component, output a JSON array of commands. Each command has:
- "type": one of the component types above
- "props": properties for that component

Property guidelines:
- title: { "text": "...", "x": 100-1600, "y": 100-900, "color": "#hex" }
- box: { "text": "...", "x": 100-1600, "y": 100-900, "width": 150-400, "height": 80-200 }
- arrow: { "startX": num, "startY": num, "endX": num, "endY": num }
- highlight: { "x": num, "y": num, "width": 100-400, "height": 18, "color": "hsl(48 100% 67%)" }
- foldedBox: { "text": "...", "x": num, "y": num, "width": 200-300, "height": 120-200 }
- codeBox: { "x": num, "y": num, "width": 300-500, "height": 200-300 }
- character: { "x": num, "y": num, "scale": 1 }
- device: { "x": num, "y": num, "scale": 1, "variant": "phone" or "tablet" }
- openPeep: { "x": num, "y": num, "scale": 0.3, "variant": "explaining" or "pointingUp" or "sitting" }
- gradientArrow: { "startX": num, "startY": num, "endX": num, "endY": num }
- curvedArrow: { "startX": num, "startY": num, "endX": num, "endY": num }

Layout tips: Space components so they don't overlap. Use x: 200-1600, y: 100-900.

Always respond with valid JSON: { "components": [...] }

Examples:
- "Add a title Hello World" → {"components":[{"type":"title","props":{"text":"Hello World","x":400,"y":200}}]}
- "Create a flowchart with 3 boxes and arrows" → {"components":[{"type":"box","props":{"text":"Step 1","x":200,"y":300,"width":200,"height":120}},{"type":"arrow","props":{"startX":400,"startY":360,"endX":550,"endY":360}},{"type":"box","props":{"text":"Step 2","x":550,"y":300,"width":200,"height":120}},{"type":"arrow","props":{"startX":750,"startY":360,"endX":900,"endY":360}},{"type":"box","props":{"text":"Step 3","x":900,"y":300,"width":200,"height":120}}]}
- "Add a character explaining something with a title" → {"components":[{"type":"title","props":{"text":"Explanation","x":400,"y":150}},{"type":"openPeep","props":{"x":500,"y":250,"scale":0.3,"variant":"explaining"}}]}`;

interface WhiteboardCommand {
  type: string;
  props: Record<string, any>;
}

async function convertToWhiteboardCommands(text: string, lovableApiKey: string): Promise<WhiteboardCommand[]> {
  try {
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: AI_SYSTEM_PROMPT },
          { role: 'user', content: text },
        ],
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      console.error(`AI API call failed [${response.status}]`);
      return [{ type: 'title', props: { text, x: 400, y: 300 } }];
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (content) {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed.components)) {
        return parsed.components;
      }
    }
  } catch (e) {
    console.error('AI conversion error:', e);
  }
  return [{ type: 'title', props: { text, x: 400, y: 300 } }];
}

Deno.serve(async () => {
  const startTime = Date.now();

  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY is not configured');

  const TELEGRAM_API_KEY = Deno.env.get('TELEGRAM_API_KEY');
  if (!TELEGRAM_API_KEY) throw new Error('TELEGRAM_API_KEY is not configured');

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  let totalProcessed = 0;

  const { data: state, error: stateErr } = await supabase
    .from('telegram_bot_state')
    .select('update_offset')
    .eq('id', 1)
    .single();

  if (stateErr) {
    return new Response(JSON.stringify({ error: stateErr.message }), { status: 500 });
  }

  let currentOffset = state.update_offset;

  while (true) {
    const elapsed = Date.now() - startTime;
    const remainingMs = MAX_RUNTIME_MS - elapsed;
    if (remainingMs < MIN_REMAINING_MS) break;

    const timeout = Math.min(50, Math.floor(remainingMs / 1000) - 5);
    if (timeout < 1) break;

    const response = await fetch(`${GATEWAY_URL}/getUpdates`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'X-Connection-Api-Key': TELEGRAM_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        offset: currentOffset,
        timeout,
        allowed_updates: ['message'],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return new Response(JSON.stringify({ error: data }), { status: 502 });
    }

    const updates = data.result ?? [];
    if (updates.length === 0) continue;

    for (const update of updates) {
      if (!update.message?.text) continue;

      const chatId = update.message.chat.id;
      const messageText = update.message.text;

      // Skip bot commands like /start
      if (messageText.startsWith('/')) {
        await fetch(`${GATEWAY_URL}/sendMessage`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'X-Connection-Api-Key': TELEGRAM_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: '👋 Send me a message describing what you want on the whiteboard!\n\nExamples:\n• "Add a title saying Hello World"\n• "Create 3 boxes with arrows between them"\n• "Add a character explaining a concept"',
          }),
        });
        continue;
      }

      // Convert message to whiteboard commands using AI
      const commands = await convertToWhiteboardCommands(messageText, LOVABLE_API_KEY);

      // Insert each command into whiteboard_commands table
      const rows = commands.map((cmd) => ({
        chat_id: chatId,
        command_type: 'add_component',
        component_type: cmd.type,
        props: cmd.props,
      }));

      const { error: cmdErr } = await supabase
        .from('whiteboard_commands')
        .insert(rows);

      if (cmdErr) {
        console.error('Command insert error:', cmdErr.message);
      }

      // Reply with confirmation
      const componentList = commands.map(c => `• ${c.type}: ${c.props.text || ''}`).join('\n');
      await fetch(`${GATEWAY_URL}/sendMessage`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'X-Connection-Api-Key': TELEGRAM_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: `✅ Added ${commands.length} component(s) to whiteboard:\n${componentList}`,
        }),
      });

      // Store message
      await supabase
        .from('telegram_messages')
        .upsert({
          update_id: update.update_id,
          chat_id: chatId,
          text: messageText,
          raw_update: update,
          reply_json: { components: commands },
          replied: true,
        }, { onConflict: 'update_id' });

      totalProcessed++;
    }

    const newOffset = Math.max(...updates.map((u: any) => u.update_id)) + 1;
    await supabase
      .from('telegram_bot_state')
      .update({ update_offset: newOffset, updated_at: new Date().toISOString() })
      .eq('id', 1);

    currentOffset = newOffset;
  }

  return new Response(JSON.stringify({ ok: true, processed: totalProcessed, finalOffset: currentOffset }));
});
