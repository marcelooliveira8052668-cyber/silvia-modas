# Silvia Modas

Site da **Silvia Modas** — loja de moda feminina, acessórios e presentes em **Taguatinga Sul, Brasília/DF**.

🌐 **Site no ar:** https://marcelooliveira8052668-cyber.github.io/silvia-modas/

---

## O que tem no site

- Vitrine com filtros por categoria (Vestidos, Conjuntos & Blazers, Roupas, Acessórios & Joias, Presentes)
- Botão **"Pedir pelo WhatsApp"** em cada peça, já com a mensagem pronta
- Favoritos (salvos no próprio navegador) e lupa de foto
- Seções: A Silvia, Como pedir, Onde estamos (endereço, horário e mapa)
- Botão flutuante de WhatsApp em todas as telas
- Página interna `catalogo.html` para gerar cartões de novas peças

## Como mexer

| Arquivo | Para que serve |
|---|---|
| `assets/js/dados.js` | **Configuração central**: nome da loja, WhatsApp, Instagram, endereço, horário, lista de peças e preços |
| `assets/img/produtos/` | Fotos das peças (`p01.jpg` ... `p32.jpg`) |
| `assets/css/estilo.css` | Cores, tipografia e layout |
| `assets/js/site.js` | Vitrine, filtros, favoritos e luz de foto |
| `assets/js/cartoes.js` | Gerador de cartões no navegador |

## Ferramentas (pasta `ferramentas/`)

| Arquivo | O que faz |
|---|---|
| `GERAR-FOTOS.bat` | Arrastre a foto do mosaico para cima dele: corta as fotos, gera a prévia do corte e os cartões com QR code |
| `publicar.bat` | Envia as alterações e atualiza o site no ar (leva ~1 minuto) |
| `recortar-mosaico.py` | Recorte do mosaico |
| `gerar-cartoes.py` | Geração dos cartões de peça, cartão de visita e card de Status |

## Publicação

Site estático (HTML, CSS e JavaScript puro), sem build, sem framework e sem banco de dados.
Publicado via **GitHub Pages** a partir da branch `main`.

---

© Silvia Modas — Todos os direitos reservados.
