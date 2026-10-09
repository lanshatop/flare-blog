import { OAuthProvider } from "@cloudflare/workers-oauth-provider";
import { McpApiHandler } from "@/features/mcp/api/mcp-api-handler";
import { createWorkersOAuthProviderOptions } from "@/features/oauth-provider/oauth-provider.config";
import { appWorkerHandler } from "./app-handler";

let oauthProvider: OAuthProvider<Env> | null = null;

function getOAuthProvider() {
  if (oauthProvider) {
    return oauthProvider;
  }

  oauthProvider = new OAuthProvider(
    createWorkersOAuthProviderOptions({
      apiHandlers: {
        "/mcp": McpApiHandler,
      },
      defaultHandler: appWorkerHandler,
    }),
  );

  return oauthProvider;
}

export function handleRootRequest(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
) {
  try {
    return getOAuthProvider().fetch(request, env, ctx);
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    return new Response(
      `<pre style="padding:20px;font:14px monospace;white-space:pre-wrap">ROOT-HANDLER ERROR\n${(err.stack || err.message).replace(/</g, "&lt;")}</pre>`,
      { status: 500, headers: { "content-type": "text/html; charset=utf-8" } },
    );
  }
}