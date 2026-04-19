import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-lg font-mono">

        {/* Terminal window chrome */}
        <div className="bg-surface-container-high border border-outline-variant/30">
          <div className="h-8 bg-surface-container-high px-4 flex items-center gap-2 border-b border-outline-variant/20">
            <div className="w-2.5 h-2.5 rounded-full bg-error/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-secondary/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-primary/40" />
            <span className="ml-auto text-[10px] text-outline-variant tracking-widest">KERNEL :: SEGFAULT</span>
          </div>

          <div className="p-6 space-y-4">
            <div className="text-error text-xs tracking-widest">
              ERROR 404 — ROUTE NOT FOUND
            </div>

            <div className="text-on-surface-variant text-xs space-y-1">
              <p><span className="text-outline-variant">$</span> resolve <span className="text-secondary">path</span></p>
              <p className="text-error">fatal: cannot resolve path — no such route in kernel</p>
              <p className="text-outline">exit code: 1</p>
            </div>

            <div className="border-t border-outline-variant/20 pt-4 space-y-1 text-[10px] text-outline">
              <p>SIGNAL: SIGSEGV</p>
              <p>CORE: dumped to /dev/null</p>
            </div>

            <div className="pt-2 flex gap-3">
              <Link
                href="/"
                className="px-4 py-2 text-[11px] bg-primary/10 border border-primary/30 text-primary hover:bg-primary hover:text-on-primary transition-colors"
              >
                cd ~
              </Link>
              <Link
                href="/blog"
                className="px-4 py-2 text-[11px] bg-surface-container-highest border border-outline-variant/20 text-on-surface-variant hover:border-outline-variant/60 transition-colors"
              >
                ls /archives
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
