#!/usr/bin/env node
// Postet als bestimmtes Teammitglied in Slack (eigener Name und eigenes Icon).
// Benötigt einen Bot-Token mit den Scopes chat:write und chat:write.customize.
//
// Aufruf:
//   node scripts/slack-post.mjs --as thomas --channel C0123456789 --text "Hallo"
//   echo "längerer Text" | node scripts/slack-post.mjs --as lena --channel C0123456789
//   Optional: --thread <ts>   (Antwort in einem Thread)
//             --mention-joon  (stellt <@SLACK_JOON_USER_ID> voran, damit Joon eine Push-Benachrichtigung bekommt)

const PERSONAS = {
  thomas: { username: 'Thomas Brandt (PL)', icon_emoji: ':spiral_note_pad:' },
  lena: { username: 'Lena Vogel (PO)', icon_emoji: ':dart:' },
  markus: { username: 'Markus Weber (BE Lead)', icon_emoji: ':building_construction:' },
  katrin: { username: 'Katrin Schulz (BE)', icon_emoji: ':gear:' },
  tim: { username: 'Tim Lorenz (BE)', icon_emoji: ':wrench:' },
  sabine: { username: 'Sabine Keller (FE Lead)', icon_emoji: ':mag:' },
  jonas: { username: 'Jonas Fischer (FE)', icon_emoji: ':bulb:' },
};

function arg(name) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : undefined;
}

async function readStdin() {
  if (process.stdin.isTTY) return '';
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf-8').trim();
}

const token = process.env.SLACK_BOT_TOKEN;
const who = arg('as');
const channel = arg('channel');
const thread = arg('thread');
const body = arg('text') ?? (await readStdin());
const joon = process.env.SLACK_JOON_USER_ID;
const text = process.argv.includes('--mention-joon') && joon && body ? `<@${joon}> ${body}` : body;

if (!token) {
  console.log('SLACK_BOT_TOKEN fehlt – nichts gesendet.');
  process.exit(0);
}
if (!PERSONAS[who] || !channel || !text) {
  console.error(`Nutzung: --as <${Object.keys(PERSONAS).join('|')}> --channel <ID> --text <Text>`);
  process.exit(1);
}

const res = await fetch('https://slack.com/api/chat.postMessage', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8', Authorization: `Bearer ${token}` },
  body: JSON.stringify({ channel, text, thread_ts: thread, ...PERSONAS[who] }),
});
const data = await res.json();
if (!data.ok) {
  console.error('Slack-Fehler:', data.error);
  process.exit(1);
}
console.log(`Gesendet als ${PERSONAS[who].username} (ts=${data.ts})`);
