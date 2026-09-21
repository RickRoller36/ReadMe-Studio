// ReadMe Studio — mini moteur Markdown -> HTML (aperçu, 100 % hors-ligne)
'use strict';

function escHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function inline(s) {
  let out = escHtml(s);
  out = out.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2">');
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/(^|\W)\*([^*\n]+)\*/g, '$1<em>$2</em>');
  out = out.replace(/`([^`\n]+)`/g, '<code>$1</code>');
  return out;
}

function render(md) {
  const lines = String(md || '').split('\n');
  let html = '';
  let i = 0;
  let inCode = false;
  let codeLang = '';
  let codeBuf = [];
  let listTag = null;
  let htmlTag = null; // bloc <div>/<p> ouvert : GitHub n'y interprète RIEN (fidélité)

  const closeList = () => { if (listTag) { html += `</${listTag}>`; listTag = null; } };

  while (i < lines.length) {
    const line = lines[i];
    const fence = line.match(/^```(\w*)\s*$/);
    if (fence) {
      if (!inCode) { closeList(); inCode = true; codeLang = fence[1] || ''; codeBuf = []; }
      else {
        inCode = false;
        html += `<pre><code${codeLang ? ` class="lang-${escHtml(codeLang)}"` : ''}>${escHtml(codeBuf.join('\n'))}</code></pre>`;
      }
      i += 1;
      continue;
    }
    if (inCode) { codeBuf.push(line); i += 1; continue; }

    const t = line.trim();
    if (!t) { closeList(); if (!htmlTag) { i += 1; continue; } html += '\n'; i += 1; continue; }

    // Dans un bloc <div>/<p> non fermé : tout passe en brut, comme GitHub
    if (htmlTag) {
      html += line + '\n';
      if (t.toLowerCase().includes(`</${htmlTag}>`)) htmlTag = null;
      i += 1;
      continue;
    }
    const openBlock = t.match(/^<(div|p)(\s[^>]*)?>$/i);
    if (openBlock && !t.toLowerCase().includes(`</${openBlock[1].toLowerCase()}>`)) {
      closeList();
      html += line + '\n';
      htmlTag = openBlock[1].toLowerCase();
      i += 1;
      continue;
    }

    // HTML brut (align center, img…) -> tel quel (inclut les fermantes </p>, </div>…)
    if (/^<\/?(p|div|h1|h2|h3|img|a|br|!--)/i.test(t)) { closeList(); html += line + '\n'; i += 1; continue; }

    const h = t.match(/^(#{1,6})\s+(.*)$/);
    if (h) { closeList(); html += `<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`; i += 1; continue; }
    if (/^(-{3,}|\*{3,})$/.test(t)) { closeList(); html += '<hr>'; i += 1; continue; }

    const q = t.match(/^>\s?(.*)$/);
    if (q) {
      closeList();
      const buf = [];
      while (i < lines.length && /^>\s?/.test(lines[i].trim())) {
        buf.push(lines[i].trim().replace(/^>\s?/, ''));
        i += 1;
      }
      html += `<blockquote>${buf.map(inline).join('<br>')}</blockquote>`;
      continue;
    }

    // tableau GFM
    if (/^\|.*\|\s*$/.test(t) && i + 1 < lines.length && /^\|[\s:|-]+\|\s*$/.test(lines[i + 1].trim())) {
      closeList();
      const cells = (s) => s.trim().replace(/^\||\|$/g, '').split('|').map((c) => inline(c.trim()));
      html += `<table><thead><tr>${cells(t).map((c) => `<th>${c}</th>`).join('')}</tr></thead><tbody>`;
      i += 2;
      while (i < lines.length && /^\|.*\|\s*$/.test(lines[i].trim())) {
        html += `<tr>${cells(lines[i]).map((c) => `<td>${c}</td>`).join('')}</tr>`;
        i += 1;
      }
      html += '</tbody></table>';
      continue;
    }

    const ul = t.match(/^[-*]\s+(.*)$/);
    const ol = t.match(/^\d+\.\s+(.*)$/);
    if (ul || ol) {
      const tag = ul ? 'ul' : 'ol';
      if (listTag !== tag) { closeList(); html += `<${tag}>`; listTag = tag; }
      html += `<li>${inline((ul || ol)[1])}</li>`;
      i += 1;
      continue;
    }

    closeList();
    html += `<p>${inline(t)}</p>`;
    i += 1;
  }
  closeList();
  if (inCode) html += `<pre><code>${escHtml(codeBuf.join('\n'))}</code></pre>`;
  return html;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { render };
}
