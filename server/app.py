from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import yt_dlp
import os
import uuid

app = Flask(__name__)
CORS(app)

DOWNLOAD_FOLDER = "downloads"
os.makedirs(DOWNLOAD_FOLDER, exist_ok=True)


@app.route("/download", methods=["POST"])
def download_video():
    data = request.json
    url = data.get("url")

    if not url:
        return jsonify({"error": "URL missing"}), 400

    file_id = str(uuid.uuid4())
    output = os.path.join(DOWNLOAD_FOLDER, file_id)

    ydl_opts = {
        "outtmpl": f"{output}.%(ext)s",
        "format": "bestvideo+bestaudio/best",
        "merge_output_format": "mp4",
        "writesubtitles": True,
        "writeautomaticsub": True,
        "subtitleslangs": ["en"],
        "quiet": True,
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])

        return jsonify(
            {
                "videoUrl": f"http://127.0.0.1:5000/video/{file_id}.mp4",
                "subtitleUrl": f"http://127.0.0.1:5000/video/{file_id}.en.vtt",
            }
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# @app.route("/video/<filename>")
# def serve_video(filename):
#     return send_from_directory(DOWNLOAD_FOLDER, filename)


@app.route("/video/<filename>")
def serve_video(filename):
    response = send_from_directory(DOWNLOAD_FOLDER, filename)

    if filename.endswith(".vtt"):
        response.headers["Content-Type"] = "text/vtt"

    return response


if __name__ == "__main__":
    app.run(debug=True)
