# Segurança

## Modelo de ameaça (resumo)

O site é estático: não tem servidor executando código, banco de dados, login ou painel. Por isso os riscos clássicos (invasão de servidor, SQL injection, senha de admin vazada) **não se aplicam ao site em si**.

Os riscos reais estão nas **contas que controlam o site** e no **domínio**.

| Risco | Onde | Proteção |
|---|---|---|
| Alguém alterar o site | Conta GitHub (LeandroNardiLopes) | Verificação em duas etapas obrigatória |
| Alguém sequestrar o domínio | Conta Registro.br | Senha forte + verificação em duas etapas |
| Perder o domínio | Vencimento no Registro.br | Renovar por vários anos; e-mail de cadastro ativo |
| Outra conta usar o domínio no GitHub | GitHub Pages | Verificar o domínio na conta (Settings > Pages > Add a domain) |
| Injeção de código na página | Formulário | Textos inseridos só por `textContent`; CSP restrita |
| Vazamento de dados de leads | Formulário | Nada é armazenado nem enviado a servidor |

## Proteções no código

### Content Security Policy (CSP)
Definida em `src/templates/partials/head.html`:
```
default-src 'self'; script-src 'self'; style-src 'self'; font-src 'self';
img-src 'self' data:; connect-src 'none'; object-src 'none'; base-uri 'self';
form-action 'none'; upgrade-insecure-requests
```
- Só roda JavaScript do próprio site. Nenhum script inline, nenhum terceiro.
- Nenhuma conexão de rede a partir da página (`connect-src 'none'`).
- Nenhum formulário pode enviar dados para fora (`form-action 'none'`).
- Sem `style=""` inline nos templates (a CSP bloquearia).

> O GitHub Pages não permite configurar cabeçalhos HTTP. Por isso a CSP vai numa meta tag. A proteção contra o site ser embutido em iframes de terceiros (`frame-ancestors`) não funciona via meta e fica como limitação conhecida, sem impacto prático num site sem login.

### Outras medidas
- **HTTPS obrigatório** ("Enforce HTTPS" no GitHub Pages) e `upgrade-insecure-requests`.
- **Links externos** com `rel="noopener noreferrer"`.
- **Referrer-Policy** `strict-origin-when-cross-origin`.
- **Fontes hospedadas no próprio site**: nenhum dado do visitante vai para o Google.
- **Sem cookies, sem rastreadores, sem analytics.** Se um dia for adicionado, revisar a CSP e a LGPD.
- **JSON embutido escapado** (`<`, `>`, `&`) pelo `build.py`, para não fechar a tag `<script>`.
- **Limite de tamanho** nos campos do formulário (120 e 600 caracteres).
- **Formulário fora do Google** (`noindex` e `robots.txt`).

## LGPD

O formulário não coleta dados no site: as respostas ficam no aparelho do visitante até ele mesmo enviá-las pelo WhatsApp. A partir daí, os dados estão na conversa de WhatsApp da Lilian, e o tratamento segue as boas práticas dela (usar só para responder ao contato; não compartilhar).

## Checklist de manutenção

- [ ] Verificação em duas etapas ativa no GitHub e no Registro.br
- [ ] Domínio verificado na conta do GitHub
- [ ] "Enforce HTTPS" marcado em Settings > Pages
- [ ] Domínio renovado com antecedência
- [ ] Nunca colocar senhas, chaves ou dados de alunos no repositório (ele é público)
- [ ] Revogar acessos de aplicativos que não estão em uso (GitHub > Settings > Applications)
