import { Routes, Route } from "react-router";
import { useState } from "react";
import axios from "axios";
import { Navbar } from "@/components/Navbar";
import { FileUpload } from "@/components/FileUpload";
import { UploadProgress } from "@/components/UploadProgress";
import { QRDisplay } from "@/components/QRDisplay";
import { DownloadPage } from "@/pages/DownloadPage";

const BACKEND_URL = process.env.BACKEND_URL
function Index() {
  const [files, setFiles] = useState([]);
  const [stage, setStage] = useState("idle");
  const [progress, setProgress] = useState(0);
  const [batchId, setBatchId] = useState("");
  const [fileCount, setFileCount] = useState(0);
  const [qrUrl, setQrUrl] = useState("");

  const handleFileUpload = async () => {
    if (!files || files.length === 0) return;

    setStage("uploading");
    setProgress(0);

    const isSingleFile = files.length === 1;
    const endpoint = isSingleFile ? `${BACKEND_URL}/upload` : `${BACKEND_URL}/upload-batch`;

    const formData = new FormData();
    if (isSingleFile) {
      formData.append("file", files[0]);
    } else {
      files.forEach((file) => formData.append("files", file));
    }

    try {
      const response = await axios.post(endpoint, formData, {
        onUploadProgress: (progressEvent) => {
          const totalSize = files.reduce((acc, f) => acc + f.size, 0);
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || totalSize)
          );
          setProgress(percentCompleted);
        },
      });

      if (response.data.success) {
        setBatchId(response.data.batchId);
        setFileCount(response.data.fileCount || files.length);
        if (isSingleFile && response.data.downloadUrl) {
          setQrUrl(response.data.downloadUrl);
        } else {
          setQrUrl(`${window.location.origin}/d/${response.data.batchId}`);
        }
        setStage("done");
      } else {
        throw new Error(response.data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload Error:", error);
      const message = error.response?.data?.message || error.message || "Upload failed";
      alert(message);
      setStage("idle");
      setProgress(0);
    }
  };

  const reset = () => {
    setFiles([]);
    setStage("idle");
    setProgress(0);
    setBatchId("");
    setFileCount(0);
    setQrUrl("");
  };

  const batchPageUrl = qrUrl || (batchId ? `${window.location.origin}/d/${batchId}` : "");

  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[500px] bg-gradient-soft" />
      <Navbar />

      <main className="relative mx-auto flex max-w-xl flex-col items-center px-4 py-12 sm:py-20">
        <div className="mb-10 text-center animate-fade-in-up">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            No login. No signup. Just drop.
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Send any file to your phone
          </h1>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
            Upload from a public PC, scan the QR — done.
          </p>
        </div>

        {stage === "idle" && (
          <FileUpload files={files} onFiles={setFiles} onUpload={handleFileUpload} />
        )}
        {stage === "uploading" && (
          <UploadProgress progress={progress} fileCount={files.length} />
        )}
        {stage === "done" && (
          <QRDisplay
            qrUrl={qrUrl}
            batchPageUrl={batchPageUrl}
            fileCount={fileCount}
            onReset={reset}
          />
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/d/:batchId" element={<DownloadPage />} />
    </Routes>
  );
}

export default App;
