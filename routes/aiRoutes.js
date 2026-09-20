const express = require('express');
const businessProfile = require('../knowledge/businessProfile');

const router = express.Router();

const SYSTEM_PROMPT = `
You are the shared AI assistant for the Digital Growth Africa website.
Use the business knowledge below as your source of truth.

${businessProfile}

Conversation rules:
- Be helpful, specific, and human.
- Keep most replies under 140 words.
- Do not dump long lists unless the visitor asks.
- If the visitor asks about services, explain only the relevant service first.
- If the visitor has a real business problem, make a simple decision using one of these exact lines:
  My decision: Book the audit
  My decision: Worth exploring later
  My decision: Needs more details
- If the visitor wants to book or says yes, ask for their name, email or phone, company name, and what they want automated.
- Never pretend a calendar booking is confirmed. Say the team will follow up after details are submitted.
`;

function normalizeMessages(messages = []) {
  return messages
    .filter((message) => message && ['user', 'assistant'].includes(message.role) && message.content)
    .slice(-12)
    .map((message) => ({
      role: message.role,
      content: String(message.content).slice(0, 2000),
    }));
}

router.post('/chat', async (req, res) => {
  try {
    const token = process.env.HUGGINGFACE_TOKEN;
    const messages = normalizeMessages(req.body.messages);

    if (!token) {
      return res.status(500).json({
        message: 'HUGGINGFACE_TOKEN is missing in Backend/.env.',
      });
    }

    if (messages.length === 0) {
      return res.status(400).json({ message: 'At least one message is required.' });
    }

    const response = await fetch('https://router.huggingface.co/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.HUGGINGFACE_MODEL || 'openai/gpt-oss-120b:fastest',
        max_tokens: 500,
        temperature: 0.75,
        top_p: 0.9,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        message: 'AI provider request failed.',
        details: errorText,
      });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(502).json({ message: 'AI returned an empty response.' });
    }

    return res.json({ reply });
  } catch (error) {
    console.error('AI chat error:', error);
    return res.status(500).json({ message: 'Could not complete AI chat request.' });
  }
});

module.exports = router;
