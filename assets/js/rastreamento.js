/* Lilian Mesquita · rastreamento (GA4 e Pixel da Meta) com consentimento (LGPD)
 *
 * COMO ATIVAR: cole os IDs abaixo, rode python3 build.py e publique.
 * Enquanto os dois IDs estiverem vazios, nada é carregado e o aviso de cookies não aparece.
 *
 * Regras (ver D10 em docs/DECISOES.md):
 * - Nada do Google ou da Meta carrega antes de a pessoa clicar em "Aceitar".
 * - "Recusar" também é guardado; a pessoa pode mudar depois pelo link "Cookies" do rodapé.
 * - Nenhum dado pessoal (nome, WhatsApp, cargo) é enviado: só o nome do evento.
 */
var GA4_ID = '';          // exemplo: 'G-ABC123XYZ'
var META_PIXEL_ID = '';   // exemplo: '123456789012345'

(function () {
  if (!GA4_ID && !META_PIXEL_ID) return;

  var CHAVE = 'lm_cookies';               // 'aceito' | 'recusado'
  var lang = (document.documentElement.lang || 'pt').slice(0, 2);
  var T = {
    pt: { msg: 'Usamos cookies do Google e da Meta para medir as visitas e melhorar nossos anúncios. Eles só são ativados se você aceitar.', sim: 'Aceitar', nao: 'Recusar', pol: 'Política de privacidade', url: '/privacidade/' },
    en: { msg: 'We use Google and Meta cookies to measure visits and improve our ads. They are only turned on if you accept.', sim: 'Accept', nao: 'Decline', pol: 'Privacy policy', url: '/en/privacidade/' },
    es: { msg: 'Usamos cookies de Google y de Meta para medir las visitas y mejorar nuestros anuncios. Solo se activan si aceptas.', sim: 'Aceptar', nao: 'Rechazar', pol: 'Política de privacidad', url: '/es/privacidade/' }
  }[lang] || null;
  if (!T) return;

  function lerEscolha() { try { return localStorage.getItem(CHAVE); } catch (e) { return null; } }
  function gravarEscolha(v) { try { localStorage.setItem(CHAVE, v); } catch (e) {} }

  var ativo = false;
  function carregar(src) { var s = document.createElement('script'); s.async = true; s.src = src; document.head.appendChild(s); }

  function ativar() {
    if (ativo) return; ativo = true;
    if (GA4_ID) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', GA4_ID, { anonymize_ip: true });
      carregar('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA4_ID));
    }
    if (META_PIXEL_ID) {
      var n = window.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!window._fbq) window._fbq = n;
      n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
      window.fbq('init', META_PIXEL_ID);
      window.fbq('track', 'PageView');
      carregar('https://connect.facebook.net/en_US/fbevents.js');
    }
  }

  /* Envia um evento para o GA4 e, quando houver equivalente, para a Meta */
  var META = { aplicacao_enviada: 'Lead', contato_whatsapp: 'Contact' };
  function evento(nome, params) {
    if (!ativo) return;
    if (window.gtag) window.gtag('event', nome, params || {});
    if (window.fbq) {
      if (META[nome]) window.fbq('track', META[nome], params || {});
      else window.fbq('trackCustom', nome, params || {});
    }
  }

  /* Aviso de cookies */
  var aviso;
  function mostrarAviso() {
    if (aviso) { aviso.hidden = false; return; }
    aviso = document.createElement('div');
    aviso.className = 'cookie-banner'; aviso.setAttribute('role', 'region'); aviso.setAttribute('aria-label', 'Cookies');
    var p = document.createElement('p'); p.textContent = T.msg + ' ';
    var a = document.createElement('a'); a.href = T.url; a.textContent = T.pol; p.appendChild(a); p.appendChild(document.createTextNode('.'));
    var botoes = document.createElement('div'); botoes.className = 'cookie-actions';
    var nao = document.createElement('button'); nao.type = 'button'; nao.className = 'cookie-no'; nao.textContent = T.nao;
    var sim = document.createElement('button'); sim.type = 'button'; sim.className = 'btn cookie-yes'; sim.textContent = T.sim;
    nao.addEventListener('click', function () { gravarEscolha('recusado'); aviso.hidden = true; });
    sim.addEventListener('click', function () { gravarEscolha('aceito'); aviso.hidden = true; ativar(); });
    botoes.appendChild(nao); botoes.appendChild(sim);
    aviso.appendChild(p); aviso.appendChild(botoes);
    document.body.appendChild(aviso);
  }

  var escolha = lerEscolha();
  if (escolha === 'aceito') ativar();
  else if (escolha !== 'recusado') mostrarAviso();

  /* Link "Cookies" no rodapé reabre o aviso */
  var prefs = document.getElementById('cookie-prefs');
  if (prefs) { prefs.hidden = false; prefs.addEventListener('click', function (e) { e.preventDefault(); mostrarAviso(); }); }

  /* Eventos da página */
  document.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('a') : null;
    if (!el) return;
    var href = el.getAttribute('href') || '';
    if (href === '#aplicacao') {
      var sec = el.closest('section, header');
      evento('clique_aplicar', { posicao: sec ? (sec.id || sec.tagName.toLowerCase()) : 'pagina' });
    } else if (el.id === 'go') {
      evento('aplicacao_whatsapp_aberto');
    } else if (href.indexOf('https://wa.me') === 0) {
      evento('contato_whatsapp', { origem: el.classList.contains('wa') ? 'botao_flutuante' : 'rodape' });
    }
  });
  document.addEventListener('lm:aplicacao-inicio', function () { evento('aplicacao_inicio'); });
  document.addEventListener('lm:aplicacao', function (e) { evento('aplicacao_enviada', { cena: (e.detail && e.detail.cena) || '' }); });
  document.querySelectorAll('video').forEach(function (v) {
    var enviado = false;
    v.addEventListener('play', function () { if (enviado) return; enviado = true; evento('video_depoimento', { video: v.getAttribute('aria-label') || '' }); });
  });
})();
