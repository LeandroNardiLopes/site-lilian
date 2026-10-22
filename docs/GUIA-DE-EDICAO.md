# Guia de edição

Este guia é para quem vai manter o site no dia a dia. Não é preciso saber programar para trocar textos.

> **Regra de ouro:** edite sempre dentro de `src/` e depois rode `python3 build.py --check`. Os arquivos fora de `src/` (index.html, en/, es/, aplicacao/, assets/) são recriados a cada build e qualquer mudança feita neles se perde.

---

## 1. Trocar um texto

Exemplo: mudar o subtítulo da abertura em português.

1. Abra `src/content/pt-BR.json`.
2. Encontre o bloco `"hero"` e a linha `"lead"`.
3. Troque só o que está entre as aspas da direita:
   ```json
   "lead": "Novo texto aqui."
   ```
4. Faça o mesmo em `en.json` e `es.json`.
5. Rode `python3 build.py --check`.

**Itálico roxo:** coloque a palavra entre asteriscos: `"*a sala onde você vai estar.*"`.

**Cuidados com o JSON:**
- Aspas dentro do texto precisam de barra: `\"assim\"`.
- Não apague as vírgulas entre as linhas.
- Se o build der erro de JSON, ele mostra a linha. Confira vírgulas e aspas ali.

## 2. Trocar o WhatsApp ou o Instagram

Abra `src/content/site.json`:
```json
"whatsapp": "5535984226585",          só números, com 55 e DDD
"whatsapp_display": "+55 35 98422-6585", como aparece escrito
"instagram_url": "https://www.instagram.com/inglesindutivo/"
```

## 3. Trocar uma foto

1. Prepare a foto (JPG, até 1400 px de largura, de preferência menos de 200 KB).
2. Salve em `src/static/assets/img/` **com o mesmo nome** da que vai substituir:
   - `lilian-mesquita-escritorio.jpg` (abertura)
   - `lilian-mesquita-blazer-bege.jpg` (Quem conduz)
   - `lilian-mesquita-palestrante.jpg` (Para empresas)
   - `og-lilian-mesquita.jpg` (imagem que aparece ao compartilhar o link, 1200 x 630)
   - `logo-lilian-mesquita.png`, `favicon.png`
3. Rode o build.

Para usar um nome novo, troque também o caminho em `src/templates/home.html`.

## 4. Mudar cores ou fontes

Tudo está no topo de `src/static/assets/css/site.css`, na seção **1. TOKENS**:
```css
--roxo: #7B5EA7;
--dourado: #C9A96E;
...
```
Mude o valor e o site inteiro acompanha.

## 5. Adicionar um item numa lista

Exemplo: um novo case. Em cada idioma, dentro de `"cases" > "items"`, copie um bloco `{ ... }` inteiro, cole depois do último (com vírgula entre eles) e edite. O layout se ajusta sozinho.

O mesmo vale para `proof.items`, `audience.profiles`, `audience.scenes`, `process.steps` e `about.credentials`.

## 6. Mudar perguntas do formulário

Em cada idioma, dentro de `"form"`:
- `"individual"`: perguntas para quem aplica para si.
- `"empresa"`: perguntas para empresas.

Cada pergunta tem `"id"`, `"label"` e `"options"` e/ou `"fields"`. Uma opção com `"tag": "sem_data"` (ou outra tag da régua) encerra a aplicação com a mensagem gentil. **Mantenha os mesmos `id` e `tag` nos três idiomas.**

Ao criar uma pergunta nova, acrescente o rótulo dela em `"summary_labels"` para aparecer na mensagem do WhatsApp.

## 7. Criar uma página nova (ex.: landing page)

1. Crie `src/templates/nova.html` (copie `home.html` como base).
2. Acrescente os textos num bloco novo em cada `src/content/<idioma>.json`, por exemplo `"lp_programa": { ... }`.
3. No `build.py`, inclua a página na lista de páginas (procure `("home", ""), ("aplicacao", "aplicacao/")`) e no dicionário `modelos`.
4. Rode o build. A página sai em `/nova/`, `/en/nova/`, `/es/nova/`.

## 8. Publicar

```bash
python3 build.py --check
git add -A
git commit -m "Descreva a mudança"
git push
```
Em 1 a 2 minutos o GitHub Pages publica. Registre mudanças relevantes no `CHANGELOG.md`.

## 9. Sintaxe dos modelos (para quem mexer em `src/templates/`)

| Marcação | O que faz |
|---|---|
| `{{ t.hero.title }}` | Insere o texto do idioma, com proteção contra HTML |
| `{{{ page.jsonld }}}` | Insere sem proteção (só para dados gerados pelo build) |
| `{{#each t.cases.items}} … {{/each}}` | Repete para cada item. Dentro: `{{ .campo }}`, `{{ . }}`, `{{ @n }}` |
| `{{> header }}` | Insere `src/templates/partials/header.html` |

Não use essas marcações dentro de comentários HTML: o gerador também as processa.
