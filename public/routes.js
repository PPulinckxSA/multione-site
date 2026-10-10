// multione.be : adresses traduites, titres/descriptions par page et donnees structurees (schema.org).
// Fichier partage : charge par le navigateur (<script src="/routes.js">) ET par le serveur (functions/_middleware.js).
// Il n'utilise que des donnees publiques (jamais de prix).
(function (G) {
  const ORIGIN = 'https://multione.be';
  const LANGS = ['fr', 'nl', 'en'];
  const HREFLANG = { fr: 'fr-BE', nl: 'nl-BE', en: 'en' };
  const OGLOC = { fr: 'fr_BE', nl: 'nl_BE', en: 'en_GB' };
  const BRAND = 'MultiOne Belgium';

  // ---------- mots des adresses (mots-cles) ----------
  const SEG = {
    machines: { fr: 'mini-chargeuses', nl: 'minishovels', en: 'mini-loaders' },
    acc: { fr: 'accessoires', nl: 'werktuigen', en: 'attachments' },
    histoire: { fr: 'notre-histoire', nl: 'ons-verhaal', en: 'our-story' },
    partenaires: { fr: 'distributeurs', nl: 'verdelers', en: 'dealers' },
    contact: { fr: 'contact', nl: 'contact', en: 'contact' },
    'devenir-distributeur': { fr: 'devenir-distributeur', nl: 'verdeler-worden', en: 'become-a-dealer' },
    configurer: { fr: 'configurateur', nl: 'configurator', en: 'configurator' },
    merci: { fr: 'merci', nl: 'bedankt', en: 'thank-you' },
    'vie-privee': { fr: 'vie-privee', nl: 'privacy', en: 'privacy' },
  };
  const SERIE_W = { fr: 'serie', nl: 'serie', en: 'series' };
  const STATIC = ['histoire', 'partenaires', 'contact', 'devenir-distributeur', 'vie-privee'];
  const NOINDEX = ['configurer', 'merci', 'notfound'];

  const slug = s => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[’'`]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

  function shortMachine(d) {
    let n = String(d || '').replace(/^MultiOne\s+/i, '').trim(); const sub = [];
    const par = n.match(/^(.*?)\s*\((.*)\)\s*$/); if (par) { n = par[1]; sub.push(par[2]); }
    const st = n.match(/^(.*?)\s+((?:T4F-)?STAGE\s+V)$/i); if (st) { n = st[1]; sub.push('Stage V'); }
    return { main: n.replace(/PACK\s*1/i, 'Pack 1').replace(/\s+-\s+/g, ' · '), sub: sub.join(' · ').replace(/Stage V - /i, 'Stage V · ') };
  }
  const serNum = s => { const m = String(s || '').match(/^(\d+)/); return m ? m[1] : String(s || '').replace(/\s/g, '').replace('7-8', '7'); };
  const serieLabel = (s, L) => { const m = String(s || '').match(/^(\d+)\s*series/i);
    return m ? ({ fr: 'Série', nl: 'Serie', en: 'Series' }[L]) + ' ' + m[1] : String(s || '').replace(/^EZ\s*7-8$/i, 'EZ7 / EZ8').replace(/^EZ\s*5$/i, 'EZ5'); };
  const serieSlug = (s, L) => { const m = String(s || '').match(/^(\d+)\s*series/i); return m ? SERIE_W[L] + '-' + m[1] : slug(String(s).replace(/\s/g, '')); };

  // ---------- index des pages a partir des donnees ----------
  // data = { products:[{code,family,series_tab,desc_*}], cat:{categories,families}, mach?:{code:{specs}}, items?:{} }
  function index(data) {
    const I = { data, mach: {}, machBySlug: {}, series: [], serieBySlug: { fr: {}, nl: {}, en: {} }, cats: [], catBySlug: { fr: {}, nl: {}, en: {} },
      fams: [], famBySlug: { fr: {}, nl: {}, en: {} }, fam: {}, cat: {}, active: new Set(data.products.map(p => p.code)) };
    const machines = data.products.filter(p => p.family === 'machine');
    const sk = s => { const m = String(s).match(/^(\d+)/); return m ? [0, +m[1]] : [1, String(s).replace(/\D/g, '') | 0]; };
    I.series = [...new Set(machines.map(p => p.series_tab))].sort((a, b) => { const x = sk(a), y = sk(b); return x[0] - y[0] || x[1] - y[1]; });
    for (const s of I.series) for (const L of LANGS) I.serieBySlug[L][serieSlug(s, L)] = s;
    const used = {};
    for (const p of machines) {
      const sm = shortMachine(p.desc_en);
      let sl = 'multione-' + slug(sm.main);
      if (used[sl]) sl += '-' + (slug(sm.sub) || p.code.toLowerCase());
      used[sl] = 1; I.mach[p.code] = { code: p.code, slug: sl, serie: p.series_tab, name: 'MultiOne ' + sm.main, sub: sm.sub, p };
      I.machBySlug[sl] = p.code;
    }
    const fams = (data.cat?.families || []).map(f => ({ ...f, codes: (f.codes || []).filter(c => I.active.has(c)) })).filter(f => f.codes.length);
    const catIds = new Set(fams.map(f => f.cat));
    I.cats = (data.cat?.categories || []).filter(c => catIds.has(c.id));
    for (const c of I.cats) { I.cat[c.id] = c; for (const L of LANGS) I.catBySlug[L][slug(c[L] || c.fr)] = c.id; }
    for (const f of fams) {
      I.fam[f.id] = f; I.fams.push(f);
      for (const L of LANGS) { const k = f.cat + '/'; let s = slug(f[L] || f.fr || f.en); while (I.famBySlug[L][k + s] && I.famBySlug[L][k + s] !== f.id) s += '-2';
        I.famBySlug[L][k + s] = f.id; (f._slug ||= {})[L] = s; }
    }
    return I;
  }

  // ---------- page -> adresse ----------
  function href(L, page, arg, I) {
    const p = '/' + L + '/';
    if (!page || page === 'home') return p;
    if (page === 'machines') return p + SEG.machines[L];
    if (page === 'serie') return p + SEG.machines[L] + '/' + serieSlug(arg, L);
    if (page === 'machine') { const m = I?.mach[arg]; return m ? p + SEG.machines[L] + '/' + serieSlug(m.serie, L) + '/' + m.slug : p + SEG.machines[L]; }
    if (page === 'acc') { const c = arg && I?.cat[arg]; return p + SEG.acc[L] + (c ? '/' + slug(c[L] || c.fr) : ''); }
    if (page === 'famille') { const f = I?.fam[arg], c = f && I.cat[f.cat]; return f && c ? p + SEG.acc[L] + '/' + slug(c[L] || c.fr) + '/' + f._slug[L] : p + SEG.acc[L]; }
    if (page === 'configurer') return p + SEG.configurer[L] + (arg ? '/' + arg : '');
    if (SEG[page]) return p + SEG[page][L];
    return p;
  }

  // ---------- adresse -> page ----------
  function resolve(pathname, I) {
    const segs = String(pathname || '/').split('/').filter(Boolean).map(s => { try { return decodeURIComponent(s); } catch (e) { return s; } });
    const L = segs[0];
    if (!LANGS.includes(L)) return null;
    const [a, b, c] = segs.slice(1), n = segs.length - 1;
    const R = (page, arg) => ({ L, page, arg });
    if (!n) return R('home');
    if (a === SEG.machines[L]) {
      if (n === 1) return R('machines');
      const s = I.serieBySlug[L][b]; if (!s) return R('notfound');
      if (n === 2) return R('serie', s);
      const code = I.machBySlug[c]; return n === 3 && code && I.mach[code].serie === s ? R('machine', code) : R('notfound');
    }
    if (a === SEG.acc[L]) {
      if (n === 1) return R('acc');
      const cat = I.catBySlug[L][b]; if (!cat) return R('notfound');
      if (n === 2) return R('acc', cat);
      const f = I.famBySlug[L][cat + '/' + c]; return n === 3 && f ? R('famille', f) : R('notfound');
    }
    if (a === SEG.configurer[L] && n <= 2 && (!b || /^[1-5]$/.test(b))) return R('configurer', b || '');
    for (const k of Object.keys(SEG)) if (SEG[k][L] === a && n === 1 && k !== 'machines' && k !== 'acc') return R(k);
    return R('notfound');
  }

  // anciennes adresses (#/machine/C951029, #/famille/job-site-toolbox, ...) -> page
  function fromLegacy(hash) {
    const [, a, b] = String(hash || '').replace(/^#/, '').split('/').map(s => { try { return decodeURIComponent(s || ''); } catch (e) { return s; } });
    if (!a) return { page: 'home' };
    if (a === 'accessoires') return { page: 'acc', arg: b || '' };
    if (['machines', 'serie', 'machine', 'famille', 'configurer', 'merci'].includes(a) || STATIC.includes(a)) return { page: a, arg: b || '' };
    return { page: 'home' };
  }

  // ---------- titres et descriptions ----------
  const TX = {
    fr: { home: ['MultiOne Belgique – mini-chargeuses articulées et accessoires', 'Importateur officiel MultiOne en Belgique : mini-chargeuses articulées compactes et plus de 100 accessoires. Configurez votre machine et recevez une offre d’un distributeur officiel près de chez vous.'],
      machines: ['Mini-chargeuses articulées MultiOne – toute la gamme', 'Toute la gamme de mini-chargeuses articulées MultiOne, de la Série 1 à la Série 11 : caractéristiques, accessoires compatibles et offre gratuite d’un distributeur officiel en Belgique.'],
      serie: s => [`MultiOne ${s} – mini-chargeuses articulées`, `Découvrez les mini-chargeuses articulées MultiOne ${s} : modèles, moteurs, capacité de levage et accessoires compatibles. Demandez une offre à un distributeur officiel en Belgique.`],
      machine: (n, sp) => [`${n} – mini-chargeuse articulée, fiche technique`, `${n} : ${sp}. Configurez-la avec ses accessoires et recevez une offre d’un distributeur MultiOne officiel en Belgique.`],
      acc: ['Accessoires MultiOne pour mini-chargeuse – plus de 100 outils', 'Plus de 100 accessoires pour mini-chargeuses MultiOne : godets, fourches, balayeuses, tondeuses, terrassement, espaces verts… avec la compatibilité de chaque machine.'],
      cat: c => [`${c} – accessoires pour mini-chargeuse MultiOne`, `Accessoires MultiOne « ${c} » pour mini-chargeuses articulées : modèles, usages et compatibilité avec chaque machine. Offre gratuite d’un distributeur officiel en Belgique.`],
      fam: f => [`${f} – accessoire pour mini-chargeuse MultiOne`, f],
      histoire: ['Notre histoire – MultiOne, depuis 1999', 'L’histoire de MultiOne, des premières mini-chargeuses articulées en 1999 à la gamme actuelle, et de son importateur officiel en Belgique.'],
      partenaires: ['Distributeurs MultiOne officiels en Belgique', 'Trouvez un distributeur MultiOne officiel près de chez vous en Belgique : vente, démonstration, entretien et pièces de mini-chargeuses articulées.'],
      contact: ['Contact – MultiOne Belgium Import', 'Contactez l’importateur MultiOne en Belgique : demande d’information, de démonstration ou de prix pour une mini-chargeuse articulée et ses accessoires.'],
      'devenir-distributeur': ['Devenir distributeur MultiOne en Belgique', 'Vous êtes concessionnaire en matériel agricole, de parcs et jardins ou de construction ? Rejoignez le réseau de distributeurs officiels MultiOne en Belgique.'],
      'vie-privee': ['Vie privée et cookies – MultiOne Belgium', 'Protection des données personnelles et cookies sur multione.be.'],
      configurer: ['Configurateur MultiOne – composez votre machine', 'Choisissez votre mini-chargeuse MultiOne et ses accessoires, puis recevez une offre d’un distributeur officiel.'],
      merci: ['Merci – MultiOne Belgium', 'Votre demande a bien été envoyée.'], notfound: ['Page introuvable – MultiOne Belgium', 'Cette page n’existe pas ou plus.'],
      home_l: 'Accueil', machine_l: 'Mini-chargeuse articulée', acc_l: 'Accessoire pour mini-chargeuse' },
    nl: { home: ['MultiOne België – minishovels (knikladers) en werktuigen', 'Officiële invoerder van MultiOne in België: compacte minishovels en meer dan 100 werktuigen. Stel uw machine samen en ontvang een offerte van een officiële verdeler in uw buurt.'],
      machines: ['MultiOne minishovels – het volledige gamma', 'Het volledige gamma MultiOne minishovels, van Serie 1 tot Serie 11: kenmerken, compatibele werktuigen en gratis offerte van een officiële verdeler in België.'],
      serie: s => [`MultiOne ${s} – minishovels`, `Ontdek de MultiOne ${s} minishovels: modellen, motoren, hefvermogen en compatibele werktuigen. Vraag een offerte aan bij een officiële verdeler in België.`],
      machine: (n, sp) => [`${n} – minishovel, technische fiche`, `${n}: ${sp}. Stel hem samen met werktuigen en ontvang een offerte van een officiële MultiOne-verdeler in België.`],
      acc: ['MultiOne werktuigen voor minishovel – meer dan 100 werktuigen', 'Meer dan 100 werktuigen voor MultiOne minishovels: bakken, vorken, veegmachines, maaiers, graafwerk, groenonderhoud… met de compatibiliteit per machine.'],
      cat: c => [`${c} – werktuigen voor MultiOne minishovel`, `MultiOne werktuigen „${c}” voor minishovels: modellen, toepassingen en compatibiliteit met elke machine. Gratis offerte van een officiële verdeler in België.`],
      fam: f => [`${f} – werktuig voor MultiOne minishovel`, f],
      histoire: ['Ons verhaal – MultiOne, sinds 1999', 'Het verhaal van MultiOne, van de eerste minishovels in 1999 tot het huidige gamma, en van de officiële invoerder in België.'],
      partenaires: ['Officiële MultiOne-verdelers in België', 'Vind een officiële MultiOne-verdeler in uw buurt in België: verkoop, demonstratie, onderhoud en onderdelen van minishovels.'],
      contact: ['Contacteer ons – MultiOne Belgium Import', 'Neem contact op met de MultiOne-invoerder in België: informatie, demonstratie of prijsaanvraag voor een minishovel en werktuigen.'],
      'devenir-distributeur': ['MultiOne-verdeler worden in België', 'Bent u dealer in land- en tuinbouwmachines, groenonderhoud of bouwmachines? Word officiële MultiOne-verdeler in België.'],
      'vie-privee': ['Privacy en cookies – MultiOne Belgium', 'Bescherming van persoonsgegevens en cookies op multione.be.'],
      configurer: ['MultiOne configurator – stel uw machine samen', 'Kies uw MultiOne minishovel en werktuigen en ontvang een offerte van een officiële verdeler.'],
      merci: ['Bedankt – MultiOne Belgium', 'Uw aanvraag is verzonden.'], notfound: ['Pagina niet gevonden – MultiOne Belgium', 'Deze pagina bestaat niet (meer).'],
      home_l: 'Home', machine_l: 'Minishovel', acc_l: 'Werktuig voor minishovel' },
    en: { home: ['MultiOne Belgium – articulated mini loaders and attachments', 'Official MultiOne importer in Belgium: compact articulated mini loaders and over 100 attachments. Configure your machine and get a quote from an official dealer near you.'],
      machines: ['MultiOne articulated mini loaders – full range', 'The full range of MultiOne articulated mini loaders, from Series 1 to Series 11: specifications, compatible attachments and a free quote from an official dealer in Belgium.'],
      serie: s => [`MultiOne ${s} – articulated mini loaders`, `Discover the MultiOne ${s} articulated mini loaders: models, engines, lifting capacity and compatible attachments. Ask an official dealer in Belgium for a quote.`],
      machine: (n, sp) => [`${n} – articulated mini loader, specifications`, `${n}: ${sp}. Configure it with attachments and get a quote from an official MultiOne dealer in Belgium.`],
      acc: ['MultiOne mini loader attachments – over 100 tools', 'Over 100 attachments for MultiOne mini loaders: buckets, forks, sweepers, mowers, digging, landscaping… with compatibility for each machine.'],
      cat: c => [`${c} – attachments for MultiOne mini loaders`, `MultiOne “${c}” attachments for articulated mini loaders: models, uses and compatibility with each machine. Free quote from an official dealer in Belgium.`],
      fam: f => [`${f} – attachment for MultiOne mini loaders`, f],
      histoire: ['Our story – MultiOne since 1999', 'The story of MultiOne, from the first articulated mini loaders in 1999 to today’s range, and of its official importer in Belgium.'],
      partenaires: ['Official MultiOne dealers in Belgium', 'Find an official MultiOne dealer near you in Belgium: sales, demonstrations, servicing and parts for articulated mini loaders.'],
      contact: ['Contact us – MultiOne Belgium Import', 'Contact the MultiOne importer in Belgium: information, demonstration or price request for an articulated mini loader and attachments.'],
      'devenir-distributeur': ['Become a MultiOne dealer in Belgium', 'Are you an agricultural, grounds-care or construction equipment dealer? Join the official MultiOne dealer network in Belgium.'],
      'vie-privee': ['Privacy and cookies – MultiOne Belgium', 'Personal data protection and cookies on multione.be.'],
      configurer: ['MultiOne configurator – build your machine', 'Choose your MultiOne mini loader and attachments, then get a quote from an official dealer.'],
      merci: ['Thank you – MultiOne Belgium', 'Your request has been sent.'], notfound: ['Page not found – MultiOne Belgium', 'This page does not exist (anymore).'],
      home_l: 'Home', machine_l: 'Articulated mini loader', acc_l: 'Mini loader attachment' },
  };
  const clip = (s, n = 158) => { s = String(s || '').replace(/\s+/g, ' ').trim(); return s.length <= n ? s : s.slice(0, n - 1).replace(/[\s,;:.–-]+\S*$/, '') + '…'; };
  const spec = (I, code, key, L) => (I.data.mach?.[code]?.specs || []).find(s => s.key === key)?.value?.[L] || '';
  const famText = (f, L) => { const ft = f.features?.[L] || f.features?.en || []; return ft.slice(0, 2).join('. ').replace(/\.\./g, '.'); };
  const abs = u => !u ? undefined : /^https?:/.test(u) ? u : ORIGIN + u;
  const machImg = (I, code) => { const p = I.data.products.find(x => x.code === code); return abs(p?.image_updated_at ? `/api/public/image/${encodeURIComponent(code)}?v=${encodeURIComponent(p.image_updated_at)}` : `/assets/machines/${code}.jpg`); };
  const famImg = (I, f) => { const c = f.codes.find(x => I.data.products.find(p => p.code === x)?.image_updated_at);
    if (c) { const p = I.data.products.find(x => x.code === c); return abs(`/api/public/image/${encodeURIComponent(c)}?v=${encodeURIComponent(p.image_updated_at)}`); }
    return f.photo ? abs('/assets/annex/' + f.photo) : undefined; };

  // fil d'Ariane : [[nom, adresse], ...] (accueil compris)
  function crumbs(L, page, arg, I) {
    const t = TX[L], C = [[t.home_l, href(L, 'home')]];
    const nav = { machines: { fr: 'Mini-chargeuses', nl: 'Minishovels', en: 'Mini loaders' }[L], acc: { fr: 'Accessoires', nl: 'Werktuigen', en: 'Attachments' }[L] };
    if (['machines', 'serie', 'machine'].includes(page)) C.push([nav.machines, href(L, 'machines')]);
    if (page === 'serie') C.push([serieLabel(arg, L), href(L, 'serie', arg)]);
    if (page === 'machine' && I.mach[arg]) { const m = I.mach[arg]; C.push([serieLabel(m.serie, L), href(L, 'serie', m.serie)], [m.name, href(L, 'machine', arg, I)]); }
    if (page === 'acc' || page === 'famille') C.push([nav.acc, href(L, 'acc')]);
    if (page === 'acc' && arg && I.cat[arg]) C.push([I.cat[arg][L] || I.cat[arg].fr, href(L, 'acc', arg, I)]);
    if (page === 'famille' && I.fam[arg]) { const f = I.fam[arg], c = I.cat[f.cat]; if (c) C.push([c[L] || c.fr, href(L, 'acc', c.id, I)]); C.push([f[L] || f.fr, href(L, 'famille', arg, I)]); }
    if (STATIC.includes(page)) C.push([TX[L][page][0].split(' – ')[0], href(L, page)]);
    return C;
  }

  // meta complete d'une page : titre, description, h1, canonique, alternatives, donnees structurees
  function meta(L, page, arg, I, extra = {}) {
    const t = TX[L]; let title, desc, h1, image, ld = [];
    const org = { '@id': ORIGIN + '/#org' };
    if (page === 'serie') { const s = serieLabel(arg, L); [title, desc] = t.serie(s); h1 = 'MultiOne ' + s; }
    else if (page === 'machine' && I.mach[arg]) {
      const m = I.mach[arg], parts = [spec(I, arg, 'engine', L), spec(I, arg, 'power', L).split('/')[0].trim(), spec(I, arg, 'emission', L)].filter(Boolean);
      [title, desc] = t.machine(m.name, parts.join(', ') || t.machine_l); h1 = m.name; image = machImg(I, arg);
      ld.push({ '@context': 'https://schema.org', '@type': 'Product', '@id': ORIGIN + href(L, 'machine', arg, I) + '#product', name: m.name, sku: arg, mpn: arg,
        description: clip(desc, 500), image, category: t.machine_l, url: ORIGIN + href(L, 'machine', arg, I),
        brand: { '@type': 'Brand', name: 'MultiOne' }, manufacturer: { '@type': 'Organization', name: 'MultiOne S.r.l.', url: 'https://www.multione.com' },
        additionalProperty: (I.data.mach?.[arg]?.specs || []).filter(s => s.value?.[L]).map(s => ({ '@type': 'PropertyValue', name: String(s.label?.[L] || s.key).replace(/\s*[¹²³]$/, ''), value: s.value[L] })) });
    }
    else if (page === 'acc' && arg && I.cat[arg]) { const c = I.cat[arg][L] || I.cat[arg].fr; [title, desc] = t.cat(c); h1 = c; }
    else if (page === 'famille' && I.fam[arg]) {
      const f = I.fam[arg], n = f[L] || f.fr; title = t.fam(n)[0]; desc = famText(f, L) || t.cat(n)[1]; h1 = n; image = famImg(I, f);
      ld.push({ '@context': 'https://schema.org', '@type': 'Product', '@id': ORIGIN + href(L, 'famille', arg, I) + '#product', name: 'MultiOne ' + n, description: clip(desc, 500), image,
        category: t.acc_l, url: ORIGIN + href(L, 'famille', arg, I), brand: { '@type': 'Brand', name: 'MultiOne' }, sku: f.codes[0] });
    }
    else if (t[page] && !['serie', 'machine', 'cat', 'fam'].includes(page)) { [title, desc] = t[page]; h1 = title.split(' – ')[0]; }
    else { [title, desc] = t.notfound; h1 = title.split(' – ')[0]; page = 'notfound'; }
    const path = page === 'notfound' ? null : href(L, page, arg, I);
    const ov = extra.overrides?.[path] || {};
    title = ov.title || (title.includes(BRAND) ? title : title + ' | ' + BRAND);
    desc = clip(ov.description || desc);
    const alternates = path && !NOINDEX.includes(page) ? Object.fromEntries(LANGS.map(l => [l, href(l, page, arg, I)])) : null;
    // listes (series, categories)
    const list = (items) => ({ '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: items.map(([name, u], i) => ({ '@type': 'ListItem', position: i + 1, name, url: ORIGIN + u })) });
    if (page === 'machines') ld.push(list(Object.values(I.mach).map(m => [m.name, href(L, 'machine', m.code, I)])));
    if (page === 'serie') ld.push(list(Object.values(I.mach).filter(m => m.serie === arg).map(m => [m.name, href(L, 'machine', m.code, I)])));
    if (page === 'acc') ld.push(list(I.fams.filter(f => !arg || f.cat === arg).map(f => [f[L] || f.fr, href(L, 'famille', f.id, I)])));
    if (page !== 'home' && page !== 'notfound') { const C = crumbs(L, page, arg, I);
      ld.push({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: C.map(([name, u], i) => ({ '@type': 'ListItem', position: i + 1, name, item: ORIGIN + u })) }); }
    // organisation, site et societes
    const biz = (extra.companies || []).map(c => localBusiness(c, L));
    ld.unshift({ '@context': 'https://schema.org', '@type': 'Organization', '@id': org['@id'], name: 'MultiOne Belgium Import', url: ORIGIN + '/', logo: ORIGIN + '/assets/logo.png',
      description: TX[L].home[1], areaServed: { '@type': 'Country', name: 'Belgium' }, brand: { '@type': 'Brand', name: 'MultiOne' },
      department: biz.length ? biz : undefined });
    if (page === 'home') ld.push({ '@context': 'https://schema.org', '@type': 'WebSite', '@id': ORIGIN + '/#website', name: 'MultiOne Belgium', url: ORIGIN + '/', inLanguage: HREFLANG[L], publisher: org });
    if (page === 'partenaires' || page === 'contact') for (const p of (extra.partners || [])) ld.push({ '@context': 'https://schema.org', ...localBusiness(p, L) });
    if (page === 'home') for (const e of (extra.events || [])) ld.push(eventLd(e, L));
    return { L, page, arg, path, canonical: path && !NOINDEX.includes(page) ? ORIGIN + path : null, noindex: NOINDEX.includes(page),
      title, description: desc, h1, image: image || ORIGIN + '/assets/logo.png', alternates, ld: ld.map(clean) };
  }
  function localBusiness(c, L) {
    const m = String(c.city || '').match(/^(\d{4})\s+(.+)$/);
    return clean({ '@type': 'LocalBusiness', '@id': ORIGIN + '/#' + c.id, name: c.name, url: c.website || undefined, telephone: c.phone || undefined,
      email: c.email || undefined, image: c.has_logo ? ORIGIN + '/api/public/logo/' + c.id : undefined, description: c.description || undefined,
      address: c.street || c.city ? { '@type': 'PostalAddress', streetAddress: c.street || undefined, postalCode: m ? m[1] : undefined, addressLocality: m ? m[2] : c.city || undefined, addressCountry: 'BE' } : undefined,
      areaServed: c.region || undefined, brand: { '@type': 'Brand', name: 'MultiOne' } });
  }
  function eventLd(e, L) {
    return clean({ '@context': 'https://schema.org', '@type': 'Event', name: e['title_' + L] || e.title_fr, description: e['text_' + L] || e.text_fr || undefined,
      startDate: e.start_date, endDate: e.end_date || e.start_date, eventStatus: 'https://schema.org/EventScheduled', eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: { '@type': 'Place', name: e.location || 'Belgium', address: e.location || 'Belgium' }, url: e.url || ORIGIN + href(L, 'home'),
      image: e.has_image ? ORIGIN + '/api/public/events/' + e.id + '/image' : undefined, organizer: { '@id': ORIGIN + '/#org', name: 'MultiOne Belgium Import', url: ORIGIN + '/' } });
  }
  function clean(o) {                               // retire les champs vides (undefined, null, '')
    if (Array.isArray(o)) return o.map(clean);
    if (o && typeof o === 'object') { const r = {}; for (const [k, v] of Object.entries(o)) if (v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && !v.length)) r[k] = clean(v); return r; }
    return o;
  }

  // toutes les pages a indexer (plan du site)
  function allPages(I) {
    const P = [['home'], ['machines'], ...I.series.map(s => ['serie', s]), ...Object.keys(I.mach).map(c => ['machine', c]),
      ['acc'], ...I.cats.map(c => ['acc', c.id]), ...I.fams.map(f => ['famille', f.id]), ...STATIC.map(s => [s])];
    return P;
  }

  G.MOR = { ORIGIN, LANGS, HREFLANG, OGLOC, SEG, slug, shortMachine, serNum, serieLabel, index, href, resolve, fromLegacy, meta, crumbs, allPages, clip, machImg, famImg, TX };
})(typeof globalThis !== 'undefined' ? globalThis : window);
