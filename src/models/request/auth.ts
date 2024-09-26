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
  email: z.string({ required_error: "Username must be filled" }).email({ message: "Invalid email" }),
  password: z.string({ required_error: "Password must be filled" }).min(1, { message: "Password must be filled" }),
});
export type AuthRequest = z.infer<typeof AuthRequestSchema>