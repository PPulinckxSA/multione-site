// API publique de multione.be : catalogue SANS prix, partenaires officiels, demandes de devis.
import { mailConfigured, sendMail, escHtml } from '../../lib/mail.js';

const json = (d, s = 200, h = {}) => new Response(JSON.stringify(d), { status: s, headers: { 'content-type': 'application/json', ...h } });
const err = (m, s = 400) => json({ error: m }, s);
const hex = (b) => [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
const sha = async (t) => hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t)));
const rid = () => 'ld_' + hex(crypto.getRandomValues(new Uint8Array(8)));
const APP = 'https://app.multione.be';

// Codes postaux couverts : "1300-1499, 4280" -> test d'appartenance
function covers(spec, cp) {
  const n = parseInt(String(cp || '').replace(/\D/g, ''), 10); if (!n || !spec) return false;
  return String(spec).split(/[,;\s]+/).some(r => { const [a, b] = r.split('-').map(x => parseInt(x, 10)); return b ? n >= a && n <= b : n === a; });
}

async function catalog(env) {
  const products = (await env.DB.prepare(`SELECT code, family, series_tab, compat_key, desc_fr, desc_nl, desc_en, image_updated_at
      FROM products WHERE is_active = 1 ORDER BY family, code`).all()).results;           // aucune colonne de prix
  const active = new Set(products.map(p => p.code));
  const mo = {};
  for (const r of (await env.DB.prepare(`SELECT machine_code, option_code FROM machine_options`).all()).results)
    if (active.has(r.machine_code) && active.has(r.option_code)) (mo[r.machine_code] ||= []).push(r.option_code);
  const cp = {};
  for (const r of (await env.DB.prepare(`SELECT accessory_code, compat_key, level FROM accessory_compat`).all()).results)
    if (active.has(r.accessory_code)) (cp[r.accessory_code] ||= {})[r.compat_key] = r.level;
  return { products, machineOptions: mo, compat: cp };
}

async function partners(env) {
  const q = (extra) => env.DB.prepare(`SELECT id, kind, IFNULL(public_name, name) AS name, public_region AS region, public_postcodes AS postcodes,
      IFNULL(public_phone, phone) AS phone, street, city, public_description AS description, logo_key IS NOT NULL AS has_logo${extra}
      FROM companies WHERE public_visible = 1 ORDER BY CASE kind WHEN 'internal' THEN 0 ELSE 1 END, name`).all();
  try { return (await q(', public_website AS website')).results; } catch (e) { return (await q('')).results; }   // colonne ajoutee par la migration 0041
}

async function notify(env, lead, company, items, machine) {
  // destinataires : adresse publique de la societe, sinon ses utilisateurs ; + commercial de contact pour un agent
  const to = new Set();
  if (company.public_email) to.add(company.public_email);
  if (!to.size) for (const u of (await env.DB.prepare(`SELECT u.email FROM user_companies uc JOIN users u ON u.id = uc.user_id WHERE uc.company_id=? AND u.is_active=1`).bind(company.id).all()).results) to.add(u.email);
  if (company.kind === 'agent' && company.contact_user_id) { const c = await env.DB.prepare(`SELECT email FROM users WHERE id=? AND is_active=1`).bind(company.contact_user_id).first(); if (c) to.add(c.email); }
  if (!to.size || !mailConfigured(env)) return false;
  const row = (k, v) => v ? `<tr><td style="padding:3px 12px 3px 0;color:#6b7a90">${k}</td><td><b>${escHtml(v)}</b></td></tr>` : '';
  const html = `<div style="font-family:Arial,sans-serif;font-size:14px;color:#1b2433;max-width:620px">
    <p><b>${lead.kind === 'partner' ? 'Nouvelle candidature de distributeur officiel via multione.be' : lead.kind === 'contact' ? 'Nouveau message reçu via multione.be' : 'Nouvelle demande de devis reçue via multione.be'}</b> pour <b>${escHtml(company.name)}</b>${lead.subject ? ' – objet : <b>' + escHtml(lead.subject) + '</b>' : ''}.</p>
    ${lead.preferred ? `<p style="background:#fff3d6;border-radius:6px;padding:8px 12px">Partenaire souhaité par le visiteur : <b>${escHtml(lead.preferred)}</b>. Transférez-lui la demande depuis l'application quand vous le décidez.</p>` : ''}
    <table>${row('Nom', lead.contact_name)}${row('Société', lead.contact_company)}${row('E-mail', lead.email)}${row('Téléphone', lead.phone)}${row('Localité', [lead.postal_code, lead.city].filter(Boolean).join(' '))}${row('Langue', lead.lang.toUpperCase())}</table>
    ${lead.extra ? `<table>${row('TVA', lead.extra.vat)}${row('Activité', lead.extra.activity)}${row('Zone couverte', lead.extra.region)}${row('Marques distribuées', lead.extra.brands)}${row('Atelier', lead.extra.workshop)}${row('Effectif', lead.extra.staff)}${row('Site web', lead.extra.website)}</table>` : ''}
    ${lead.kind !== 'quote' ? '' : `<p><b>Configuration</b> : ${escHtml(machine || 'sans machine')}${items.length ? '<br>' + items.map(i => '• ' + escHtml(i)).join('<br>') : ''}</p>`}
    ${lead.message ? `<p><b>Message</b> :<br>${escHtml(lead.message).replace(/\n/g, '<br>')}</p>` : ''}
    <p><a href="${APP}/#demandes/${lead.id}" style="display:inline-block;background:#0b4f9c;color:#fff;padding:9px 16px;border-radius:6px;text-decoration:none;font-weight:bold">${lead.kind === 'partner' ? 'Voir la candidature' : lead.kind === 'contact' ? 'Répondre au message' : 'Prendre en charge la demande'}</a></p>
    <p style="color:#6b7a90;font-size:12px">Merci de prendre contact avec le demandeur dans les 24 heures. Le suivi des demandes est visible par MultiOne Belgium Import.</p></div>`;
  try { await sendMail(env, { to: [...to], subject: lead.kind === 'partner' ? `Candidature distributeur – ${lead.contact_company} (${lead.contact_name})` : lead.kind === 'contact' ? `Nouveau message – ${lead.contact_name} – ${lead.subject}` : `Nouvelle demande de devis – ${lead.contact_name}${machine ? ' – ' + machine : ''}`, html, text: html.replace(/<[^>]+>/g, ' '), replyTo: { name: lead.contact_name, email: lead.email }, fromName: 'multione.be' }); return true; }
  catch (e) { return false; }
}

export async function onRequest({ request: req, env }) {
  const url = new URL(req.url), path = url.pathname, method = req.method;
  try {
    if (path === '/api/public/catalog' && method === 'GET') return json(await catalog(env), 200, { 'cache-control': 'public, max-age=60' });
    if (path === '/api/public/events' && method === 'GET') {
      // suppression definitive des evenements termines, puis annonces en cours de diffusion
      const old = (await env.DB.prepare(`SELECT id, image_key FROM events WHERE end_date < date('now')`).all()).results;
      for (const e of old) if (e.image_key) await env.FILES.delete(e.image_key).catch(() => {});
      if (old.length) await env.DB.prepare(`DELETE FROM events WHERE end_date < date('now')`).run();
      const ev = (await env.DB.prepare(`SELECT id, title_fr, title_nl, title_en, text_fr, text_nl, text_en, location, booth, url, start_date, end_date,
          image_key IS NOT NULL AS has_image, date('now') AS today FROM events WHERE show_from <= date('now') AND end_date >= date('now') ORDER BY start_date`).all()).results;
      return json({ events: ev }, 200, { 'cache-control': 'no-cache' });
    }
    const evi = path.match(/^\/api\/public\/event-image\/(ev_[a-f0-9]+)$/);
    if (evi) {
      const r = await env.DB.prepare(`SELECT image_key, image_type FROM events WHERE id=? AND end_date >= date('now')`).bind(evi[1]).first();
      const o = r?.image_key ? await env.FILES.get(r.image_key) : null;
      return o ? new Response(o.body, { headers: { 'content-type': r.image_type || 'image/jpeg', 'cache-control': 'public, max-age=600' } }) : new Response('', { status: 404 });
    }
    if (path === '/api/public/partners' && method === 'GET') return json({ partners: await partners(env) }, 200, { 'cache-control': 'no-cache' });
    const im = path.match(/^\/api\/public\/image\/([A-Z0-9.]+)$/);
    if (im) {
      const r = await env.DB.prepare(`SELECT image_key, image_type FROM products WHERE code=? AND is_active=1`).bind(im[1]).first();
      const o = r?.image_key ? await env.FILES.get(r.image_key) : null;
      return o ? new Response(o.body, { headers: { 'content-type': r.image_type || 'image/jpeg', 'cache-control': 'public, max-age=3600' } }) : new Response('', { status: 404 });
    }
    const lg = path.match(/^\/api\/public\/logo\/([a-z0-9_]+)$/);
    if (lg) {
      const c = await env.DB.prepare(`SELECT logo_key, logo_type FROM companies WHERE id=? AND public_visible=1`).bind(lg[1]).first();
      const o = c?.logo_key ? await env.FILES.get(c.logo_key) : null;
      return o ? new Response(o.body, { headers: { 'content-type': c.logo_type || 'image/png', 'cache-control': 'public, max-age=3600' } }) : new Response('', { status: 404 });
    }
    if (path === '/api/public/lead' && method === 'POST') {
      const b = await req.json().catch(() => ({}));
      if (b.website) return json({ ok: true });                                         // piege a robots
      if (!b.t || Date.now() - Number(b.t) < 4000) return err('Merci de vérifier votre demande avant de l’envoyer.');
      const ip = await sha((req.headers.get('cf-connecting-ip') || '') + 'multione-site');
      const recent = (await env.DB.prepare(`SELECT COUNT(*) n FROM leads WHERE ip_hash=? AND created_at > datetime('now','-1 hour')`).bind(ip).first()).n;
      if (recent >= 5) return err('Trop de demandes envoyées. Réessayez plus tard ou contactez-nous par téléphone.', 429);
      const s = (v, n = 200) => String(v ?? '').trim().slice(0, n);
      const lead = { id: rid(), lang: ['fr', 'nl', 'en'].includes(b.lang) ? b.lang : 'fr', contact_name: s(b.name, 120), contact_company: s(b.company, 150),
        email: s(b.email, 150).toLowerCase(), phone: s(b.phone, 40), postal_code: s(b.postal_code, 12), city: s(b.city, 80), message: s(b.message, 3000) };
      if (!lead.contact_name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(lead.email)) return err('Indiquez votre nom et une adresse e-mail valide.');
      if (!b.consent) return err('Merci d’accepter le traitement de vos données pour que nous puissions vous répondre.');
      const kind = ['contact', 'partner'].includes(b.kind) ? b.kind : 'quote';
      let cid = s(b.company_id, 40);
      if (kind === 'partner') {                                              // candidature : toujours chez l'importateur
        const def = await env.DB.prepare(`SELECT value FROM settings WHERE key='public_contact_company'`).first(); cid = JSON.parse(def?.value || '"pp"');
      } else if (kind === 'contact' && (!cid || cid === 'auto')) {                  // interlocuteur choisi par le site : le plus proche, sinon l'importateur
        const all = (await env.DB.prepare(`SELECT id, public_postcodes FROM companies WHERE public_visible=1`).all()).results;
        const near = all.find(c => covers(c.public_postcodes, lead.postal_code));
        const def = await env.DB.prepare(`SELECT value FROM settings WHERE key='public_contact_company'`).first();
        cid = near?.id || JSON.parse(def?.value || '"pp"');
      }
      const company = await env.DB.prepare(`SELECT id, kind, IFNULL(public_name, name) AS name, public_email, contact_user_id FROM companies WHERE id=? AND (public_visible=1 OR ?=1)`).bind(cid, kind === 'quote' ? 0 : 1).first();
      if (!company) return err('Choisissez un partenaire.');
      // l'importateur garde la main : une demande adressee a un agent arrive d'abord chez MultiOne Belgium Import
      let handler = company, preferred = null;
      if (company.kind === 'agent' && kind !== 'partner') {
        const def = await env.DB.prepare(`SELECT value FROM settings WHERE key='public_contact_company'`).first();
        const hid = JSON.parse(def?.value || '"pp"');
        handler = await env.DB.prepare(`SELECT id, kind, IFNULL(public_name, name) AS name, public_email, contact_user_id FROM companies WHERE id=?`).bind(hid).first() || company;
        preferred = company;
      }
      const cat = await env.DB.prepare(`SELECT code, family, desc_fr, desc_nl, desc_en FROM products WHERE is_active=1`).all();
      const by = Object.fromEntries(cat.results.map(p => [p.code, p]));
      const m = by[b.machine_code]?.family === 'machine' ? b.machine_code : null;
      const items = (Array.isArray(b.items) ? b.items : []).filter(c => by[c] && by[c].family !== 'machine').slice(0, 60);
      if (kind === 'contact' && !lead.message) return err('Écrivez votre message.');
      if (kind === 'partner' && !lead.contact_company) return err('Indiquez le nom de votre société.');
      const subject = kind === 'contact' ? s(b.subject, 80) || 'Demande d’information' : kind === 'partner' ? 'Candidature distributeur officiel' : null;
      const X = b.extra && typeof b.extra === 'object' ? b.extra : {};
      const extra = kind === 'partner' ? JSON.stringify({ vat: s(X.vat, 30), activity: s(X.activity, 80), region: s(X.region, 200), brands: s(X.brands, 200),
        workshop: s(X.workshop, 20), staff: s(X.staff, 20), website: s(X.website, 150) }) : null;
      await env.DB.prepare(`INSERT INTO leads(id, company_id, lang, machine_code, items, contact_company, contact_name, email, phone, postal_code, city, message, consent, ip_hash, kind, subject)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,1,?,?,?)`).bind(lead.id, handler.id, lead.lang, m, JSON.stringify(items), lead.contact_company || null, lead.contact_name, lead.email,
        lead.phone || null, lead.postal_code || null, lead.city || null, lead.message || null, ip, kind, subject).run();
      if (extra) await env.DB.prepare(`UPDATE leads SET extra=? WHERE id=?`).bind(extra, lead.id).run();
      lead.extra = extra ? JSON.parse(extra) : null;
      await env.DB.prepare(`INSERT INTO lead_events(lead_id, action, detail) VALUES (?, 'created', ?)`).bind(lead.id, kind === 'partner' ? 'Candidature reçue via multione.be' : kind === 'contact' ? `Message reçu via multione.be (${subject})` : 'Demande reçue via multione.be').run();
      lead.kind = kind; lead.subject = subject; lead.preferred = preferred?.name || null;
      if (preferred) {
        await env.DB.prepare(`UPDATE leads SET preferred_company_id=? WHERE id=?`).bind(preferred.id, lead.id).run();
        await env.DB.prepare(`INSERT INTO lead_events(lead_id, action, detail) VALUES (?, 'note', ?)`).bind(lead.id, `Partenaire souhaité par le visiteur : ${preferred.name} (à transférer)`).run();
      }
      const label = (c) => by[c] ? (by[c]['desc_' + 'fr'] || by[c].desc_en) + ' (' + c + ')' : c;
      if (await notify(env, lead, handler, items.map(label), m ? label(m) : null))
        await env.DB.prepare(`UPDATE leads SET notified_at=datetime('now') WHERE id=?`).bind(lead.id).run();
      return json({ ok: true, id: lead.id, partner: company.name, via: preferred ? handler.name : null });
    }
    return err('Introuvable.', 404);
  } catch (e) { return err('Erreur : ' + e.message, 500); }
}
