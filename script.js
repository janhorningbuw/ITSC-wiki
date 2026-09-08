const DOCS_DIR = "docs";

const elements = {
  list: document.getElementById("fileList"),
  search: document.getElementById("searchInput"),
  empty: document.getElementById("emptyState"),
  error: document.getElementById("errorState"),
  count: document.getElementById("resultCount"),
  total: document.getElementById("documentCount"),
  resultsTitle: document.getElementById("resultsTitle"),
  dialog: document.getElementById("viewerDialog"),
  viewerTitle: document.getElementById("viewerTitle"),
  viewerType: document.getElementById("viewerType"),
  viewerContent: document.getElementById("viewerContent"),
  openOriginal: document.getElementById("openOriginal"),
};

let allFiles = [];
let activeType = "all";

async function loadFileList() {
  elements.list.setAttribute("aria-busy", "true");
  elements.error.classList.add("hidden");
  try {
    const response = await fetch(`${DOCS_DIR}/index.json`, { cache: "no-cache" });
    if (!response.ok) throw new Error(`Index konnte nicht geladen werden (${response.status})`);
    const files = await response.json();
    if (!Array.isArray(files)) throw new Error("Ungültiger Dokumentindex");
    allFiles = files;
    elements.total.textContent = `${files.length} ${files.length === 1 ? "Dokument" : "Dokumente"}`;
    applyFilters();
  } catch (error) {
    console.error(error);
    allFiles = [];
    elements.list.replaceChildren();
    elements.empty.classList.add("hidden");
    elements.error.classList.remove("hidden");
    elements.total.textContent = "Nicht verfügbar";
    elements.count.textContent = "";
  } finally {
    elements.list.setAttribute("aria-busy", "false");
  }
}

function renderFiles(files) {
  const fragment = document.createDocumentFragment();
  files.forEach((file) => fragment.appendChild(createFileCard(file)));
  elements.list.replaceChildren(fragment);

  const isFiltered = elements.search.value.trim() || activeType !== "all";
  elements.resultsTitle.textContent = isFiltered ? "Suchergebnisse" : "Alle Dokumente";
  elements.count.textContent = `${files.length} Treffer`;
  elements.empty.classList.toggle("hidden", files.length > 0);
}

function createFileCard(file) {
  const item = document.createElement("li");
  item.className = "file-card";

  const button = document.createElement("button");
  button.type = "button";
  button.className = "file-button";
  button.addEventListener("click", () => openFile(file));

  const top = document.createElement("span");
  top.className = "file-card-top";

  const type = String(file.type || "datei").toLowerCase();
  const icon = document.createElement("span");
  icon.className = `file-icon ${type === "pdf" ? "file-icon--pdf" : "file-icon--html"}`;
  icon.textContent = type === "pdf" ? "PDF" : "Aa";

  const arrow = document.createElement("span");
  arrow.className = "card-arrow";
  arrow.setAttribute("aria-hidden", "true");
  arrow.textContent = "↗";
  top.append(icon, arrow);

  const name = document.createElement("strong");
  name.className = "file-name";
  name.textContent = file.name || file.file || "Unbenanntes Dokument";

  const description = document.createElement("span");
  description.className = "file-description";
  description.textContent = file.description || (type === "pdf" ? "PDF-Dokument" : "HTML-Dokument");

  const meta = document.createElement("span");
  meta.className = "file-meta";
  meta.textContent = [type.toUpperCase(), formatSize(file.size), formatDate(file.date)].filter(Boolean).join(" · ");

  button.append(top, name, description, meta);
  item.appendChild(button);
  return item;
}

function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("de");
}

function applyFilters() {
  const terms = normalize(elements.search.value).trim().split(/\s+/).filter(Boolean);
  const filtered = allFiles.filter((file) => {
    const type = String(file.type || "").toLowerCase();
    const matchesType = activeType === "all" || type === activeType;
    const text = normalize([file.name, file.file, file.description, ...(file.tags || [])].join(" "));
    return matchesType && terms.every((term) => text.includes(term));
  });
  renderFiles(filtered);
}

function openFile(file) {
  const url = `${DOCS_DIR}/${encodeURIComponent(file.file)}`;
  elements.viewerTitle.textContent = file.name || file.file;
  elements.viewerType.textContent = String(file.type || "Dokument").toUpperCase();
  elements.openOriginal.href = url;

  const iframe = document.createElement("iframe");
  iframe.src = url;
  iframe.title = file.name || file.file;
  elements.viewerContent.replaceChildren(iframe);
  elements.dialog.showModal();
}

function closeViewer() {
  elements.dialog.close();
  elements.viewerContent.replaceChildren();
}

function resetSearch() {
  elements.search.value = "";
  activeType = "all";
  document.querySelectorAll(".filter").forEach((filter) => {
    const isActive = filter.dataset.type === "all";
    filter.classList.toggle("is-active", isActive);
    filter.setAttribute("aria-pressed", String(isActive));
  });
  applyFilters();
  elements.search.focus();
}

function formatSize(bytes) {
  if (!Number.isFinite(Number(bytes))) return "";
  if (bytes < 1024) return `${bytes} B`;
  const unit = bytes < 1048576 ? "KB" : "MB";
  const value = bytes < 1048576 ? bytes / 1024 : bytes / 1048576;
  return `${new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 }).format(value)} ${unit}`;
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

elements.search.addEventListener("input", applyFilters);
document.querySelectorAll(".filter").forEach((filter) => {
  filter.addEventListener("click", () => {
    activeType = filter.dataset.type;
    document.querySelectorAll(".filter").forEach((item) => {
      const isActive = item === filter;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });
    applyFilters();
  });
});
document.getElementById("resetSearch").addEventListener("click", resetSearch);
document.getElementById("retryLoad").addEventListener("click", loadFileList);
document.getElementById("closeViewer").addEventListener("click", closeViewer);
elements.dialog.addEventListener("click", (event) => {
  if (event.target === elements.dialog) closeViewer();
});
elements.dialog.addEventListener("close", () => elements.viewerContent.replaceChildren());
document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    elements.search.focus();
  }
});

loadFileList();
