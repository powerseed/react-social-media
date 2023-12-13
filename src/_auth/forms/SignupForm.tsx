import { Button } from '@/components/ui/button'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import * as z from "zod"
import { SignupValidation } from '@/lib/validation'
import Loader from '@/components/shared/Loader'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from "@/components/ui/use-toast"
import { useCreateUser, useSignIn } from '@/lib/react-query/queriesAndMutations'
import { useContext } from 'react'
import { AuthContext } from '@/context/AuthContext'

const SignupForm = () => {
  const { toast } = useToast()
  const navigate = useNavigate();
  const { mutateAsync: createUser, isPending: isCreatingUser } = useCreateUser();
  const { mutateAsync: signIn, isPending: isSigningIn } = useSignIn();
  const { checkIsUserAuthenticated, isLoading: isUserLoading } = useContext(AuthContext);

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      email: '',
      password: ''
    },
  })

  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    const newUser = await createUser(values);

    if (!newUser) {
      return toast({
        title: "Sign up failed. Please try again. "
      })
    }

    const session = await signIn({
      email: values.email,
      password: values.password
    });

    if (!session) {
      return toast({
        title: "Sign in failed. Please try again. "
      })
    }

    const isLoggedIn = await checkIsUserAuthenticated();

    if (isLoggedIn) {
      form.reset();
      navigate('/');
    }
    else {
      return toast({
        title: "Sign up failed. Please try again. "
      })
    }
  }

  return (
    <Form {...form}>
      <div className='sm:w-420 flex-center flex-col'>
        <img src='/public/assets/images/logo.svg' alt='logo' />

        <h2 className='h3-bold md:h2-bold pt-5 sm:pt-12'>Create a new account</h2>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type='email' className='shad-input' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type='password' className='shad-input' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className='shad-button_primary'>
            {isCreatingUser ? (
              <div className='flex-center gap-2'>
                <Loader /> Loading...
              </div>
            ) : 'Sign up'}
          </Button>

          <p>
            Already have an account?
            <Link to="/sign-in" className='text-primary-500 text-small-semibold ml-1'>Sign in</Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SignupForm