# Site public multione.be

Site de **MultiOne Belgium Import** : catalogue des chargeuses MultiOne et des accessoires (sans prix),
configurateur, partenaires officiels, histoire, contact, candidature distributeur. Trois langues : FR, NL, EN.

## Organisation des fichiers
- `public/index.html` : structure de la page, styles, balises SEO, Google Analytics (avec consentement)
- `public/site.js` : pages et textes (dictionnaire FR / NL / EN), configurateur, bandeau cookies, mesure GA4
- `public/story.js` : page « Notre histoire » et page « Contact »
- `public/partner.js` : page « Devenir distributeur officiel »
- `public/assets/` : photos, logos, fiches techniques
- `functions/` : petit serveur public (catalogue sans prix, partenaires, envoi des demandes). **Ne pas modifier sans accord.**

## Règles de travail
1. Ne jamais travailler directement sur `main` : créer une branche (`seo-titres`, `texte-accueil`…).
2. Ouvrir une **pull request** : un aperçu en ligne est créé automatiquement pour la vérifier.
3. Maxime (ou son frère) relit et valide : la modification part alors en ligne sur **multione.be**.
4. Aucun secret, mot de passe ni donnée client dans ce dépôt (il est **public**).
5. Les prix, le stock et les données du portail ne font jamais partie du site.

## Après chaque modification d'un script
Changer le numéro de version `?v=AAAAMMJJhhmm` des balises `<script>` dans `index.html`,
sinon les navigateurs gardent l'ancienne version en mémoire.
