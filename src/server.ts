import { handleQueueBatch } from "@/lib/queue/queue.handler";

export { CommentModerationWorkflow } from "@/features/comments/workflows/comment-moderation";
export { ExportWorkflow } from "@/features/import-export/workflows/export.workflow";
export { ImportWorkflow } from "@/features/import-export/workflows/import.workflow";
export { PostAutoSnapshotWorkflow } from "@/features/posts/workflows/post-auto-snapshot";
export { PostProcessWorkflow } from "@/features/posts/workflows/post-process";
export { ScheduledPublishWorkflow } from "@/features/posts/workflows/scheduled-publish";
export { PasswordHasher } from "@/lib/do/password-hasher";
export { RateLimiter } from "@/lib/do/rate-limiter";

declare module "@tanstack/react-start" {
  interface Register {
    server: {
      requestContext: {
        env: Env;
        executionCtx: ExecutionContext<unknown>;
      };
    };
  }
}

export default {
  async fetch(request, env, ctx) {
    try {
      const { handleRootRequest } = await import("@/lib/worker/root-handler");
      return await handleRootRequest(request, env, ctx);
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e));
      return new Response(
        `<!DOCTYPE html><pre style="padding:20px;font:14px monospace;white-space:pre-wrap">${(err.stack || err.message).replace(/</g, "&lt;")}</pre>`,
        { status: 500, headers: { "content-type": "text/html; charset=utf-8" } },
      );
    }
  },
  async queue(batch, env, ctx) {
    await handleQueueBatch(batch, env, ctx);
  },
} satisfies ExportedHandler<Env>;
