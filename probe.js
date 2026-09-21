// ReadMe Studio — probe.js : vérifie qu'une URL d'image répond (statut + type).
// Sans dépendance Electron (testable avec `node` uniquement).
'use strict';

function probeUrl(rawUrl, timeoutMs = 15000, wantBody = false) {
  // skillicons répond 200 même pour un ID inconnu : on inspecte toujours son corps
  const sniffSkillicons = /skillicons\.dev/i.test(String(rawUrl || ''));
  return new Promise((resolve) => {
    const finish = (r) => resolve(r);
    const go = (url, hops) => {
      if (hops > 4) return finish({ ok: false, status: 0, contentType: '', error: 'trop de redirections' });
      let lib;
      try {
        const u = new URL(url);
        if (u.protocol !== 'http:' && u.protocol !== 'https:') {
          return finish({ ok: false, status: 0, contentType: '', error: 'protocole non supporté' });
        }
        lib = u.protocol === 'https:' ? require('https') : require('http');
      } catch {
        return finish({ ok: false, status: 0, contentType: '', error: 'URL invalide' });
      }
      let req;
      try {
        req = lib.get(url, {
          timeout: timeoutMs,
          headers: { 'User-Agent': 'ReadMe-Studio/1.0', Accept: 'image/*,*/*' },
        }, (res) => {
          const loc = res.headers.location;
          if (res.statusCode >= 300 && res.statusCode < 400 && loc) {
            res.resume();
            try { go(new URL(loc, url).toString(), hops + 1); }
            catch { finish({ ok: false, status: res.statusCode, contentType: '', error: 'redirection invalide' }); }
            return;
          }
          const ct = String(res.headers['content-type'] || '');
          const chunks = [];
          let size = 0;
          const collect = wantBody || sniffSkillicons;
          res.on('data', (c) => {
            if (collect && size < 262144) { chunks.push(c); size += c.length; }
          });
          res.on('end', () => {
            const body = collect ? Buffer.concat(chunks).toString('utf8') : '';
            if (res.statusCode >= 200 && res.statusCode < 300 && /^image\//.test(ct)) {
              // skillicons répond 200 même pour un ID inconnu (rend "undefined" invisible)
              if (sniffSkillicons && /undefined|didn't specify/i.test(body)) {
                finish({ ok: false, status: res.statusCode, contentType: ct, error: 'icône inconnue dans la liste (IDs en minuscules : cpp, nodejs, cs…)' });
              } else {
                finish({ ok: true, status: res.statusCode, contentType: ct });
              }
            } else {
              finish({ ok: false, status: res.statusCode, contentType: ct, error: res.statusCode >= 400 ? 'HTTP ' + res.statusCode : 'pas une image (' + (ct || 'inconnu') + ')' });
            }
          });
        });
      } catch (e) {
        return finish({ ok: false, status: 0, contentType: '', error: String(e.message || e) });
      }
      req.on('timeout', () => { req.destroy(); finish({ ok: false, status: 0, contentType: '', error: 'délai dépassé' }); });
      req.on('error', (e) => finish({ ok: false, status: 0, contentType: '', error: String(e.message || e).slice(0, 120) }));
    };
    go(rawUrl, 0);
  });
}

async function checkUrls(urls, timeoutMs) {
  const list = Array.isArray(urls) ? urls.filter((u) => typeof u === 'string').slice(0, 60) : [];
  const results = new Array(list.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(6, list.length) }, async () => {
    while (next < list.length) {
      const i = next;
      next += 1;
      const sniff = /skillicons\.dev/i.test(list[i]);
      results[i] = { url: list[i], ...(await probeUrl(list[i], timeoutMs, sniff)) };
    }
  });
  await Promise.all(workers);
  return results;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { probeUrl, checkUrls };
}
