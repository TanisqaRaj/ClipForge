import { useState } from "react";
function App() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("");
  const [video, setVideo] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const downloadVideo = async () => {
    setStatus("Downloading...");
    setVideo("");

    const res = await fetch("http://127.0.0.1:5000/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    const data = await res.json();

    if (data.videoUrl) {
      setVideo(data.videoUrl);
      setSubtitle(data.subtitleUrl);
      setStatus("Download complete ✅");
    } else {
      setStatus("Error ❌");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold mb-6">YouTube Downloader</h1>

      <div className="flex w-full max-w-xl gap-2">
        <input
          className="flex-1 px-4 py-2 rounded text-black"
          placeholder="Paste YouTube link..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <button
          onClick={downloadVideo}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          Download
        </button>
      </div>

      {status && <p className="mt-4 text-lg">{status}</p>}

      {video && (
        <video controls className="mt-6 w-full max-w-3xl rounded">
          <source src={video} type="video/mp4" />

          {subtitle && (
            <track
              src={subtitle}
              kind="subtitles"
              srcLang="en"
              label="English"
              default
            />
          )}
        </video>
      )}
    </div>
  );
}

export default App;
