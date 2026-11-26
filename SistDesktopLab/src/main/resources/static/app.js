const demo = {
  "livro-fisico": [
    { id: 1, titulo: "Cantos da Serra", autor: "Marta Valença", editora: "Aurora", ano: 2019, numPaginas: 240, localizacao: "Estante A" },
    { id: 2, titulo: "Território em Verso", autor: "Ana Luz", editora: "Trama", ano: 2024, numPaginas: 180, localizacao: "Estante B" }
  ],
  "livro-digital": [
    { id: 3, titulo: "Memórias do Amanhã", autor: "Rui Carvalho", editora: "Ofício", ano: 2022, formato: "EPUB", tamanhoArquivo: 3.2 }
  ],
  "patrimonio-material": [
    { id: 1, nome: "Igreja da Boa Arte", dataTombamento: "1984-04-15", tipo: "Arquitetura", endereco: "Praça Central, 10", contexto: "Conjunto religioso tombado." },
    { id: 2, nome: "Ponte do Artesão", dataTombamento: "1992-08-09", tipo: "Engenharia", endereco: "Rio das Flores", contexto: "Estrutura histórica de pedra." }
  ],
  "patrimonio-imaterial": [
    { id: 1, nome: "Festa das Tintas", dataTombamento: "2001-06-22", tipoManifestacao: "Celebração", localidade: "Vale do Sol", contexto: "Festividade coletiva anual." },
    { id: 2, nome: "Ofício da Cerâmica", dataTombamento: "2010-03-10", tipoManifestacao: "Saberes", localidade: "Vila Nova", contexto: "Técnica artesanal transmitida por gerações." }
  ]
};

const configs = {
  "livro-fisico": {
    label: "livro físico", endpoint: "/livros_fisicos", icon: "book-marked",
    fields: [
      ["titulo", "Título", "text", true], ["autor", "Autor", "text", true],
      ["editora", "Editora", "text", true], ["ano", "Ano", "number", true],
      ["numPaginas", "Número de páginas", "number", true], ["localizacao", "Localização", "text", true]
    ]
  },
  "livro-digital": {
    label: "livro digital", endpoint: "/livros_digitais", icon: "tablet-smartphone",
    fields: [
      ["titulo", "Título", "text", true], ["autor", "Autor", "text", true],
      ["editora", "Editora", "text", true], ["ano", "Ano", "number", true],
      ["formato", "Formato", "text", true], ["tamanhoArquivo", "Tamanho do arquivo (MB)", "number", true]
    ]
  },
  "patrimonio-material": {
    label: "patrimônio material", endpoint: "/patrimonios-materiais", icon: "brick-wall",
    fields: [
      ["nome", "Nome", "text", true], ["dataTombamento", "Data de tombamento", "date", true],
      ["tipo", "Tipo", "text", false],
      ["endereco", "Endereço", "text", false], ["contexto", "Contexto", "textarea", false]
    ]
  },
  "patrimonio-imaterial": {
    label: "patrimônio imaterial", endpoint: "/patrimonios-imateriais", icon: "sparkles",
    fields: [
      ["nome", "Nome", "text", true], ["dataTombamento", "Data de tombamento", "date", true],
      ["tipoManifestacao", "Tipo de manifestação", "text", false],
      ["localidade", "Localidade", "text", false], ["contexto", "Contexto", "textarea", false]
    ]
  }
};

const state = {
  active: "inicio",
  data: { "livro-fisico": [], "livro-digital": [], "patrimonio-material": [], "patrimonio-imaterial": [] },
  currentModal: null,
  importRows: []
};

function toggleAccessibilityPanel(forceOpen) {
  const panel = document.querySelector("#accessibilityPanel");
  const toggle = document.querySelector("#accessibilityToggle");
  const shouldOpen = forceOpen ?? panel.hidden;
  panel.hidden = !shouldOpen;
  toggle.setAttribute("aria-expanded", String(shouldOpen));
  if (shouldOpen) document.querySelector("#narrationButton").focus();
}

function setAccessibilityPreference(key, enabled) {
  localStorage.setItem(key, String(enabled));
  const button = document.querySelector(key === "contrast" ? "#contrastButton"
    : key === "largeText" ? "#textButton"
    : key === "reduceMotion" ? "#motionButton"
    : "#highlightButton");
  if (button) button.setAttribute("aria-pressed", String(enabled));
}

function restoreAccessibilityPreferences() {
  const preferences = [
    ["contrast", "high-contrast"],
    ["largeText", "large-text"],
    ["reduceMotion", "reduce-motion"],
    ["highlightLinks", "highlight-links"]
  ];
  preferences.forEach(([key, className]) => {
    const enabled = localStorage.getItem(key) === "true";
    document.body.classList.toggle(className, enabled);
  });
  document.querySelector("#contrastButton").setAttribute("aria-pressed", String(localStorage.getItem("contrast") === "true"));
  document.querySelector("#textButton").setAttribute("aria-pressed", String(localStorage.getItem("largeText") === "true"));
  document.querySelector("#motionButton").setAttribute("aria-pressed", String(localStorage.getItem("reduceMotion") === "true"));
  document.querySelector("#highlightButton").setAttribute("aria-pressed", String(localStorage.getItem("highlightLinks") === "true"));
}

function loadVLibras() {
  if (document.querySelector("#vlibrasWidget")) {
    document.querySelector("#vlibrasWidget").hidden = false;
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const widget = document.createElement("div");
    widget.id = "vlibrasWidget";
    widget.setAttribute("vw", "");
    widget.className = "enabled";
    widget.innerHTML = `
      <div vw-access-button class="active"></div>
      <div vw-plugin-wrapper>
        <div class="vw-plugin-top-wrapper"></div>
      </div>`;
    document.body.append(widget);

    const script = document.createElement("script");
    script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
    script.async = true;
    script.onload = () => {
      if (!window.VLibras) {
        reject(new Error("VLibras indisponível"));
        return;
      }
      new window.VLibras.Widget("https://vlibras.gov.br/app");
      resolve();
    };
    script.onerror = reject;
    document.body.append(script);
  });
}

async function toggleVLibras() {
  const button = document.querySelector("#librasButton");
  const enabled = button.getAttribute("aria-pressed") !== "true";
  if (!enabled) {
    const widget = document.querySelector("#vlibrasWidget");
    if (widget) widget.hidden = true;
    button.setAttribute("aria-pressed", "false");
    button.querySelector("strong").textContent = "Ativar Libras";
    localStorage.setItem("libras", "false");
    toast("Tradução em Libras desativada.");
    return;
  }
  try {
    await loadVLibras();
    button.setAttribute("aria-pressed", "true");
    button.querySelector("strong").textContent = "Desativar Libras";
    localStorage.setItem("libras", "true");
    toast("Tradução em Libras ativada.");
  } catch (_) {
    toast("Não foi possível carregar o VLibras.", "circle-alert");
  }
}

function stopNarration() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  document.querySelector("#narrationButton").setAttribute("aria-pressed", "false");
  document.querySelector("#narrationButton strong").textContent = "Ler conteúdo";
}

function narrateCurrentView() {
  if (!("speechSynthesis" in window)) {
    toast("Narração não disponível neste navegador.", "circle-alert");
    return;
  }
  if (window.speechSynthesis.speaking) {
    stopNarration();
    toast("Narração interrompida.");
    return;
  }
  const view = document.querySelector(".view.active");
  const title = document.querySelector("#pageTitle").textContent;
  const text = [title, view.innerText].join(". ").replace(/\s+/g, " ").trim();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "pt-BR";
  utterance.rate = 0.95;
  utterance.onend = () => {
    document.querySelector("#narrationButton").setAttribute("aria-pressed", "false");
    document.querySelector("#narrationButton strong").textContent = "Ler conteúdo";
  };
  document.querySelector("#narrationButton").setAttribute("aria-pressed", "true");
  document.querySelector("#narrationButton strong").textContent = "Parar narração";
  window.speechSynthesis.speak(utterance);
}

async function apiGet(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Erro ${response.status}`);
    return await response.json();
  } catch (_) {
    return null;
  }
}

async function apiSend(path, method, body) {
  const response = await fetch(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!response.ok) throw new Error(`Erro ${response.status}`);
  return response.status === 204 ? null : response.json();
}

function unwrapOptionalRows(rows) {
  if (!Array.isArray(rows)) return [];
  return rows.map(row => row && typeof row === "object" && "present" in row
    ? row.present ? row.get ?? row : null
    : row).filter(Boolean);
}

async function loadData() {
  const [livrosFisicos, livrosDigitais, material, imaterial] = await Promise.all([
    apiGet("/livros_fisicos"), apiGet("/livros_digitais"),
    apiGet("/patrimonios-materiais"), apiGet("/patrimonios-imateriais")
  ]);
  state.data["livro-fisico"] = Array.isArray(livrosFisicos) ? livrosFisicos : demo["livro-fisico"];
  state.data["livro-digital"] = Array.isArray(livrosDigitais) ? livrosDigitais : demo["livro-digital"];
  state.data["patrimonio-material"] = Array.isArray(material) ? material : demo["patrimonio-material"];
  state.data["patrimonio-imaterial"] = Array.isArray(imaterial) ? imaterial : demo["patrimonio-imaterial"];
  renderAll();
}

function icon(name) {
  return `<i data-lucide="${name}"></i>`;
}

function refreshIcons() {
  if (window.lucide) window.lucide.createIcons();
}

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, char =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
}

function switchView(view) {
  state.active = view;
  document.querySelectorAll(".view").forEach(element => element.classList.remove("active"));
  document.querySelector(`#view-${view}`)?.classList.add("active");
  document.querySelectorAll(".nav-item").forEach(item => {
    const active = item.dataset.view === view;
    item.classList.toggle("active", active);
    if (active) item.setAttribute("aria-current", "page");
    else item.removeAttribute("aria-current");
  });

  const titles = {
    inicio: ["ACERVO CULTURAL", "Visão geral"],
    "livro-fisico": ["MEMÓRIA ESCRITA", "Livro físico"],
    "livro-digital": ["MEMÓRIA DIGITAL", "Livro digital"],
    "patrimonio-material": ["BENS CULTURAIS", "Patrimônio material"],
    "patrimonio-imaterial": ["MANIFESTAÇÕES", "Patrimônio imaterial"],
    estatisticas: ["ANÁLISE DE DADOS", "Estatísticas"]
  };
  document.querySelector("#pageEyebrow").textContent = titles[view][0];
  document.querySelector("#pageTitle").textContent = titles[view][1];
  document.querySelector("#navigationAnnouncement").textContent = `Tela aberta: ${titles[view][1]}`;
  document.querySelector("#sidebar").classList.remove("open");
  refreshIcons();
}

function renderDashboard() {
  const counts = [
    ["Livros", state.data["livro-fisico"].length + state.data["livro-digital"].length, "book-open", "acervo literário"],
    ["Monumentos", state.data["patrimonio-material"].length + state.data["patrimonio-imaterial"].length, "landmark", "marcos culturais"],
    ["Patrimônio material", state.data["patrimonio-material"].length, "brick-wall", "bens preservados"],
    ["Patrimônio imaterial", state.data["patrimonio-imaterial"].length, "sparkles", "expressões culturais"]
  ];
  document.querySelector("#dashboardMetrics").innerHTML = counts.map(([label, count, iconName, caption]) => `
    <article class="metric-card">
      <div class="metric-card-head"><span>${label}</span>${icon(iconName)}</div>
      <strong>${count}</strong>
      <small><b>+${Math.max(1, count)}</b> no ${caption}</small>
    </article>`).join("");

  const maximum = Math.max(...counts.map(item => item[1]), 1);
  document.querySelector("#distributionChart").innerHTML = counts.map(([label, count]) => `
    <div class="bar-column">
      <div class="bar-track"><div class="bar" style="height:${Math.max(6, count / maximum * 100)}%"></div></div>
      <span>${label.replace("Patrimônio ", "Pat. ")}</span>
    </div>`).join("");

  const recent = [
    ...state.data["livro-fisico"].slice(0, 1).map(item => ({ name: item.titulo, type: "Livro físico", icon: "book-marked" })),
    ...state.data["livro-digital"].slice(0, 1).map(item => ({ name: item.titulo, type: "Livro digital", icon: "tablet-smartphone" })),
    ...state.data["patrimonio-material"].slice(0, 1).map(item => ({ name: item.nome, type: "Patrimônio material", icon: "brick-wall" })),
    ...state.data["patrimonio-imaterial"].slice(0, 1).map(item => ({ name: item.nome, type: "Patrimônio imaterial", icon: "sparkles" }))
  ];
  document.querySelector("#recentList").innerHTML = recent.length ? recent.map((item, index) => `
    <div class="recent-item">
      <div class="recent-icon">${icon(item.icon)}</div>
      <div><strong>${esc(item.name)}</strong><small>${item.type}</small></div>
      <time>${index ? "Ontem" : "Hoje"}</time>
    </div>`).join("") : `<div class="empty-state">Nenhum cadastro recente.</div>`;
}

function recordCard(dataset, item) {
  const config = configs[dataset];
  let title = item.titulo || item.nome || `Registro ${item.id}`;
  let subtitle = item.autor || item.tipo || item.tipoManifestacao || item.contexto || "Cadastro cultural";
  let tags = [];
  if (dataset.startsWith("livro-")) {
    tags = [item.editora, item.ano,
      dataset === "livro-fisico" ? item.numPaginas && `${item.numPaginas} páginas` : item.formato,
      dataset === "livro-fisico" ? item.localizacao : item.tamanhoArquivo && `${item.tamanhoArquivo} MB`
    ].filter(Boolean);
  }
  if (dataset === "patrimonio-material") tags = [item.tipo, item.endereco, item.dataTombamento].filter(Boolean);
  if (dataset === "patrimonio-imaterial") tags = [item.tipoManifestacao, item.localidade, item.dataTombamento].filter(Boolean);
  return `
    <article class="record-card">
      <div class="record-top">
        <div class="record-icon">${icon(config.icon)}</div>
        <button class="record-menu" data-edit="${dataset}" data-id="${item.id}" aria-label="Editar ${esc(title)}">${icon("ellipsis")}</button>
      </div>
      <h3>${esc(title)}</h3>
      <p>${esc(subtitle)}</p>
      <div class="record-meta">${tags.map(tag => `<span class="tag">${esc(tag)}</span>`).join("")}</div>
    </article>`;
}

function renderDataset(dataset) {
  const gridId = {
    "livro-fisico": "livrosFisicosGrid", "livro-digital": "livrosDigitaisGrid",
    "patrimonio-material": "materialGrid", "patrimonio-imaterial": "imaterialGrid"
  }[dataset];
  const searchId = {
    "livro-fisico": "livrosFisicosSearch", "livro-digital": "livrosDigitaisSearch",
    "patrimonio-material": "materialSearch", "patrimonio-imaterial": "imaterialSearch"
  }[dataset];
  const input = document.querySelector(`#${searchId}`);
  const query = (input?.value || "").toLocaleLowerCase();
  const rows = state.data[dataset].filter(item =>
    Object.values(item).some(value => String(value ?? "").toLocaleLowerCase().includes(query)));
  const grid = document.querySelector(`#${gridId}`);
  grid.innerHTML = rows.length
    ? rows.map(item => recordCard(dataset, item)).join("")
    : `<div class="empty-state">${icon("archive-x")}<div><strong>Nenhum registro encontrado</strong><p>Cadastre um novo item ou ajuste a busca.</p></div></div>`;
  refreshIcons();
}

function renderAll() {
  renderDashboard();
  ["livro-fisico", "livro-digital", "patrimonio-material", "patrimonio-imaterial"].forEach(renderDataset);
  renderStats();
  refreshIcons();
}

function numericValues(rows, field) {
  return rows.map(row => Number(row[field])).filter(value => Number.isFinite(value));
}

function mean(values) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function median(values) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function mode(values) {
  if (!values.length) return 0;
  const frequencies = new Map();
  values.forEach(value => frequencies.set(value, (frequencies.get(value) || 0) + 1));
  let best = values[0], max = 0;
  frequencies.forEach((count, value) => { if (count > max) { max = count; best = value; } });
  return best;
}

function variance(values) {
  if (!values.length) return 0;
  const avg = mean(values);
  return mean(values.map(value => (value - avg) ** 2));
}

function formatNumber(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(".", ",");
}

function renderStats(field) {
  const dataset = document.querySelector("#statsDataset")?.value || "livros";
  const bookRows = [...state.data["livro-fisico"], ...state.data["livro-digital"]];
  const datasetFields = dataset === "livros"
    ? [["ano", "Ano"], ["tamanhoArquivo", "Tamanho do arquivo"]]
    : [["anoTombamento", "Ano de tombamento"]];
  let selectedField = field || datasetFields.find(([key]) => numericValues(dataset === "livros" ? bookRows : state.data[dataset] || [], key).length)?.[0] || datasetFields[0][0];

  let rows = dataset === "livros" ? bookRows : [
    ...state.data["patrimonio-material"], ...state.data["patrimonio-imaterial"]
  ];
  let values = numericValues(rows, selectedField);
  if (dataset === "monumentos" && selectedField === "anoTombamento") {
    values = numericValues(rows.map(row => ({ anoTombamento: Number(String(row.dataTombamento || "").slice(0, 4)) })), "anoTombamento");
  }

  document.querySelector("#statsFields").innerHTML = datasetFields.map(([key, label]) =>
    `<button class="field-chip ${key === selectedField ? "active" : ""}" data-stat-field="${key}">${label}</button>`).join("");

  const avg = mean(values), med = median(values), mod = mode(values);
  const varianceValue = variance(values), deviation = Math.sqrt(varianceValue);
  document.querySelector("#statsGrid").innerHTML = [
    ["Média", avg, "média aritmética"],
    ["Mediana", med, "valor central"],
    ["Moda", mod, "valor mais frequente"],
    ["Desvio padrão", deviation, "dispersão dos dados"]
  ].map(([label, value, caption]) => `
    <article class="stat-card"><span>${label}</span><strong>${formatNumber(value)}</strong><small>${caption}</small></article>
  `).join("");

  document.querySelector("#statsInsight").textContent = values.length
    ? `Nesta seleção, a média é ${formatNumber(avg)}, enquanto a mediana é ${formatNumber(med)}. Uma moda de ${formatNumber(mod)} indica o valor mais recorrente; o desvio padrão de ${formatNumber(deviation)} mostra o nível de variação dos registros.`
    : "Ainda não há dados numéricos suficientes neste conjunto para gerar uma leitura estatística.";
}

function openModal(dataset, item = null) {
  state.currentModal = { dataset, item };
  const config = configs[dataset];
  document.querySelector("#modalSubmit").hidden = false;
  document.querySelector("#modalEyebrow").textContent = item ? "EDITAR CADASTRO" : "NOVO CADASTRO";
  document.querySelector("#modalTitle").textContent = item ? `Editar ${config.label}` : `Novo ${config.label}`;
  document.querySelector("#modalBody").innerHTML = `
    <form class="form-grid" id="recordForm">
      ${config.fields.map(([key, label, type, required]) => `
        <div class="form-field ${type === "textarea" ? "full" : ""}">
          <label for="field-${key}">${label}</label>
          ${type === "textarea"
            ? `<textarea id="field-${key}" name="${key}" ${required ? "required" : ""}>${esc(item?.[key] || "")}</textarea>`
            : `<input id="field-${key}" name="${key}" type="${type}" value="${esc(item?.[key] || "")}" ${type === "number" ? `min="${key === "tamanhoArquivo" ? 0 : 1}" step="${key === "tamanhoArquivo" ? "any" : 1}"` : ""} ${required ? "required" : ""}>`}
        </div>`).join("")}
    </form>`;
  document.querySelector("#modalSubmit").innerHTML = `${icon("check")}<span>${item ? "Atualizar" : "Salvar"}</span>`;
  document.querySelector("#modalDelete").hidden = !item;
  document.querySelector("#modalDelete").dataset.dataset = dataset;
  document.querySelector("#modalDelete").dataset.id = item?.id || "";
  document.querySelector("#modalBackdrop").hidden = false;
  refreshIcons();
  document.querySelector("#field-" + config.fields[0][0])?.focus();
}

async function submitRecord() {
  const { dataset, item } = state.currentModal;
  const form = document.querySelector("#recordForm");
  if (!form.reportValidity()) return;
  const formData = new FormData(form);
  const body = Object.fromEntries(formData.entries());
  configs[dataset].fields.forEach(([key, , type]) => {
    if (type === "number" && body[key] !== "") body[key] = Number(body[key]);
  });
  try {
    if (item) {
      await apiSend(`${configs[dataset].endpoint}/${item.id}`, "PATCH", body);
      const index = state.data[dataset].findIndex(row => row.id === item.id);
      if (index >= 0) state.data[dataset][index] = { ...state.data[dataset][index], ...body };
      toast("Cadastro atualizado.");
    } else {
      const saved = await apiSend(configs[dataset].endpoint, "POST", body);
      state.data[dataset].push(saved || { id: Date.now(), ...body });
      toast("Cadastro criado.");
    }
    closeModal();
    renderAll();
  } catch (error) {
    toast("Não foi possível acessar o servidor.", "alert-circle");
  }
}

function closeModal() {
  document.querySelector("#modalBackdrop").hidden = true;
  document.querySelector("#modalDelete").hidden = true;
  state.currentModal = null;
  state.importRows = [];
}

function openImport() {
  state.currentModal = { type: "import" };
  document.querySelector("#modalDelete").hidden = true;
  document.querySelector("#modalSubmit").hidden = false;
  document.querySelector("#modalEyebrow").textContent = "IMPORTAÇÃO";
  document.querySelector("#modalTitle").textContent = "Adicionar dados da planilha";
  document.querySelector("#modalSubmit").innerHTML = `${icon("upload")}<span>Importar registros</span>`;
  document.querySelector("#modalBody").innerHTML = `
    <label class="dropzone" id="dropzone">
      ${icon("file-spreadsheet")}
      <h3>Selecione um arquivo Excel ou CSV</h3>
      <p>Arraste para cá ou clique para procurar</p>
      <input id="importFile" type="file" accept=".xlsx,.xls,.csv">
    </label>
    <div class="template-download">
      <label for="templateDataset">Modelo para</label>
      <select id="templateDataset" class="field-chip">
        ${Object.keys(configs).map(key => `<option value="${key}">${configs[key].label}</option>`).join("")}
      </select>
      <button class="secondary-button" type="button" data-download-template>Baixar modelo CSV</button>
    </div>
    <p class="template-hint">O modelo contém os nomes das colunas aceitos na importação. Datas devem usar o formato AAAA-MM-DD.</p>
    <div class="import-preview" id="importPreview"></div>`;
  document.querySelector("#modalBackdrop").hidden = false;
  refreshIcons();

  const fileInput = document.querySelector("#importFile");
  fileInput.addEventListener("change", event => parseFile(event.target.files[0]));
  const dropzone = document.querySelector("#dropzone");
  ["dragenter", "dragover"].forEach(type => dropzone.addEventListener(type, event => {
    event.preventDefault(); dropzone.classList.add("dragging");
  }));
  ["dragleave", "drop"].forEach(type => dropzone.addEventListener(type, event => {
    event.preventDefault(); dropzone.classList.remove("dragging");
  }));
  dropzone.addEventListener("drop", event => parseFile(event.dataTransfer.files[0]));
}

function openTemplates() {
  state.currentModal = { type: "templates" };
  document.querySelector("#modalDelete").hidden = true;
  document.querySelector("#modalSubmit").hidden = true;
  document.querySelector("#modalEyebrow").textContent = "MODELOS";
  document.querySelector("#modalTitle").textContent = "Baixar modelo de planilha";
  document.querySelector("#modalBody").innerHTML = `
    <div class="template-download">
      <label for="templateDataset">Modelo para</label>
      <select id="templateDataset" class="field-chip">
        ${Object.keys(configs).map(key => `<option value="${key}">${configs[key].label}</option>`).join("")}
      </select>
      <button class="primary-button" type="button" data-download-template>${icon("download")}<span>Baixar modelo CSV</span></button>
    </div>
    <p class="template-hint">O arquivo traz os campos do cadastro escolhido. Preencha uma linha por registro. Datas devem usar o formato AAAA-MM-DD.</p>`;
  document.querySelector("#modalBackdrop").hidden = false;
  refreshIcons();
  document.querySelector("#templateDataset").focus();
}

async function parseFile(file) {
  if (!file) return;
  const fileName = file.name.toLocaleLowerCase();
  let rows = [];
  try {
    if (fileName.endsWith(".csv")) {
      const text = await file.text();
      rows = parseCSV(text);
    } else {
      if (!window.XLSX) await loadSheetParser();
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array", cellDates: true });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
    }
  } catch (_) {
    toast("Não foi possível ler esta planilha.", "circle-alert");
    return;
  }
  if (!rows.length) {
    toast("A planilha não contém linhas.", "circle-alert");
    return;
  }
  if (rows.length > 500) {
    toast("O limite seguro da importação é de 500 linhas.", "circle-alert");
    rows = rows.slice(0, 500);
  }
  state.importRows = rows;
  renderImportPreview(rows);
}

function downloadTemplate() {
  const dataset = document.querySelector("#templateDataset").value;
  const headers = configs[dataset].fields.map(([key]) => key);
  const blob = new Blob([`\uFEFF${headers.join(";")}\r\n`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `modelo-${dataset}.csv`;
  link.style.display = "none";
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast(`Modelo de ${configs[dataset].label} baixado.`);
}

function loadSheetParser() {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-sheet-parser]');
    if (existing) {
      existing.addEventListener("load", resolve, { once: true });
      existing.addEventListener("error", reject, { once: true });
      return;
    }
    const script = document.createElement("script");
    script.dataset.sheetParser = "true";
    script.src = "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js";
    script.onload = resolve;
    script.onerror = reject;
    document.head.append(script);
  });
}

function parseCSV(text) {
  const separator = text.includes(";") && !text.includes(",") ? ";" : ",";
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let index = 0; index < text.length; index++) {
    const char = text[index];
    if (char === '"') {
      if (quoted && text[index + 1] === '"') {
        field += '"';
        index++;
      } else {
        quoted = !quoted;
      }
    } else if (char === separator && !quoted) {
      row.push(field.trim());
      field = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && text[index + 1] === "\n") index++;
      row.push(field.trim());
      if (row.some(value => value !== "")) rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  row.push(field.trim());
  if (row.some(value => value !== "")) rows.push(row);
  if (!rows.length) return [];
  const headers = rows.shift().map(header => header.replace(/^\uFEFF/, "").trim());
  return rows.map(values => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])));
}

function renderImportPreview(rows) {
  const columns = Object.keys(rows[0]).slice(0, 8);
  document.querySelector("#importPreview").innerHTML = `
    <div class="preview-head">
      <strong>${rows.length} registro(s) encontrado(s)</strong>
      <select id="importDataset" class="field-chip" style="height:38px">
        ${Object.keys(configs).map(key => `<option value="${key}">${configs[key].label}</option>`).join("")}
      </select>
    </div>
    <div class="preview-table-wrap">
      <table class="preview-table"><thead><tr>${columns.map(column => `<th>${esc(column)}</th>`).join("")}</tr></thead>
      <tbody>${rows.slice(0, 5).map(row => `<tr>${columns.map(column => `<td>${esc(row[column])}</td>`).join("")}</tr>`).join("")}</tbody></table>
    </div>
    <div class="mapping-grid" id="mappingGrid"></div>`;
  updateMapping();
  document.querySelector("#importDataset").addEventListener("change", updateMapping);
}

function updateMapping() {
  const dataset = document.querySelector("#importDataset")?.value;
  if (!dataset) return;
  const columns = Object.keys(state.importRows[0] || {});
  document.querySelector("#mappingGrid").innerHTML = configs[dataset].fields.map(([key, label]) => {
    const guess = columns.find(column => column.toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").includes(key.toLocaleLowerCase()));
    return `<div class="mapping-row"><span>${label}</span><select data-map="${key}">
      <option value="">Não importar</option>
      ${columns.map(column => `<option value="${esc(column)}" ${column === guess ? "selected" : ""}>${esc(column)}</option>`).join("")}
    </select></div>`;
  }).join("");
}

async function submitImport() {
  if (!state.importRows.length) {
    toast("Selecione uma planilha primeiro.", "circle-alert");
    return;
  }
  const dataset = document.querySelector("#importDataset").value;
  const mappings = [...document.querySelectorAll("[data-map]")].map(select => [select.dataset.map, select.value]).filter(([, source]) => source);
  let imported = 0, failed = 0;
  for (const row of state.importRows) {
    const body = {};
    mappings.forEach(([target, source]) => {
      let value = row[source];
      const field = configs[dataset].fields.find(([key]) => key === target);
      if (field?.[2] === "number" && value !== "") value = Number(value);
      if (field?.[2] === "date" && value instanceof Date) {
        const pad = number => String(number).padStart(2, "0");
        value = `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`;
      }
      body[target] = value;
    });
    const requiredFields = configs[dataset].fields.filter(([, , , required]) => required);
    const missingRequired = requiredFields.some(([key]) => body[key] === undefined || body[key] === "");
    const hasValidTombstoneDate = !dataset.startsWith("patrimonio-")
      || (/^\d{4}-\d{2}-\d{2}$/.test(body.dataTombamento || "")
        && !Number.isNaN(Date.parse(`${body.dataTombamento}T00:00:00Z`))
        && new Date(`${body.dataTombamento}T00:00:00Z`).toISOString().slice(0, 10) === body.dataTombamento);
    if (missingRequired
      || !hasValidTombstoneDate
      || (dataset.startsWith("livro-") && (!Number.isInteger(body.ano) || body.ano < 1))
      || (dataset === "livro-fisico" && (!Number.isInteger(body.numPaginas) || body.numPaginas < 1))
      || (dataset === "livro-digital" && (!Number.isFinite(body.tamanhoArquivo) || body.tamanhoArquivo < 0))) {
      failed++;
      continue;
    }
    try {
      const saved = await apiSend(configs[dataset].endpoint, "POST", body);
      state.data[dataset].push(saved || { id: Date.now() + imported, ...body });
      imported++;
    } catch (_) { failed++; }
  }
  closeModal();
  renderAll();
  toast(`${imported} registro(s) importado(s); ${failed} não foi(ram) importado(s).`, failed ? "circle-alert" : "circle-check");
}

function toast(message, iconName = "circle-check") {
  const element = document.createElement("div");
  element.className = "toast";
  element.innerHTML = `${icon(iconName)}<span>${esc(message)}</span>`;
  document.querySelector("#toastStack").append(element);
  refreshIcons();
  setTimeout(() => element.remove(), 3500);
}

async function deleteRecord() {
  const button = document.querySelector("#modalDelete");
  const dataset = button.dataset.dataset;
  const id = button.dataset.id;
  if (!dataset || !id) return;
  if (!window.confirm("Excluir este cadastro permanentemente?")) return;
  try {
    await apiSend(`${configs[dataset].endpoint}/${id}`, "DELETE");
  } catch (_) {
    toast(`Não foi possível salvar o cadastro (${error.message}).`, "alert-circle");
  }
  state.data[dataset] = state.data[dataset].filter(item => String(item.id) !== String(id));
  closeModal();
  renderAll();
  toast("Cadastro excluído.");
}

document.addEventListener("click", event => {
  const viewTarget = event.target.closest("[data-view-target]");
  if (viewTarget) switchView(viewTarget.dataset.viewTarget);

  const nav = event.target.closest(".nav-item");
  if (nav) switchView(nav.dataset.view);

  const brand = event.target.closest(".brand");
  if (brand) { event.preventDefault(); switchView("inicio"); }

  if (event.target.closest("[data-open-import]")) openImport();
  if (event.target.closest("[data-open-templates]")) openTemplates();
  if (event.target.closest("[data-download-template]")) downloadTemplate();
  if (event.target.closest("[data-close-modal]")) closeModal();

  const add = event.target.closest("[data-add]");
  if (add) openModal(add.dataset.add);

  const edit = event.target.closest("[data-edit]");
  if (edit) {
    const item = state.data[edit.dataset.edit].find(row => String(row.id) === edit.dataset.id);
    openModal(edit.dataset.edit, item);
  }

  const statField = event.target.closest("[data-stat-field]");
  if (statField) renderStats(statField.dataset.statField);
});

document.querySelector("#menuButton").addEventListener("click", () => {
  document.querySelector("#sidebar").classList.toggle("open");
});

document.querySelector("#accessibilityToggle").addEventListener("click", () => toggleAccessibilityPanel());
document.querySelector("#accessibilityClose").addEventListener("click", () => toggleAccessibilityPanel(false));
document.querySelector("#narrationButton").addEventListener("click", narrateCurrentView);

document.querySelector("#contrastButton").addEventListener("click", event => {
  const enabled = !document.body.classList.contains("high-contrast");
  document.body.classList.toggle("high-contrast", enabled);
  setAccessibilityPreference("contrast", enabled);
  toast(enabled ? "Alto contraste ativado." : "Alto contraste desativado.");
});

document.querySelector("#textButton").addEventListener("click", event => {
  const enabled = !document.body.classList.contains("large-text");
  document.body.classList.toggle("large-text", enabled);
  setAccessibilityPreference("largeText", enabled);
  toast(enabled ? "Texto ampliado." : "Texto restaurado.");
});

document.querySelector("#motionButton").addEventListener("click", event => {
  const enabled = !document.body.classList.contains("reduce-motion");
  document.body.classList.toggle("reduce-motion", enabled);
  setAccessibilityPreference("reduceMotion", enabled);
  toast(enabled ? "Movimento reduzido." : "Movimento restaurado.");
});

document.querySelector("#highlightButton").addEventListener("click", event => {
  const enabled = !document.body.classList.contains("highlight-links");
  document.body.classList.toggle("highlight-links", enabled);
  setAccessibilityPreference("highlightLinks", enabled);
  toast(enabled ? "Links destacados." : "Destaque de links desativado.");
});

document.querySelector("#librasButton").addEventListener("click", toggleVLibras);

document.querySelector("#searchButton").addEventListener("click", () => {
  if (!state.active.startsWith("livro-")) switchView("livro-fisico");
  document.querySelector(`#${state.active === "livro-digital" ? "livrosDigitaisSearch" : "livrosFisicosSearch"}`).focus();
});

document.querySelector("#modalSubmit").addEventListener("click", () => {
  if (state.currentModal?.type === "import") submitImport();
  else if (state.currentModal) submitRecord();
});

document.querySelector("#modalDelete").addEventListener("click", deleteRecord);

document.querySelector("#modalBackdrop").addEventListener("click", event => {
  if (event.target === event.currentTarget) closeModal();
});

document.querySelector("#statsDataset").addEventListener("change", () => renderStats());

["livro-fisico", "livro-digital", "patrimonio-material", "patrimonio-imaterial"].forEach(dataset => {
  const inputId = { "livro-fisico": "livrosFisicosSearch", "livro-digital": "livrosDigitaisSearch",
    "patrimonio-material": "materialSearch", "patrimonio-imaterial": "imaterialSearch" }[dataset];
  document.querySelector(`#${inputId}`).addEventListener("input", () => renderDataset(dataset));
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeModal();
    toggleAccessibilityPanel(false);
  }
  if (event.altKey && event.key.toLocaleLowerCase() === "n") narrateCurrentView();
  if (event.altKey && event.key.toLocaleLowerCase() === "c") {
    const enabled = !document.body.classList.contains("high-contrast");
    document.body.classList.toggle("high-contrast", enabled);
    setAccessibilityPreference("contrast", enabled);
  }
});

restoreAccessibilityPreferences();
if (localStorage.getItem("libras") === "true") {
  toggleVLibras();
}
loadData();
