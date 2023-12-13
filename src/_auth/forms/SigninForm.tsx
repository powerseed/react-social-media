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
import { SigninValidation } from '@/lib/validation'
import Loader from '@/components/shared/Loader'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from "@/components/ui/use-toast"
import { useSignIn } from '@/lib/react-query/queriesAndMutations'
import { useContext } from 'react'
import { AuthContext } from '@/context/AuthContext'

const SigninForm = () => {
  const { toast } = useToast()
  const navigate = useNavigate();
  const { mutateAsync: signIn, isPending: isSigningIn } = useSignIn();
  const { checkIsUserAuthenticated } = useContext(AuthContext);

  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: '',
      password: ''
    },
  })

  async function onSubmit(values: z.infer<typeof SigninValidation>) {
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
        title: "Sign in failed. Please try again. "
      })
    }
  }

  return (
    <Form {...form}>
      <div className='sm:w-420 flex-center flex-col'>
        <img src='/public/assets/images/logo.svg' alt='logo' />

        <h2 className='h3-bold md:h2-bold pt-5 sm:pt-12'>Sign in to your account</h2>

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
            {isSigningIn ? (
              <div className='flex-center gap-2'>
                <Loader /> Loading...
              </div>
            ) : 'Sign in'}
          </Button>

          <p>
            Don't have an account?
            <Link to="/sign-up" className='text-primary-500 text-small-semibold ml-1'>Sign up</Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SigninForm