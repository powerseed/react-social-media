import * as z from "zod"

export const SignupValidation = z.object({
    email: z.string().email(),
    password: z.string().min(8, 'Too short')
})