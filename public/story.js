// Page « Notre histoire » (texte original rédigé d'après les faits publiés par MultiOne) et page « Contact »
const STORY = {
  fr: { title: 'L’histoire de MultiOne', lead: 'Plus de vingt-cinq ans de chargeuses articulées, conçues et fabriquées en Italie, au nord de Vicence.',
    steps: [
      ['1969', 'Des racines agricoles', 'Avant les chargeuses, l’entreprise familiale fabrique du matériel agricole : presses à balles rondes, semoirs et enrouleurs d’irrigation. Ce savoir-faire du terrain reste au cœur des machines d’aujourd’hui.'],
      ['1998', 'Une idée simple', 'La société C.S.F. est créée avec une ambition claire : une machine compacte capable de tout faire, grâce à des accessoires qui se changent en quelques secondes.'],
      ['1999', 'Les premières MultiOne', 'Les premières chargeuses articulées sortent d’usine. Deux ans plus tard, la gamme compte déjà 11 modèles, de 13 à 50 ch, la plus large du marché.'],
      ['2001', 'Une nouvelle usine', 'Installation à Grumolo delle Abbadesse, dans un site de production de 8 000 m². La gamme « Evolution » arrive, puis l’usine intègre la fabrication des châssis, la découpe laser et le soudage robotisé. Un second bâtiment d’assemblage suit en 2007.'],
      ['2012', 'Des machines plus grandes, une usine plus verte', 'Quatre nouvelles générations de chargeuses voient le jour, dont une machine capable de lever une palette de 1,5 tonne à 3 mètres. Les toits de l’usine se couvrent de 550 kW de panneaux solaires.'],
      ['2015', 'Qualité et électrique', 'Une architecture entièrement repensée améliore le confort et la fiabilité, et l’usine s’automatise encore. MultiOne lance la série 10 et la gamme électrique EZ, « Emission Zero ».'],
      ['2020', 'La série 11', 'Un accord de distribution avec Vermeer ouvre l’Amérique du Nord. Le modèle phare 11.9 K apporte OneDrive, le régulateur de vitesse, l’ACI et des carrosseries incassables.'],
      ['2021', 'Un groupe solide', 'Le groupe suédois Lifco devient actionnaire majoritaire, Vermeer détient 20 %. De quoi investir durablement dans l’innovation et la production.'],
      ['Aujourd’hui', 'MultiOne en Belgique', 'MultiOne Belgium Import et son réseau de partenaires officiels vous accompagnent partout en Belgique : conseil, démonstration, vente, pièces et service.']],
    cta: 'Configurer ma machine', source: 'D’après les informations publiées par MultiOne S.r.l.' },
  nl: { title: 'Het verhaal van MultiOne', lead: 'Meer dan vijfentwintig jaar knikladers, ontworpen en gebouwd in Italië, ten noorden van Vicenza.',
    steps: [
      ['1969', 'Landbouwwortels', 'Vóór de knikladers bouwt het familiebedrijf landbouwmachines: rondebalenpersen, zaaimachines en beregeningshaspels. Die praktijkkennis zit nog altijd in elke machine.'],
      ['1998', 'Een eenvoudig idee', 'C.S.F. wordt opgericht met één duidelijk doel: een compacte machine die alles kan, dankzij werktuigen die je in enkele seconden wisselt.'],
      ['1999', 'De eerste MultiOnes', 'De eerste knikladers verlaten de fabriek. Twee jaar later telt het gamma al 11 modellen van 13 tot 50 pk, het breedste van de markt.'],
      ['2001', 'Een nieuwe fabriek', 'Verhuis naar Grumolo delle Abbadesse, naar een productiesite van 8.000 m². Het gamma „Evolution” verschijnt, en de fabriek bouwt voortaan zelf chassis, met lasersnijden en robotlassen. In 2007 volgt een tweede assemblagegebouw.'],
      ['2012', 'Grotere machines, een groenere fabriek', 'Vier nieuwe generaties knikladers zien het licht, waaronder een machine die een pallet van 1,5 ton tot 3 meter hoog heft. Op de daken komt 550 kW aan zonnepanelen.'],
      ['2015', 'Kwaliteit en elektrisch', 'Een volledig nieuwe architectuur verhoogt comfort en betrouwbaarheid, en de fabriek wordt verder geautomatiseerd. MultiOne lanceert de 10-serie en het elektrische EZ-gamma, „Emission Zero”.'],
      ['2020', 'De 11-serie', 'Een distributieakkoord met Vermeer opent Noord-Amerika. Het topmodel 11.9 K brengt OneDrive, cruisecontrol, ACI en onbreekbare carrosseriepanelen.'],
      ['2021', 'Een sterke groep', 'De Zweedse groep Lifco wordt meerderheidsaandeelhouder, Vermeer heeft 20 %. Zo kan er duurzaam geïnvesteerd worden in innovatie en productie.'],
      ['Vandaag', 'MultiOne in België', 'MultiOne Belgium Import en zijn netwerk van officiële partners begeleiden je overal in België: advies, demonstratie, verkoop, onderdelen en service.']],
    cta: 'Mijn machine samenstellen', source: 'Op basis van informatie gepubliceerd door MultiOne S.r.l.' },
  en: { title: 'The MultiOne story', lead: 'More than twenty-five years of articulated loaders, designed and built in Italy, north of Vicenza.',
    steps: [
      ['1969', 'Farming roots', 'Before loaders, the family business built farm equipment: round balers, seed drills and irrigation reels. That hands-on know-how still shapes every machine.'],
      ['1998', 'A simple idea', 'C.S.F. is founded with one clear goal: a compact machine that can do it all, thanks to attachments you change in seconds.'],
      ['1999', 'The first MultiOnes', 'The first articulated loaders leave the factory. Two years later the range already counts 11 models from 13 to 50 hp, the widest on the market.'],
      ['2001', 'A new factory', 'The company moves to Grumolo delle Abbadesse, into an 8,000 m² production site. The “Evolution” range arrives, and the plant brings frame building, laser cutting and robotic welding in-house. A second assembly building follows in 2007.'],
      ['2012', 'Bigger machines, a greener plant', 'Four new loader generations appear, including a machine able to lift a 1.5-tonne pallet to 3 metres. The factory roofs are covered with 550 kW of solar panels.'],
      ['2015', 'Quality and electric', 'A fully redesigned architecture improves comfort and reliability, and the plant is further automated. MultiOne launches the 10 Series and the electric EZ range, “Emission Zero”.'],
      ['2020', 'The 11 Series', 'A distribution agreement with Vermeer opens North America. The flagship 11.9 K brings OneDrive, cruise control, ACI and unbreakable body panels.'],
      ['2021', 'A strong group', 'The Swedish group Lifco becomes majority shareholder, with Vermeer holding 20%. A solid base for long-term investment in innovation and production.'],
      ['Today', 'MultiOne in Belgium', 'MultiOne Belgium Import and its network of official partners support you across Belgium: advice, demonstrations, sales, parts and service.']],
    cta: 'Configure my machine', source: 'Based on information published by MultiOne S.r.l.' } };
const STORY_IMG = { '1999': 'C926006', '2012': 'C963045', '2015': 'C977060', '2020': 'C968220' };

function pageStory() {
  const s = STORY[L] || STORY.fr;
  return `<section><div class="wrap"><h1 style="font-size:clamp(40px,6vw,76px)">${s.title}</h1><p style="font-size:20px;color:var(--muted);margin:14px 0 36px">${s.lead}</p>
    <ol class="tl">${s.steps.map(([y, h, p]) => `<li><span class="yr ${/^\d/.test(y) ? '' : 'word'}">${esc(y)}</span><div><h3>${esc(h)}</h3><p>${esc(p)}</p></div>
      ${STORY_IMG[y] && D.by[STORY_IMG[y]] ? `<img src="${mImg(STORY_IMG[y])}" alt="" loading="lazy">` : '<span></span>'}</li>`).join('')}</ol>
    <p style="margin-top:34px"><a class="cta" href="#/configurer">${s.cta}</a></p><p style="color:var(--muted);font-size:13px;margin-top:18px">${s.source}</p></div></section>`;
}

const CT = {
  fr: { title: 'Nous contacter', lead: 'Une question, une démonstration, une pièce ? Écrivez-nous, le bon interlocuteur vous répond.', subj: 'Objet', subjects: ['Demande d’information', 'Démonstration', 'Pièces et service après-vente', 'Devenir partenaire', 'Autre'],
    who: 'Votre interlocuteur', auto: 'Le partenaire le plus proche de chez moi', msg: 'Votre message *', sent: 'Merci, votre message est envoyé', sentP: 'Nous vous répondons rapidement, en principe sous 24 heures ouvrables.', addr: 'Nos adresses', inv: 'Invitation' },
  nl: { title: 'Contact', lead: 'Een vraag, een demonstratie, een onderdeel? Schrijf ons, de juiste contactpersoon antwoordt je.', subj: 'Onderwerp', subjects: ['Informatieaanvraag', 'Demonstratie', 'Onderdelen en service', 'Partner worden', 'Andere'],
    who: 'Je contactpersoon', auto: 'De partner het dichtst bij mij', msg: 'Je bericht *', sent: 'Bedankt, je bericht is verstuurd', sentP: 'We antwoorden je snel, in principe binnen 24 werkuren.', addr: 'Onze adressen', inv: 'Uitnodiging' },
  en: { title: 'Contact us', lead: 'A question, a demonstration, a spare part? Write to us and the right person will answer.', subj: 'Subject', subjects: ['Information request', 'Demonstration', 'Parts and service', 'Become a partner', 'Other'],
    who: 'Who should answer', auto: 'The partner nearest to me', msg: 'Your message *', sent: 'Thank you, your message has been sent', sentP: 'We will answer shortly, normally within 24 working hours.', addr: 'Our locations', inv: 'Invitation' } };

function pageContact() {
  const c = CT[L] || CT.fr;
  setTimeout(() => {
    const T0 = Date.now(), b = $('#cSend');
    b.onclick = async () => {
      const e = $('#cErr'); e.textContent = '';
      const body = { kind: 'contact', lang: L, company_id: $('#cWho').value || 'auto', subject: $('#cSubj').value, name: $('#cName').value, company: $('#cCo').value, email: $('#cMail').value,
        phone: $('#cTel').value, postal_code: $('#cCp').value, city: $('#cCity').value, message: $('#cMsg').value, consent: $('#cOk').checked, website: $('#cWeb').value, t: T0 };
      b.disabled = true; b.textContent = t().sending;
      try { const r = await fetch('/api/public/lead', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }); const d = await r.json();
        if (!r.ok) throw new Error(d.error || 'Erreur');
        $('#cForm').innerHTML = `<div class="ok-box"><h2>${c.sent}</h2><p>${c.sentP}</p></div>`; window.scrollTo(0, 0);
      } catch (x) { e.textContent = x.message; b.disabled = false; b.textContent = t().send; }
    };
  }, 0);
  return `<section><div class="wrap"><h1 style="font-size:clamp(40px,6vw,76px)">${c.title}</h1><p style="font-size:20px;color:var(--muted);margin:14px 0 30px">${c.lead}</p>
    <div class="cfg"><div id="cForm"><div class="form">
      <label>${c.subj}<select id="cSubj" style="border:1px solid var(--steel2);border-radius:8px;padding:11px 12px">${(() => { const ev = sessionStorage.getItem('mo_ct_subject'); sessionStorage.removeItem('mo_ct_subject');
        return (ev ? `<option selected>${esc(c.inv + ' – ' + ev)}</option>` : '') + c.subjects.map(x => `<option>${esc(x)}</option>`).join(''); })()}</select></label>
      <label>${c.who}<select id="cWho" style="border:1px solid var(--steel2);border-radius:8px;padding:11px 12px"><option value="auto">${c.auto}</option>${D.partners.map(p => `<option value="${p.id}">${esc(p.name)}</option>`).join('')}</select></label>
      <label>${t().name}<input id="cName" autocomplete="name"></label><label>${t().company}<input id="cCo" autocomplete="organization"></label>
      <label>${t().email}<input id="cMail" type="email" autocomplete="email"></label><label>${t().phone}<input id="cTel" type="tel" autocomplete="tel"></label>
      <label>${t().cp}<input id="cCp" autocomplete="postal-code"></label><label>${t().city}<input id="cCity" autocomplete="address-level2"></label>
      <label class="full">${c.msg}<textarea id="cMsg" rows="5"></textarea></label>
      <label class="hp" aria-hidden="true">Website<input id="cWeb" tabindex="-1" autocomplete="off"></label>
      <label class="full consent"><input type="checkbox" id="cOk"><span>${t().consent} <a href="#/vie-privee" target="_blank">${t().privacy}</a></span></label>
      <div class="full"><span class="err" id="cErr"></span></div></div>
      <div class="navbtns"><span></span><button class="cta" id="cSend">${t().send}</button></div></div>
    <aside><h3 style="margin-bottom:12px">${c.addr}</h3>${D.partners.map(p => `<div style="background:var(--steel);border-radius:12px;padding:14px 16px;margin-bottom:10px">
      <b style="font-family:var(--cond);font-size:22px">${esc(p.name)}</b><br><small style="color:var(--blue);font-weight:600">${p.kind === 'internal' ? t().importer : t().official}</small><br>
      ${esc([p.street, p.city].filter(Boolean).join(', '))}${p.phone ? `<br><a href="tel:${esc(p.phone.replace(/\s/g, ''))}">${esc(p.phone)}</a>` : ''}</div>`).join('')}</aside></div></div></section>`;
}
