# /mapeamento/: Mapeamento Comportamental (formulários de clientes)

Páginas avulsas, feitas à mão, usadas pela Lilian para aplicar o Mapeamento Comportamental a clientes novos.

- `etapa-1.html`: abertura, autorização LGPD, Parte A (24 blocos), Parte C (12 escalas) e Parte D (18 notas)
- `etapa-2.html`: Parte B (24 blocos sobre o ambiente de trabalho)

## Importante para o build

- Esta pasta **não** é gerada pelo `build.py` e não está na lista `GERADOS`, então o build não a apaga.
- Não entra no menu nem no `sitemap.xml`. As páginas têm `<meta name="robots" content="noindex, nofollow">`. Não coloque `/mapeamento/` no `robots.txt`: o bloqueio impediria o Google de ler o `noindex`.
- Não usam GA4 nem Pixel, de propósito (respostas de clientes, LGPD).
- Usam `/assets/logo/logo-horizontal.svg`, `/assets/logo/favicon.png` e as fontes `/assets/fonts/cormorant-garamond-*` e `/assets/fonts/montserrat-*`, por endereço absoluto. Se esses arquivos mudarem de nome, atualize o topo das duas páginas.

## Uso

Link por cliente, com o nome em `?c=`:
`https://inglesindutivo.com.br/mapeamento/etapa-1.html?c=Jefferson%20G.%20Rossini`

Nada é enviado a servidor. No fim, o cliente abre o WhatsApp da Lilian com as respostas em código (`LM1|A:...|C:...|D:...` e `LM2|B:...`). A leitura do código fica com a Lilian.

---
Desenvolvido por NKODE.
