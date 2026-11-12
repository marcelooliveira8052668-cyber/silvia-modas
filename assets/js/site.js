/* ============================================================
   SILVIA MODAS — interações do site
   ============================================================ */
(function () {
  'use strict';

  const D = window.SILVIA;
  const L = D.loja;
  const CHAVE_FAV = 'silvia:favoritos';

  /* ---------- utilidades ---------- */
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  function textoZap(msg) {
    return 'https://wa.me/' + L.whatsapp + '?text=' + encodeURIComponent(msg);
  }

  function linkItem(p) {
    return textoZap(
      'Olá, Silvia! Vi no site a peça "' + p.nome + '" e quero saber mais. Está disponível? ' +
      'Qual o valor e o tamanho?'
    );
  }

  function foto(p) {
    return 'assets/img/produtos/' + p.foto;
  }

  /* Se a foto ainda não existe, mostra um cartão elegante no lugar */
  function semFoto(el, nome) {
    el.onerror = null;
    el.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#f7efe6"/><stop offset="1" stop-color="#f6dbe2"/></linearGradient></defs>' +
      '<rect width="400" height="500" fill="url(#g)"/>' +
      '<circle cx="200" cy="195" r="54" fill="none" stroke="#b23a56" stroke-width="3" opacity=".45"/>' +
      '<path d="M172 190c0-18 14-32 28-32s28 14 28 32" fill="none" stroke="#b23a56" stroke-width="3" opacity=".45"/>' +
      '<path d="M172 190l-34 34" stroke="#b23a56" stroke-width="3" opacity=".45"/>' +
      '<path d="M228 190l34 34" stroke="#b23a56" stroke-width="3" opacity=".45"/>' +
      '<text x="200" y="320" font-family="Georgia,serif" font-size="26" fill="#8d2940" text-anchor="middle">Silvia Modas</text>' +
      '<text x="200" y="352" font-family="Arial,sans-serif" font-size="16" fill="#6b5c50" text-anchor="middle">' +
      String(nome || '').slice(0, 26) + '</text>' +
      '</svg>'
    );
  }

  /* ---------- texto da loja em todo o site ---------- */
  function preencherTextos() {
    const zap = textoZap('Olá, Silvia! Vi o site e quero conhecer as novidades.');
    ['topoWhats', 'menuWhats', 'heroWhats', 'chamadaWhats', 'flutuanteWhats', 'rodapeWhats'].forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.href = zap; if (id === 'flutuanteWhats') el.target = '_blank'; }
    });
    const insta = 'https://instagram.com/' + L.instagram;
    ['topoInsta', 'btnInsta', 'rodapeInsta'].forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.href = insta; el.target = '_blank'; el.rel = 'noopener'; }
    });
    const topoInsta = document.getElementById('topoInsta');
    if (topoInsta) topoInsta.textContent = '@' + L.instagram;

    const end = document.getElementById('topoEnd');
    if (end) end.textContent = L.endereco + ' — ' + L.cidade;
    const hor = document.getElementById('topoHorario');
    if (hor) hor.innerHTML = '<span>' + L.horario + '</span>';

    const set = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
    set('heroLead', L.descricao);
    set('infoEndereco', L.endereco + ' — ' + L.cidade);
    set('infoHorario', L.horario);
    set('infoWhats', L.whatsappLegivel);
    set('infoInsta', '@' + L.instagram);
    set('rodapeSlogan', L.slogan);
    set('rodapeDesc', L.frase + '. ' + L.endereco + ' — ' + L.cidade + '.');
    set('rodapeEnd', L.endereco + ' — ' + L.cidade);
    set('rodapeHorario', L.horario);
    set('rodapeFeito', 'Site e catálogo da Silvia Modas.');
    set('ano', new Date().getFullYear());

    const mapa = document.getElementById('btnMapa');
    if (mapa) mapa.href = L.mapa;
  }

  /* ---------- mosaico do topo ---------- */
  function mosaico() {
    const box = $('#mosaico');
    if (!box) return;
    const fotos = D.produtos.slice(0, 6);
    box.innerHTML = fotos.map((p, i) => {
      const g = i === 0 ? 'g1' : (i === 4 ? 'g2' : '');
      return '<figure class="' + g + '"><img src="' + foto(p) + '" alt="' + p.nome + '" loading="lazy"></figure>';
    }).join('');
    $$('img', box).forEach((im, i) => {
      im.onerror = () => semFoto(im, D.produtos[i].nome);
    });
  }

  /* ---------- vitrine ---------- */
  let filtroAtual = 'tudo';

  function favoritos() {
    try { return JSON.parse(localStorage.getItem(CHAVE_FAV) || '[]'); } catch (e) { return []; }
  }
  function alternarFav(nome) {
    const f = favoritos();
    const i = f.indexOf(nome);
    if (i < 0) f.push(nome); else f.splice(i, 1);
    localStorage.setItem(CHAVE_FAV, JSON.stringify(f));
    return f.indexOf(nome) > -1;
  }

  function cardProduto(p) {
    const cat = D.categorias.find(c => c.id === p.categoria);
    const preco = p.preco ? p.preco : '<small>Sob consulta</small>';
    const fav = favoritos().includes(p.nome);
    return '<article class="cartao" data-categoria="' + p.categoria + '">' +
      '<div class="foto">' +
      (p.destaque ? '<span class="marca-destaque">Destaque</span>' : '') +
      '<button class="coracao' + (fav ? ' liked' : '') + '" data-fav="' + p.nome + '" aria-label="Salvar nos favoritos" title="Salvar nos favoritos">' + (fav ? '♥' : '♡') + '</button>' +
      '<img src="' + foto(p) + '" alt="' + p.nome + '" loading="lazy">' +
      '</div>' +
      '<div class="corpo">' +
      '<span class="tag">' + (cat ? cat.nome : '') + '</span>' +
      '<h3>' + p.nome + '</h3>' +
      '<div class="preco">' + preco + '</div>' +
      '<a class="btn btn-whats" href="' + linkItem(p) + '" target="_blank" rel="noopener">Pedir pelo WhatsApp</a>' +
      '</div>' +
      '</article>';
  }

  function desenharVitrine() {
    const grade = $('#grade');
    const vazio = $('#vazio');
    if (!grade) return;
    const lista = D.produtos.filter(p => filtroAtual === 'tudo' || p.categoria === filtroAtual);
    const ordenados = lista.slice().sort((a, b) => (b.destaque ? 1 : 0) - (a.destaque ? 1 : 0));
    grade.innerHTML = ordenados.map(cardProduto).join('');
    if (vazio) vazio.style.display = ordenados.length ? 'none' : 'block';

    $$('#grade img').forEach((im, i) => {
      im.onerror = () => semFoto(im, ordenados[i].nome);
    });
    $$('#grade .coracao').forEach(btn => {
      btn.addEventListener('click', () => {
        const nome = btn.dataset.fav;
        const liked = alternarFav(nome);
        btn.classList.toggle('liked', liked);
        btn.textContent = liked ? '♥' : '♡';
      });
    });
    $$('#grade img').forEach(im => {
      im.addEventListener('click', () => {
        const nome = im.alt;
        const p = D.produtos.find(x => x.nome === nome);
        abrirLightbox(im.getAttribute('src'), nome, p ? linkItem(p) : null);
      });
    });
  }

  function desenharFiltros() {
    const box = $('#filtros');
    if (!box) return;
    box.innerHTML = D.categorias.map(c => {
      const total = c.id === 'tudo' ? D.produtos.length : D.produtos.filter(p => p.categoria === c.id).length;
      return '<button class="chip' + (c.id === filtroAtual ? ' ativo' : '') + '" data-filtro="' + c.id + '">' +
        c.nome + ' <span style="opacity:.6">(' + total + ')</span></button>';
    }).join('');
    $$('#filtros .chip').forEach(chip => {
      chip.addEventListener('click', () => {
        filtroAtual = chip.dataset.filtro;
        desenharFiltros();
        desenharVitrine();
      });
    });
  }

  /* ---------- lightbox ---------- */
  function abrirLightbox(src, legenda, link) {
    const lb = $('#lightbox');
    $('#lbImg').src = src;
    $('#lbLegenda').innerHTML = legenda + (link ? ' · <a href="' + link + '" target="_blank" rel="noopener" style="color:#7fd7a4">Pedir pelo WhatsApp</a>' : '');
    lb.classList.add('aberto');
  }
  function fecharLightbox() { $('#lightbox').classList.remove('aberto'); }

  /* ---------- início ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    preencherTextos();
    mosaico();
    desenharFiltros();
    desenharVitrine();

    const dono = document.getElementById('fotoDona');
    if (dono) dono.onerror = () => semFoto(dono, 'Silvia');
    const loja = document.getElementById('fotoLoja');
    if (loja) loja.onerror = () => semFoto(loja, 'A loja');

    document.getElementById('fechar').addEventListener('click', fecharLightbox);
    document.getElementById('lightbox').addEventListener('click', e => {
      if (e.target.id === 'lightbox') fecharLightbox();
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') fecharLightbox(); });
  });
})();
