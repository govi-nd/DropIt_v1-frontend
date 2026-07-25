import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

export function UploadProgress({ progress, fileCount }) {
  return (
    <div className="w-full animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
      <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-8 text-center shadow-soft">
        <div className="mb-6 rounded-full bg-primary/10 p-4 text-primary">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
        <h3 className="mb-1 text-xl font-semibold">
          Uploading {fileCount} {fileCount === 1 ? "file" : "files"}...
        </h3>
        <p className="mb-8 text-sm text-muted-foreground">Please do not close this window.</p>
        
        <div className="w-full space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Uploading...</span>
            <span className="text-primary">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2.5 w-full" />
        </div>
      </div>
    </div>
  );
}
