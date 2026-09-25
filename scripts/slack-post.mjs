#!/usr/bin/env node
// Postet als bestimmtes Teammitglied in Slack (eigener Name und eigenes Icon).
// Benötigt einen Bot-Token mit den Scopes chat:write und chat:write.customize.
//
// Token-Quellen:
//   - GitHub Actions: Umgebungsvariable SLACK_BOT_TOKEN (Repository-Secret)
//   - Claude-Routinen: Token als "API-Anmeldedaten" im Cloud-Environment hinterlegt,
//     dazu SLACK_AUTH_VIA_PROXY=1 setzen. Der Proxy hängt den Token an die Anfrage an,
//     die Session sieht ihn nie. In diesem Modus wird curl verwendet, weil nur curl
//     über den Proxy der Umgebung läuft (Nodes fetch umgeht ihn).
//
// Aufruf:
//   node scripts/slack-post.mjs --as thomas --channel C0123456789 --text "Hallo"
//   echo "längerer Text" | node scripts/slack-post.mjs --as lena --channel C0123456789
//   Optional: --thread <ts>   (Antwort in einem Thread)
//             --mention-joon  (stellt <@SLACK_JOON_USER_ID> voran, damit Joon eine Push-Benachrichtigung bekommt)

import { execFileSync } from 'node:child_process';

const API_URL = process.env.SLACK_API_URL ?? 'https://slack.com/api/chat.postMessage';

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

const viaProxy = process.env.SLACK_AUTH_VIA_PROXY === '1';
if (!token && !viaProxy) {
  console.log('SLACK_BOT_TOKEN fehlt (und SLACK_AUTH_VIA_PROXY ist nicht gesetzt) – nichts gesendet.');
  process.exit(0);
}
if (!PERSONAS[who] || !channel || !text) {
  console.error(`Nutzung: --as <${Object.keys(PERSONAS).join('|')}> --channel <ID> --text <Text>`);
  process.exit(1);
}

const payload = JSON.stringify({ channel, text, thread_ts: thread, ...PERSONAS[who] });
let data;
if (token) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8', Authorization: `Bearer ${token}` },
    body: payload,
  });
  data = await res.json();
} else {
  const out = execFileSync(
    'curl',
    ['-sS', '-X', 'POST', API_URL, '-H', 'Content-Type: application/json; charset=utf-8', '--data-binary', '@-'],
    { input: payload },
  );
  data = JSON.parse(out.toString('utf-8'));
}
if (!data.ok) {
  console.error('Slack-Fehler:', data.error);
  process.exit(1);
}
console.log(`Gesendet als ${PERSONAS[who].username} (ts=${data.ts})`);
