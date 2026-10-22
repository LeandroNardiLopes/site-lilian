/* =====================================================================
   site.js · Comportamentos da página inicial
   ---------------------------------------------------------------------
   1. Fecha o menu do celular ao tocar num item, ao tocar fora ou ao
      apertar Esc (o menu abre e fecha sozinho, sem este script; aqui só
      melhoramos a experiência).
   2. Destaca no menu a seção que está na tela enquanto a pessoa rola.
   Nada é guardado nem enviado. Carregado só do próprio site (CSP).
   ===================================================================== */
(function () {
  "use strict";

  // ---------- 1. Menu do celular ----------
  var menu = document.getElementById("menu");
  if (menu) {
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) menu.removeAttribute("open");
    });
    document.addEventListener("click", function (e) {
      if (menu.hasAttribute("open") && !menu.contains(e.target)) menu.removeAttribute("open");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.hasAttribute("open")) {
        menu.removeAttribute("open");
        menu.querySelector("summary").focus();
      }
    });
  }

  // ---------- 2. Seção atual no menu ----------
  var links = document.querySelectorAll("[data-sec]");
  if (!links.length || !("IntersectionObserver" in window)) return;

  function marcar(id) {
    links.forEach(function (a) {
      var ativo = a.getAttribute("data-sec") === id;
      a.classList.toggle("is-active", ativo);
      if (ativo) a.setAttribute("aria-current", "location"); else a.removeAttribute("aria-current");
    });
  }

  // Considera "atual" a seção que cruza a faixa logo abaixo do topo da tela.
  var observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (en) { if (en.isIntersecting) marcar(en.target.id); });
  }, { rootMargin: "-35% 0px -60% 0px" });

  var vistos = {};
  links.forEach(function (a) {
    var id = a.getAttribute("data-sec");
    var sec = document.getElementById(id);
    if (sec && !vistos[id]) { vistos[id] = true; observador.observe(sec); }
  });
})();
