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
- **Decisão:** a página inicial em português passa a ser o arquivo `src/static/index.html` (com `assets/css/style.css` e `assets/js/script.js`), copiado para a raiz pelo `build.py` depois de gerar as páginas. `/en/`, `/es/`, `/aplicacao/` e a 404 continuam vindo dos modelos, com o visual antigo, até as traduções da página nova ficarem prontas.
- **Identidade:** logo LM com globo, azul #13233F, dourado #C9A45C, off-white #F7F4EE; Cormorant Garamond e Montserrat, servidas de `/assets/fonts` (sem Google Fonts). Substitui a D6 só na página inicial em português.
- **Formulário:** a página nova tem formulário próprio em 2 telas que monta a mensagem do WhatsApp; a régua de qualificação da D7 continua valendo em `/aplicacao/` (link da bio e do ManyChat).
- **Segurança:** mesma CSP da D5, com `media-src 'self'` para os vídeos de depoimento; sem `style=""` inline; links externos com `rel="noopener noreferrer"`.
- **Motivo:** colocar o rebranding no ar sem esperar as traduções e sem quebrar os links existentes.
- **Pendente:** levar a página nova para os modelos e JSON (três idiomas) e unificar os formulários.
- **Como desfazer:** a branch `backup-site-antigo` guarda o site anterior; apagar `src/static/index.html` e rodar `python3 build.py` volta a home gerada pelo modelo.
