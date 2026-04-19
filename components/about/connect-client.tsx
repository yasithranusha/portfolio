"use client";

import { useState } from "react";
import { InteractiveTerminal } from "@/components/ui/interactive-terminal";
import { SystemLog } from "@/components/about/system-log";
import { siteConfig } from "@/config/site";

export function ConnectLayout({ sidePanel }: { sidePanel: React.ReactNode }) {
  const [curled, setCurled] = useState(false);

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6">
        <InteractiveTerminal
          title="CURL :: api/v1/identity"
          initialCommands={[`curl ${siteConfig.domain}${siteConfig.terminal.identityEndpoint}`]}
          className="h-[20rem] lg:h-auto lg:flex-[2] lg:min-h-0"
          onBootComplete={() => setCurled(true)}
        />
        {sidePanel}
      </div>

      {/* ─── Backend System Log — always visible, request trace fires on curl ── */}
      <SystemLog triggered={curled} />
    </>
  );
}
