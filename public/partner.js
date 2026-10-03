// Page « Devenir distributeur officiel » + formulaire de candidature (leads.kind = partner)
const PT = {
  fr: { nav: 'Devenir distributeur', title: 'Devenez distributeur officiel MultiOne', lead: 'Vous êtes concessionnaire, loueur, spécialiste parcs et jardins ou agricole ? Rejoignez le réseau MultiOne en Belgique et proposez à vos clients une machine qui remplace à elle seule une dizaine d’outils.',
    why: 'Ce que nous vous apportons', benefits: [['Une gamme complète', 'Des chargeuses articulées de la série 1 à la série 11, thermiques et électriques, et plus de 100 familles d’accessoires.'],
      ['Un importateur proche', 'MultiOne Belgium Import vous accompagne au quotidien : conseil, commandes, pièces détachées et garantie, dans votre langue.'],
      ['Formation et démonstration', 'Formation technique et commerciale de vos équipes, et accès à des machines de démonstration pour vos clients.'],
      ['Des demandes qualifiées', 'Les demandes de devis reçues sur multione.be dans votre région peuvent vous être confiées, avec un outil de suivi en ligne.'],
      ['Vos offres en quelques minutes', 'Un accès à notre application : catalogue, compatibilités, tarif et création d’offres de prix professionnelles en PDF.'],
      ['Visibilité', 'Votre société présentée comme partenaire officiel sur multione.be, avec vos coordonnées et votre zone.']],
    who: 'Le profil que nous recherchons', profile: ['Une activité de vente de matériel professionnel : agricole, parcs et jardins, travaux publics, location ou manutention.', 'Un atelier ou un partenaire technique pour la mise en service et l’entretien.', 'Une bonne connaissance de votre région et de vos clients.', 'L’envie de développer une marque premium, polyvalente et reconnue.'],
    how: 'Comment ça se passe', steps: [['Candidature', 'Vous remplissez le formulaire ci-dessous.'], ['Échange', 'Nous vous contactons pour faire connaissance et parler de votre projet.'], ['Rencontre', 'Visite, démonstration et présentation des conditions du réseau.'], ['Lancement', 'Formation, première commande et mise en ligne sur multione.be.']],
    form: 'Votre candidature', co: 'Société *', vat: 'N° de TVA', act: 'Activité principale', acts: ['Concessionnaire agricole', 'Parcs et jardins', 'Travaux publics et construction', 'Location de matériel', 'Manutention', 'Autre'],
    region: 'Zone que vous couvrez', brands: 'Marques déjà distribuées', ws: 'Atelier', wsOpts: ['Oui', 'Non', 'En partenariat'], staff: 'Effectif', site: 'Site web', msg: 'Votre projet (facultatif)',
    send: 'Envoyer ma candidature', sent: 'Merci, votre candidature est envoyée', sentP: 'Nous étudions chaque candidature avec attention et revenons vers vous rapidement.', home: 'Rejoindre le réseau', homeP: 'Vous vendez du matériel professionnel ? Devenez distributeur officiel MultiOne dans votre région.' },
  nl: { nav: 'Verdeler worden', title: 'Word officiële MultiOne-verdeler', lead: 'Ben je concessiehouder, verhuurder, specialist in tuin en park of landbouw? Sluit je aan bij het MultiOne-netwerk in België en bied je klanten een machine die op zich een tiental werktuigen vervangt.',
    why: 'Wat wij je bieden', benefits: [['Een volledig gamma', 'Knikladers van serie 1 tot serie 11, met verbrandingsmotor en elektrisch, en meer dan 100 werktuigfamilies.'],
      ['Een invoerder dichtbij', 'MultiOne Belgium Import staat je dagelijks bij: advies, bestellingen, onderdelen en garantie, in je eigen taal.'],
      ['Opleiding en demonstratie', 'Technische en commerciële opleiding van je team, en toegang tot demomachines voor je klanten.'],
      ['Gekwalificeerde aanvragen', 'Offerteaanvragen via multione.be in jouw regio kunnen aan jou worden toevertrouwd, met een online opvolgingstool.'],
      ['Je offertes in enkele minuten', 'Toegang tot onze toepassing: catalogus, compatibiliteit, tarief en professionele prijsoffertes in pdf.'],
      ['Zichtbaarheid', 'Je bedrijf vermeld als officiële partner op multione.be, met je gegevens en je regio.']],
    who: 'Het profiel dat we zoeken', profile: ['Een verkoopactiviteit in professioneel materiaal: landbouw, tuin en park, openbare werken, verhuur of behandeling.', 'Een werkplaats of technische partner voor oplevering en onderhoud.', 'Een goede kennis van je regio en je klanten.', 'Zin om een premium, veelzijdig en erkend merk uit te bouwen.'],
    how: 'Hoe het verloopt', steps: [['Kandidatuur', 'Je vult het formulier hieronder in.'], ['Gesprek', 'We nemen contact op om kennis te maken en over je project te praten.'], ['Ontmoeting', 'Bezoek, demonstratie en voorstelling van de netwerkvoorwaarden.'], ['Start', 'Opleiding, eerste bestelling en vermelding op multione.be.']],
    form: 'Je kandidatuur', co: 'Bedrijf *', vat: 'Btw-nummer', act: 'Hoofdactiviteit', acts: ['Landbouwconcessie', 'Tuin en park', 'Openbare werken en bouw', 'Materiaalverhuur', 'Behandeling', 'Andere'],
    region: 'Regio die je bedient', brands: 'Merken die je al verdeelt', ws: 'Werkplaats', wsOpts: ['Ja', 'Nee', 'Via partner'], staff: 'Aantal medewerkers', site: 'Website', msg: 'Je project (facultatief)',
    send: 'Mijn kandidatuur versturen', sent: 'Bedankt, je kandidatuur is verstuurd', sentP: 'We bekijken elke kandidatuur aandachtig en nemen snel contact met je op.', home: 'Word partner', homeP: 'Verkoop je professioneel materiaal? Word officiële MultiOne-verdeler in je regio.' },
  en: { nav: 'Become a dealer', title: 'Become an official MultiOne dealer', lead: 'Are you a dealer, a rental company, a grounds-care or farming specialist? Join the MultiOne network in Belgium and offer your customers one machine that replaces a dozen tools.',
    why: 'What we bring you', benefits: [['A complete range', 'Articulated loaders from the 1 to the 11 Series, diesel and electric, and more than 100 attachment families.'],
      ['A local importer', 'MultiOne Belgium Import supports you every day: advice, orders, spare parts and warranty, in your language.'],
      ['Training and demonstration', 'Technical and sales training for your team, and access to demo machines for your customers.'],
      ['Qualified leads', 'Quotation requests received on multione.be in your area can be passed on to you, with an online follow-up tool.'],
      ['Your quotations in minutes', 'Access to our application: catalogue, compatibility, price list and professional PDF quotations.'],
      ['Visibility', 'Your company listed as an official partner on multione.be, with your details and your area.']],
    who: 'The profile we are looking for', profile: ['A professional equipment sales business: farming, grounds care, construction, rental or handling.', 'A workshop or technical partner for delivery and servicing.', 'Good knowledge of your area and your customers.', 'The drive to grow a premium, versatile and recognised brand.'],
    how: 'How it works', steps: [['Application', 'You fill in the form below.'], ['Conversation', 'We contact you to get to know you and discuss your project.'], ['Meeting', 'Visit, demonstration and presentation of the network terms.'], ['Launch', 'Training, first order and listing on multione.be.']],
    form: 'Your application', co: 'Company *', vat: 'VAT number', act: 'Main activity', acts: ['Farm equipment dealer', 'Grounds care', 'Construction', 'Equipment rental', 'Handling', 'Other'],
    region: 'Area you cover', brands: 'Brands you already sell', ws: 'Workshop', wsOpts: ['Yes', 'No', 'Through a partner'], staff: 'Staff', site: 'Website', msg: 'Your project (optional)',
    send: 'Send my application', sent: 'Thank you, your application has been sent', sentP: 'We review every application carefully and will get back to you shortly.', home: 'Join the network', homeP: 'Do you sell professional equipment? Become an official MultiOne dealer in your area.' } };
const pt = () => PT[L] || PT.fr;

function partnerBand() {
  const p = pt();
  return `<section style="padding-top:0"><div class="wrap"><div class="joinband"><div><h2>${p.home}</h2><p>${p.homeP}</p></div><a class="cta" href="#/devenir-distributeur">${p.nav} ›</a></div></div></section>`;
}
function pagePartnerApply() {
  const p = pt();
  setTimeout(() => {
    const T0 = Date.now(), b = $('#aSend'); if (!b) return;
    b.onclick = async () => {
      const e = $('#aErr'); e.textContent = '';
      const g = id => $('#' + id).value;
      const body = { kind: 'partner', lang: L, name: g('aName'), company: g('aCo'), email: g('aMail'), phone: g('aTel'), postal_code: g('aCp'), city: g('aCity'), message: g('aMsg'),
        extra: { vat: g('aVat'), activity: g('aAct'), region: g('aReg'), brands: g('aBr'), workshop: g('aWs'), staff: g('aSt'), website: g('aWeb') },
        consent: $('#aOk').checked, website: g('aHp'), t: T0 };
      b.disabled = true; b.textContent = t().sending;
      try { const r = await fetch('/api/public/lead', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }); const d = await r.json();
        if (!r.ok) throw new Error(d.error || 'Erreur');
        $('#aForm').innerHTML = `<div class="ok-box"><h2>${p.sent}</h2><p>${p.sentP}</p></div>`; $('#aForm').scrollIntoView({ block: 'center' });
      } catch (x) { e.textContent = x.message; b.disabled = false; b.textContent = p.send; }
    };
  }, 0);
  const sel = (id, opts) => `<select id="${id}" style="border:1px solid var(--steel2);border-radius:8px;padding:11px 12px">${opts.map(o => `<option>${esc(o)}</option>`).join('')}</select>`;
  return `<div class="hero"><div class="wrap" style="grid-template-columns:1fr;padding-bottom:40px"><div><h1 style="font-size:clamp(40px,6vw,76px)">${p.title}</h1><p>${p.lead}</p><a class="cta" href="#aForm">${p.send}</a></div></div></div>
  <section><div class="wrap"><h2 style="margin-bottom:22px">${p.why}</h2>
    <div class="benef">${p.benefits.map(([h, x], i) => `<div><span class="bn">${String(i + 1).padStart(2, '0')}</span><h3>${esc(h)}</h3><p>${esc(x)}</p></div>`).join('')}</div></div></section>
  <section class="band"><div class="wrap" style="display:grid;grid-template-columns:1fr 1fr;gap:40px" id="ptcols">
    <div><h2 style="margin-bottom:16px">${p.who}</h2><ul class="prof">${p.profile.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
    <div><h2 style="margin-bottom:16px">${p.how}</h2><ol class="psteps">${p.steps.map(([h, x]) => `<li><b>${esc(h)}</b><span>${esc(x)}</span></li>`).join('')}</ol></div></div></section>
  <section><div class="wrap" style="max-width:900px"><div id="aForm"><h2 style="margin-bottom:18px">${p.form}</h2><div class="form">
      <label>${p.co}<input id="aCo" autocomplete="organization"></label><label>${p.vat}<input id="aVat" placeholder="BE 0123.456.789"></label>
      <label>${t().name}<input id="aName" autocomplete="name"></label><label>${t().email}<input id="aMail" type="email" autocomplete="email"></label>
      <label>${t().phone}<input id="aTel" type="tel" autocomplete="tel"></label><label>${p.site}<input id="aWeb" placeholder="www.…"></label>
      <label>${t().cp}<input id="aCp" autocomplete="postal-code"></label><label>${t().city}<input id="aCity" autocomplete="address-level2"></label>
      <label>${p.act}${sel('aAct', p.acts)}</label><label>${p.region}<input id="aReg"></label>
      <label>${p.brands}<input id="aBr"></label><label>${p.ws}${sel('aWs', p.wsOpts)}</label>
      <label>${p.staff}<input id="aSt" inputmode="numeric"></label><span></span>
      <label class="full">${p.msg}<textarea id="aMsg" rows="4"></textarea></label>
      <label class="hp" aria-hidden="true">Website<input id="aHp" tabindex="-1" autocomplete="off"></label>
      <label class="full consent"><input type="checkbox" id="aOk"><span>${t().consent.replace(/au partenaire choisi et à |aan de gekozen partner en aan |to the chosen partner and to /, '')} <a href="#/vie-privee" target="_blank">${t().privacy}</a></span></label>
      <div class="full"><span class="err" id="aErr"></span></div></div>
      <div class="navbtns"><span></span><button class="cta" id="aSend">${p.send}</button></div></div></div></section>`;
}
