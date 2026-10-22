# Site Lilian Mesquita · inglesindutivo.com.br

Site institucional e formulário de aplicação de **Lilian Mesquita**, mentora de inglês e comunicação para executivos (Método Indutivo).

- **Endereço:** https://inglesindutivo.com.br
- **Idiomas:** português do Brasil (principal), inglês (`/en/`) e espanhol (`/es/`)
- **Hospedagem:** GitHub Pages, gratuita, com HTTPS
- **Tecnologia:** HTML + CSS + um pouco de JavaScript, sem servidor e sem banco de dados

---

## Para editar um texto (o caso mais comum)

1. Abra o arquivo do idioma em `src/content/`:
   - `pt-BR.json` (português) · `en.json` (inglês) · `es.json` (espanhol)
2. Mude só o texto entre aspas **do lado direito** dos dois-pontos.
3. Rode o gerador:
   ```bash
   python3 build.py --check
   ```
4. Confira o resultado abrindo um servidor local:
   ```bash
   python3 -m http.server 8000
   ```
   e acesse http://localhost:8000
5. Faça commit e push. Em 1 a 2 minutos o site atualiza.

> Mudou um texto em português? Mude também em `en.json` e `es.json`, para os três idiomas continuarem iguais.

O passo a passo completo, com exemplos, está em **[docs/GUIA-DE-EDICAO.md](docs/GUIA-DE-EDICAO.md)**.

---

## Estrutura do projeto

```
site-lilian/
├── build.py                  Gerador: junta textos + modelos e cria as páginas
├── src/                      FONTE: tudo o que se edita fica aqui
│   ├── content/
│   │   ├── site.json         WhatsApp, Instagram, domínio, lista de idiomas
│   │   ├── pt-BR.json        Textos em português
│   │   ├── en.json           Textos em inglês
│   │   └── es.json           Textos em espanhol
│   ├── templates/
│   │   ├── home.html         Estrutura da página inicial
│   │   ├── aplicacao.html    Estrutura do formulário
│   │   ├── 404.html          Página de erro
│   │   └── partials/         Pedaços reaproveitados (head, topo, rodapé, ícones)
│   └── static/assets/
│       ├── css/site.css      Visual completo (cores e fontes no topo)
│       ├── js/aplicacao.js   Lógica do formulário
│       ├── img/              Fotos, logo, favicon
│       └── fonts/            Playfair Display e Poppins (licença OFL)
├── docs/                     Documentação de engenharia
├── CNAME                     Domínio do GitHub Pages (não apagar)
│
│   ↓ GERADOS pelo build.py (não edite à mão)
├── index.html, 404.html, sitemap.xml, robots.txt
├── aplicacao/  en/  es/
└── assets/
```

## Documentação

| Documento | Para quê |
|---|---|
| [docs/ARQUITETURA.md](docs/ARQUITETURA.md) | Como o site é montado e por que foi feito assim |
| [docs/GUIA-DE-EDICAO.md](docs/GUIA-DE-EDICAO.md) | Como trocar textos, fotos, cores, WhatsApp e criar páginas |
| [docs/SEGURANCA.md](docs/SEGURANCA.md) | Proteções do site e cuidados com as contas |
| [docs/DECISOES.md](docs/DECISOES.md) | Registro das decisões de projeto |
| [CHANGELOG.md](CHANGELOG.md) | Histórico de versões |

## Requisitos

- Python 3.8 ou mais novo (só a biblioteca padrão)
- Git
- Nenhuma outra dependência

## Regras de conteúdo (da marca)

- Sem preços nas páginas, salvo pedido explícito da Lilian.
- Nunca citar mestrado.
- Cases só reais. Nomes só com autorização (Isabella e Vinícius autorizados); os demais anonimizados.
- Fotos de pessoa: só da própria Lilian.
