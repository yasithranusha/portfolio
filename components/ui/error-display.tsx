"use client";

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  digest?: string;
  reset?: () => void;
}

export function ErrorDisplay({ title = "KERNEL PANIC", message, digest, reset }: ErrorDisplayProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="w-full max-w-lg font-mono">

        <div className="bg-surface-container-high border border-error/20">
          <div className="h-8 bg-surface-container-high px-4 flex items-center gap-2 border-b border-error/10">
            <div className="w-2.5 h-2.5 rounded-full bg-error/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-error/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-error/20" />
            <span className="ml-auto text-[10px] text-error/60 tracking-widest">{title}</span>
          </div>

          <div className="p-6 space-y-4">
            <div className="text-error text-xs tracking-widest">
              UNHANDLED EXCEPTION — PROCESS TERMINATED
            </div>

            <div className="text-[#adaaaa] text-xs space-y-1">
              {message && (
                <p className="text-error/80 break-words">{message}</p>
              )}
              {digest && (
                <p className="text-[#494847]">digest: {digest}</p>
              )}
              <p className="text-[#494847]">exit code: 1</p>
            </div>

            <div className="border-t border-[#494847]/20 pt-4 text-[10px] text-[#494847] space-y-1">
              <p>SIGNAL: SIGABRT</p>
              <p>RECOVERY: manual restart required</p>
            </div>

            {reset && (
              <div className="pt-2">
                <button
                  onClick={reset}
                  className="px-4 py-2 text-[11px] bg-error/10 border border-error/30 text-error hover:bg-error hover:text-white transition-colors"
                >
                  ./restart --force
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
