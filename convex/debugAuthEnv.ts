"use node";

import { internalAction } from "./_generated/server";

/**
 * Debug action: returns whether Convex Auth env vars are set in this deployment.
 * Internal only — do not expose to clients (information disclosure).
 * Use from Convex dashboard or internal functions for debugging.
 */
export const check = internalAction({
  args: {},
  handler: async () => {
    const jwtPrivateKeySet = typeof process.env.JWT_PRIVATE_KEY === "string" && process.env.JWT_PRIVATE_KEY.length > 0;
    const jwksSet = typeof process.env.JWKS === "string" && process.env.JWKS.length > 0;
    return { jwtPrivateKeySet, jwksSet };
  },
});
