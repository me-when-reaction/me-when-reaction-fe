import { z } from "zod";

z.setErrorMap((issue, ctx) => {
  let name = issue.path.join('.');
  if (issue.code === z.ZodIssueCode.invalid_type && issue.received === 'undefined') {
    return { message: `${name} must be filled` };
  }
  if (issue.code === z.ZodIssueCode.invalid_type) {
    return { message: `${name} must be ${issue.expected}` };
  }
  else if (issue.code === z.ZodIssueCode.too_small) {
    if (issue.type === 'string') return { message: `${name} must contain at least ${issue.minimum} character(s)` };
    if (issue.type === 'number') return { message: `${name} must be at least ${issue.minimum}` };
    if (issue.type === 'array') return { message: `${name} must contain at least ${issue.minimum} elements` };
  }
  return { message: ctx.defaultError };
});

export const AuthRequestSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});
export type AuthRequest = z.infer<typeof AuthRequestSchema>