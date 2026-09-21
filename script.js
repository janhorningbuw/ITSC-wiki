const DOCS_DIR = "docs";

const elements = {
  list: document.getElementById("fileList"),
  search: document.getElementById("searchInput"),
  empty: document.getElementById("emptyState"),
  error: document.getElementById("errorState"),
  count: document.getElementById("resultCount"),
  total: document.getElementById("documentCount"),
  resultsTitle: document.getElementById("resultsTitle"),
  breadcrumbs: document.getElementById("breadcrumbs"),
  dialog: document.getElementById("viewerDialog"),
  viewerTitle: document.getElementById("viewerTitle"),
  viewerType: document.getElementById("viewerType"),
  viewerContent: document.getElementById("viewerContent"),
  openOriginal: document.getElementById("openOriginal"),
};

let allFiles = [];
let activeType = "all";
let currentFolder = "";

async function loadFileList() {
  elements.list.setAttribute("aria-busy", "true");
  elements.error.classList.add("hidden");

  try {
    const response = await fetch(`${DOCS_DIR}/index.json`, { cache: "no-cache" });
    if (!response.ok) throw new Error(`Index konnte nicht geladen werden (${response.status})`);

    const files = await response.json();
    if (!Array.isArray(files)) throw new Error("Ungültiger Dokumentindex");

    allFiles = files.map(prepareFile);
    const folderCount = countFolders(allFiles);
    elements.total.textContent = `${allFiles.length} ${allFiles.length === 1 ? "Dokument" : "Dokumente"}${folderCount ? ` · ${folderCount} ${folderCount === 1 ? "Ordner" : "Ordner"}` : ""}`;
    renderLibrary();
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

function prepareFile(file) {
  const path = String(file.file || "").replaceAll("\\", "/").replace(/^\/+|\/+$/g, "");
  const pathParts = path.split("/").filter(Boolean);
  const derivedFolder = pathParts.slice(0, -1).join("/");
  const folder = String(file.folder ?? derivedFolder).replaceAll("\\", "/").replace(/^\/+|\/+$/g, "");
  const rawType = String(file.type || pathParts.at(-1)?.split(".").pop() || "").toLowerCase();
  const type = ["md", "markdown", "mdown"].includes(rawType) ? "markdown" : rawType;
  return { ...file, file: path, folder, type };
}

function renderLibrary() {
  const terms = normalize(elements.search.value).trim().split(/\s+/).filter(Boolean);
  const isSearching = terms.length > 0;
  const matchingFiles = allFiles.filter((file) => matchesFile(file, terms));
  const fragment = document.createDocumentFragment();
  let itemCount = 0;

  if (isSearching) {
    matchingFiles.forEach((file) => fragment.appendChild(createFileCard(file, true)));
    itemCount = matchingFiles.length;
    elements.resultsTitle.textContent = "Suchergebnisse";
    elements.breadcrumbs.classList.add("hidden");
  } else {
    const folders = getChildFolders(matchingFiles, currentFolder);
    const files = matchingFiles.filter((file) => file.folder === currentFolder);
    folders.forEach((folder) => fragment.appendChild(createFolderCard(folder)));
    files.forEach((file) => fragment.appendChild(createFileCard(file, false)));
    itemCount = folders.length + files.length;
    elements.resultsTitle.textContent = currentFolder ? getFolderName(currentFolder) : "Alle Dokumente";
    renderBreadcrumbs();
  }

  elements.list.replaceChildren(fragment);
  elements.count.textContent = `${itemCount} ${itemCount === 1 ? "Eintrag" : "Einträge"}`;
  elements.empty.classList.toggle("hidden", itemCount > 0);
}

function matchesFile(file, terms) {
  const type = String(file.type || "").toLowerCase();
  const matchesType = activeType === "all" || type === activeType;
  const text = normalize([file.name, file.file, file.folder, file.description, ...(file.tags || [])].join(" "));
  return matchesType && terms.every((term) => text.includes(term));
}

function getChildFolders(files, parentFolder) {
  const prefix = parentFolder ? `${parentFolder}/` : "";
  const folders = new Map();

  files.forEach((file) => {
    if (!file.folder.startsWith(prefix) || file.folder === parentFolder) return;
    const remainder = file.folder.slice(prefix.length);
    const childName = remainder.split("/")[0];
    if (!childName) return;

    const path = `${prefix}${childName}`;
    const existing = folders.get(path) || { name: childName, path, count: 0 };
    existing.count += 1;
    folders.set(path, existing);
  });

  return [...folders.values()].sort((a, b) => a.name.localeCompare(b.name, "de"));
}

function countFolders(files) {
  const folders = new Set();
  files.forEach((file) => {
    let path = "";
    file.folder.split("/").filter(Boolean).forEach((part) => {
      path = path ? `${path}/${part}` : part;
      folders.add(path);
    });
  });
  return folders.size;
}

function createFolderCard(folder) {
  const item = document.createElement("li");
  item.className = "file-card folder-card";

  const button = createCardButton(() => openFolder(folder.path));
  const top = createCardTop("folder", "📁");
  const name = createTextElement("strong", "file-name", folder.name);
  const description = createTextElement("span", "file-description", `${folder.count} ${folder.count === 1 ? "Dokument" : "Dokumente"}`);
  const meta = createTextElement("span", "file-meta", "ORDNER");
  button.append(top, name, description, meta);
  item.appendChild(button);
  return item;
}

function createFileCard(file, showFolder) {
  const item = document.createElement("li");
  item.className = "file-card";

  const type = String(file.type || "datei").toLowerCase();
  const button = createCardButton(() => openFile(file));
  const iconKind = type === "pdf" ? "pdf" : type === "markdown" ? "markdown" : "html";
  const iconLabel = type === "pdf" ? "PDF" : type === "markdown" ? "MD" : "Aa";
  const top = createCardTop(iconKind, iconLabel);
  const name = createTextElement("strong", "file-name", file.name || getFileName(file.file) || "Unbenanntes Dokument");
  const fallbackDescription = type === "pdf" ? "PDF-Dokument" : type === "markdown" ? "Markdown-Dokument" : "HTML-Dokument";
  const description = createTextElement("span", "file-description", file.description || fallbackDescription);

  const metadata = [type.toUpperCase(), formatSize(file.size), formatDate(file.date)];
  if (showFolder && file.folder) metadata.push(`in ${file.folder}`);
  const meta = createTextElement("span", "file-meta", metadata.filter(Boolean).join(" · "));

  button.append(top, name, description, meta);
  item.appendChild(button);
  return item;
}

function createCardButton(onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "file-button";
  button.addEventListener("click", onClick);
  return button;
}

function createCardTop(kind, label) {
  const top = document.createElement("span");
  top.className = "file-card-top";

  const icon = createTextElement("span", `file-icon file-icon--${kind}`, label);
  const arrow = createTextElement("span", "card-arrow", kind === "folder" ? "→" : "↗");
  arrow.setAttribute("aria-hidden", "true");
  top.append(icon, arrow);
  return top;
}

function createTextElement(tag, className, text) {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = text;
  return element;
}

function openFolder(path) {
  currentFolder = path;
  renderLibrary();
  document.querySelector(".library").scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderBreadcrumbs() {
  elements.breadcrumbs.classList.remove("hidden");
  const fragment = document.createDocumentFragment();
  fragment.appendChild(createBreadcrumb("Alle Dokumente", "", currentFolder === ""));

  let path = "";
  currentFolder.split("/").filter(Boolean).forEach((part) => {
    const separator = createTextElement("span", "breadcrumb-separator", "/");
    separator.setAttribute("aria-hidden", "true");
    fragment.appendChild(separator);
    path = path ? `${path}/${part}` : part;
    fragment.appendChild(createBreadcrumb(part, path, path === currentFolder));
  });

  elements.breadcrumbs.replaceChildren(fragment);
}

function createBreadcrumb(label, path, isCurrent) {
  if (isCurrent) {
    const current = createTextElement("span", "breadcrumb-current", label);
    current.setAttribute("aria-current", "page");
    return current;
  }

  const button = createTextElement("button", "breadcrumb-button", label);
  button.type = "button";
  button.addEventListener("click", () => openFolder(path));
  return button;
}

async function openFile(file) {
  const url = `${DOCS_DIR}/${encodePath(file.file)}`;
  elements.viewerTitle.textContent = file.name || getFileName(file.file);
  elements.viewerType.textContent = String(file.type || "Dokument").toUpperCase();
  elements.openOriginal.href = url;
  elements.viewerContent.classList.toggle("markdown-viewer", file.type === "markdown");

  if (!elements.dialog.open) elements.dialog.showModal();

  if (file.type === "markdown") {
    const loading = createTextElement("p", "viewer-message", "Markdown wird geladen …");
    elements.viewerContent.replaceChildren(loading);

    try {
      const response = await fetch(url, { cache: "no-cache" });
      if (!response.ok) throw new Error(`Markdown konnte nicht geladen werden (${response.status})`);
      elements.viewerContent.replaceChildren(renderMarkdown(await response.text(), url));
    } catch (error) {
      console.error(error);
      const message = createTextElement("p", "viewer-message viewer-message--error", "Die Markdown-Datei konnte nicht angezeigt werden. Öffne sie stattdessen in einem neuen Tab.");
      elements.viewerContent.replaceChildren(message);
    }
    return;
  }

  const iframe = document.createElement("iframe");
  iframe.src = url;
  iframe.title = file.name || getFileName(file.file);
  elements.viewerContent.replaceChildren(iframe);
}

function closeViewer() {
  elements.dialog.close();
  elements.viewerContent.replaceChildren();
  elements.viewerContent.classList.remove("markdown-viewer");
}

function resetSearch() {
  elements.search.value = "";
  activeType = "all";
  document.querySelectorAll(".filter").forEach((filter) => {
    const isActive = filter.dataset.type === "all";
    filter.classList.toggle("is-active", isActive);
    filter.setAttribute("aria-pressed", String(isActive));
  });
  renderLibrary();
  elements.search.focus();
}

function renderMarkdown(source, documentUrl) {
  const article = document.createElement("article");
  article.className = "markdown-document";
  const lines = source.replace(/\r\n?/g, "\n").split("\n");
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) {
      index += 1;
      continue;
    }

    const fence = line.match(/^\s*```([^\s`]*)\s*$/);
    if (fence) {
      const codeLines = [];
      index += 1;
      while (index < lines.length && !/^\s*```/.test(lines[index])) {
        codeLines.push(lines[index]);
        index += 1;
      }
      index += index < lines.length ? 1 : 0;
      const pre = document.createElement("pre");
      const code = document.createElement("code");
      if (fence[1]) code.dataset.language = fence[1];
      code.textContent = codeLines.join("\n");
      pre.appendChild(code);
      article.appendChild(pre);
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      const element = document.createElement(`h${heading[1].length}`);
      element.appendChild(renderInlineMarkdown(heading[2], documentUrl));
      article.appendChild(element);
      index += 1;
      continue;
    }

    if (/^\s*(?:---+|___+|\*\*\*+)\s*$/.test(line)) {
      article.appendChild(document.createElement("hr"));
      index += 1;
      continue;
    }

    if (/^\s*>/.test(line)) {
      const quoteLines = [];
      while (index < lines.length && /^\s*>/.test(lines[index])) {
        quoteLines.push(lines[index].replace(/^\s*>\s?/, ""));
        index += 1;
      }
      const quote = document.createElement("blockquote");
      quote.appendChild(renderInlineMarkdown(quoteLines.join(" "), documentUrl));
      article.appendChild(quote);
      continue;
    }

    const listMatch = line.match(/^\s*(?:([-+*])|(\d+)\.)\s+(.+)$/);
    if (listMatch) {
      const ordered = Boolean(listMatch[2]);
      const list = document.createElement(ordered ? "ol" : "ul");
      while (index < lines.length) {
        const itemMatch = lines[index].match(/^\s*(?:([-+*])|(\d+)\.)\s+(.+)$/);
        if (!itemMatch || Boolean(itemMatch[2]) !== ordered) break;
        const item = document.createElement("li");
        item.appendChild(renderInlineMarkdown(itemMatch[3], documentUrl));
        list.appendChild(item);
        index += 1;
      }
      article.appendChild(list);
      continue;
    }

    if (index + 1 < lines.length && isTableDivider(lines[index + 1])) {
      const table = document.createElement("table");
      const head = document.createElement("thead");
      const headRow = document.createElement("tr");
      splitTableRow(line).forEach((cell) => {
        const th = document.createElement("th");
        th.appendChild(renderInlineMarkdown(cell, documentUrl));
        headRow.appendChild(th);
      });
      head.appendChild(headRow);
      table.appendChild(head);
      index += 2;

      const body = document.createElement("tbody");
      while (index < lines.length && lines[index].includes("|") && lines[index].trim()) {
        const row = document.createElement("tr");
        splitTableRow(lines[index]).forEach((cell) => {
          const td = document.createElement("td");
          td.appendChild(renderInlineMarkdown(cell, documentUrl));
          row.appendChild(td);
        });
        body.appendChild(row);
        index += 1;
      }
      table.appendChild(body);
      article.appendChild(table);
      continue;
    }

    const paragraphLines = [line.trim()];
    index += 1;
    while (index < lines.length && lines[index].trim() && !isMarkdownBlockStart(lines, index)) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }
    const paragraph = document.createElement("p");
    paragraph.appendChild(renderInlineMarkdown(paragraphLines.join(" "), documentUrl));
    article.appendChild(paragraph);
  }

  return article;
}

function isMarkdownBlockStart(lines, index) {
  const line = lines[index];
  return /^\s*```/.test(line)
    || /^(#{1,6})\s+/.test(line)
    || /^\s*>/.test(line)
    || /^\s*(?:[-+*]|\d+\.)\s+/.test(line)
    || /^\s*(?:---+|___+|\*\*\*+)\s*$/.test(line)
    || (index + 1 < lines.length && isTableDivider(lines[index + 1]));
}

function isTableDivider(line) {
  const cells = splitTableRow(line);
  return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

function splitTableRow(line) {
  return line.trim().replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim());
}

function renderInlineMarkdown(text, documentUrl) {
  const fragment = document.createDocumentFragment();
  const pattern = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)|\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)|`([^`]+)`|\*\*([^*]+)\*\*|__([^_]+)__|\*([^*]+)\*|_([^_]+)_/g;
  let cursor = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    fragment.appendChild(document.createTextNode(text.slice(cursor, match.index)));

    if (match[1] !== undefined) {
      const source = resolveSafeUrl(match[2], documentUrl);
      if (source) {
        const image = document.createElement("img");
        image.src = source;
        image.alt = match[1];
        image.loading = "lazy";
        fragment.appendChild(image);
      } else {
        fragment.appendChild(document.createTextNode(match[0]));
      }
    } else if (match[3] !== undefined) {
      const href = resolveSafeUrl(match[4], documentUrl);
      if (href) {
        const link = createTextElement("a", "", match[3]);
        link.href = href;
        link.target = "_blank";
        link.rel = "noopener";
        fragment.appendChild(link);
      } else {
        fragment.appendChild(document.createTextNode(match[3]));
      }
    } else if (match[5] !== undefined) {
      fragment.appendChild(createTextElement("code", "", match[5]));
    } else if (match[6] !== undefined || match[7] !== undefined) {
      fragment.appendChild(createTextElement("strong", "", match[6] ?? match[7]));
    } else {
      fragment.appendChild(createTextElement("em", "", match[8] ?? match[9]));
    }
    cursor = pattern.lastIndex;
  }

  fragment.appendChild(document.createTextNode(text.slice(cursor)));
  return fragment;
}

function resolveSafeUrl(value, documentUrl) {
  if (value.startsWith("#")) return value;
  try {
    const base = new URL(documentUrl, document.baseURI);
    const url = new URL(value, base);
    return ["http:", "https:", "file:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function normalize(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("de");
}

function encodePath(path) {
  return path.split("/").map((part) => encodeURIComponent(part)).join("/");
}

function getFileName(path) {
  return path.split("/").pop() || path;
}

function getFolderName(path) {
  return path.split("/").pop() || "Alle Dokumente";
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

elements.search.addEventListener("input", renderLibrary);
document.querySelectorAll(".filter").forEach((filter) => {
  filter.addEventListener("click", () => {
    activeType = filter.dataset.type;
    document.querySelectorAll(".filter").forEach((item) => {
      const isActive = item === filter;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });
    renderLibrary();
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
