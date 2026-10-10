// multione.be : catalogue public (sans prix), configurateur, choix du partenaire, demande de devis.
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
let L = (localStorage.getItem('mo_lang') || (navigator.language || 'fr').slice(0, 2)); if (!['fr', 'nl', 'en'].includes(L)) L = 'fr';
{ const pl = location.pathname.split('/')[1]; if (['fr', 'nl', 'en'].includes(pl)) L = pl; }   // la langue de l'adresse prime
let CUR = { page: 'home' };                        // page affichee
let D = null;                                     // donnees
const CFG = JSON.parse(sessionStorage.getItem('mo_cfg') || '{"machine":null,"items":[],"partner":null}');
const saveCfg = () => sessionStorage.setItem('mo_cfg', JSON.stringify(CFG));

const T = {
  fr: { nav: [['#/', 'Accueil'], ['#/machines', 'Machines'], ['#/accessoires', 'Accessoires'], ['#/histoire', 'Notre histoire'], ['#/partenaires', 'Partenaires'], ['#/contact', 'Contact']], cta: 'Configurer ma machine',
    heroT: n => `Une seule machine, plus de ${n} accessoires`, heroP: 'Les chargeuses articulées MultiOne passent de la pelle à la fourche, de la balayeuse à la fraise à neige en quelques secondes. Composez votre configuration, un partenaire officiel vous répond.',
    f1: 'modèles d’accessoires', f2: 'séries de machines', f3: 'partenaires en Belgique', machines: 'Les machines', machinesP: 'Du modèle compact de la série 1 à la puissante série 11.',
    seeAll: 'Voir toutes les machines', apps: 'Accessoires par métier', appsP: 'Choisissez votre activité pour voir les accessoires adaptés.', allAcc: 'Tous les accessoires',
    partners: 'Nos partenaires', partnersP: 'Des équipes proches de chez vous pour la démonstration, la vente et le service.', official: 'Partenaire officiel', importer: 'Importateur MultiOne',
    serie: 'Série', models: n => `${n} modèle${n > 1 ? 's' : ''}`, famAcc: n => `${n} famille${n > 1 ? 's' : ''} d’accessoires`, specs: 'Caractéristiques', std: 'Équipements de série',
    dims: 'Dimensions', chart: 'Tableau de charge', opts: 'Options disponibles', compatAcc: 'Accessoires compatibles', addMachine: 'Configurer cette machine', inCfg: '✓ Dans ma configuration',
    add: '+ Ajouter', added: '✓ Ajouté', very: 'Très compatible', ok: 'Compatible, à valider selon l’usage', no: 'Non compatible avec votre machine', unk: 'Compatibilité à confirmer',
    steps: ['Machine', 'Options', 'Accessoires', 'Partenaire', 'Demande'], next: 'Continuer', prev: 'Retour', myCfg: 'Ma configuration', noMachine: 'Aucune machine choisie',
    chooseSerie: 'Choisissez une série, puis un modèle.', noOpts: 'Aucune option pour cette machine.', optsP: 'Cochez les options qui vous intéressent.', accP: 'Seuls les accessoires compatibles avec votre machine sont proposés.',
    partnerP: 'Choisissez le partenaire qui vous recevra et vous remettra une offre. Indiquez votre code postal pour voir le plus proche.', cpPh: 'Votre code postal', near: 'Proche de chez vous',
    form: 'Vos coordonnées', name: 'Nom et prénom *', company: 'Société', email: 'E-mail *', phone: 'Téléphone', cp: 'Code postal', city: 'Localité', msg: 'Votre message (usage, terrain, délai…)',
    consent: 'J’accepte que mes données soient transmises au partenaire choisi et à MultiOne Belgium Import pour répondre à ma demande.', send: 'Envoyer ma demande', sending: 'Envoi…',
    thanks: 'Merci, votre demande est envoyée', thanksP: (p, v) => v ? `${v} a bien reçu votre configuration et la transmet à ${p}, qui vous contactera rapidement.` : `${p} a reçu votre configuration et vous contactera rapidement, en principe sous 24 heures ouvrables.`, newCfg: 'Nouvelle configuration',
    choosePartner: 'Choisissez un partenaire pour continuer.', filter: 'Filtrer les accessoires', all: 'Toutes', privacy: 'Vie privée', foot: 'Chargeuses articulées et accessoires MultiOne en Belgique.',
    privT: 'Protection de vos données', privP: 'Les informations que vous saisissez dans le formulaire de demande sont transmises uniquement au partenaire que vous choisissez et à MultiOne Belgium Import, dans le seul but de répondre à votre demande et de vous remettre une offre. Elles ne sont ni vendues ni cédées à des tiers. Vous pouvez demander à tout moment leur consultation, leur correction ou leur suppression en écrivant au partenaire concerné.',
    empty: 'Votre configuration est vide.', acc: '🔒 Accès réservé', evNow: 'En ce moment', evSoon: 'Retrouvez-nous', evBooth: 'Stand', evMore: 'En savoir plus', evAsk: 'Demander une invitation', remove: 'Retirer', phoneL: 'Tél.' },
  nl: { nav: [['#/', 'Home'], ['#/machines', 'Machines'], ['#/accessoires', 'Werktuigen'], ['#/histoire', 'Ons verhaal'], ['#/partenaires', 'Partners'], ['#/contact', 'Contact']], cta: 'Mijn machine samenstellen',
    heroT: n => `Eén machine, meer dan ${n} werktuigen`, heroP: 'Met een MultiOne knikladder wissel je in enkele seconden van bak naar vork, van veegmachine naar sneeuwblazer. Stel je configuratie samen, een officiële partner antwoordt je.',
    f1: 'werktuigmodellen', f2: 'machineseries', f3: 'partners in België', machines: 'De machines', machinesP: 'Van het compacte model uit serie 1 tot de krachtige serie 11.',
    seeAll: 'Alle machines bekijken', apps: 'Werktuigen per vak', appsP: 'Kies je activiteit om de geschikte werktuigen te zien.', allAcc: 'Alle werktuigen',
    partners: 'Onze partners', partnersP: 'Teams dicht bij jou voor demonstratie, verkoop en service.', official: 'Officiële partner', importer: 'MultiOne-invoerder',
    serie: 'Serie', models: n => `${n} model${n > 1 ? 'len' : ''}`, famAcc: n => `${n} werktuigfamilie${n > 1 ? 's' : ''}`, specs: 'Kenmerken', std: 'Standaarduitrusting',
    dims: 'Afmetingen', chart: 'Lastentabel', opts: 'Beschikbare opties', compatAcc: 'Compatibele werktuigen', addMachine: 'Deze machine samenstellen', inCfg: '✓ In mijn configuratie',
    add: '+ Toevoegen', added: '✓ Toegevoegd', very: 'Zeer compatibel', ok: 'Compatibel, te bevestigen volgens gebruik', no: 'Niet compatibel met je machine', unk: 'Compatibiliteit te bevestigen',
    steps: ['Machine', 'Opties', 'Werktuigen', 'Partner', 'Aanvraag'], next: 'Verder', prev: 'Terug', myCfg: 'Mijn configuratie', noMachine: 'Geen machine gekozen',
    chooseSerie: 'Kies een serie en daarna een model.', noOpts: 'Geen opties voor deze machine.', optsP: 'Vink de opties aan die je interesseren.', accP: 'Enkel de werktuigen die compatibel zijn met je machine worden getoond.',
    partnerP: 'Kies de partner die je zal ontvangen en een offerte zal bezorgen. Geef je postcode op om de dichtstbijzijnde te zien.', cpPh: 'Je postcode', near: 'Dicht bij jou',
    form: 'Je gegevens', name: 'Naam en voornaam *', company: 'Bedrijf', email: 'E-mail *', phone: 'Telefoon', cp: 'Postcode', city: 'Gemeente', msg: 'Je bericht (gebruik, terrein, termijn…)',
    consent: 'Ik ga ermee akkoord dat mijn gegevens aan de gekozen partner en aan MultiOne Belgium Import worden doorgegeven om mijn aanvraag te beantwoorden.', send: 'Mijn aanvraag versturen', sending: 'Versturen…',
    thanks: 'Bedankt, je aanvraag is verstuurd', thanksP: (p, v) => v ? `${v} heeft je configuratie goed ontvangen en bezorgt ze aan ${p}, die snel contact met je opneemt.` : `${p} heeft je configuratie ontvangen en neemt snel contact met je op, in principe binnen 24 werkuren.`, newCfg: 'Nieuwe configuratie',
    choosePartner: 'Kies een partner om verder te gaan.', filter: 'Werktuigen filteren', all: 'Alle', privacy: 'Privacy', foot: 'MultiOne knikladers en werktuigen in België.',
    privT: 'Bescherming van je gegevens', privP: 'De gegevens die je in het aanvraagformulier invult, worden enkel doorgegeven aan de partner die je kiest en aan MultiOne Belgium Import, met als enig doel je aanvraag te beantwoorden en je een offerte te bezorgen. Ze worden niet verkocht of aan derden doorgegeven. Je kunt op elk moment inzage, verbetering of verwijdering vragen door de betrokken partner te contacteren.',
    empty: 'Je configuratie is leeg.', acc: '🔒 Partnertoegang', evNow: 'Nu bezig', evSoon: 'Kom ons bezoeken', evBooth: 'Stand', evMore: 'Meer info', evAsk: 'Een uitnodiging vragen', remove: 'Verwijderen', phoneL: 'Tel.' },
  en: { nav: [['#/', 'Home'], ['#/machines', 'Machines'], ['#/accessoires', 'Attachments'], ['#/histoire', 'Our story'], ['#/partenaires', 'Partners'], ['#/contact', 'Contact']], cta: 'Configure my machine',
    heroT: n => `One machine, more than ${n} attachments`, heroP: 'MultiOne articulated loaders switch from bucket to fork, from sweeper to snow blower in seconds. Build your configuration and an official partner will get back to you.',
    f1: 'attachment models', f2: 'machine series', f3: 'partners in Belgium', machines: 'The machines', machinesP: 'From the compact 1 series to the powerful 11 series.',
    seeAll: 'See all machines', apps: 'Attachments by trade', appsP: 'Pick your activity to see the right attachments.', allAcc: 'All attachments',
    partners: 'Our partners', partnersP: 'Local teams for demonstrations, sales and service.', official: 'Official partner', importer: 'MultiOne importer',
    serie: 'Series', models: n => `${n} model${n > 1 ? 's' : ''}`, famAcc: n => `${n} attachment famil${n > 1 ? 'ies' : 'y'}`, specs: 'Specifications', std: 'Standard equipment',
    dims: 'Dimensions', chart: 'Load chart', opts: 'Available options', compatAcc: 'Compatible attachments', addMachine: 'Configure this machine', inCfg: '✓ In my configuration',
    add: '+ Add', added: '✓ Added', very: 'Very compatible', ok: 'Compatible, to be confirmed for your use', no: 'Not compatible with your machine', unk: 'Compatibility to be confirmed',
    steps: ['Machine', 'Options', 'Attachments', 'Partner', 'Request'], next: 'Continue', prev: 'Back', myCfg: 'My configuration', noMachine: 'No machine selected',
    chooseSerie: 'Pick a series, then a model.', noOpts: 'No options for this machine.', optsP: 'Tick the options you are interested in.', accP: 'Only attachments compatible with your machine are shown.',
    partnerP: 'Choose the partner who will meet you and send you a quotation. Enter your postcode to see the nearest one.', cpPh: 'Your postcode', near: 'Near you',
    form: 'Your details', name: 'Full name *', company: 'Company', email: 'E-mail *', phone: 'Phone', cp: 'Postcode', city: 'Town', msg: 'Your message (use, ground, timing…)',
    consent: 'I agree that my details are passed on to the chosen partner and to MultiOne Belgium Import to answer my request.', send: 'Send my request', sending: 'Sending…',
    thanks: 'Thank you, your request has been sent', thanksP: (p, v) => v ? `${v} has received your configuration and is passing it on to ${p}, who will contact you shortly.` : `${p} has received your configuration and will contact you shortly, normally within 24 working hours.`, newCfg: 'New configuration',
    choosePartner: 'Choose a partner to continue.', filter: 'Filter attachments', all: 'All', privacy: 'Privacy', foot: 'MultiOne articulated loaders and attachments in Belgium.',
    privT: 'Protecting your data', privP: 'The details you enter in the request form are passed only to the partner you choose and to MultiOne Belgium Import, solely to answer your request and send you a quotation. They are never sold or passed on to third parties. You can ask at any time to see, correct or delete them by writing to the partner concerned.',
    empty: 'Your configuration is empty.', acc: '🔒 Partner login', evNow: 'Happening now', evSoon: 'Meet us', evBooth: 'Booth', evMore: 'Learn more', evAsk: 'Request an invitation', remove: 'Remove', phoneL: 'Tel.' } };
const t = () => T[L];

// ---------- donnees ----------
async function load() {
  const [cat, pt, c, m, i, ev, ov] = await Promise.all(['/api/public/catalog', '/api/public/partners', '/assets/annex/catalog.json', '/assets/annex/machines.json', '/assets/annex/items.json', '/api/public/events', '/seo-overrides.json']
    .map(u => fetch(u).then(r => r.json()).catch(() => ({ events: [] }))));
  D = { ...cat, partners: pt.partners, events: ev.events || [], cat: c, mach: m, items: i, ov: ov || {}, by: Object.fromEntries(cat.products.map(p => [p.code, p])) };
  D.I = MOR.index({ products: cat.products, cat: c, mach: m });
}
const desc = p => p?.['desc_' + L] || p?.desc_fr || p?.desc_en || '';
const serKey = s => { const m = String(s).match(/^(\d+)/); return m ? [0, +m[1]] : [1, String(s).replace(/\D/g, '') | 0]; };
const SER = s => { const m = String(s || '').match(/^(\d+)\s*series/i); return m ? t().serie + ' ' + m[1] : String(s || '').replace(/^EZ\s*7-8$/i, 'EZ7 / EZ8').replace(/^EZ\s*5$/i, 'EZ5'); };
const serNum = s => { const m = String(s || '').match(/^(\d+)/); return m ? m[1] : String(s || '').replace(/\s/g, '').replace('7-8', '7'); };
function shortMachine(d) {
  let n = String(d || '').replace(/^MultiOne\s+/i, '').trim(), sub = [];
  const par = n.match(/^(.*?)\s*\((.*)\)\s*$/); if (par) { n = par[1]; sub.push(par[2]); }
  const st = n.match(/^(.*?)\s+((?:T4F-)?STAGE\s+V)$/i); if (st) { n = st[1]; sub.push('Stage V'); }
  return { main: n.replace(/PACK\s*1/i, 'Pack 1').replace(/\s+-\s+/g, ' · '), sub: sub.join(' · ').replace(/Stage V - /i, 'Stage V · ') };
}
const machines = () => D.products.filter(p => p.family === 'machine');
const seriesList = () => [...new Set(machines().map(p => p.series_tab))].sort((a, b) => { const x = serKey(a), y = serKey(b); return x[0] - y[0] || x[1] - y[1]; });
const img = (code, fb) => D.by[code]?.image_updated_at ? `/api/public/image/${encodeURIComponent(code)}?v=${encodeURIComponent(D.by[code].image_updated_at)}` : fb;
const mImg = code => img(code, `/assets/machines/${code}.jpg`);
const iImg = code => img(code, D.items[code] ? `/assets/annex/${D.items[code].photo}` : null);
const famImg = f => { const c = f.codes.find(x => D.by[x]?.image_updated_at); return c ? img(c) : `/assets/annex/${f.photo}`; };
const famName = f => f[L] || f.fr;
const catName = c => c[L] || c.fr;
const level = (acc, mcode) => { const m = D.by[mcode]; return m ? (D.compat[acc]?.[m.compat_key] || null) : undefined; };
const famLevel = (f, mcode) => { if (!mcode) return undefined; const l = f.codes.filter(c => D.by[c]).map(c => level(c, mcode)); return l.includes('very') ? 'very' : l.includes('ok') ? 'ok' : l.length && l.every(x => x === 'no') ? 'no' : null; };
const famsVisible = () => D.cat.families.map(f => ({ ...f, codes: f.codes.filter(c => D.by[c]) })).filter(f => f.codes.length);
const lvl = l => l === 'very' ? `<span class="lvl very">● ${t().very}</span>` : l === 'ok' ? `<span class="lvl ok">● ${t().ok}</span>` : l === null ? `<span class="lvl">○ ${t().unk}</span>` : '';


// ---------- cookies (RGPD) et mesure d'audience GA4 ----------
const CKT = { fr: { t: 'Nous utilisons des cookies de mesure d’audience (Google Analytics) pour améliorer ce site, uniquement avec votre accord.', y: 'Accepter', n: 'Refuser', more: 'En savoir plus', link: 'Cookies' },
  nl: { t: 'Wij gebruiken cookies voor bezoekersstatistieken (Google Analytics) om deze site te verbeteren, alleen met uw toestemming.', y: 'Aanvaarden', n: 'Weigeren', more: 'Meer info', link: 'Cookies' },
  en: { t: 'We use audience measurement cookies (Google Analytics) to improve this website, only with your consent.', y: 'Accept', n: 'Decline', more: 'Learn more', link: 'Cookies' } };
const consent = () => { try { return localStorage.getItem('mo_consent'); } catch (e) { return null; } };
function loadGA() {
  if (window._gaLoaded || consent() !== 'granted') return; window._gaLoaded = true;
  const sc = document.createElement('script'); sc.async = true; sc.src = 'https://www.googletagmanager.com/gtag/js?id=G-3Z8Q0D0TWQ'; document.head.appendChild(sc);
}
function setConsent(v) {
  try { localStorage.setItem('mo_consent', v); } catch (e) {}
  if (window.gtag) gtag('consent', 'update', { analytics_storage: v === 'granted' ? 'granted' : 'denied' });
  document.getElementById('ckb')?.remove();
  if (v === 'granted') { loadGA(); trackPage(true); }
}
function cookieBanner(force) {
  if (!force && consent()) return; document.getElementById('ckb')?.remove();
  const c = CKT[L] || CKT.fr, d = document.createElement('div'); d.className = 'ckb'; d.id = 'ckb'; d.setAttribute('role', 'dialog');
  d.innerHTML = `<p>${c.t} <a href="#/vie-privee">${c.more}</a></p><span class="ckbtns"><button class="ckno">${c.n}</button><button class="ckyes">${c.y}</button></span>`;
  document.body.appendChild(d); d.querySelector('.ckno').onclick = () => setConsent('denied'); d.querySelector('.ckyes').onclick = () => setConsent('granted');
}
let lastTracked = null;
function trackPage(force) {                       // le site change de page sans recharger : chaque page est signalee a GA4
  const path = location.pathname;
  if (!window.gtag || consent() !== 'granted' || (!force && path === lastTracked)) return; lastTracked = path; loadGA();
  gtag('event', 'page_view', { page_title: document.title, page_location: location.origin + path, page_path: path, language: L });
}

// ---------- adresses ----------
function LH(h) { const g = MOR.fromLegacy(h); return D ? MOR.href(L, g.page, g.arg, D.I) : '/' + L + '/'; }   // « #/machine/C951029 » -> adresse traduite
function fixLinks() { if (!D) return; document.querySelectorAll('a[href^="#/"]').forEach(a => a.setAttribute('href', LH(a.getAttribute('href')))); }
function go(path) { if (path !== location.pathname + location.search) history.pushState(null, '', path); route(); }
function setMeta(r) {
  const m = MOR.meta(r.L || L, r.page, r.arg, D.I, { overrides: D.ov });
  document.title = m.title;
  const set = (sel, attr, val, make) => { let e = document.head.querySelector(sel); if (!e && val) { e = document.createElement(make[0]); for (const [k, v] of Object.entries(make[1])) e.setAttribute(k, v); document.head.appendChild(e); } if (e) val ? e.setAttribute(attr, val) : e.remove(); };
  set('meta[name="description"]', 'content', m.description, ['meta', { name: 'description' }]);
  set('link[rel="canonical"]', 'href', m.canonical, ['link', { rel: 'canonical' }]);
  set('meta[name="robots"]', 'content', m.noindex ? 'noindex, follow' : '', ['meta', { name: 'robots' }]);
  for (const l of MOR.LANGS) set(`link[rel="alternate"][hreflang="${MOR.HREFLANG[l]}"]`, 'href', m.alternates ? MOR.ORIGIN + m.alternates[l] : '', ['link', { rel: 'alternate', hreflang: MOR.HREFLANG[l] }]);
}
function footerImporters() {
  const e = $('#fimp'); if (!e || !D) return;
  const int = (D.partners || []).filter(c => c.kind === 'internal');
  const lbl = { fr: 'Importateurs officiels MultiOne en Belgique', nl: 'Officiële MultiOne-invoerders in België', en: 'Official MultiOne importers in Belgium' }[L];
  e.innerHTML = int.length ? `${lbl} : ${int.map(c => c.website ? `<a href="${esc(c.website)}" rel="noopener">${esc(c.name)}</a>` : esc(c.name)).join(' · ')}` : '';
}

// ---------- coque ----------
function shell() {
  document.documentElement.lang = L;
  const h = location.pathname;
  $('#nav').innerHTML = t().nav.map(([lh, l]) => { const href = LH(lh); return `<a href="${href}" class="${(lh === '#/' ? h === href : h.startsWith(href)) ? 'on' : ''}">${l}</a>`; }).join('')
;
  $('#accL').textContent = t().acc + ' ▾';
  const PM = { fr: [['Portail commercial', 'Offres de prix, tarif, catalogue'], ['Portail SAV', 'Mises en service, livres de pièces, pièces, garanties']],
    nl: [['Commercieel portaal', 'Prijsoffertes, tarief, catalogus'], ['Serviceportaal', 'Ingebruikname, onderdelenboeken, onderdelen, garantie']],
    en: [['Sales portal', 'Quotations, price list, catalogue'], ['Service portal', 'Commissioning, parts books, parts, warranty']] }[L];
  $('#accM').innerHTML = `<a href="https://app.multione.be/" rel="nofollow"><b>${PM[0][0]}</b><small>${PM[0][1]}</small></a><a href="https://sav.multione.be/" rel="nofollow"><b>${PM[1][0]}</b><small>${PM[1][1]}</small></a>`;
  $('#accL').onclick = e => { e.stopPropagation(); $('#accM').classList.toggle('open'); };
  document.onclick = () => $('#accM')?.classList.remove('open');
  const fa = $('#facc'); if (fa) fa.textContent = t().acc.replace('🔒 ', '');
  $('#lang').innerHTML = ['fr', 'nl', 'en'].map(l => `<button data-l="${l}" class="${l === L ? 'on' : ''}">${l.toUpperCase()}</button>`).join('');
  document.querySelectorAll('[data-l]').forEach(b => b.onclick = () => { L = b.dataset.l; localStorage.setItem('mo_lang', L); go(MOR.href(L, CUR.page === 'notfound' ? 'home' : CUR.page, CUR.arg, D?.I)); });
  $('#topCta').textContent = t().cta; $('#ftxt').textContent = t().foot; $('#fpriv').textContent = t().privacy;
  const fj = $('#fjoin'); if (fj) fj.textContent = pt().nav;
  const fck = $('#fck'); if (fck) { fck.textContent = (CKT[L] || CKT.fr).link; fck.onclick = e => { e.preventDefault(); cookieBanner(true); }; }
  $('#menuT').onclick = () => $('#nav').classList.toggle('open');
  footerImporters(); fixLinks();
}
function route() {
  if (D && location.hash.startsWith('#/')) { const g = MOR.fromLegacy(location.hash); history.replaceState(null, '', MOR.href(L, g.page, g.arg, D.I)); }   // anciennes adresses avec #
  { const pl = location.pathname.split('/')[1]; if (['fr', 'nl', 'en'].includes(pl) && pl !== L) { L = pl; try { localStorage.setItem('mo_lang', L); } catch (e) {} } }
  shell(); setTimeout(trackPage, 50); if (document.getElementById('ckb')) cookieBanner(true); $('#nav').classList.remove('open'); window.scrollTo(0, 0);
  const v = $('#view');
  if (!D) { v.innerHTML = '<div class="loading">…</div>'; return; }
  const r = MOR.resolve(location.pathname, D.I) || { L, page: 'notfound' };
  CUR = r; setMeta(r);
  const a = { home: undefined, acc: 'accessoires' }[r.page] ?? r.page, b = r.arg || undefined;
  if (a === 'notfound') return v.innerHTML = `<section><div class="wrap"><h1 class="h2">${esc(MOR.TX[L].notfound[0].split(' – ')[0])}</h1><p style="margin-top:14px">${esc(MOR.TX[L].notfound[1])}</p><p><a class="cta" href="${MOR.href(L, 'home')}">${esc(MOR.TX[L].home_l)}</a></p></div></section>`;
  if (a === 'machines') return v.innerHTML = pageMachines(), wire();
  if (a === 'serie') return v.innerHTML = pageSerie(b), wire();
  if (a === 'machine') return v.innerHTML = pageMachine(b), wire();
  if (a === 'accessoires') return v.innerHTML = pageAcc(b), wire();
  if (a === 'famille') return v.innerHTML = pageFamily(b), wire();
  if (a === 'partenaires') return v.innerHTML = pagePartners(), wire();
  if (a === 'histoire') return v.innerHTML = pageStory(), wire();
  if (a === 'contact') return v.innerHTML = pageContact();
  if (a === 'devenir-distributeur') return v.innerHTML = pagePartnerApply();
  if (a === 'configurer') return pageConfig(b);
  if (a === 'merci') return v.innerHTML = pageThanks(b), wire();
  if (a === 'vie-privee') { const ck = { fr: ['Cookies', 'Avec votre accord, ce site utilise Google Analytics (Google Ireland Ltd) pour mesurer son audience de façon statistique : pages consultées, langue, type d’appareil. Sans votre accord, aucun cookie de mesure n’est déposé. Le choix « Accepter » ou « Refuser » est retenu dans votre navigateur ; vous pouvez le modifier à tout moment.', 'Modifier mon choix'],
      nl: ['Cookies', 'Met uw toestemming gebruikt deze site Google Analytics (Google Ireland Ltd) om het bezoek statistisch te meten: bekeken pagina’s, taal, type toestel. Zonder uw toestemming worden geen meetcookies geplaatst. Uw keuze wordt in uw browser bewaard; u kunt ze op elk moment wijzigen.', 'Mijn keuze wijzigen'],
      en: ['Cookies', 'With your consent, this website uses Google Analytics (Google Ireland Ltd) to measure its audience statistically: pages viewed, language, device type. Without your consent, no measurement cookie is set. Your choice is stored in your browser and can be changed at any time.', 'Change my choice'] }[L];
    v.innerHTML = `<section><div class="wrap"><h1 class="h2">${t().privT}</h1><p style="margin-top:16px">${t().privP}</p><h3 style="margin-top:24px">${ck[0]}</h3><p>${ck[1]}</p><button class="btn2" id="ckChange">${ck[2]}</button></div></section>`;
    $('#ckChange').onclick = () => cookieBanner(true); return; }
  v.innerHTML = pageHome(); wire();
}
function wire() {
  document.querySelectorAll('[data-evsubj]').forEach(a => a.onclick = () => sessionStorage.setItem('mo_ct_subject', a.dataset.evsubj));
  document.querySelectorAll('[data-addm]').forEach(b => b.onclick = () => { CFG.machine = b.dataset.addm; CFG.items = CFG.items.filter(c => D.by[c]?.family !== 'option'); saveCfg(); go(LH('#/configurer/2')); });
  document.querySelectorAll('[data-add]').forEach(b => b.onclick = () => { const c = b.dataset.add; CFG.items = CFG.items.includes(c) ? CFG.items.filter(x => x !== c) : [...CFG.items, c]; saveCfg(); route(); });
}

// ---------- pages ----------
function serieCard(s) {
  const ms = machines().filter(p => p.series_tab === s);
  return `<a class="ser" href="#/serie/${encodeURIComponent(s)}"><span class="num">${esc(serNum(s))}</span><img src="${mImg(ms[0].code)}" alt="MultiOne ${esc(SER(s))}" loading="lazy">
    <b>${esc(SER(s))}</b><small>${ms.map(p => esc(shortMachine(p.desc_en).main)).join(' · ')}</small></a>`;
}
function pageHome() {
  const hero = machines().find(p => p.code === 'C968120') || machines()[0];
  const cats = D.cat.categories.map(c => ({ ...c, n: famsVisible().filter(f => f.cat === c.id).length })).filter(c => c.n);
  const nf = famsVisible().length, round = nf >= 100 ? Math.floor(nf / 50) * 50 : Math.floor(nf / 10) * 10;
  return `<div class="hero"><div class="wrap"><div><h1>${t().heroT(round)}</h1><p>${t().heroP}</p><a class="cta" href="#/configurer">${t().cta}</a>
      <div class="facts"><div><b>${famsVisible().reduce((a, f) => a + f.codes.length, 0)}</b>${t().f1}</div><div><b>${seriesList().length}</b>${t().f2}</div><div><b>${D.partners.length}</b>${t().f3}</div></div></div>
    <div class="ph"><span class="num">${esc(serNum(hero.series_tab))}</span><img src="${mImg(hero.code)}" alt="MultiOne ${esc(shortMachine(hero.desc_en).main)}"></div></div></div>
  ${eventBanner()}
  <section><div class="wrap"><div class="sechead"><div><h2>${t().machines}</h2><p>${t().machinesP}</p></div></div><div class="series">${seriesList().map(serieCard).join('')}</div></div></section>
  <section style="padding-top:0"><div class="wrap"><div class="sechead"><div><h2>${t().apps}</h2><p>${t().appsP}</p></div><a class="btn2" href="#/accessoires">${t().allAcc}</a></div>
    <div class="apps">${cats.map(c => `<a class="app" href="#/accessoires/${c.id}"><img src="/assets/annex/${c.photo}" alt="${esc(catName(c))}" loading="lazy"><span>${esc(catName(c))}<small>${t().famAcc(c.n)}</small></span></a>`).join('')}</div></div></section>
  <section class="band"><div class="wrap"><div class="sechead"><div><h2>${t().partners}</h2><p>${t().partnersP}</p></div><a class="btn2" href="#/devenir-distributeur">${pt().nav}</a></div>${partnerCards(false)}</div></section>
  <section style="padding-top:48px">${partnerBand().replace('<section style="padding-top:0">', '').replace(/<\/section>$/, '')}</section>`;
}
// encart evenement (salon, expo) : affiche avant et pendant, supprime ensuite
function eventBanner() {
  if (!D.events?.length) return '';
  const fd = d => new Date(d + 'T12:00:00').toLocaleDateString({ fr: 'fr-BE', nl: 'nl-BE', en: 'en-GB' }[L], { day: 'numeric', month: 'long' });
  return `<section class="evs"><div class="wrap">${D.events.map(e => { const now = e.today >= e.start_date, one = e.start_date === e.end_date;
    return `<div class="ev ${now ? 'now' : ''}">${e.has_image ? `<img src="/api/public/event-image/${e.id}" alt="">` : ''}<div class="evt">
      <span class="evtag">${now ? '● ' + t().evNow : t().evSoon}</span><h2>${esc(e['title_' + L] || e.title_fr)}</h2>
      <p class="evd"><b>${one ? fd(e.start_date) : fd(e.start_date) + ' – ' + fd(e.end_date)}</b>${e.location ? ' · ' + esc(e.location) : ''}${e.booth ? ' · ' + t().evBooth + ' ' + esc(e.booth) : ''}</p>
      ${(e['text_' + L] || e.text_fr) ? `<p>${esc(e['text_' + L] || e.text_fr)}</p>` : ''}
      <p class="evb">${e.url ? `<a class="btn2" href="${esc(e.url)}" target="_blank" rel="noopener">${t().evMore}</a>` : ''}<a class="cta small" href="#/contact" data-evsubj="${esc(e['title_' + L] || e.title_fr)}">${t().evAsk}</a></p></div></div>`; }).join('')}</div></section>`;
}
function pageMachines() { return `<section><div class="wrap"><h1 class="h2" style="margin-bottom:24px">${t().machines}</h1><div class="series">${seriesList().map(serieCard).join('')}</div></div></section>`; }
function pageSerie(s) {
  const ms = machines().filter(p => p.series_tab === s);
  return `<section style="padding-top:0"><div class="wrap"><div class="crumb"><a href="#/machines">${t().machines}</a> › ${esc(SER(s))}</div><h1 class="h2" style="margin-bottom:22px">${esc(SER(s))}</h1>
    <div class="grid3">${ms.map(p => { const sm = shortMachine(p.desc_en), sp = D.mach[p.code]?.specs || [], g = k => sp.find(x => x.key === k)?.value[L] || '';
      return `<a class="card" href="#/machine/${p.code}"><img src="${mImg(p.code)}" alt="MultiOne ${esc(sm.main)}" style="object-fit:contain;background:var(--steel)"><div><b>MultiOne ${esc(sm.main)}</b><small>${esc(sm.sub)}</small>
        <div class="chips">${[g('tipping'), g('height'), g('weight')].filter(Boolean).map(v => `<span>${esc(v)}</span>`).join('')}</div></div></a>`; }).join('')}</div></div></section>`;
}
function pageMachine(code) {
  const p = D.by[code]; if (!p) return pageMachines();
  const a = D.mach[code] || {}, sm = shortMachine(p.desc_en), inC = CFG.machine === code;
  const opts = (D.machineOptions[code] || []).map(c => D.by[c]).filter(Boolean);
  const fams = famsVisible().map(f => ({ f, l: famLevel(f, code) })).filter(x => x.l === 'very' || x.l === 'ok');
  return `<section style="padding-top:0"><div class="wrap"><div class="crumb"><a href="#/machines">${t().machines}</a> › <a href="#/serie/${encodeURIComponent(p.series_tab)}">${esc(SER(p.series_tab))}</a> › ${esc(sm.main)}</div>
    <div class="mtop"><div class="big"><img src="${mImg(code)}" alt="MultiOne ${esc(sm.main)}"></div>
      <div><h1 style="font-size:clamp(40px,5vw,64px)">MultiOne ${esc(sm.main)}</h1><p style="color:var(--muted);margin:6px 0 16px">${esc(sm.sub)}</p>
        ${inC ? `<a class="cta" href="#/configurer/2">${t().inCfg}</a>` : `<button class="cta" data-addm="${code}">${t().addMachine}</button>`}
        <table class="spec">${(a.specs || []).map(s => `<tr><td>${esc(s.label[L] || s.label.fr)}</td><td>${esc(s.value[L] || s.value.fr)}</td></tr>`).join('')}</table></div></div>
    ${(a.features?.[L] || []).length ? `<details open><summary>${t().std}</summary><ul class="feat">${a.features[L].map(x => `<li>${esc(x)}</li>`).join('')}</ul></details>` : ''}
    ${a.dims ? `<details><summary>${t().dims}</summary><img src="/assets/annex/${a.dims}" alt="${esc(t().dims)}" loading="lazy" style="max-width:820px;margin-top:10px"></details>` : ''}
    ${a.chart ? `<details><summary>${t().chart}</summary><img src="/assets/annex/${a.chart}" alt="${esc(t().chart)}" loading="lazy" style="max-width:900px;margin-top:10px"></details>` : ''}
    <h2 style="margin:36px 0 16px">${t().opts}</h2><div class="optlist">${opts.map(o => optCard(o)).join('') || `<p>${t().noOpts}</p>`}</div>
    <h2 style="margin:40px 0 16px">${t().compatAcc}</h2>
    ${D.cat.categories.map(c => { const g = fams.filter(x => x.f.cat === c.id); return g.length ? `<h3 style="margin:22px 0 10px">${esc(catName(c))}</h3><div class="grid3">${g.map(({ f, l }) => famCard(f, l)).join('')}</div>` : ''; }).join('')}
  </div></section>`;
}
function optCard(o, sel) {
  const on = CFG.items.includes(o.code), ph = iImg(o.code), txt = D.items[o.code]?.text?.[L];
  return `<button class="opt ${on ? 'on' : ''}" data-add="${o.code}" type="button">${ph ? `<img src="${ph}" alt="" loading="lazy">` : ''}<span><b>${esc(desc(o))}</b>
    ${txt ? `<small>${esc(txt.length > 110 ? txt.slice(0, 108) + '…' : txt)}</small>` : ''}<small style="color:var(--blue);font-weight:600;margin-top:3px">${on ? t().added : t().add}</small></span></button>`;
}
function famCard(f, l) {
  return `<a class="card" href="#/famille/${f.id}"><img src="${famImg(f)}" alt="${esc(famName(f))}" loading="lazy"><div><b>${esc(famName(f))}</b><small>${t().models(f.codes.length)}</small><br>${lvl(l)}</div></a>`;
}
function pageAcc(catId) {
  const cats = D.cat.categories.map(c => ({ ...c, fams: famsVisible().filter(f => f.cat === c.id) })).filter(c => c.fams.length);
  const m = CFG.machine;
  const show = catId ? cats.filter(c => c.id === catId) : cats;
  return `<section style="padding-top:0"><div class="wrap"><div class="crumb"><a href="#/accessoires">${t().allAcc}</a>${catId ? ' › ' + esc(catName(cats.find(c => c.id === catId) || {})) : ''}</div>
    <h1 class="h2" style="margin-bottom:16px">${catId ? esc(catName(cats.find(c => c.id === catId) || {})) : t().allAcc}</h1>
    <div class="tabs">${[`<a class="btn2" style="padding:5px 12px;border-width:1px" href="#/accessoires">${t().all}</a>`, ...cats.map(c => `<a class="btn2" style="padding:5px 12px;border-width:1px;${c.id === catId ? 'background:var(--night);color:#fff;border-color:var(--night)' : ''}" href="#/accessoires/${c.id}">${esc(catName(c))}</a>`)].join('')}</div>
    ${show.map(c => { const g = c.fams.map(f => ({ f, l: famLevel(f, m) })).filter(x => !m || x.l !== 'no'); return g.length ? `<h3 style="margin:24px 0 10px">${esc(catName(c))}</h3><div class="grid3">${g.map(({ f, l }) => famCard(f, l)).join('')}</div>` : ''; }).join('')}
  </div></section>`;
}
function pageFamily(id) {
  const f = famsVisible().find(x => x.id === id); if (!f) return pageAcc();
  const c = D.cat.categories.find(x => x.id === f.cat), m = CFG.machine, feats = f.features?.[L] || [];
  return `<section style="padding-top:0"><div class="wrap"><div class="crumb"><a href="#/accessoires">${t().allAcc}</a> › <a href="#/accessoires/${c.id}">${esc(catName(c))}</a> › ${esc(famName(f))}</div>
    <div class="mtop"><div class="big" style="padding:0;overflow:hidden"><img src="${famImg(f)}" alt="MultiOne ${esc(famName(f))}" style="max-height:440px;object-fit:cover"></div>
      <div><h1 style="font-size:clamp(38px,5vw,60px)">${esc(famName(f))}</h1>${feats.length ? `<ul style="padding-left:20px;margin-top:16px">${feats.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}</div></div>
    <div class="models">${f.codes.map(code => { const p = D.by[code], l = m ? level(code, m) : undefined, on = CFG.items.includes(code), tech = D.items[code]?.tech || [];
      return `<div class="mrow" style="${l === 'no' ? 'opacity:.45' : ''}"><div><b>${esc(desc(p))}</b>${tech.length ? `<div class="chips">${tech.map(x => `<span>${esc(x.label[L] || x.label.fr)} ${esc(x.value)}</span>`).join('')}</div>` : ''}
        ${l === 'no' ? `<span class="lvl" style="color:var(--bad)">${t().no}</span>` : lvl(l)}</div>
        ${l === 'no' ? '' : `<button class="btn2 pick" data-add="${code}">${on ? t().added : t().add}</button>`}</div>`; }).join('')}</div>
  </div></section>`;
}
function partnerCards(selectable, cp) {
  let P = D.partners.slice();
  const covers = (spec, c) => { const n = parseInt(String(c || '').replace(/\D/g, ''), 10); if (!n || !spec) return false;
    return String(spec).split(/[,;\s]+/).some(r => { const [a, b] = r.split('-').map(x => parseInt(x, 10)); return b ? n >= a && n <= b : n === a; }); };
  if (cp) P.sort((a, b) => covers(b.postcodes, cp) - covers(a.postcodes, cp));
  const Tag = selectable ? 'button' : 'div';
  return `<div class="partners">${P.map(p => `<${Tag} class="pt ${selectable && CFG.partner === p.id ? 'on' : ''}" ${selectable ? `data-pt="${p.id}" type="button"` : ''}>
    <div class="lg">${p.has_logo ? `<img src="/api/public/logo/${p.id}" alt="${esc(p.name)}">` : ''}</div><b>${esc(p.name)}</b>
    <span class="off">${p.kind === 'internal' ? t().importer : t().official}${cp && covers(p.postcodes, cp) ? ' · ' + t().near : ''}</span>
    ${p.region ? `<small>${esc(p.region)}</small>` : ''}<small>${esc([p.street, p.city].filter(Boolean).join(', '))}</small>${p.phone ? `<small>${t().phoneL} ${esc(p.phone)}</small>` : ''}
    ${p.description ? `<small>${esc(p.description)}</small>` : ''}</${Tag}>`).join('')}</div>`;
}
function pagePartners() { return `<section><div class="wrap"><h1 class="h2">${t().partners}</h1><p style="margin:8px 0 24px">${t().partnersP}</p>${partnerCards(false)}</div></section>${partnerBand()}`; }

// ---------- configurateur ----------
let SERSEL = null;
function summary() {
  const m = D.by[CFG.machine], its = CFG.items.map(c => D.by[c]).filter(Boolean), pt = D.partners.find(p => p.id === CFG.partner);
  return `<aside class="sum"><h3>${t().myCfg}</h3>${m ? `<div class="sph"><img src="${mImg(m.code)}" alt=""></div><b style="font-family:var(--cond);font-size:22px">MultiOne ${esc(shortMachine(m.desc_en).main)}</b>` : `<p class="empty">${t().noMachine}</p>`}
    ${its.length ? `<ul style="margin-top:8px">${its.map(p => `<li>${esc(desc(p))}</li>`).join('')}</ul>` : ''}
    ${pt ? `<p style="margin:12px 0 0;font-size:15px">➜ <b>${esc(pt.name)}</b></p>` : ''}</aside>`;
}
function pageConfig(step) {
  const st = Math.min(5, Math.max(1, parseInt(step || (CFG.machine ? 2 : 1), 10)));
  const v = $('#view');
  const stepsBar = `<div class="steps">${t().steps.map((s, i) => `<button data-st="${i + 1}" class="${i + 1 === st ? 'on' : i + 1 < st ? 'done' : ''}"><b>${i + 1}</b>${s}</button>`).join('')}</div>`;
  let body = '';
  const m = D.by[CFG.machine];
  if (st === 1) {
    const S = seriesList(); SERSEL = SERSEL || (m ? m.series_tab : S[0]);
    body = `<p>${t().chooseSerie}</p><div class="tabs">${S.map(s => `<button data-ser="${esc(s)}" class="${s === SERSEL ? 'on' : ''}">${esc(SER(s))}</button>`).join('')}</div>
      <div class="mchoice">${machines().filter(p => p.series_tab === SERSEL).map(p => { const sm = shortMachine(p.desc_en);
        return `<button data-mc="${p.code}" class="${CFG.machine === p.code ? 'on' : ''}"><img src="${mImg(p.code)}" alt=""><b>${esc(sm.main)}</b><small style="color:var(--muted)">${esc(sm.sub)}</small></button>`; }).join('')}</div>`;
  } else if (st === 2) {
    const opts = m ? (D.machineOptions[m.code] || []).map(c => D.by[c]).filter(Boolean) : [];
    body = m ? `<p>${t().optsP}</p><div class="optlist">${opts.map(o => optCard(o)).join('') || `<p>${t().noOpts}</p>`}</div>` : `<p>${t().noMachine}</p>`;
  } else if (st === 3) {
    const fams = famsVisible().map(f => ({ f, l: famLevel(f, CFG.machine) })).filter(x => !m || x.l !== 'no');
    body = `<p>${t().accP}</p><div class="tabs" id="accTabs"><button data-ac="" class="on">${t().all}</button>${D.cat.categories.filter(c => fams.some(x => x.f.cat === c.id)).map(c => `<button data-ac="${c.id}">${esc(catName(c))}</button>`).join('')}</div>
      <div id="accBody">${accList(fams, '')}</div>`;
  } else if (st === 4) {
    body = `<p>${t().partnerP}</p><input id="cpIn" placeholder="${t().cpPh}" inputmode="numeric" style="border:1px solid var(--steel2);border-radius:8px;padding:10px 12px;margin-bottom:16px;width:220px" value="${esc(CFG.cp || '')}"><div id="ptBody">${partnerCards(true, CFG.cp)}</div>`;
  } else {
    body = `<h3 style="margin-bottom:14px">${t().form}</h3><div class="form">
      <label>${t().name}<input id="fName" autocomplete="name"></label><label>${t().company}<input id="fCo" autocomplete="organization"></label>
      <label>${t().email}<input id="fMail" type="email" autocomplete="email"></label><label>${t().phone}<input id="fTel" type="tel" autocomplete="tel"></label>
      <label>${t().cp}<input id="fCp" autocomplete="postal-code" value="${esc(CFG.cp || '')}"></label><label>${t().city}<input id="fCity" autocomplete="address-level2"></label>
      <label class="full">${t().msg}<textarea id="fMsg" rows="4"></textarea></label>
      <label class="hp" aria-hidden="true">Website<input id="fWeb" tabindex="-1" autocomplete="off"></label>
      <label class="full consent"><input type="checkbox" id="fOk"><span>${t().consent} <a href="#/vie-privee" target="_blank">${t().privacy}</a></span></label>
      <div class="full"><span class="err" id="fErr"></span></div></div>`;
  }
  v.innerHTML = `<section style="padding-top:0"><div class="wrap">${stepsBar}<div class="cfg"><div>${body}
    <div class="navbtns">${st > 1 ? `<button class="btn2" data-go="${st - 1}">‹ ${t().prev}</button>` : '<span></span>'}
      ${st < 5 ? `<button class="cta" data-go="${st + 1}" ${st === 1 && !CFG.machine ? 'disabled style="opacity:.5"' : ''}>${t().next}</button>` : `<button class="cta" id="sendB">${t().send}</button>`}</div></div>${summary()}</div></div></section>`;
  const T0 = Date.now();
  document.querySelectorAll('[data-st]').forEach(b => b.onclick = () => { go(LH('#/configurer/' + b.dataset.st)); });
  document.querySelectorAll('[data-go]').forEach(b => b.onclick = () => {
    const n = +b.dataset.go; if (n === 5 && !CFG.partner) { alert(t().choosePartner); return; } go(LH('#/configurer/' + n)); });
  document.querySelectorAll('[data-ser]').forEach(b => b.onclick = () => { SERSEL = b.dataset.ser; pageConfig(1); });
  document.querySelectorAll('[data-mc]').forEach(b => b.onclick = () => { if (CFG.machine !== b.dataset.mc) CFG.items = CFG.items.filter(c => D.by[c]?.family !== 'option'); CFG.machine = b.dataset.mc; saveCfg(); pageConfig(1); });
  document.querySelectorAll('.opt[data-add]').forEach(b => b.onclick = () => { const c = b.dataset.add; CFG.items = CFG.items.includes(c) ? CFG.items.filter(x => x !== c) : [...CFG.items, c]; saveCfg(); pageConfig(st); });
  document.querySelectorAll('#accTabs [data-ac]').forEach(b => b.onclick = () => {
    document.querySelectorAll('#accTabs button').forEach(x => x.classList.toggle('on', x === b));
    const fams = famsVisible().map(f => ({ f, l: famLevel(f, CFG.machine) })).filter(x => !m || x.l !== 'no');
    $('#accBody').innerHTML = accList(fams, b.dataset.ac); wireAcc(st); });
  wireAcc(st);
  const cp = $('#cpIn'); if (cp) cp.oninput = () => { CFG.cp = cp.value.trim(); saveCfg(); $('#ptBody').innerHTML = partnerCards(true, CFG.cp); wirePt(); };
  const wirePt = () => document.querySelectorAll('[data-pt]').forEach(b => b.onclick = () => { CFG.partner = b.dataset.pt; saveCfg(); $('#ptBody').innerHTML = partnerCards(true, CFG.cp); wirePt(); v.querySelector('.sum').outerHTML = summary(); });
  wirePt();
  const sb = $('#sendB'); if (sb) sb.onclick = async () => {
    const e = $('#fErr'); e.textContent = '';
    const body = { lang: L, company_id: CFG.partner, machine_code: CFG.machine, items: CFG.items, name: $('#fName').value, company: $('#fCo').value, email: $('#fMail').value,
      phone: $('#fTel').value, postal_code: $('#fCp').value, city: $('#fCity').value, message: $('#fMsg').value, consent: $('#fOk').checked, website: $('#fWeb').value, t: T0 };
    if (!CFG.partner) { e.textContent = t().choosePartner; return; }
    sb.disabled = true; sb.textContent = t().sending;
    try { const r = await fetch('/api/public/lead', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }); const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Erreur');
      sessionStorage.setItem('mo_last_partner', d.partner); sessionStorage.setItem('mo_last_via', d.via || ''); CFG.machine = null; CFG.items = []; saveCfg(); go(LH('#/merci'));
    } catch (x) { e.textContent = x.message; sb.disabled = false; sb.textContent = t().send; }
  };
}
function accList(fams, cat) {
  return D.cat.categories.filter(c => !cat || c.id === cat).map(c => { const g = fams.filter(x => x.f.cat === c.id); if (!g.length) return '';
    return `<h3 style="margin:18px 0 10px">${esc(catName(c))}</h3><div class="optlist">${g.map(({ f }) => f.codes.filter(code => !CFG.machine || level(code, CFG.machine) !== 'no').map(code => {
      const p = D.by[code], on = CFG.items.includes(code), l = CFG.machine ? level(code, CFG.machine) : undefined;
      return `<button class="opt ${on ? 'on' : ''}" data-add="${code}" type="button"><img src="${iImg(code) || famImg(f)}" alt="" loading="lazy"><span><b>${esc(desc(p))}</b>${lvl(l)}<small style="color:var(--blue);font-weight:600">${on ? t().added : t().add}</small></span></button>`; }).join('')).join('')}</div>`; }).join('');
}
function wireAcc(st) { document.querySelectorAll('#accBody .opt[data-add]').forEach(b => b.onclick = () => { const c = b.dataset.add; CFG.items = CFG.items.includes(c) ? CFG.items.filter(x => x !== c) : [...CFG.items, c]; saveCfg();
  b.classList.toggle('on'); b.querySelector('small:last-child').textContent = CFG.items.includes(c) ? t().added : t().add; document.querySelector('.sum').outerHTML = summary(); }); }
function pageThanks() {
  const p = sessionStorage.getItem('mo_last_partner') || '', via = sessionStorage.getItem('mo_last_via') || '';
  return `<section><div class="wrap"><div class="ok-box"><h2>${t().thanks}</h2><p>${t().thanksP(esc(p), esc(via))}</p><a class="cta" href="#/configurer/1">${t().newCfg}</a></div></div></section>`;
}

window.addEventListener('hashchange', route);
window.addEventListener('popstate', route);
// liens internes : changement de page sans rechargement
document.addEventListener('click', e => {
  const a = e.target.closest && e.target.closest('a[href]'); if (!a || e.defaultPrevented || e.button || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || a.target === '_blank') return;
  let h = a.getAttribute('href'); if (h.startsWith('#/')) h = LH(h);
  if (!h.startsWith('/') || h.startsWith('//') || /^\/(api|assets)\//.test(h) || /\.[a-z0-9]{2,5}$/i.test(h)) return;
  e.preventDefault(); go(h);
});
// les liens ecrits « #/… » dans les pages deviennent de vraies adresses (lisibles par Google)
new MutationObserver(() => fixLinks()).observe(document.body, { childList: true, subtree: true });
shell();
load().then(() => { route(); cookieBanner(); }).catch(e => { $('#view').innerHTML = `<div class="loading">${esc(e.message)}</div>`; });
