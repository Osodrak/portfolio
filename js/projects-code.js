// ============================================================
// PROJECTS DATA — source code embedded for the code viewer
// ============================================================

const PROJECTS = [
  {
    id: 0,
    num: '001',
    name: 'Visualizador de Ordenação',
    file: 'projects/sorting.html',
    filename: 'sorting.html',
    description: 'Animação visual de algoritmos de ordenação',
    code: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Visualizador de Ordenação</title>
<style>
  :root {
    --bg: #09090f; --surface: #0f0f1c;
    --accent: #00f5a0; --blue: #00c8ff;
    --red: #ff6b6b; --yellow: #ffd700;
    --text: #dcdcf0; --muted: #5a5a7a;
    --mono: 'Courier New', monospace;
  }
  body { background: var(--bg); color: var(--text); font-family: var(--mono); }

  /* Layout */
  header { padding: 1.2rem 2rem; background: var(--surface); }
  .controls { display: flex; gap: 0.8rem; flex-wrap: wrap; margin-top: 0.8rem; }

  /* Botões */
  .btn {
    padding: 0.5rem 1.1rem; font-family: var(--mono);
    border: 1px solid var(--border); background: transparent;
    color: var(--muted); cursor: pointer;
  }
  .btn.run { background: var(--accent); color: #09090f; }

  /* Barras de visualização */
  #canvas-area {
    display: flex; align-items: flex-end; gap: 3px;
    height: 280px; padding: 1.5rem; background: var(--surface);
  }
  .bar { flex: 1; border-radius: 2px 2px 0 0; min-width: 4px; }
  .bar.comparing { background: var(--yellow); }
  .bar.swapping   { background: var(--red); }
  .bar.sorted     { background: var(--accent); }
  .bar            { background: var(--blue); }
</style>
</head>
<body>
<header>
  <h1>▶ Visualizador de Ordenação</h1>
  <div class="controls">
    <select id="algoSelect">
      <option value="bubble">Bubble Sort — O(n²)</option>
      <option value="selection">Selection Sort — O(n²)</option>
      <option value="insertion">Insertion Sort — O(n²)</option>
    </select>
    <button class="btn" onclick="generateArray()">↺ Novo Array</button>
    <button class="btn run" id="runBtn" onclick="runSort()">▶ Ordenar</button>
  </div>
</header>
<main>
  <div id="canvas-area"></div>
  <div id="logBox"></div>
</main>

<script>
  let arr = [], running = false;

  function generateArray() {
    const n = 30;
    arr = Array.from({length: n}, () => Math.floor(Math.random() * 90) + 10);
    renderBars(arr);
  }

  function renderBars(a, comparing=[], swapping=[], sorted=[]) {
    const area = document.getElementById('canvas-area');
    const maxVal = Math.max(...a);
    area.innerHTML = a.map((v, i) => {
      let cls = 'bar';
      if (sorted.includes(i))    cls += ' sorted';
      else if (swapping.includes(i)) cls += ' swapping';
      else if (comparing.includes(i)) cls += ' comparing';
      const h = Math.max(8, Math.round((v / maxVal) * 240));
      return \`<div class="\${cls}" style="height:\${h}px"></div>\`;
    }).join('');
  }

  function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

  async function bubbleSort() {
    const a = [...arr], n = a.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        renderBars(a, [j, j+1]);
        await delay(80);
        if (a[j] > a[j+1]) {
          [a[j], a[j+1]] = [a[j+1], a[j]];
          arr = [...a];
        }
      }
    }
    renderBars(a, [], [], a.map((_,i)=>i));
  }

  async function runSort() {
    if (running || !arr.length) return;
    running = true;
    const algo = document.getElementById('algoSelect').value;
    if (algo === 'bubble') await bubbleSort();
    running = false;
  }

  generateArray();
<\/script>
</body>
</html>`
  },
  {
    id: 1,
    num: '002',
    name: 'To-Do App',
    file: 'projects/todo.html',
    filename: 'todo.html',
    description: 'Gerenciador de tarefas com padrão MVC',
    code: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>To-Do App</title>
<style>
  :root {
    --bg: #09090f; --surface: #0f0f1c; --card: #121220;
    --accent: #00f5a0; --red: #ff6b6b; --text: #dcdcf0; --muted: #5a5a7a;
    --mono: 'Courier New', monospace;
  }
  body { background: var(--bg); color: var(--text); font-family: sans-serif; }

  .add-form { display: flex; gap: 0.6rem; margin-bottom: 1.5rem; }
  .add-input {
    flex: 1; padding: 0.75rem 1rem;
    background: var(--surface); border: 1px solid #1c1c2e;
    color: var(--text); font-family: var(--mono);
  }
  .add-btn { padding: 0.75rem 1.2rem; background: var(--accent); color: #09090f; border: none; cursor: pointer; }

  .task-item {
    display: flex; align-items: center; gap: 0.8rem;
    background: var(--card); border: 1px solid #1c1c2e;
    padding: 0.9rem 1rem; margin-bottom: 0.5rem;
  }
  .task-item.done .task-text { text-decoration: line-through; opacity: 0.5; }

  .task-check { width: 18px; height: 18px; border: 2px solid #1c1c2e; cursor: pointer; }
  .task-check.checked { background: var(--accent); }
  .task-delete { background: transparent; border: none; color: var(--muted); cursor: pointer; margin-left: auto; }
</style>
</head>
<body>
<main style="max-width:580px; margin:0 auto; padding:2rem">
  <div class="add-form">
    <input class="add-input" id="taskInput" placeholder="Nova tarefa...">
    <button class="add-btn" onclick="addTask()">+ Add</button>
  </div>
  <ul id="taskList" style="list-style:none"></ul>
</main>

<script>
  // Padrão MVC em JavaScript puro
  class TodoApp {
    constructor() {
      // Model: carrega do localStorage
      this.tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      this.render(); // View
    }

    // Controller: adicionar
    add(text) {
      this.tasks.push({ id: Date.now(), text, done: false });
      this.save();
      this.render();
    }

    // Controller: alternar estado
    toggle(id) {
      const t = this.tasks.find(t => t.id === id);
      if (t) { t.done = !t.done; this.save(); this.render(); }
    }

    // Controller: remover
    remove(id) {
      this.tasks = this.tasks.filter(t => t.id !== id);
      this.save();
      this.render();
    }

    // Model: persistir
    save() { localStorage.setItem('tasks', JSON.stringify(this.tasks)); }

    // View: renderizar
    render() {
      document.getElementById('taskList').innerHTML =
        this.tasks.map(t => \`
          <li class="task-item \${t.done ? 'done' : ''}">
            <div class="task-check \${t.done ? 'checked' : ''}"
                 onclick="app.toggle(\${t.id})"></div>
            <span class="task-text">\${t.text}</span>
            <button class="task-delete" onclick="app.remove(\${t.id})">✕</button>
          </li>
        \`).join('');
    }
  }

  const app = new TodoApp();

  function addTask() {
    const input = document.getElementById('taskInput');
    if (input.value.trim()) {
      app.add(input.value.trim());
      input.value = '';
    }
  }

  document.getElementById('taskInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') addTask();
  });
<\/script>
</body>
</html>`
  },
  {
    id: 2,
    num: '003',
    name: 'Calculadora de Expressões',
    file: 'projects/calculator.html',
    filename: 'calculator.html',
    description: 'Avaliador de expressões usando Stack',
    code: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Calculadora de Expressões — Stack</title>
</head>
<body>
<!--
  Algoritmo Shunting-Yard (Dijkstra, 1961)
  Converte notação infixa → pós-fixa (RPN)
  e avalia usando uma Stack.

  Exemplo: "3 + 4 * 2"
  RPN:     "3 4 2 * +"
  Passos:
    PUSH 3  → stack: [3]
    PUSH 4  → stack: [3, 4]
    PUSH 2  → stack: [3, 4, 2]
    POP 4*2 → stack: [3, 8]
    POP 3+8 → stack: [11]
  Resultado: 11
-->
<script>
  const PRECEDENCE = { '+': 1, '-': 1, '*': 2, '/': 2 };

  // Etapa 1: Tokenizar a expressão
  function tokenize(expr) {
    const tokens = [];
    let i = 0;
    while (i < expr.length) {
      if (/[\\d.]/.test(expr[i])) {
        let num = '';
        while (i < expr.length && /[\\d.]/.test(expr[i])) num += expr[i++];
        tokens.push({ type: 'num', val: parseFloat(num) });
      } else if ('+-*/()'.includes(expr[i])) {
        const type = expr[i] === '(' || expr[i] === ')' ? 'paren' : 'op';
        tokens.push({ type, val: expr[i++] });
      } else { i++; }
    }
    return tokens;
  }

  // Etapa 2: Shunting-Yard → RPN
  function shuntingYard(tokens) {
    const output = [], ops = [];
    for (const t of tokens) {
      if (t.type === 'num') {
        output.push(t);
      } else if (t.type === 'op') {
        while (ops.length && ops.at(-1).type === 'op' &&
               PRECEDENCE[ops.at(-1).val] >= PRECEDENCE[t.val]) {
          output.push(ops.pop());
        }
        ops.push(t);
      } else if (t.val === '(') {
        ops.push(t);
      } else if (t.val === ')') {
        while (ops.length && ops.at(-1).val !== '(') output.push(ops.pop());
        ops.pop(); // remove '('
      }
    }
    while (ops.length) output.push(ops.pop());
    return output;
  }

  // Etapa 3: Avaliar RPN com Stack
  function evalRPN(rpn) {
    const stack = [];
    const steps = [];
    for (const t of rpn) {
      if (t.type === 'num') {
        stack.push(t.val);
        steps.push(\`PUSH \${t.val} → stack: [\${stack.join(', ')}]\`);
      } else {
        const b = stack.pop(), a = stack.pop();
        const ops = { '+': (x,y) => x+y, '-': (x,y) => x-y,
                      '*': (x,y) => x*y, '/': (x,y) => x/y };
        const result = ops[t.val](a, b);
        stack.push(result);
        steps.push(\`POP \${a} \${t.val} \${b} = \${result} → PUSH \${result}\`);
      }
    }
    return { result: stack[0], steps };
  }

  // Função principal
  function evaluate(expr) {
    const tokens  = tokenize(expr);
    const rpn     = shuntingYard(tokens);
    const { result, steps } = evalRPN(rpn);
    console.log('Expressão:', expr);
    console.log('RPN:', rpn.map(t => t.val).join(' '));
    console.log('Passos:', steps);
    console.log('Resultado:', result);
    return result;
  }

  // Testes
  console.log(evaluate('3+4*2'));     // 11
  console.log(evaluate('(3+4)*2'));   // 14
  console.log(evaluate('10/2+3'));    // 8
<\/script>
</body>
</html>`
  },
  {
    id: 3,
    num: '004',
    name: 'Quiz de Algoritmos',
    file: 'projects/quiz.html',
    filename: 'quiz.html',
    description: 'Quiz interativo com timer e pontuação',
    code: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Quiz de Algoritmos</title>
</head>
<body>
<!--
  Quiz System — Estrutura de Dados utilizada: Array de objetos
  Cada questão tem: categoria, texto, código, opções, resposta, explicação
  Pontuação: 10 pts por acerto + bônus de velocidade
-->
<script>
  const QUESTIONS = [
    {
      cat: 'Big-O',
      text: 'Complexidade do Bubble Sort no pior caso?',
      opts: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
      ans: 2,
      explain: 'Bubble Sort faz n*(n-1)/2 comparações no pior caso → O(n²)'
    },
    {
      cat: 'Estruturas',
      text: 'Qual estrutura usa LIFO?',
      opts: ['Queue', 'Stack', 'Árvore', 'Hash Map'],
      ans: 1,
      explain: 'Stack (Pilha) — Last In First Out. Ex: desfazer ações, recursão.'
    },
    // ... mais 8 questões no arquivo completo
  ];

  class QuizApp {
    constructor(questions) {
      this.questions = this.shuffle(questions);
      this.current   = 0;
      this.score     = 0;
      this.timeLeft  = 20;
      this.timer     = null;
    }

    shuffle(arr) {
      return [...arr].sort(() => Math.random() - 0.5);
    }

    startTimer() {
      this.timeLeft = 20;
      this.timer = setInterval(() => {
        this.timeLeft--;
        this.updateTimerUI();
        if (this.timeLeft <= 0) {
          clearInterval(this.timer);
          this.timeout(); // resposta não dada a tempo
        }
      }, 1000);
    }

    answer(idx) {
      clearInterval(this.timer);
      const q = this.questions[this.current];
      const correct = idx === q.ans;

      if (correct) {
        // Bônus de velocidade por resposta rápida
        const bonus = this.timeLeft > 15 ? 3
                    : this.timeLeft > 10 ? 2
                    : this.timeLeft > 5  ? 1 : 0;
        this.score += 10 + bonus;
      }

      this.showFeedback(correct, q.explain);
    }

    next() {
      this.current++;
      if (this.current >= this.questions.length) this.showResult();
      else this.showQuestion();
    }

    showResult() {
      const pct = Math.round(this.score / (this.questions.length * 10) * 100);
      console.log(\`Pontuação: \${this.score} | Aproveitamento: \${pct}%\`);
    }

    // updateTimerUI(), showFeedback(), showQuestion() omitidos por brevidade
    // ver arquivo completo: projects/quiz.html
  }

  const quiz = new QuizApp(QUESTIONS);
<\/script>
</body>
</html>`
  }
];
