import * as z from "zod"

export const SignupValidation = z.object({
    email: z.string().email(),
    password: z.string().min(8, 'Too short')
})

export const SigninValidation = z.object({
    email: z.string().email(),
    password: z.string().min(8)
})

export const PostValidation = z.object({
    caption: z.string().min(1).max(2200),
    file: z.custom<File>(),
    tags: z.string()
})