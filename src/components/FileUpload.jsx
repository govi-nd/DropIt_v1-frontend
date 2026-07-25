import { UploadCloud, File as FileIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FileUpload({ files, onFiles, onUpload }) {
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFiles([...(files || []), ...Array.from(e.dataTransfer.files)]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFiles([...(files || []), ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index) => {
    onFiles((files || []).filter((_, i) => i !== index));
  };

  return (
    <div className="w-full animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8">
        {(!files || files.length === 0) ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/60 bg-muted/30 px-6 py-12 transition-colors hover:border-primary/50 hover:bg-muted/50"
          >
            <input
              type="file"
              multiple
              className="absolute inset-0 cursor-pointer opacity-0"
              onChange={handleFileChange}
            />
            <div className="mb-4 rounded-full bg-background p-4 shadow-sm ring-1 ring-border transition-transform group-hover:scale-105">
              <UploadCloud className="h-8 w-8 text-primary" strokeWidth={1.5} />
            </div>
            <h3 className="mb-1 text-lg font-semibold">Click or drag files here</h3>
            <p className="text-sm text-muted-foreground">Any file size up to 100MB</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="max-h-[300px] overflow-y-auto pr-2 space-y-3">
              {files.map((file, idx) => (
                <div key={idx} className="flex items-center gap-4 rounded-xl border border-border/50 bg-muted/30 p-4">
                  <div className="rounded-full bg-primary/10 p-3 text-primary">
                    <FileIcon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={() => removeFile(idx)}
                    className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-background hover:text-foreground shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="relative flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-border/60 bg-muted/30 p-4 transition-colors hover:border-primary/50 hover:bg-muted/50">
               <input
                type="file"
                multiple
                className="absolute inset-0 cursor-pointer opacity-0"
                onChange={handleFileChange}
              />
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <UploadCloud className="h-4 w-4" /> Add more files
              </span>
            </div>

            <Button size="lg" className="w-full text-base font-semibold shadow-elegant" onClick={onUpload}>
              Upload {files.length} {files.length === 1 ? 'File' : 'Files'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
