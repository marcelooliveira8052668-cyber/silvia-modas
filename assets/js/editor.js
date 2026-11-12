/* ============================================================
   SILVIA MODAS — editor visual
   A Silvia mexe no site sem tocar em código.
   ============================================================ */
(function () {
  'use strict';

  const CHAVE = 'silvia:edicao';
  const $ = id => document.getElementById(id);
  let dados = JSON.parse(JSON.stringify(window.SILVIA));

  const CAMPOS_LOJA = [
    'whatsapp', 'whatsappLegivel', 'instagram', 'horario',
    'endereco', 'cidade', 'frase', 'descricao', 'slogan'
  ];

  /* ---------- carregar ---------- */
  function carregar() {
    try {
      const salvo = localStorage.getItem(CHAVE);
      if (salvo) dados = JSON.parse(salvo);
    } catch (e) { /* ignora */ }
    CAMPOS_LOJA.forEach(c => { if ($(c)) $(c).value = dados.loja[c] || ''; });
    desenharPecas();
    preview();
  }

  function salvarLocal() {
    try { localStorage.setItem(CHAVE, JSON.stringify(dados)); } catch (e) { /* ignora */ }
  }

  /* ---------- peças ---------- */
  function desenharPecas() {
    const box = $('pecas');
    box.innerHTML = '';
    dados.produtos.forEach((p, i) => {
      const div = document.createElement('div');
      div.className = 'peca';
      div.innerHTML =
        '<div class="topo-peca">' +
        '<img class="foto-mini" src="assets/img/produtos/' + p.foto + '" alt="" onerror="this.src=\'assets/img/logo.svg\'">' +
        '<b style="flex:1;font-size:.92rem">' + (i + 1) + '. ' + escapar(p.nome) + '</b>' +
        '<button type="button" class="btn btn-linha" style="padding:.35rem .7rem;font-size:.78rem">Remover</button>' +
        '</div>' +
        '<div class="linhas">' +
        '<input type="text" data-i="' + i + '" data-k="nome" placeholder="Nome da peça" value="' + escapar(p.nome) + '">' +
        '<input type="text" data-i="' + i + '" data-k="preco" placeholder="R$ 0,00" value="' + escapar(p.preco || '') + '">' +
        '<select data-i="' + i + '" data-k="categoria">' +
        dados.categorias.filter(c => c.id !== 'tudo')
          .map(c => '<option value="' + c.id + '"' + (c.id === p.categoria ? ' selected' : '') + '>' + c.nome + '</option>').join('') +
        '</select>' +
        '</div>' +
        '<small style="color:var(--tinta-suave)">Arquivo da foto: ' + escapar(p.foto) + '</small>';

      div.querySelectorAll('[data-k]').forEach(el => {
        el.addEventListener('input', () => {
          const i2 = +el.dataset.i, k = el.dataset.k;
          dados.produtos[i2][k] = el.value;
          if (k === 'nome') div.querySelector('.topo-peca b').textContent = (i2 + 1) + '. ' + (el.value || 'Peça');
          salvarLocal(); preview();
        });
      });
      div.querySelector('button').addEventListener('click', () => {
        if (!confirm('Remover "' + p.nome + '" da lista?')) return;
        dados.produtos.splice(i, 1);
        salvarLocal(); desenharPecas(); preview();
      });
      box.append(div);
    });
  }

  $('btnAddPeca').addEventListener('click', () => {
    const proximo = 'p' + String(dados.produtos.length + 1).padStart(2, '0') + '.jpg';
    dados.produtos.push({ nome: 'Nova peça', categoria: 'roupas', preco: '', foto: proximo, destaque: false });
    salvarLocal(); desenharPecas(); preview();
  });

  /* ---------- prévia ---------- */
  function preview() {
    CAMPOS_LOJA.forEach(c => {
      if ($(c)) dados.loja[c] = $(c).value;
    });
    $('pTitulo').textContent = dados.loja.nome || 'Silvia Modas';
    $('pCab').textContent = (dados.loja.whatsappLegivel || '') + ' · ' + (dados.loja.cidade || '');
    $('pPecas').innerHTML = dados.produtos.slice(0, 8).map(p =>
      '<div class="mini-card"><b>' + escapar(p.nome) + '</b><i>' +
      escapar(p.preco || 'Sob consulta') + ' · ' +
      escapar((dados.categorias.find(c => c.id === p.categoria) || {}).nome || '') + '</i></div>'
    ).join('') + (dados.produtos.length > 8 ? '<div class="mini-card"><i>e mais ' + (dados.produtos.length - 8) + ' peças…</i></div>' : '');
    salvarLocal();
  }

  /* ---------- baixar / copiar ---------- */
  function gerarArquivo() {
    const texto =
      '/* ============================================================\n' +
      '   SILVIA MODAS — configuração central\n' +
      '   Editado pela loja em ' + new Date().toLocaleDateString('pt-BR') + '\n' +
      '   ============================================================ */\n\n' +
      'window.SILVIA = ' + JSON.stringify(dados, null, 2) + ';\n';
    return texto;
  }

  $('btnBaixar').addEventListener('click', () => {
    const blob = new Blob([gerarArquivo()], { type: 'text/javascript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'dados.js';
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    $('status').textContent = 'dados.js salvo no seu aparelho. Agora envie por WhatsApp para publicar.';
  });

  $('btnCopiar').addEventListener('click', () => {
    const texto = gerarArquivo();
    const done = () => $('status').textContent = 'Copiado. Cole no WhatsApp para quem publica o site.';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto).then(done, () => fallback(texto, done));
    } else fallback(texto, done);
  });

  function fallback(texto, done) {
    const ta = document.createElement('textarea');
    ta.value = texto; document.body.append(ta); ta.select();
    try { document.execCommand('copy'); done(); } catch (e) { $('status').textContent = 'Não consegui copiar. Use o botão de baixar.'; }
    ta.remove();
  }

  $('btnRestaurar').addEventListener('click', () => {
    if (!confirm('Voltar ao site como está publicado? Suas mudanças neste aparelho serão perdidas.')) return;
    localStorage.removeItem(CHAVE);
    dados = JSON.parse(JSON.stringify(window.SILVIA));
    carregar();
    $('status').textContent = 'Site restaurado.';
  });

  function escapar(t) {
    return String(t || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ---------- início ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    carregar();
    CAMPOS_LOJA.forEach(c => {
      const el = $(c);
      if (el) el.addEventListener('input', preview);
    });
  });
})();
