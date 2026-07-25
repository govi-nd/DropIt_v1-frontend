import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle2, Download, Files } from "lucide-react";
import { useState } from "react";

export function QRDisplay({ qrUrl, batchPageUrl, fileCount, onReset }) {
  const [copied, setCopied] = useState(false);
  const targetUrl = qrUrl || batchPageUrl || "";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(targetUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <div className="w-full animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
      <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8">
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-sm font-medium text-green-600 dark:text-green-400">
          <CheckCircle2 className="h-4 w-4" />
          Ready to download
        </div>

        <div className="mb-2 flex items-center gap-2">
          <Files className="h-5 w-5 text-primary" />
          <h3 className="text-center text-xl font-semibold">
            Scan to get {fileCount} {fileCount === 1 ? "file" : "files"}
          </h3>
        </div>
        <p className="mb-6 text-sm text-muted-foreground">
          {fileCount === 1
            ? "Scan or open the link to download your file"
            : "Open the link on your phone to download all files"}
        </p>

        <div className="mb-6 overflow-hidden rounded-xl bg-white p-4 shadow-sm ring-1 ring-border/50">
          <QRCodeSVG
            value={targetUrl}
            size={200}
            level="Q"
            includeMargin={false}
            className="h-auto w-48 sm:w-56"
          />
        </div>

        <div className="w-full space-y-4">
          <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 p-1">
            <div className="flex-1 truncate px-3 py-2 text-sm text-muted-foreground font-mono">
              {targetUrl}
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={copyToClipboard}
              className="shrink-0"
            >
              {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex-1" onClick={onReset}>
              Send Another
            </Button>
            <Button className="flex-1 bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-90" asChild>
              <a href={targetUrl} target="_blank" rel="noreferrer">
                <Download className="mr-2 h-4 w-4" />
                Open Link
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
