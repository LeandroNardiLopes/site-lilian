#!/usr/bin/env python3
"""
build.py · Gerador do site da Lilian Mesquita
==============================================

O QUE FAZ
  Junta os TEXTOS (src/content/*.json) com os MODELOS (src/templates/*.html)
  e gera as páginas finais em HTML puro na raiz do repositório, prontas para
  o GitHub Pages:

      /index.html              página inicial em português
      /en/index.html           página inicial em inglês
      /es/index.html           página inicial em espanhol
      /aplicacao/index.html    formulário (e /en/aplicacao/, /es/aplicacao/)
      /404.html, /sitemap.xml, /robots.txt
      /assets/                 CSS, JS e imagens (copiados de src/static/assets)

COMO USAR
  python3 build.py          gera tudo
  python3 build.py --check  gera e confere se faltou algum texto (sai com erro se faltar)

  Só usa a biblioteca padrão do Python 3.8+. Nada para instalar.

REGRA DE OURO
  Nunca edite os arquivos gerados (index.html, en/, es/, aplicacao/...).
  Eles são apagados e recriados a cada build. Edite sempre o que está em src/.

MINI-LINGUAGEM DOS MODELOS
  {{ a.b.c }}                 valor do conteúdo, com escape de HTML; *texto* vira <em>texto</em>
  {{{ a.b }}}                 valor sem escape (só para dados gerados aqui, como JSON)
  {{#each lista}} ... {{/each}}  repete o bloco; dentro: {{ .campo }}, {{ . }} e {{ @n }} (1, 2, 3...)
  {{> nome }}                 insere src/templates/partials/nome.html
"""

import html
import json
import re
import shutil
import sys
from datetime import date
from pathlib import Path

RAIZ = Path(__file__).resolve().parent
SRC = RAIZ / "src"
CONTEUDO = SRC / "content"
MODELOS = SRC / "templates"
ESTATICOS = SRC / "static"

# Pastas e arquivos que o build cria. Só eles são apagados antes de gerar.
GERADOS = ["index.html", "404.html", "sitemap.xml", "robots.txt", "aplicacao", "en", "es", "assets"]

# Locale usado nas pré-visualizações de link (Open Graph)
OG_LOCALE = {"pt-BR": "pt_BR", "en": "en_US", "es": "es_ES"}

faltando = []   # textos que não foram encontrados (relatados no --check)


# ---------------------------------------------------------------------------
# Leitura de conteúdo
# ---------------------------------------------------------------------------
def ler_json(caminho):
    with open(caminho, encoding="utf-8") as f:
        return json.load(f)


def pegar(contexto, caminho, local=None):
    """Busca 'a.b.c' no contexto. '.campo' busca no item atual do each."""
    if caminho == ".":
        return local
    if caminho.startswith("."):
        alvo, partes = local, caminho[1:].split(".")
    else:
        alvo, partes = contexto, caminho.split(".")
    for p in partes:
        if isinstance(alvo, dict) and p in alvo:
            alvo = alvo[p]
        else:
            faltando.append(caminho)
            return ""
    return alvo


def texto_rico(valor):
    """Escapa HTML e transforma *texto* em <em>texto</em>."""
    seguro = html.escape(str(valor), quote=True)
    return re.sub(r"\*([^*]+)\*", r"<em>\1</em>", seguro)


# ---------------------------------------------------------------------------
# Motor de modelos (bem pequeno, de propósito)
# ---------------------------------------------------------------------------
RE_PARCIAL = re.compile(r"\{\{>\s*([\w-]+)\s*\}\}")
RE_EACH = re.compile(r"\{\{#each\s+([\w.]+)\s*\}\}(.*?)\{\{/each\}\}", re.S)
RE_CRU = re.compile(r"\{\{\{\s*([@\w.]+)\s*\}\}\}")
RE_VAR = re.compile(r"\{\{\s*([@\w.]+|\.)\s*\}\}")


def incluir_parciais(texto, profundidade=0):
    if profundidade > 5:
        raise RuntimeError("Parciais incluídos em loop")
    def troca(m):
        arq = MODELOS / "partials" / f"{m.group(1)}.html"
        return incluir_parciais(arq.read_text(encoding="utf-8"), profundidade + 1)
    return RE_PARCIAL.sub(troca, texto)


def renderizar(texto, contexto, local=None, indice=None):
    # 1) blocos {{#each}}
    def troca_each(m):
        lista = pegar(contexto, m.group(1), local) or []
        bloco = m.group(2)
        return "".join(renderizar(bloco, contexto, item, n) for n, item in enumerate(lista, 1))
    texto = RE_EACH.sub(troca_each, texto)

    # 2) valores crus {{{ }}}
    def troca_cru(m):
        return str(pegar(contexto, m.group(1), local))
    texto = RE_CRU.sub(troca_cru, texto)

    # 3) valores com escape {{ }}
    def troca_var(m):
        chave = m.group(1)
        if chave == "@n":
            return str(indice or "")
        return texto_rico(pegar(contexto, chave, local))
    return RE_VAR.sub(troca_var, texto)


# ---------------------------------------------------------------------------
# Geração
# ---------------------------------------------------------------------------
def limpar_gerados():
    for nome in GERADOS:
        alvo = RAIZ / nome
        if alvo.is_dir():
            shutil.rmtree(alvo)
        elif alvo.exists():
            alvo.unlink()


def json_para_html(dado):
    """JSON seguro para colocar dentro de <script type="application/json">."""
    texto = json.dumps(dado, ensure_ascii=False, separators=(",", ":"))
    return texto.replace("<", "\\u003c").replace(">", "\\u003e").replace("&", "\\u0026")


def gravar(caminho_rel, conteudo):
    destino = RAIZ / caminho_rel
    destino.parent.mkdir(parents=True, exist_ok=True)
    aviso = "<!-- ARQUIVO GERADO PELO build.py. NÃO EDITE AQUI: edite src/ e rode python3 build.py -->\n"
    if conteudo.startswith("<!doctype html>"):
        conteudo = conteudo.replace("<!doctype html>", "<!doctype html>\n" + aviso, 1)
    destino.write_text(conteudo, encoding="utf-8")


def main():
    site = ler_json(CONTEUDO / "site.json")
    idiomas = {cod: ler_json(CONTEUDO / f"{cod}.json") for cod in site["languages"]}
    principal = site["languages"][0]
    versao = date.today().strftime("%Y%m%d")
    dominio = site["domain"].rstrip("/")

    limpar_gerados()
    shutil.copytree(ESTATICOS / "assets", RAIZ / "assets")

    modelos = {nome: incluir_parciais((MODELOS / f"{nome}.html").read_text(encoding="utf-8"))
               for nome in ("home", "aplicacao", "404")}

    urls_sitemap = []

    for cod, t in idiomas.items():
        for pagina, sufixo in (("home", ""), ("aplicacao", "aplicacao/")):
            # Links para a mesma página nos outros idiomas (seletor e hreflang)
            alternates = []
            for c2, t2 in idiomas.items():
                href = t2["path"] + sufixo
                alternates.append({
                    "lang": t2["lang"], "label": t2["lang_label"], "href": href, "url": dominio + href,
                    "current_attr": ' aria-current="true"' if c2 == cod else "",
                })

            if pagina == "home":
                titulo, descricao = t["meta"]["title"], t["meta"]["description"]
                og_t, og_d = t["meta"]["og_title"], t["meta"]["og_description"]
            else:
                titulo, descricao = t["form"]["meta_title"], t["form"]["meta_description"]
                og_t, og_d = t["form"]["meta_title"], t["form"]["title"]

            url = dominio + t["path"] + sufixo
            page = {
                "title": titulo, "description": descricao, "og_title": og_t, "og_description": og_d,
                "url": url, "default_url": dominio + idiomas[principal]["path"] + sufixo,
                "og_locale": OG_LOCALE.get(t["lang"], "pt_BR"),
            }

            if pagina == "home":
                # Dados estruturados (ajudam o Google a entender quem é a Lilian)
                page["jsonld"] = json_para_html({
                    "@context": "https://schema.org",
                    "@type": "ProfessionalService",
                    "name": "Lilian Mesquita · Comunicação Inteligente",
                    "description": t["meta"]["description"],
                    "url": url,
                    "image": dominio + "/assets/img/og-lilian-mesquita.jpg",
                    "areaServed": "Worldwide",
                    "availableLanguage": ["pt-BR", "en", "es"],
                    "founder": {"@type": "Person", "name": site["author"], "sameAs": [site["instagram_url"]]},
                })
            else:
                page["form_json"] = json_para_html({
                    "form": t["form"], "whatsapp": site["whatsapp"],
                    "whatsapp_display": site["whatsapp_display"], "instagram_url": site["instagram_url"],
                })

            contexto = {"t": t, "site": site, "page": page, "alternates": alternates, "build": {"version": versao}}
            saida = renderizar(modelos[pagina], contexto)
            gravar((t["path"].lstrip("/") + sufixo + "index.html"), saida)
            if pagina == "home":
                urls_sitemap.append(url)

    # 404 no idioma principal
    t = idiomas[principal]
    alternates = [{"lang": x["lang"], "label": x["lang_label"], "href": x["path"], "url": dominio + x["path"],
                   "current_attr": ' aria-current="true"' if x is t else ""} for x in idiomas.values()]
    page = {"title": t["notfound"]["title"] + " | " + site["author"], "description": t["notfound"]["body"],
            "og_title": t["meta"]["og_title"], "og_description": t["meta"]["og_description"],
            "url": dominio + "/404.html", "default_url": dominio + "/", "og_locale": "pt_BR"}
    gravar("404.html", renderizar(modelos["404"], {"t": t, "site": site, "page": page,
                                                   "alternates": alternates, "build": {"version": versao}}))

    # sitemap.xml e robots.txt
    hoje = date.today().isoformat()
    itens = "".join(f"  <url><loc>{u}</loc><lastmod>{hoje}</lastmod></url>\n" for u in urls_sitemap)
    (RAIZ / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + itens + "</urlset>\n", encoding="utf-8")
    (RAIZ / "robots.txt").write_text(
        f"User-agent: *\nAllow: /\nDisallow: /aplicacao/\nDisallow: /en/aplicacao/\nDisallow: /es/aplicacao/\n"
        f"Sitemap: {dominio}/sitemap.xml\n", encoding="utf-8")

    # Relatório
    if faltando:
        print("ATENÇÃO: textos não encontrados no conteúdo:")
        for f in sorted(set(faltando)):
            print("  -", f)
        if "--check" in sys.argv:
            sys.exit(1)
    print(f"Site gerado: {len(idiomas)} idiomas, versão {versao}.")


if __name__ == "__main__":
    main()
