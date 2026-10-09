import * as AuthRepo from "@/features/auth/data/auth.data";
import * as ConfigService from "@/features/config/service/config.service";

export async function getSession(context: SessionContext) {
  return context.session;
}

export async function userHasPassword(context: AuthContext) {
  return await AuthRepo.userHasPassword(context.db, context.session.user.id);
}

export async function getIsEmailConfigured(
  _context: DbContext & { executionCtx: ExecutionContext },
) {
  // emailAndPassword is enabled in auth config; show email/password login form
  return true;
}