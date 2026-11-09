# Histórico de versões

Formato: [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/). Datas no formato AAAA-MM-DD.

## [3.1.0] · 2026-11-09
### Adicionado
- Página nova em inglês (`/en/`) e espanhol (`/es/`), geradas por `tools/traduzir_home.py`.
- Mensagem do WhatsApp do formulário no idioma da página.
- Links de idioma no rodapé e `hreflang` nas três páginas.

### Alterado
- `/aplicacao/`, `/en/aplicacao/` e `/es/aplicacao/` redirecionam para o formulário da página nova (`#aplicacao`).
- Caminhos de imagens, CSS e JS da página nova passam a ser absolutos (`/assets/...`).

## [3.0.0] · 2026-11-09
### Alterado
- Nova página inicial em português com o rebranding: logo LM com globo, paleta azul escuro e dourado, fontes Cormorant Garamond e Montserrat (locais).
- Copy revisada seção por seção: dores do executivo, tese, Método CENA, quem é a Lilian, cases no formato Antes → Hoje (com o case do Rafael), para quem é, como funciona, perguntas frequentes.

### Adicionado
- Depoimentos em vídeo de Isabella Witzel e Carol Neder.
- Formulário de aplicação em 2 telas na própria página e botão flutuante de WhatsApp.
- CSS e JavaScript da página nova em arquivos separados (`assets/css/style.css`, `assets/js/script.js`).

## [2.1.0] · 2026-10-22
### Adicionado
- Menu de navegação: no computador, links das seções na barra do topo com destaque da seção atual; no celular, botão "Menu" com todas as seções, o botão Aplicar e o seletor de idioma.
- Formação em Antropologia em "Quem conduz"; palavra "LinkedIn" ao lado do ícone.

## [2.0.0] · 2026-10-22
### Adicionado
- Novo site institucional em três idiomas (pt-BR, en, es), com posicionamento do Plano High Level e do Método Indutivo.
- Seções: abertura, prova, a pergunta errada, Armadilha do Aluno, Método (CENA), para quem é, como funciona, cases, quem conduz, para empresas, chamada final.
- Atalhos com ícone para Instagram (@inglesindutivo) e LinkedIn no rodapé e em "Quem conduz".
- Novos cases: engenheiro de Machine Learning (Austrália, sob sigilo), Ana (coordenadora de Trade Marketing) e Robson (gerente de planta).
- Encontros online de 1 a 5 por semana; cena de viagem pessoal e turismo; feiras internacionais na China, EUA e Europa.
- Formulário de aplicação multilíngue com régua de qualificação e saída pelo WhatsApp; atalho `#empresa`.
- Gerador `build.py`, conteúdo em JSON, templates comentados.
- Documentação: README, arquitetura, guia de edição, segurança, decisões.
- SEO: `hreflang`, Open Graph, dados estruturados (schema.org), `sitemap.xml`, `robots.txt`, página 404.
- Segurança: CSP restrita, fontes locais, sem scripts de terceiros.

### Alterado
- Identidade visual baseada no ebook My English Journey.
- O botão direto de WhatsApp foi substituído pela aplicação.

### Removido
- Site de página única anterior ("Comunicação Global"). Continua disponível no histórico do Git.

## [1.1.0] · 2026-10-22
### Adicionado
- Formulário de aplicação em `/aplicacao` e domínio `inglesindutivo.com.br`.

## [1.0.0] · 2026-03-31
- Primeira versão do site.
