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
