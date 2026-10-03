// Adresse officielle unique : l'adresse technique Cloudflare redirige vers multione.be (301, meme chemin)
export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  // adresses techniques de production (ancien et nouveau projet) et www : redirection vers multione.be.
  // Les aperçus des propositions de modification (<branche>.multione-site-git.pages.dev) ne sont PAS redirigés.
  if (['multione-site.pages.dev', 'multione-site-git.pages.dev', 'www.multione.be'].includes(url.hostname)) {
    return Response.redirect('https://multione.be' + url.pathname + url.search, 301);
  }
  const res = await next();
  if (url.hostname.endsWith('.pages.dev')) {                 // apercus de deploiement : jamais indexes par Google
    const r = new Response(res.body, res); r.headers.set('X-Robots-Tag', 'noindex'); return r;
  }
  return res;
}
