const DOCS_DIR = "docs";

const fileListEl = document.getElementById("fileList");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const noResults = document.getElementById("noResults");
const viewerSection = document.getElementById("viewerSection");
const viewerTitle = document.getElementById("viewerTitle");
const viewerContent = document.getElementById("viewerContent");
const closeViewer = document.getElementById("closeViewer");

let allFiles = [];

async function loadFileList() {
  try {
    const response = await fetch(`${DOCS_DIR}/index.json`);
    if (!response.ok) throw new Error("index.json nicht gefunden");
    allFiles = await response.json();
  } catch {
    allFiles = [];
  }
  renderFiles(allFiles);
}

function renderFiles(files) {
  fileListEl.innerHTML = "";
  noResults.classList.toggle("hidden", files.length > 0);

  files.forEach((file) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "#";
    a.addEventListener("click", (e) => {
      e.preventDefault();
      openFile(file);
    });

    const icon = file.type === "pdf" ? "📄" : "📝";
    const size = file.size ? formatSize(file.size) : "";
    const date = file.date || "";

    a.innerHTML = `
      <span class="file-icon">${icon}</span>
      <span class="file-info">
        <span class="file-name">${escapeHtml(file.name)}</span>
        <span class="file-meta">${file.type.toUpperCase()} ${size ? "· " + size : ""} ${date ? "· " + date : ""}</span>
      </span>
    `;
    li.appendChild(a);
    fileListEl.appendChild(li);
  });
}

function openFile(file) {
  viewerSection.classList.remove("hidden");
  viewerTitle.textContent = file.name;
  viewerContent.innerHTML = "";

  const iframe = document.createElement("iframe");
  iframe.src = `${DOCS_DIR}/${file.file}`;
  viewerContent.appendChild(iframe);

  viewerSection.scrollIntoView({ behavior: "smooth" });
}

function filterFiles(query) {
  if (!query.trim()) {
    renderFiles(allFiles);
    return;
  }
  const q = query.toLowerCase();
  const filtered = allFiles.filter(
    (f) =>
      f.name.toLowerCase().includes(q) ||
      (f.tags && f.tags.some((t) => t.toLowerCase().includes(q))) ||
      (f.description && f.description.toLowerCase().includes(q))
  );
  renderFiles(filtered);
}

searchBtn.addEventListener("click", () => filterFiles(searchInput.value));
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") filterFiles(searchInput.value);
});
searchInput.addEventListener("input", () => filterFiles(searchInput.value));

closeViewer.addEventListener("click", () => {
  viewerSection.classList.add("hidden");
  viewerContent.innerHTML = "";
});

function formatSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

loadFileList();
