import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/telegram';
const MAX_RUNTIME_MS = 55_000;
const MIN_REMAINING_MS = 5_000;

const AI_SYSTEM_PROMPT = `You are an AI assistant that converts user messages into structured JSON.
Given a user message, extract the project name and a list of actions.
Always respond with valid JSON in this exact format:
{"project": "<project name or empty string>", "actions": ["<action1>", "<action2>", ...]}

Examples:
- "Add a login page to my e-commerce app" → {"project": "e-commerce app", "actions": ["Add a login page"]}
- "Create a dashboard with charts and a sidebar" → {"project": "", "actions": ["Create a dashboard", "Add charts", "Add a sidebar"]}
- "Update the navbar color to blue in MyApp" → {"project": "MyApp", "actions": ["Update the navbar color to blue"]}

If the message is unclear or not related to a project, still try your best to extract meaningful actions.`;

async function convertMessageToJson(text: string, lovableApiKey: string): Promise<{ project: string; actions: string[] }> {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://lovable.dev',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-001',
        messages: [
          { role: 'system', content: AI_SYSTEM_PROMPT },
          { role: 'user', content: text },
        ],
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      console.error(`AI API call failed [${response.status}]`);
      return { project: '', actions: [text] };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (content) {
      const parsed = JSON.parse(content);
      return {
        project: parsed.project || '',
        actions: Array.isArray(parsed.actions) ? parsed.actions : [text],
      };
    }
  } catch (e) {
    console.error('AI conversion error:', e);
  }
  return { project: '', actions: [text] };
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

    // Process each message: convert to JSON with AI and reply
    for (const update of updates) {
      if (!update.message?.text) continue;

      const chatId = update.message.chat.id;
      const messageText = update.message.text;

      // Convert message to structured JSON using AI
      const jsonResult = await convertMessageToJson(messageText, LOVABLE_API_KEY);
      const replyText = JSON.stringify(jsonResult, null, 2);

      // Reply back to the user with the JSON
      const sendResponse = await fetch(`${GATEWAY_URL}/sendMessage`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'X-Connection-Api-Key': TELEGRAM_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: `\`\`\`json\n${replyText}\n\`\`\``,
          parse_mode: 'Markdown',
        }),
      });

      if (!sendResponse.ok) {
        console.error(`Failed to send reply to chat ${chatId}`);
      }

      // Store in database
      const { error: insertErr } = await supabase
        .from('telegram_messages')
        .upsert({
          update_id: update.update_id,
          chat_id: chatId,
          text: messageText,
          raw_update: update,
          reply_json: jsonResult,
          replied: true,
        }, { onConflict: 'update_id' });

      if (insertErr) {
        console.error('Insert error:', insertErr.message);
      }

      totalProcessed++;
    }

    // Advance offset
    const newOffset = Math.max(...updates.map((u: any) => u.update_id)) + 1;
    await supabase
      .from('telegram_bot_state')
      .update({ update_offset: newOffset, updated_at: new Date().toISOString() })
      .eq('id', 1);

    currentOffset = newOffset;
  }

  return new Response(JSON.stringify({ ok: true, processed: totalProcessed, finalOffset: currentOffset }));
});
