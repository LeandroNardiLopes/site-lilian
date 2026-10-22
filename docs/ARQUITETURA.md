# Arquitetura

## Visão geral

O site é **estático**: cada página é um arquivo HTML pronto, servido pelo GitHub Pages. Não há servidor executando código, banco de dados ou painel de administração.

Para que os textos possam ser editados sem mexer no layout, e para manter três idiomas sincronizados, o projeto separa **conteúdo**, **estrutura** e **visual**, e usa um pequeno gerador para juntar tudo.

```
 src/content/*.json   ─┐
 (textos por idioma)   │
                       ├──►  build.py  ──►  páginas HTML finais  ──►  GitHub Pages
 src/templates/*.html ─┤     (gerador)      (/, /en/, /es/, ...)      (inglesindutivo.com.br)
 (estrutura)           │
                       │
 src/static/assets/   ─┘  (copiados como estão: CSS, JS, imagens, fontes)
```

## Camadas

| Camada | Onde | Responsabilidade |
|---|---|---|
| Conteúdo | `src/content/*.json` | Todos os textos, por idioma. Configurações gerais em `site.json`. |
| Estrutura | `src/templates/` | Ordem das seções e marcação HTML. Sem texto fixo. |
| Visual | `src/static/assets/css/site.css` | Cores, fontes, espaços e layout responsivo. Tokens no topo. |
| Comportamento | `src/static/assets/js/aplicacao.js` | Formulário de aplicação (uma pergunta por tela). |
| Navegação | `src/static/assets/js/site.js` | Fecha o menu do celular e destaca a seção atual. O menu funciona mesmo sem JS (`<details>`). |
| Geração | `build.py` | Junta as camadas e grava as páginas finais. |

## Páginas geradas

| URL | Template | Observação |
|---|---|---|
| `/`, `/en/`, `/es/` | `home.html` | Página inicial em cada idioma |
| `/aplicacao/`, `/en/aplicacao/`, `/es/aplicacao/` | `aplicacao.html` | Formulário; `noindex` (não aparece no Google) |
| `/404.html` | `404.html` | Erro, em português, com seletor de idiomas |
| `/sitemap.xml`, `/robots.txt` | gerados no `build.py` | SEO |

## Idiomas

- Cada idioma tem um arquivo de conteúdo com as **mesmas chaves**. O `build.py --check` avisa se faltar alguma.
- O idioma principal (primeiro da lista em `site.json`) fica na raiz; os outros em subpastas.
- Cada página declara as versões equivalentes com `hreflang`, para o Google mostrar o idioma certo.
- O seletor de idioma é um link simples para a mesma página no outro idioma. Não há redirecionamento automático pelo idioma do navegador (isso atrapalha SEO e irrita quem quer escolher).

## Formulário de aplicação

1. O `build.py` coloca as perguntas do idioma num bloco `<script type="application/json" id="form-data">`.
2. O `aplicacao.js` lê esse bloco e monta uma pergunta por tela.
3. Opções com `"tag"` no JSON acionam a régua de qualificação (`TAGS_QUE_DESQUALIFICAM` no JS):
   - `sem_compromisso`, `sem_data`: sem cena ou sem data ("sem data, eu não pego")
   - `sem_rotina`: não cabe a prática semanal e diária
   - `sem_formato`: procura aula avulsa ou a opção mais barata
4. Qualificado: abre o WhatsApp (`wa.me`) com as respostas escritas. Empresas sempre passam.
5. Não qualificado: mensagem gentil e convite para o Instagram.

Nenhum dado é enviado a servidor nem guardado no navegador. As respostas só saem do aparelho do visitante quando ele mesmo toca em "Enviar pelo WhatsApp".

## Desempenho

- Sem bibliotecas externas. Um CSS (~15 KB) e um JS (~10 KB, só no formulário).
- Fontes hospedadas no próprio site, só os pesos usados, com `preload` e `font-display: swap`.
- Fotos redimensionadas e comprimidas; as que não aparecem na primeira tela usam `loading="lazy"`.

## Acessibilidade

- Link "pular para o conteúdo", foco visível, contraste AA nos textos.
- Rótulos em todos os campos, `aria-live` no formulário, `role="alert"` nas mensagens de erro.
- Respeita `prefers-reduced-motion`.
- Área de toque mínima de 40 a 48 px nos botões.

## Responsividade

Mobile first. Pontos de quebra em 720 px (tablet) e 960 px (computador). Nenhum elemento passa da largura da tela.
