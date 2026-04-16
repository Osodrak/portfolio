// ============================================================
// GABRIEL CARDOSO — PORTFOLIO main.js
// ============================================================

// ——— CUSTOM CURSOR ———
const cursor    = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

(function animCursor() {
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
  rx += (mx - rx) * 0.14;
  ry += (my - ry) * 0.14;
  cursorRing.style.left = rx + 'px';
  cursorRing.style.top  = ry + 'px';
  requestAnimationFrame(animCursor);
})();

document.querySelectorAll('a, button, .project-card, .ds-card, .contact-card, .skill-card, select').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.classList.add('big'); cursorRing.classList.add('big'); });
  el.addEventListener('mouseleave', () => { cursor.classList.remove('big'); cursorRing.classList.remove('big'); });
});

// ——— NAVBAR SCROLL ———
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  nav.style.borderBottomColor = window.scrollY > 10 ? 'rgba(0,245,160,0.12)' : '';
});

// ——— MOBILE MENU ———
function toggleMenu() {
  document.getElementById('navMobile').classList.toggle('open');
}

// ——— TERMINAL TYPER ———
const TERMINAL_LINES = [
  { cmd: 'cat skills.txt',           out: '<span style="color:#00f5a0">HTML</span> <span style="color:#00c8ff">CSS</span> <span style="color:#ffd700">JavaScript</span> <span style="color:#ff6b6b">Python</span>' },
  { cmd: 'python -m algoritmos',     out: '<span style="color:#00f5a0">✓</span> <span style="color:#dcdcf0">Estruturas de Dados OK</span>' },
  { cmd: 'git log --oneline',        out: '<span style="color:#00c8ff">4 projetos</span> <span style="color:#5a5a7a">· commits recentes</span>' },
  { cmd: './buscar_estagio.sh',      out: '<span style="color:#00f5a0">→ Disponível agora!</span>' },
  { cmd: 'echo $STATUS',             out: '<span style="color:#ffd700">Jr. Dev · Buscando oportunidade</span>' },
];

let termLine = 0, termChar = 0;
const typedEl  = document.getElementById('typedText');
const outputEl = document.getElementById('termOutput');

function typeLine() {
  if (termLine >= TERMINAL_LINES.length) {
    termLine = 0; outputEl.innerHTML = '';
  }
  const line = TERMINAL_LINES[termLine];
  typedEl.textContent = '';
  outputEl.innerHTML  = '';
  termChar = 0;

  function typeChar() {
    if (termChar < line.cmd.length) {
      typedEl.textContent += line.cmd[termChar++];
      setTimeout(typeChar, 48);
    } else {
      setTimeout(() => {
        outputEl.innerHTML = line.out;
        termLine++;
        setTimeout(typeLine, 1900);
      }, 280);
    }
  }
  typeChar();
}
setTimeout(typeLine, 900);

// ——— SCROLL REVEAL + SKILL BARS ———
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.transform = `scaleX(${bar.dataset.w})`;
      });
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ——— MODAL SYSTEM ———
let currentBlobUrl = null;

function openProject(idx) {
  const project = PROJECTS[idx];
  if (!project) return;

  document.getElementById('modalNum').textContent  = project.num;
  document.getElementById('modalName').textContent = project.name;
  document.getElementById('codeFilename').textContent = project.filename;

  // Build preview using blob URL from the actual project file path
  const iframe = document.getElementById('previewFrame');
  iframe.src = project.file;

  // Load code into viewer
  renderCode(project.code);

  // Open modal
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';

  // Default to preview tab
  switchTab('preview');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
  // Clear iframe to stop any running scripts in projects
  setTimeout(() => { document.getElementById('previewFrame').src = ''; }, 300);
}

function switchTab(tab) {
  const isPreview = tab === 'preview';
  document.getElementById('tabPreview').classList.toggle('active', isPreview);
  document.getElementById('tabCode').classList.toggle('active', !isPreview);
  document.getElementById('panelPreview').classList.toggle('hidden', !isPreview);
  document.getElementById('panelCode').classList.toggle('hidden', isPreview);
}

function renderCode(raw) {
  const viewer = document.getElementById('codeViewer');
  // Escape HTML, then apply syntax coloring
  const escaped = raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const highlighted = escaped
    // Keywords
    .replace(/\b(function|const|let|var|class|new|return|if|else|for|while|of|in|this|async|await|import|export|default|true|false|null|undefined)\b/g, '<span class="ck">$1</span>')
    // Python keywords
    .replace(/\b(def|self|and|or|not|pass|None|True|False|import|from|as|with|yield|lambda|try|except|finally|raise|del|global|nonlocal|elif|print|range|len|type|int|float|str|list|dict|set|tuple)\b/g, '<span class="ck">$1</span>')
    // Strings
    .replace(/(&#39;[^&#39;]*&#39;|&quot;[^&quot;]*&quot;|`[^`]*`)/g, '<span class="cs">$1</span>')
    // Numbers
    .replace(/\b(\d+\.?\d*)\b/g, '<span class="cn">$1</span>')
    // Comments // and #
    .replace(/(\/\/[^\n]*|#[^\n]*)/g, '<span class="cc">$1</span>')
    // HTML tags
    .replace(/(&lt;\/?[\w\s="'/]*&gt;)/g, '<span class="ct">$1</span>');

  viewer.innerHTML = highlighted;
}

function copyCode() {
  const viewer = document.getElementById('codeViewer');
  navigator.clipboard.writeText(viewer.innerText).then(() => {
    const btn = document.querySelector('.code-toolbar button');
    btn.textContent = '✓ Copiado!';
    btn.style.color = 'var(--accent)';
    setTimeout(() => { btn.textContent = 'Copiar'; btn.style.color = ''; }, 2000);
  });
}

// Close modal on overlay click
document.getElementById('modalOverlay').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

// Close modal on ESC
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ——— SMOOTH NAV LINKS ———
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// ——— YEAR IN FOOTER ———
const footerYear = document.querySelector('footer');
if (footerYear) {
  footerYear.innerHTML = footerYear.innerHTML.replace('2025', new Date().getFullYear());
}
