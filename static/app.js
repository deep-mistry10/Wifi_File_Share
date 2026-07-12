const input = document.getElementById('files');
const list = document.getElementById('list');
const msg = document.getElementById('msg');
const drop = document.getElementById('drop');
const selectAllBox = document.getElementById('selectAll');
const previewModal = document.getElementById('previewModal');
const previewTitle = document.getElementById('previewTitle');
const previewBody = document.getElementById('previewBody');

async function refreshList() {
  const res = await fetch('/api/files');
  const data = await res.json();

  list.innerHTML = '';
  selectAllBox.checked = false;

  if (!data.files.length) {
    list.innerHTML = '<li><span class="muted">No files yet.</span></li>';
    return;
  }

  data.files.forEach(file => {
    const li = document.createElement('li');

    const left = document.createElement('div');
    left.className = 'file-left';
    left.innerHTML = `
      <label class="file-check">
        <input type="checkbox" class="file-select" value="${escapeHtml(file.stored_name)}">
        <span class="name">${escapeHtml(file.original_name)}</span>
      </label>
      <div class="small">${file.size_human} • ${file.time_human}</div>
    `;

    const right = document.createElement('div');
    right.className = 'row';
    right.innerHTML = `
      <button class="secondary" onclick="openPreview('${file.stored_name.replace(/'/g, "\\'")}', '${file.original_name.replace(/'/g, "\\'")}')">Preview</button>
      <a class="btn" href="/download/${encodeURIComponent(file.stored_name)}">Download</a>
      <button class="danger" onclick="deleteSingle('${file.stored_name.replace(/'/g, "\\'")}')">Delete</button>
    `;

    li.appendChild(left);
    li.appendChild(right);
    list.appendChild(li);
  });
}

async function uploadFiles(filesArg) {
  const filesToSend = filesArg || input.files;
  if (!filesToSend || !filesToSend.length) {
    msg.textContent = 'Choose one or more files first.';
    msg.style.color = '#b45309';
    return;
  }

  const form = new FormData();

  for (const f of filesToSend) {
    form.append('files', f, f.name);
  }

  msg.textContent = 'Uploading...';
  msg.style.color = '#065f46';

  const res = await fetch('/upload', { method: 'POST', body: form });
  const data = await res.json();

  if (data.ok) {
    msg.textContent = 'Upload complete.';
    input.value = '';
    await refreshList();
  } else {
    msg.textContent = data.error || 'Upload failed.';
    msg.style.color = '#dc2626';
  }
}

async function deleteSingle(name) {
  if (!confirm('Delete this file?')) return;
  const res = await fetch('/delete/' + encodeURIComponent(name), { method: 'DELETE' });
  const data = await res.json();
  if (data.ok) {
    await refreshList();
  } else {
    alert(data.error || 'Delete failed');
  }
}

async function deleteSelected() {
  const selected = Array.from(document.querySelectorAll('.file-select:checked'))
    .map(cb => cb.value);

  if (!selected.length) {
    alert('Select one or more files first.');
    return;
  }

  if (!confirm(`Delete ${selected.length} selected file(s)?`)) return;

  const res = await fetch('/delete-selected', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ files: selected })
  });

  const data = await res.json();
  if (data.ok) {
    await refreshList();
  } else {
    alert(data.error || 'Delete selected failed');
  }
}

async function deleteAllFiles() {
  if (!confirm('Delete ALL files and folders in shared_files?')) return;

  const res = await fetch('/delete-all', {
    method: 'DELETE'
  });

  const data = await res.json();
  if (data.ok) {
    await refreshList();
  } else {
    alert(data.error || 'Delete all failed');
  }
}

function toggleSelectAll(box) {
  document.querySelectorAll('.file-select').forEach(cb => {
    cb.checked = box.checked;
  });
}

drop.addEventListener('dragover', e => {
  e.preventDefault();
  drop.classList.add('drag');
});
drop.addEventListener('dragleave', () => drop.classList.remove('drag'));
drop.addEventListener('drop', e => {
  e.preventDefault();
  drop.classList.remove('drag');
  uploadFiles(e.dataTransfer.files);
});

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function getFileExt(name) {
  return name.split('.').pop().toLowerCase();
}

function openPreview(storedName, originalName) {
  const ext = getFileExt(originalName);
  const url = `/preview/${encodeURIComponent(storedName)}`;

  previewTitle.textContent = originalName;
  previewBody.innerHTML = '';

  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg'].includes(ext)) {
    previewBody.innerHTML = `<img src="${url}" alt="${originalName}" class="preview-media">`;
  } else if (['mp4', 'webm', 'ogg', 'mov', 'm4v'].includes(ext)) {
    previewBody.innerHTML = `
      <video controls class="preview-media">
        <source src="${url}">
        Your browser does not support video preview.
      </video>
    `;
  } else if (['mp3', 'wav', 'm4a', 'aac', 'flac'].includes(ext)) {
    previewBody.innerHTML = `
      <audio controls class="preview-audio">
        <source src="${url}">
        Your browser does not support audio preview.
      </audio>
    `;
  } else if (['pdf'].includes(ext)) {
    previewBody.innerHTML = `<iframe src="${url}" class="preview-frame"></iframe>`;
  } else if (['txt', 'md', 'json', 'csv', 'log', 'html', 'js', 'css', 'py'].includes(ext)) {
    fetch(url)
      .then(r => r.text())
      .then(text => {
        previewBody.innerHTML = `<pre class="preview-text"></pre>`;
        previewBody.querySelector('pre').textContent = text;
      })
      .catch(() => {
        previewBody.innerHTML = `<div class="preview-error">Could not load preview.</div>`;
      });
  } else {
    previewBody.innerHTML = `
      <div class="preview-error">
        No preview available for this file type.
      </div>
      <a class="btn" href="${url}" target="_blank">Open File</a>
    `;
  }

  previewModal.classList.remove('hidden');
}

function closePreview(event) {
  if (event && event.target !== previewModal) return;
  previewModal.classList.add('hidden');
  previewBody.innerHTML = '';
}

refreshList();
