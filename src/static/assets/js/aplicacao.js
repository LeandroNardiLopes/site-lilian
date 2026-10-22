/* =====================================================================
   aplicacao.js · Formulário de aplicação (uma pergunta por tela)
   ---------------------------------------------------------------------
   O QUE FAZ
   - Lê perguntas e textos do bloco <script id="form-data"> (gerado pelo
     build.py a partir de src/content/<idioma>.json).
   - Mostra uma pergunta por vez, com barra de progresso.
   - No fim, aplica a régua de qualificação (função qualifica):
       * qualificado  -> botão que abre o WhatsApp com as respostas prontas
       * não qualificado -> mensagem gentil + convite para o Instagram
   - NÃO envia nada para servidor. Nada é guardado no navegador.

   SEGURANÇA
   - Todo texto entra na página por textContent (nunca innerHTML com dados
     digitados), o que impede injeção de código.
   - O script é carregado do próprio site (CSP: script-src 'self').

   PARA MUDAR A RÉGUA DE QUALIFICAÇÃO
   - Cada opção do JSON pode ter "tag". As tags que desqualificam estão
     na lista TAGS_QUE_DESQUALIFICAM abaixo.
   ===================================================================== */
(function () {
  "use strict";

  // Tags (definidas no JSON) que encerram a aplicação com a mensagem gentil.
  // A ordem importa: a primeira encontrada decide qual mensagem aparece.
  var TAGS_QUE_DESQUALIFICAM = ["sem_compromisso", "sem_data", "sem_rotina", "sem_formato"];

  var dataEl = document.getElementById("form-data");
  var card = document.getElementById("card");
  var bar = document.getElementById("bar");
  if (!dataEl || !card) return;

  var D = JSON.parse(dataEl.textContent);   // textos do idioma + configurações
  var T = D.form;                            // atalho para os textos do formulário
  var respostas = {};                        // id da pergunta -> resposta escolhida/digitada
  var tags = {};                             // id da pergunta -> tag da opção escolhida
  var caminho = null;                        // "mim" ou "empresa"
  var passo = 0;                             // 0 = pergunta "para quem", depois as do caminho

  /* ---------- utilitários de DOM ---------- */

  // Cria um elemento com classe e texto. Nunca usa innerHTML.
  function el(tag, cls, texto) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (texto != null) appendRico(e, texto);
    return e;
  }

  // Acrescenta texto onde *palavra* vira <em>palavra</em> (com segurança).
  function appendRico(alvo, texto) {
    String(texto).split(/(\*[^*]+\*)/).forEach(function (parte) {
      if (/^\*[^*]+\*$/.test(parte)) alvo.appendChild(el("em", null, parte.slice(1, -1)));
      else if (parte) alvo.appendChild(document.createTextNode(parte));
    });
  }

  // Troca {chave} pelo valor: fmt("Pergunta {n}", {n: 2})
  function fmt(s, vars) {
    return String(s).replace(/\{(\w+)\}/g, function (_, k) { return vars[k] != null ? vars[k] : ""; });
  }

  function limpar() { while (card.firstChild) card.removeChild(card.firstChild); }

  function perguntas() {
    var lista = caminho === "empresa" ? T.empresa : T.individual;
    return [T.who].concat(lista);
  }

  function progresso(frac) { if (bar) bar.style.width = Math.max(4, Math.round(frac * 100)) + "%"; }

  /* ---------- telas ---------- */

  function renderPergunta() {
    var lista = perguntas();
    var q = lista[passo];
    limpar();
    progresso(passo / lista.length);

    card.appendChild(el("p", "eyebrow", fmt(T.question_of, { n: passo + 1, total: caminho ? lista.length : "…" })));
    card.appendChild(el("h2", null, q.label));
    if (q.help) card.appendChild(el("p", "muted", q.help));

    // Opções de escolha única
    if (q.options) {
      var grupo = el("div", "opts");
      grupo.setAttribute("role", "radiogroup");
      q.options.forEach(function (o, i) {
        var id = q.id + "_" + i;
        var label = el("label", "opt");
        label.htmlFor = id;
        var input = document.createElement("input");
        input.type = "radio"; input.name = q.id; input.id = id; input.value = o.value;
        input.dataset.tag = o.tag || "";
        if (respostas[q.id] === o.value) input.checked = true;
        var span = el("span");
        span.appendChild(el("b", null, o.label || o.value));
        if (o.desc) span.appendChild(el("small", null, o.desc));
        label.appendChild(input); label.appendChild(span);
        grupo.appendChild(label);
        // Pergunta só com opções: avança sozinha ao escolher
        if (!q.fields) input.addEventListener("change", function () { setTimeout(avancar, 220); });
      });
      card.appendChild(grupo);
    }

    // Campos de texto
    (q.fields || []).forEach(function (f) {
      var lab = el("label", "field-label", f.label);
      lab.htmlFor = "f_" + f.id;
      var inp = document.createElement(f.multiline ? "textarea" : "input");
      if (!f.multiline) inp.type = "text";
      inp.id = "f_" + f.id;
      inp.maxLength = f.multiline ? 600 : 120;   // limite de tamanho
      inp.value = respostas[f.id] || "";
      if (f.id === "nome") inp.autocomplete = "name";
      card.appendChild(lab); card.appendChild(inp);
    });

    var erro = el("p", "err"); erro.id = "err"; erro.setAttribute("role", "alert");
    card.appendChild(erro);

    var nav = el("div", "nav");
    var voltar = el("button", "linkbtn", T.back); voltar.type = "button";
    voltar.addEventListener("click", function () { if (passo === 0) renderIntro(); else { passo--; renderPergunta(); } });
    var seguir = el("button", "btn btn--primary", passo === lista.length - 1 ? T.finish : T.next); seguir.type = "button";
    seguir.addEventListener("click", avancar);
    nav.appendChild(voltar); nav.appendChild(seguir);
    card.appendChild(nav);

    var primeiro = card.querySelector("input[type=text], textarea");
    if (primeiro) primeiro.focus({ preventScroll: true });
  }

  // Valida a pergunta atual, guarda a resposta e vai para a próxima.
  function avancar() {
    var lista = perguntas();
    var q = lista[passo];
    var erro = document.getElementById("err");

    if (q.options) {
      var marcado = card.querySelector('input[name="' + q.id + '"]:checked');
      if (!marcado) { erro.textContent = T.choose; return; }
      respostas[q.id] = marcado.value;
      tags[q.id] = marcado.dataset.tag;
      if (q.id === T.who.id) caminho = marcado.value;
    }
    var faltando = null;
    (q.fields || []).forEach(function (f) {
      var v = document.getElementById("f_" + f.id).value.trim();
      if (f.required && v.length < 2 && !faltando) faltando = f.label.toLowerCase();
      respostas[f.id] = v;
    });
    if (faltando) { erro.textContent = fmt(T.fill, { campo: faltando }); return; }

    if (passo === perguntas().length - 1) { renderResultado(); return; }
    passo++;
    renderPergunta();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Régua de qualificação. Devolve null (qualificado) ou a tag que desqualificou.
  function qualifica() {
    if (caminho === "empresa") return null;
    var escolhidas = Object.keys(tags).map(function (k) { return tags[k]; });
    for (var i = 0; i < TAGS_QUE_DESQUALIFICAM.length; i++) {
      if (escolhidas.indexOf(TAGS_QUE_DESQUALIFICAM[i]) !== -1) return TAGS_QUE_DESQUALIFICAM[i];
    }
    return null;
  }

  // Monta o texto que vai para o WhatsApp.
  function mensagem() {
    var lista = caminho === "empresa" ? T.empresa : T.individual;
    var ids = [];
    lista.forEach(function (q) {
      if (q.options) ids.push(q.id);
      (q.fields || []).forEach(function (f) { ids.push(f.id); });
    });
    var linhas = [caminho === "empresa" ? T.msg_empresa : T.msg_individual, ""];
    ids.forEach(function (id) {
      if (id === "emp") return;
      if (respostas[id]) linhas.push((T.summary_labels[id] || id) + ": " + respostas[id]);
    });
    return linhas.join("\n");
  }

  function renderResultado() {
    progresso(1);
    limpar();
    var motivo = qualifica();
    var nav;

    if (motivo) {
      var chave = motivo === "sem_compromisso" ? "sem_data" : motivo;
      var primeiroNome = (respostas.nome || "").split(" ")[0];
      card.appendChild(el("p", "eyebrow", fmt(T.no_eyebrow, { nome: primeiroNome })));
      card.appendChild(el("h2", null, T.no_title));
      card.appendChild(el("p", null, T["no_" + chave]));
      card.appendChild(el("p", "muted", T.no_follow));
      nav = el("div", "nav");
      var rever = el("button", "linkbtn", T.review); rever.type = "button";
      rever.addEventListener("click", renderPergunta);
      var insta = el("a", "btn btn--primary", T.no_cta);
      insta.href = D.instagram_url; insta.target = "_blank"; insta.rel = "noopener noreferrer";
      nav.appendChild(rever); nav.appendChild(insta);
      card.appendChild(nav);
      return;
    }

    var texto = mensagem();
    var url = "https://wa.me/" + D.whatsapp + "?text=" + encodeURIComponent(texto);
    card.appendChild(el("p", "eyebrow", T.ok_eyebrow));
    card.appendChild(el("h2", null, caminho === "empresa" ? T.ok_title_empresa : T.ok_title_individual));
    card.appendChild(el("p", null, T.ok_body));
    var resumo = el("div", "summary", null); resumo.textContent = texto; resumo.id = "resumo";
    card.appendChild(resumo);

    nav = el("div", "nav");
    var voltar = el("button", "linkbtn", T.review); voltar.type = "button";
    voltar.addEventListener("click", renderPergunta);
    var wa = el("a", "btn btn--primary", T.ok_cta);
    wa.href = url; wa.target = "_blank"; wa.rel = "noopener noreferrer";
    nav.appendChild(voltar); nav.appendChild(wa);
    card.appendChild(nav);

    var fallback = el("p", "muted");
    var partes = String(T.ok_fallback).split("{numero}");
    fallback.appendChild(document.createTextNode(partes[0]));
    fallback.appendChild(el("span", "phone", D.whatsapp_display));
    fallback.appendChild(document.createTextNode(partes[1] || ""));
    card.appendChild(fallback);

    var copiar = el("button", "linkbtn", T.copy); copiar.type = "button";
    copiar.addEventListener("click", function () {
      var ok = function () { copiar.textContent = T.copied; };
      var seleciona = function () {
        var r = document.createRange(); r.selectNodeContents(resumo);
        var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
        copiar.textContent = T.selected;
      };
      if (navigator.clipboard) navigator.clipboard.writeText(texto).then(ok, seleciona); else seleciona();
    });
    card.appendChild(copiar);
  }

  // Tela inicial (já vem pronta no HTML; aqui só religamos o botão).
  var htmlInicial = Array.prototype.slice.call(card.childNodes).map(function (n) { return n.cloneNode(true); });
  function renderIntro() {
    limpar(); progresso(0);
    htmlInicial.forEach(function (n) { card.appendChild(n.cloneNode(true)); });
    ligarInicio();
  }
  function ligarInicio() {
    var b = document.getElementById("start");
    if (b) b.addEventListener("click", function () { passo = 0; renderPergunta(); });
  }

  ligarInicio();

  // Link vindo da seção "Para empresas" (…/aplicacao/#empresa): já começa no caminho empresa.
  if (location.hash === "#empresa") {
    respostas[T.who.id] = "empresa"; tags[T.who.id] = ""; caminho = "empresa"; passo = 1;
    renderPergunta();
  }
})();
