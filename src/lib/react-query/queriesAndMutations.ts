import {
    useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery
} from '@tanstack/react-query'
import { createUser, signIn, signOut } from '../appwrite/api'
import { INewUser } from '@/types'

export const useCreateUser = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUser(user)
    })
}

export const useSignIn = () => {
    return useMutation({
        mutationFn: (user: {
            email: string,
            password: string
        }) => signIn(user)
    })
}

export const useSignOut = () => {
    return useMutation({
        mutationFn: signOut
    })
}