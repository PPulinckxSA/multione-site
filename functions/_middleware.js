// multione.be : adresse officielle unique, adresses traduites sans #, metas par page, donnees structurees, plan du site.
import '../public/routes.js';
const MOR = globalThis.MOR;

const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const json = o => JSON.stringify(o).replace(/</g, '\\u003c');

// ---------- donnees (gardees 5 minutes en memoire) ----------
let CACHE = null, CACHE_AT = 0;
async function asset(env, origin, path) { try { const r = await env.ASSETS.fetch(new URL(path, origin)); return r.ok ? await r.json() : null; } catch (e) { return null; } }
async function loadData(env, origin) {
  if (CACHE && Date.now() - CACHE_AT < 300000) return CACHE;
  const [products, cat, mach, overrides] = await Promise.all([
    env.DB.prepare(`SELECT code, family, series_tab, desc_fr, desc_nl, desc_en, image_updated_at FROM products WHERE is_active = 1 ORDER BY family, code`).all().then(r => r.results),
    asset(env, origin, '/assets/annex/catalog.json'), asset(env, origin, '/assets/annex/machines.json'), asset(env, origin, '/seo-overrides.json')]);
  let companies = [];
  const base = `id, kind, IFNULL(public_name, name) AS name, public_region AS region, IFNULL(public_phone, phone) AS phone, public_email AS email,
      street, city, public_description AS description, logo_key IS NOT NULL AS has_logo`;
  try { companies = (await env.DB.prepare(`SELECT ${base}, public_website AS website FROM companies WHERE public_visible = 1 ORDER BY CASE kind WHEN 'internal' THEN 0 ELSE 1 END, name`).all()).results; }
  catch (e) { companies = (await env.DB.prepare(`SELECT ${base} FROM companies WHERE public_visible = 1 ORDER BY CASE kind WHEN 'internal' THEN 0 ELSE 1 END, name`).all()).results; }
  let events = [];
  try { events = (await env.DB.prepare(`SELECT id, title_fr, title_nl, title_en, text_fr, text_nl, text_en, location, url, start_date, end_date, image_key IS NOT NULL AS has_image
      FROM events WHERE show_from <= date('now') AND end_date >= date('now') ORDER BY start_date`).all()).results; } catch (e) {}
  const data = { products, cat: cat || { categories: [], families: [] }, mach: mach || {} };
  const ov = {}; for (const [k, v] of Object.entries(overrides || {})) if (k.startsWith('/')) ov[k] = v;      // les cles « _aide » etc. sont ignorees
  CACHE = { I: MOR.index(data), companies, events, overrides: ov }; CACHE_AT = Date.now();
  return CACHE;
}

// ---------- contenu lisible sans JavaScript (remplace a l'affichage par le site) ----------
function ssrBody(m, I, D) {
  const { L, page, arg } = m, H = (p, a) => MOR.href(L, p, a, I), li = (u, t) => `<li><a href="${esc(u)}">${esc(t)}</a></li>`;
  const crumbs = page === 'home' || page === 'notfound' ? '' : `<nav class="crumb" aria-label="breadcrumb">${MOR.crumbs(L, page, arg, I).map(([n, u], i, a) => i === a.length - 1 ? esc(n) : `<a href="${esc(u)}">${esc(n)}</a>`).join(' › ')}</nav>`;
  let body = '';
  const machs = Object.values(I.mach);
  if (page === 'home') body = `<ul>${I.series.map(s => li(H('serie', s), 'MultiOne ' + MOR.serieLabel(s, L))).join('')}</ul><ul>${I.cats.map(c => li(H('acc', c.id), c[L] || c.fr)).join('')}</ul>`;
  if (page === 'machines') body = I.series.map(s => `<h2><a href="${esc(H('serie', s))}">MultiOne ${esc(MOR.serieLabel(s, L))}</a></h2><ul>${machs.filter(x => x.serie === s).map(x => li(H('machine', x.code), x.name)).join('')}</ul>`).join('');
  if (page === 'serie') body = `<ul>${machs.filter(x => x.serie === arg).map(x => li(H('machine', x.code), x.name)).join('')}</ul>`;
  if (page === 'machine') { const sp = I.data.mach?.[arg]?.specs || [];
    body = `<img src="${esc(MOR.machImg(I, arg))}" alt="${esc(I.mach[arg].name)}" width="600"><dl>${sp.filter(s => s.value?.[L]).map(s => `<dt>${esc(s.label?.[L] || s.key)}</dt><dd>${esc(s.value[L])}</dd>`).join('')}</dl>`; }
  if (page === 'acc') body = (arg ? [I.cat[arg]] : I.cats).map(c => `<h2><a href="${esc(H('acc', c.id))}">${esc(c[L] || c.fr)}</a></h2><ul>${I.fams.filter(f => f.cat === c.id).map(f => li(H('famille', f.id), f[L] || f.fr)).join('')}</ul>`).join('');
  if (page === 'famille') { const f = I.fam[arg], ft = f.features?.[L] || f.features?.en || [];
    body = `${m.image ? `<img src="${esc(m.image)}" alt="${esc(f[L] || f.fr)}" width="600">` : ''}<ul>${ft.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`; }
  if (page === 'partenaires' || page === 'contact') body = `<ul>${D.companies.map(c => `<li><b>${esc(c.name)}</b> – ${esc([c.street, c.city].filter(Boolean).join(', '))}${c.phone ? ' – ' + esc(c.phone) : ''}${c.website ? ` – <a href="${esc(c.website)}">${esc(c.website.replace(/^https?:\/\//, '').replace(/\/$/, ''))}</a>` : ''}</li>`).join('')}</ul>`;
  return `<section><div class="wrap">${crumbs}<h1>${esc(m.h1)}</h1><p>${esc(m.description)}</p>${body}</div></section>`;
}

function headExtra(m) {
  const h = [];
  if (m.canonical) h.push(`<link rel="canonical" href="${m.canonical}">`);
  if (m.alternates) { for (const [l, p] of Object.entries(m.alternates)) h.push(`<link rel="alternate" hreflang="${MOR.HREFLANG[l]}" href="${MOR.ORIGIN + p}">`);
    h.push(`<link rel="alternate" hreflang="x-default" href="${MOR.ORIGIN}/">`); }
  if (m.noindex) h.push('<meta name="robots" content="noindex, follow">');
  h.push(`<meta property="og:type" content="${m.page === 'machine' || m.page === 'famille' ? 'product' : 'website'}">`, `<meta property="og:site_name" content="MultiOne Belgium">`,
    `<meta property="og:title" content="${esc(m.title)}">`, `<meta property="og:description" content="${esc(m.description)}">`,
    `<meta property="og:image" content="${esc(m.image)}">`, `<meta property="og:locale" content="${MOR.OGLOC[m.L]}">`, `<meta name="twitter:card" content="summary_large_image">`);
  if (m.canonical) h.push(`<meta property="og:url" content="${m.canonical}">`);
  for (const o of m.ld) h.push(`<script type="application/ld+json">${json(o)}</script>`);
  return h.join('\n');
}

function importers(D, L) {
  const lbl = { fr: 'Importateurs officiels MultiOne en Belgique', nl: 'Officiële MultiOne-invoerders in België', en: 'Official MultiOne importers in Belgium' }[L];
  const int = D.companies.filter(c => c.kind === 'internal');
  return int.length ? `${lbl} : ${int.map(c => c.website ? `<a href="${esc(c.website)}" rel="noopener">${esc(c.name)}</a>` : esc(c.name)).join(' · ')}` : '';
}

async function renderPage(ctx, url, r) {
  const { env } = ctx, D = await loadData(env, url.origin);
  const m = MOR.meta(r.L, r.page, r.arg, D.I, { overrides: D.overrides, companies: D.companies.filter(c => c.kind === 'internal'), partners: D.companies, events: D.events });
  const tpl = await env.ASSETS.fetch(new URL('/', url.origin));
  const rw = new HTMLRewriter()
    .on('html', { element: e => e.setAttribute('lang', r.L) })
    .on('title', { element: e => e.setInnerContent(m.title) })
    .on('meta[name="description"]', { element: e => e.setAttribute('content', m.description) })
    .on('head', { element: e => e.append(headExtra(m), { html: true }) })
    .on('#view', { element: e => e.setInnerContent(ssrBody(m, D.I, D), { html: true }) })
    .on('#fimp', { element: e => e.setInnerContent(importers(D, r.L), { html: true }) })
    .on('a[href^="#/"]', { element: e => { const g = MOR.fromLegacy(e.getAttribute('href')); e.setAttribute('href', MOR.href(r.L, g.page, g.arg, D.I)); } });
  const res = rw.transform(tpl);
  return new Response(res.body, { status: r.page === 'notfound' ? 404 : 200,
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-cache', 'content-language': r.L } });
}

async function sitemap(env, origin) {
  const D = await loadData(env, origin), I = D.I, out = [];
  for (const [page, arg] of MOR.allPages(I)) for (const L of MOR.LANGS) {
    const alt = MOR.LANGS.map(l => `<xhtml:link rel="alternate" hreflang="${MOR.HREFLANG[l]}" href="${MOR.ORIGIN}${MOR.href(l, page, arg, I)}"/>`).join('');
    const img = page === 'machine' ? MOR.machImg(I, arg) : page === 'famille' ? MOR.famImg(I, I.fam[arg]) : null;
    out.push(`<url><loc>${MOR.ORIGIN}${MOR.href(L, page, arg, I)}</loc>${alt}<xhtml:link rel="alternate" hreflang="x-default" href="${MOR.ORIGIN}/"/>${img ? `<image:image><image:loc>${esc(img)}</image:loc></image:image>` : ''}</url>`);
  }
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${out.join('\n')}\n</urlset>`,
    { headers: { 'content-type': 'application/xml; charset=utf-8', 'cache-control': 'public, max-age=3600' } });
}

const preferredLang = req => { const a = (req.headers.get('accept-language') || '').toLowerCase(); const m = a.match(/\b(fr|nl|en)\b/); return m ? m[1] : 'fr'; };

export async function onRequest(ctx) {
  const { request, next, env } = ctx;
  const url = new URL(request.url);
  // adresses techniques de production (ancien et nouveau projet) et www : redirection vers multione.be.
  // Les aperçus des propositions de modification (<branche>.multione-site-git.pages.dev) ne sont PAS redirigés.
  if (['multione-site.pages.dev', 'multione-site-git.pages.dev', 'www.multione.be'].includes(url.hostname)) {
    return Response.redirect('https://multione.be' + url.pathname + url.search, 301);
  }
  let res;
  const p = url.pathname, isPage = request.method === 'GET' && !p.startsWith('/api/') && !p.startsWith('/assets/') && !/\.[a-z0-9]{2,5}$/i.test(p);
  if (p === '/sitemap.xml') res = await sitemap(env, url.origin);
  else if (request.method === 'GET' && (p === '/' || p === '/index.html')) res = new Response(null, { status: 302, headers: { location: '/' + preferredLang(request) + '/' + url.search, vary: 'Accept-Language' } });
  else if (isPage && /^\/(fr|nl|en)$/.test(p)) res = Response.redirect(url.origin + p + '/' + url.search, 301);
  else if (isPage && p.length > 4 && p.endsWith('/')) res = Response.redirect(url.origin + p.replace(/\/+$/, '') + url.search, 301);
  else if (isPage) {
    try { const D = await loadData(env, url.origin); const r = MOR.resolve(p, D.I);
      res = await renderPage(ctx, url, r || { L: preferredLang(request), page: 'notfound' }); }
    catch (e) { console.error('rendu', e); res = await next(); }   // en cas d'incident : le site s'affiche quand meme
  }
  else res = await next();
  if (url.hostname.endsWith('.pages.dev')) {                 // apercus de deploiement : jamais indexes par Google
    const r = new Response(res.body, res); r.headers.set('X-Robots-Tag', 'noindex'); return r;
  }
  return res;
}
