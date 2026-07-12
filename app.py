from flask import Flask, request, send_from_directory, jsonify, render_template, abort
from werkzeug.utils import secure_filename
from pathlib import Path
from datetime import datetime

app = Flask(__name__)

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "shared_files"
UPLOAD_DIR.mkdir(exist_ok=True)

app.config["MAX_CONTENT_LENGTH"] = 1024 * 1024 * 1024


def size_human(num: int) -> str:
    for unit in ["B", "KB", "MB", "GB", "TB"]:
        if num < 1024:
            return f"{num:.0f} {unit}"
        num /= 1024
    return f"{num:.1f} PB"


def safe_relative_path(name: str) -> Path:
    parts = []
    for part in Path(name).parts:
        if part in ("", ".", ".."):
            continue
        clean = secure_filename(part)
        if clean:
            parts.append(clean)
    return Path(*parts)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/files")
def api_files():
    files = []
    for p in sorted(UPLOAD_DIR.rglob("*"), key=lambda x: x.stat().st_mtime, reverse=True):
        if p.is_file():
            rel = p.relative_to(UPLOAD_DIR).as_posix()
            stat = p.stat()
            files.append({
                "stored_name": rel,
                "original_name": rel,
                "size": stat.st_size,
                "size_human": size_human(stat.st_size),
                "time_human": datetime.fromtimestamp(stat.st_mtime).strftime("%Y-%m-%d %H:%M"),
            })
    return jsonify({"files": files})


@app.route("/upload", methods=["POST"])
def upload():
    files = request.files.getlist("files")
    if not files:
        return jsonify({"ok": False, "error": "No files uploaded"}), 400

    saved = 0
    for f in files:
        if not f.filename:
            continue

        rel_path = safe_relative_path(f.filename)
        if not rel_path.parts:
            continue

        stored_path = UPLOAD_DIR / rel_path
        stored_path.parent.mkdir(parents=True, exist_ok=True)
        f.save(stored_path)
        saved += 1

    if saved == 0:
        return jsonify({"ok": False, "error": "No valid files"}), 400

    return jsonify({"ok": True, "saved": saved})


@app.route("/download/<path:filename>")
def download(filename):
    file_path = UPLOAD_DIR / filename
    if not file_path.exists() or not file_path.is_file():
        abort(404)

    return send_from_directory(
        UPLOAD_DIR,
        filename,
        as_attachment=True,
        download_name=Path(filename).name
    )


@app.route("/preview/<path:filename>")
def preview(filename):
    file_path = UPLOAD_DIR / filename
    if not file_path.exists() or not file_path.is_file():
        abort(404)

    return send_from_directory(UPLOAD_DIR, filename, as_attachment=False)


@app.route("/delete/<path:filename>", methods=["DELETE"])
def delete(filename):
    file_path = UPLOAD_DIR / filename
    if not file_path.exists() or not file_path.is_file():
        return jsonify({"ok": False, "error": "File not found"}), 404

    file_path.unlink()
    return jsonify({"ok": True})


@app.route("/delete-selected", methods=["POST"])
def delete_selected():
    data = request.get_json(silent=True) or {}
    files = data.get("files", [])

    if not isinstance(files, list) or not files:
        return jsonify({"ok": False, "error": "No files selected"}), 400

    deleted = 0
    for filename in files:
        file_path = UPLOAD_DIR / filename
        if file_path.exists() and file_path.is_file():
            file_path.unlink()
            deleted += 1

    return jsonify({"ok": True, "deleted": deleted})


@app.route("/delete-all", methods=["DELETE"])
def delete_all():
    deleted = 0

    for p in sorted(UPLOAD_DIR.rglob("*"), key=lambda x: len(x.parts), reverse=True):
        if p.is_file():
            p.unlink()
            deleted += 1

    for p in sorted(UPLOAD_DIR.rglob("*"), key=lambda x: len(x.parts), reverse=True):
        if p.is_dir():
            try:
                p.rmdir()
            except OSError:
                pass

    return jsonify({"ok": True, "deleted": deleted})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)