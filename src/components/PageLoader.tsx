import { cn } from "@/lib/utils";

interface PageLoaderProps {
  className?: string;
}

export function PageLoader({ className }: PageLoaderProps) {
  return (
    <div className={cn("min-h-screen w-full flex items-center justify-center bg-slate-950", className)}>
      <div className="loader-container">
        <div className="loader-holder">
          <div className="loader-box"></div>
        </div>
        <div className="loader-holder">
          <div className="loader-box"></div>
        </div>
        <div className="loader-holder">
          <div className="loader-box"></div>
        </div>
      </div>
    </div>
  );
}