# Registro de decisões

Formato curto: contexto, decisão, motivo. Acrescente novas decisões no fim.

## D1 · Site estático em vez de PHP
- **Contexto:** precisávamos de um site seguro, barato e fácil de manter por uma pessoa.
- **Decisão:** HTML + CSS gerados a partir de arquivos de conteúdo, hospedados no GitHub Pages.
- **Motivo:** sem servidor, a superfície de ataque é mínima; hospedagem e HTTPS gratuitos; PHP exigiria hospedagem paga e atualizações de segurança contínuas.

## D2 · Gerador próprio em Python, sem dependências
- **Contexto:** três idiomas precisam da mesma estrutura, e os textos devem ser editáveis sem tocar no layout.
- **Decisão:** `build.py` com uma mini-linguagem de modelos (cerca de 250 linhas, só biblioteca padrão).
- **Motivo:** nada a instalar nem atualizar; o código cabe na leitura de uma tarde. Ferramentas como Hugo ou Eleventy seriam mais completas, mas trariam dependências e curva de aprendizado desnecessárias para o tamanho do site.

## D3 · Arquivos gerados versionados no repositório
- **Decisão:** o resultado do build é commitado na branch `main` e servido diretamente.
- **Motivo:** dispensa CI/CD; o que está no repositório é exatamente o que está no ar. Alternativa futura: GitHub Actions rodando o build a cada push.

## D4 · Idiomas em subpastas, sem redirecionamento automático
- **Decisão:** português na raiz, `/en/` e `/es/`, com `hreflang` e seletor manual.
- **Motivo:** melhor para SEO e respeita a escolha do visitante.

## D5 · Fontes hospedadas no próprio site
- **Decisão:** Playfair Display e Poppins (licença OFL) servidas de `/assets/fonts`.
- **Motivo:** CSP mais restrita, nenhum dado enviado a terceiros, carregamento previsível.

## D6 · Identidade visual do ebook My English Journey
- **Decisão:** paleta roxo #7B5EA7, dourado #C9A96E, pêssego #FCEFE6, lilás #EEE6F6, fundo #FDFBF8, texto #1F1F1F; títulos em Playfair Display, texto em Poppins; ícones dourados de traço fino; cartões numerados; logo do ebook.
- **Motivo:** consistência com o material que os alunos já recebem.
- **Pendente:** logo em resolução maior (SVG ou PNG grande).

## D7 · Formulário com régua de qualificação e saída pelo WhatsApp
- **Decisão:** sem backend; o lead qualificado envia as respostas pelo WhatsApp.
- **Motivo:** filtra leads fora do perfil ("sem data, eu não pego") sem coletar dados no site e sem custo de infraestrutura.

## D8 · Conteúdo sem preços
- **Decisão:** nenhuma página mostra valores; os botões levam à aplicação.
- **Motivo:** regra comercial da Lilian; o preço é apresentado na Análise de Negócio.

## D9 · Nova landing page em português (rebranding) como página estática
- **Data:** 2026-11-09
- **Decisão:** as páginas iniciais em português, inglês e espanhol passam a ser arquivos estáticos (`src/static/index.html`, `src/static/en/index.html`, `src/static/es/index.html`), copiados para a raiz pelo `build.py` depois de gerar as páginas. As versões em inglês e espanhol são geradas a partir da portuguesa por `tools/traduzir_home.py` (tabela português → inglês → espanhol). Os endereços antigos do formulário (`/aplicacao/`, `/en/aplicacao/`, `/es/aplicacao/`) redirecionam para `#aplicacao` da página do idioma, para não quebrar o link da bio e do ManyChat. A 404 continua vindo do modelo.
- **Identidade:** logo LM com globo, azul #13233F, dourado #C9A45C, off-white #F7F4EE; Cormorant Garamond e Montserrat, servidas de `/assets/fonts` (sem Google Fonts). Substitui a D6 só na página inicial em português.
- **Formulário:** formulário próprio em 2 telas que monta a mensagem do WhatsApp no idioma da página (`assets/js/script.js`). A régua de qualificação automática da D7 sai de uso; a qualificação passa a acontecer na conversa (Análise de Negócio). O `aplicacao.js` e os modelos antigos ficam no repositório, sem uso, até a próxima limpeza.
- **Segurança:** mesma CSP da D5, com `media-src 'self'` para os vídeos de depoimento; sem `style=""` inline; links externos com `rel="noopener noreferrer"`.
- **Motivo:** colocar o rebranding no ar sem esperar as traduções e sem quebrar os links existentes.
- **Para editar um texto:** mude em `src/static/index.html`; se o trecho existir na tabela de `tools/traduzir_home.py`, atualize lá também, rode `python3 tools/traduzir_home.py` e depois `python3 build.py`. O script para com erro se algum trecho em português não for encontrado.
- **Pendente:** levar a página nova para os modelos e JSON e remover os arquivos antigos sem uso.
- **Como desfazer:** a branch `backup-site-antigo` guarda o site anterior; apagar `src/static/index.html` e rodar `python3 build.py` volta a home gerada pelo modelo.

## D10 · Medição (GA4 e Pixel da Meta) só com consentimento
- **Data:** 2026-11-09
- **Decisão:** `assets/js/rastreamento.js` (fonte em `src/static/assets/js/`) carrega o Google Analytics 4 e o Pixel da Meta **somente depois** de a pessoa clicar em "Aceitar" no aviso de cookies. "Recusar" é guardado no navegador e nada é carregado. O link "Cookies" no rodapé reabre o aviso. Com os IDs vazios, o arquivo não faz nada e o aviso não aparece.
- **Como ativar:** colar `GA4_ID` e `META_PIXEL_ID` no topo de `src/static/assets/js/rastreamento.js`, rodar `python3 build.py` e publicar.
- **Eventos:** `clique_aplicar` (com a seção do botão), `aplicacao_inicio` (passou da tela 1), `aplicacao_enviada` (GA4; na Meta vira **Lead**), `aplicacao_whatsapp_aberto`, `contato_whatsapp` (botão flutuante ou rodapé; na Meta vira **Contact**), `video_depoimento`. Nenhum dado pessoal vai nos eventos.
- **CSP:** a página nova e a política de privacidade liberam, além do próprio site, só `www.googletagmanager.com`, `*.google-analytics.com`, `*.analytics.google.com`, `connect.facebook.net` e `www.facebook.com`. Continua sem script inline, sem `style=""` e sem iframes. Substitui, nessas páginas, a regra "sem rastreadores" da D5.
- **Política de privacidade:** `/privacidade/`, `/en/privacidade/`, `/es/privacidade/` (fonte em `src/static/`). Contato pelo WhatsApp. **Pendente:** revisão por advogado.
- **Motivo:** medir as campanhas de tráfego pago e alimentar o algoritmo da Meta com o evento certo (Lead no formulário, não no clique do WhatsApp), respeitando a LGPD.
