/* Lilian Mesquita · rastreamento direto (GA4, Google Ads e Pixel da Meta)
 *
 * COMO ATIVAR: cole os IDs abaixo e publique.
 * Enquanto os IDs estiverem vazios, nada é carregado.
 */
var GA4_ID = '';                 // exemplo: 'G-ABC123XYZ'
var GOOGLE_ADS_ID = 'AW-18581613508';
var GOOGLE_ADS_LABEL_LEAD = 'bdqjCJuUtrodEMTXs5xF';
var GOOGLE_ADS_LABEL_WA = 'bdqjCJuUtrodEMTXs5xF';
var META_PIXEL_ID = '';          // exemplo: '123456789012345'

(function () {
  if (!GA4_ID && !GOOGLE_ADS_ID && !META_PIXEL_ID) return;

  var ativo = false;
  function carregar(src) {
    var s = document.createElement('script');
    s.async = true;
    s.src = src;
    document.head.appendChild(s);
  }

  function ativar() {
    if (ativo) return;
    ativo = true;

    var googleMainId = GA4_ID || GOOGLE_ADS_ID;
    if (googleMainId) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      if (GA4_ID) window.gtag('config', GA4_ID, { anonymize_ip: true });
      if (GOOGLE_ADS_ID) window.gtag('config', GOOGLE_ADS_ID);
      carregar('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(googleMainId));
    }

    if (META_PIXEL_ID) {
      var n = window.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!window._fbq) window._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = '2.0';
      n.queue = [];
      window.fbq('init', META_PIXEL_ID);
      window.fbq('track', 'PageView');
      carregar('https://connect.facebook.net/en_US/fbevents.js');
    }
  }

  /* Ativa imediatamente sem bloquear o usuário com banner */
  ativar();

  /* Envia eventos para GA4, Google Ads e Meta Pixel */
  var META = { aplicacao_enviada: 'Lead', contato_whatsapp: 'Contact' };
  function evento(nome, params) {
    if (!ativo) return;

    if (window.gtag) {
      window.gtag('event', nome, params || {});

      /* Dispara conversão oficial no Google Ads */
      if (GOOGLE_ADS_ID) {
        if (nome === 'aplicacao_enviada' && GOOGLE_ADS_LABEL_LEAD) {
          window.gtag('event', 'conversion', { send_to: GOOGLE_ADS_ID + '/' + GOOGLE_ADS_LABEL_LEAD });
        } else if (nome === 'contato_whatsapp' && GOOGLE_ADS_LABEL_WA) {
          window.gtag('event', 'conversion', { send_to: GOOGLE_ADS_ID + '/' + GOOGLE_ADS_LABEL_WA });
        }
      }
    }

    if (window.fbq) {
      if (META[nome]) window.fbq('track', META[nome], params || {});
      else window.fbq('trackCustom', nome, params || {});
    }
  }

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

  document.addEventListener('lm:aplicacao-inicio', function () {
    evento('aplicacao_inicio');
  });

  document.addEventListener('lm:aplicacao', function (e) {
    evento('aplicacao_enviada', { cena: (e.detail && e.detail.cena) || '' });
  });

  document.querySelectorAll('video').forEach(function (v) {
    var enviado = false;
    v.addEventListener('play', function () {
      if (enviado) return;
      enviado = true;
      evento('video_depoimento', { video: v.getAttribute('aria-label') || '' });
    });
  });
})();