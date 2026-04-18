import { NextResponse } from "next/server";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

// you didn't see this

export async function GET(): Promise<Response> {
  return NextResponse.json(
    {
      status:       "GRANTED",
      user:         "visitor",
      elevated_to:  "root",
      message:      "sudo access granted. with great power comes great responsibility.",
      root_secrets: siteConfig.sudo.root_secrets,
      warning:      siteConfig.sudo.warning,
    },
    {
      status: 200,
      headers: {
        "Content-Type":  "application/json",
        "X-Powered-By":  "KERNEL_CONSOLE",
        "X-Elevated":    "root",
        "X-Handle":      siteConfig.handle,
      },
    }
  );
}
