/* ============================================================
   SILVIA MODAS — gerador de cartões (Canvas)
   Gera o mesmo cartão do script Python, direto no navegador.
   ============================================================ */
(function () {
  'use strict';

  const D = window.SILVIA;
  const L = D.loja;
  const C = {
    rosa: '#b23a56', rosaEscuro: '#8d2940', dourado: '#c9912f',
    creme: '#fff9f4', areia: '#f7efe6', tinta: '#2b2018', suave: '#6b5c50',
    rosaClaro: '#f6dbe2', linha: '#ecdfd6'
  };
  const W = 1080, H = 1350;

  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const selFoto = document.getElementById('fotoSelect');
  const selCat = document.getElementById('pCategoria');
  const inpNome = document.getElementById('pNome');
  const inpPreco = document.getElementById('pPreco');
  const inpUpload = document.getElementById('fotoUpload');
  const msg = document.getElementById('msg');

  let fotoAtual = null;      // Image carregada
  let fotoAtualNome = '';
  let qrImg = null;
  let ultimaLinha = '';

  /* ---------- fontes ---------- */
  function fonte(peso, tamanho) {
    const familias = peso === 'serif' ? 'Georgia, "Times New Roman", serif'
      : peso === 'serifB' ? 'Georgia, "Times New Roman", serif'
        : peso === 'sansB' ? '"Segoe UI", Arial, sans-serif' : '"Segoe UI", Arial, sans-serif';
    return peso === 'serifB' || peso === 'sansB' ? `700 ${tamanho}px ${familias}` : `400 ${tamanho}px ${familias}`;
  }

  function quebrar(texto, fnt, larguraMax) {
    ctx.font = fnt;
    const palavras = texto.split(' ');
    const linhas = [];
    let atual = '';
    palavras.forEach(p => {
      const teste = (atual + ' ' + p).trim();
      if (ctx.measureText(teste).width <= larguraMax || !atual) atual = teste;
      else { linhas.push(atual); atual = p; }
    });
    if (atual) linhas.push(atual);
    return linhas;
  }

  function arredondado(x, y, w, h, r, cor) {
    ctx.fillStyle = cor;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    ctx.fill();
  }

  function carregarFoto(src) {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }

  /* ---------- desenho do cartão ---------- */
  function desenhar(produto, foto) {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = C.creme;
    ctx.fillRect(0, 0, W, H);

    // foto
    const altF = 780;
    if (foto) {
      const escala = Math.max(W / foto.width, altF / foto.height);
      const lw = foto.width * escala, lh = foto.height * escala;
      ctx.drawImage(foto, (W - lw) / 2, (altF - lh) / 2, lw, lh);
    } else {
      const g = ctx.createLinearGradient(0, 0, W, altF);
      g.addColorStop(0, C.areia); g.addColorStop(1, C.rosaClaro);
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, altF);
      ctx.strokeStyle = 'rgba(178,58,86,.5)'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(W / 2, altF / 2, 90, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.fillStyle = C.rosa;
    ctx.fillRect(0, altF, W, 12);

    let y = 832;
    ctx.fillStyle = C.rosa;
    ctx.font = fonte('serifB', 30);
    ctx.textBaseline = 'top';
    ctx.fillText(L.nome.toUpperCase(), 60, y);
    ctx.fillStyle = C.suave;
    ctx.font = fonte('sans', 26);
    ctx.textAlign = 'right';
    ctx.fillText('@' + L.instagram, W - 60, y + 4);
    ctx.textAlign = 'left';

    y = 884;
    ctx.fillStyle = C.tinta;
    ctx.font = fonte('sansB', 50);
    quebrar(produto.nome, fonte('sansB', 50), W - 120).slice(0, 2).forEach(linha => {
      ctx.fillText(linha, 60, y);
      y += 58;
    });
    y += 12;

    const categoria = (D.categorias.find(c => c.id === produto.categoria) || {}).nome || '';
    if (categoria) {
      ctx.font = fonte('sansB', 24);
      const larg = ctx.measureText(categoria.toUpperCase()).width + 44;
      arredondado(60, y, larg, 46, 23, C.rosaClaro);
      ctx.fillStyle = C.rosa;
      ctx.fillText(categoria.toUpperCase(), 82, y + 10);
      y += 62;
    }

    if (produto.preco) {
      ctx.fillStyle = C.tinta;
      ctx.font = fonte('serifB', 46);
      ctx.fillText(produto.preco, 60, y);
    } else {
      ctx.fillStyle = C.suave;
      ctx.font = 'italic 400 36px Georgia, serif';
      ctx.fillText('Sob consulta', 60, y + 4);
    }

    ctx.strokeStyle = C.linha; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(60, 1148); ctx.lineTo(W - 60, 1148); ctx.stroke();

    if (qrImg) ctx.drawImage(qrImg, W - 210, 1178, 150, 150);

    ctx.fillStyle = C.rosa;
    ctx.font = fonte('sansB', 30);
    ctx.fillText('Peça pelo WhatsApp', 60, 1188);
    ctx.fillStyle = C.tinta;
    ctx.font = fonte('sansB', 40);
    ctx.fillText(L.whatsappLegivel, 60, 1230);
    ctx.fillStyle = C.suave;
    ctx.font = fonte('sans', 24);
    ctx.fillText('ou chame no @' + L.instagram, 60, 1290);
  }

  /* ---------- ações ---------- */
  async function gerar() {
    const nome = inpNome.value.trim() || 'Peça da Silvia Modas';
    const produto = {
      nome: nome,
      categoria: selCat.value,
      preco: inpPreco.value.trim()
    };
    desenhar(produto, fotoAtual);
    ultimaLinha = '{ "nome": "' + nome.replace(/"/g, '') + '", "categoria": "' + produto.categoria +
      '", "preco": "' + produto.preco + '", "foto": "' + (fotoAtualNome || 'pXX.jpg') + '" }';
    msg.textContent = 'Cartão pronto. Use "Baixar PNG" para salvar e mandar no WhatsApp.';
  }

  function baixar() {
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const nome = (inpNome.value.trim() || 'peça').toLowerCase()
        .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      a.href = url;
      a.download = 'silvia-cartao-' + nome + '.png';
      document.body.append(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      msg.textContent = 'PNG salvo na pasta de downloads.';
    }, 'image/png');
  }

  function copiar() {
    const texto = ultimaLinha || '{ "nome": "", "categoria": "vestidos", "preco": "", "foto": "pXX.jpg" }';
    const done = () => {
      msg.textContent = 'Linha copiada. Cole dentro de "produtos" no arquivo assets/js/dados.js.';
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto).then(done, () => fallback(texto, done));
    } else fallback(texto, done);
  }

  function fallback(texto, done) {
    const ta = document.createElement('textarea');
    ta.value = texto; document.body.append(ta); ta.select();
    try { document.execCommand('copy'); done(); } catch (e) { msg.textContent = texto; }
    ta.remove();
  }

  /* ---------- lista de peças ---------- */
  async function montarLista() {
    const box = document.getElementById('lista');
    const qtd = document.getElementById('qtd');
    qtd.textContent = '(' + D.produtos.length + ')';
    box.innerHTML = '';
    for (const p of D.produtos) {
      const item = document.createElement('div');
      item.className = 'mini';
      const img = document.createElement('img');
      img.src = 'assets/img/produtos/' + p.foto;
      img.alt = p.nome;
      img.onerror = () => { img.src = 'assets/img/logo.svg'; };
      const b = document.createElement('b'); b.textContent = p.nome;
      const s = document.createElement('span'); s.className = 'sp';
      s.textContent = p.preco || 'Sob consulta';
      item.append(img, b, s);
      item.addEventListener('click', () => {
        inpNome.value = p.nome;
        inpPreco.value = p.preco || '';
        selCat.value = p.categoria;
        selFoto.value = p.foto;
        carregarFoto('assets/img/produtos/' + p.foto).then(f => {
          fotoAtual = f; fotoAtualNome = p.foto; gerar();
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      box.append(item);
    }
  }

  /* ---------- impressão ---------- */
  async function imprimir() {
    const alvo = document.getElementById('imprimir');
    alvo.innerHTML = '';
    for (const p of D.produtos) {
      const foto = await carregarFoto('assets/img/produtos/' + p.foto);
      desenhar(p, foto);
      const pg = document.createElement('div');
      pg.className = 'pg';
      const img = document.createElement('img');
      img.src = canvas.toDataURL('image/png');
      pg.append(img);
      alvo.append(pg);
    }
    window.print();
  }

  /* ---------- início ---------- */
  document.addEventListener('DOMContentLoaded', async function () {
    selCat.innerHTML = D.categorias.filter(c => c.id !== 'tudo')
      .map(c => `<option value="${c.id}">${c.nome}</option>`).join('');

    const opcoes = D.produtos.map(p => 'assets/img/produtos/' + p.foto);
    const nomes = D.produtos.map(p => p.nome + ' — ' + p.foto);
    selFoto.innerHTML = opcoes.map((o, i) => `<option value="${o}">${nomes[i]}</option>`).join('');

    selFoto.addEventListener('change', async () => {
      fotoAtualNome = selFoto.value.split('/').pop();
      fotoAtual = await carregarFoto(selFoto.value);
      gerar();
    });

    inpUpload.addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      const leitor = new FileReader();
      leitor.onload = async () => {
        fotoAtual = await carregarFoto(leitor.result);
        fotoAtualNome = 'p33.jpg';
        msg.textContent = 'Foto carregada. Salve-a em assets/img/produtos/ com o nome indicado antes de publicar.';
        gerar();
      };
      leitor.readAsDataURL(file);
    });

    inpNome.addEventListener('input', gerar);
    inpPreco.addEventListener('input', gerar);
    selCat.addEventListener('change', gerar);

    document.getElementById('btnGerar').addEventListener('click', gerar);
    document.getElementById('btnBaixar').addEventListener('click', baixar);
    document.getElementById('btnCopiar').addEventListener('click', copiar);
    document.getElementById('btnImprimir').addEventListener('click', imprimir);

    qrImg = await carregarFoto('cartoes/qr-whatsapp.png');

    await montarLista();
    inpNome.value = D.produtos[0].nome;
    selCat.value = D.produtos[0].categoria;
    selFoto.value = 'assets/img/produtos/' + D.produtos[0].foto;
    fotoAtualNome = D.produtos[0].foto;
    fotoAtual = await carregarFoto(selFoto.value);
    gerar();
  });
})();
