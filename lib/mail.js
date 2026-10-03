// Envoi d'e-mails par SMTP (Google Workspace : smtp.gmail.com + mot de passe d'application).
// Secrets : SMTP_USER, SMTP_PASS ; facultatifs : SMTP_HOST (smtp.gmail.com), SMTP_PORT (465), MAIL_FROM (= SMTP_USER).
import { WorkerMailer } from 'worker-mailer';

export const mailConfigured = (env) => !!(env.SMTP_USER && env.SMTP_PASS);
export const escHtml = (s) => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export const textToHtml = (t) => `<div style="font-family:Arial,sans-serif;font-size:14px;color:#1b2433;line-height:1.5">${escHtml(t).replace(/\n/g, '<br>')}</div>`;
export function b64(bytes) {
  let s = ''; const u = new Uint8Array(bytes);
  for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000));
  return btoa(s);
}
const list = (v) => [...new Set(String(v || '').split(/[,;\s]+/).map(x => x.trim().toLowerCase()).filter(Boolean))];
export function checkAddresses(v) {
  const L = list(v);
  for (const a of L) if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(a)) throw new Error(`Adresse e-mail invalide : ${a}`);
  return L;
}

export async function sendMail(env, { to, cc, bcc, subject, text, html, replyTo, fromName, attachments }) {
  if (!mailConfigured(env)) throw new Error("L'envoi d'e-mails n'est pas encore configuré.");
  const port = Number(env.SMTP_PORT || 465);
  await WorkerMailer.send({
    host: env.SMTP_HOST || 'smtp.gmail.com', port, secure: port === 465, startTls: port !== 465,
    credentials: { username: env.SMTP_USER, password: env.SMTP_PASS }, authType: 'plain', socketTimeoutMs: 30000,
  }, {
    from: { name: fromName || 'MultiOne Belgium Import', email: env.MAIL_FROM || env.SMTP_USER },
    to: list(to), cc: cc ? list(cc) : undefined, bcc: bcc ? list(bcc) : undefined,
    reply: replyTo || undefined, subject, text, html: html || (text ? textToHtml(text) : undefined), attachments,
  });
}
