import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { Download, FileIcon, ArrowLeft, AlertCircle, Loader2, PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function getFileIcon(mimeType) {
  if (!mimeType) return "📄";
  if (mimeType.startsWith("image/")) return "🖼️";
  if (mimeType.startsWith("video/")) return "🎬";
  if (mimeType.startsWith("audio/")) return "🎵";
  if (mimeType.includes("pdf")) return "📕";
  if (mimeType.includes("zip") || mimeType.includes("tar") || mimeType.includes("compressed")) return "📦";
  if (mimeType.includes("word") || mimeType.includes("document")) return "📝";
  if (mimeType.includes("sheet") || mimeType.includes("excel")) return "📊";
  if (mimeType.includes("presentation") || mimeType.includes("powerpoint")) return "📑";
  if (mimeType.includes("text")) return "📃";
  return "📄";
}

export function DownloadPage() {
  const { batchId } = useParams();
  const [state, setState] = useState("loading"); // loading | ready | error
  const [files, setFiles] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [downloading, setDownloading] = useState({});

  useEffect(() => {
    if (!batchId) return;

    fetch(`${BACKEND_URL}/batch/${batchId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.files.length > 0) {
          setFiles(data.files);
          setState("ready");
        } else {
          setErrorMsg(data.message || "Files not found.");
          setState("error");
        }
      })
      .catch(() => {
        setErrorMsg("Could not reach the server. Please check your connection.");
        setState("error");
      });
  }, [batchId]);

  const handleDownload = (file) => {
    setDownloading((prev) => ({ ...prev, [file.id]: true }));
    // Reset after a moment
    setTimeout(() => {
      setDownloading((prev) => ({ ...prev, [file.id]: false }));
    }, 2000);
  };

  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[500px] bg-gradient-soft" />
      <Navbar />

      <main className="relative mx-auto flex max-w-xl flex-col items-center px-4 py-12 sm:py-20">
        {/* Loading state */}
        {state === "loading" && (
          <div className="flex w-full flex-col items-center gap-4 animate-fade-in-up">
            <div className="rounded-full bg-primary/10 p-5 text-primary">
              <Loader2 className="h-10 w-10 animate-spin" />
            </div>
            <p className="text-lg font-medium text-muted-foreground">Fetching your files...</p>
          </div>
        )}

        {/* Error state */}
        {state === "error" && (
          <div className="flex w-full flex-col items-center gap-6 animate-fade-in-up">
            <div className="rounded-full bg-destructive/10 p-5 text-destructive">
              <AlertCircle className="h-10 w-10" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold">Files Unavailable</h2>
              <p className="mt-2 text-sm text-muted-foreground">{errorMsg}</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Link>
            </Button>
          </div>
        )}

        {/* Ready state */}
        {state === "ready" && (
          <div className="w-full animate-fade-in-up">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-4 text-primary">
                <PackageOpen className="h-9 w-9" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {files.length} {files.length === 1 ? "File" : "Files"} Ready
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Tap a file below to download it to your device
              </p>
            </div>

            {/* File list */}
            <div className="rounded-2xl border border-border bg-card p-4 shadow-soft sm:p-6">
              <div className="space-y-3">
                {files.map((file, idx) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-4 rounded-xl border border-border/50 bg-muted/30 p-4 transition-colors hover:bg-muted/60"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    {/* File emoji icon */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-background text-2xl shadow-sm ring-1 ring-border/50">
                      {getFileIcon(file.mimeType)}
                    </div>

                    {/* File info */}
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium leading-tight">{file.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                    </div>

                    {/* Download button */}
                    <Button
                      asChild
                      size="sm"
                      className="shrink-0 bg-primary/10 text-primary shadow-none hover:bg-primary/20"
                      variant="ghost"
                      onClick={() => handleDownload(file)}
                    >
                      <a href={file.downloadUrl} download={file.name} rel="noreferrer">
                        {downloading[file.id] ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                        <span className="ml-2 hidden sm:inline">Download</span>
                      </a>
                    </Button>
                  </div>
                ))}
              </div>

              {/* Download all hint */}
              {files.length > 1 && (
                <p className="mt-5 text-center text-xs text-muted-foreground">
                  Tap each file to download individually
                </p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
