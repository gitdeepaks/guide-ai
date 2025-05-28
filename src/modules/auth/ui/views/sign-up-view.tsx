'use client';

import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, OctagonAlert } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { z } from 'zod';

const formSchema = z
  .object({
    name: z.string().min(1, { message: 'name is required' }),
    email: z.string().email(),
    password: z.string().min(1, { message: 'password is required' }),
    confirmPassword: z.string().min(1, { message: 'password is required' }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const SignUpView = () => {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [socialPending, setSocialPending] = useState<{
    [key: string]: boolean;
  }>({
    google: false,
    github: false,
  });

  const isAnySocialPending = Object.values(socialPending).some(Boolean);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setError(null);
    setPending(true);

    authClient.signUp.email(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        callbackURL: '/',
      },
      {
        onSuccess: () => {
          setPending(false);
          router.push('/');
        },
        onError: ({ error }) => {
          setError(error.message);
          setPending(false);
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 lg:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Let&apos;s get started</h1>
                  <p className="text-muted-foreground text-balance">
                    Create an account to continue
                  </p>
                </div>
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Henna"
                            {...field}
                            disabled={isAnySocialPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="m@example.com"
                            {...field}
                            disabled={isAnySocialPending}
                          />
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
                          <Input
                            placeholder="********"
                            {...field}
                            type="password"
                            disabled={isAnySocialPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="********"
                            {...field}
                            type="password"
                            disabled={isAnySocialPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {!!error && (
                  <Alert className="bg-destructive/10 border-none">
                    <OctagonAlert className="size-4 !text-destructive" />
                    <AlertTitle>{error}</AlertTitle>
                  </Alert>
                )}
                <Button
                  disabled={pending || isAnySocialPending}
                  type="submit"
                  className="w-full"
                >
                  {pending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    'Sign up'
                  )}
                </Button>
                <div className="after:border-border relative text-center text-sm after:top-1/2 after:z-0 after:flex after:items-center after:justify-center after:border-dashed">
                  <span className="text-muted-foreground bg-card relative z-10 px-2">
                    or continue with
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => {
                      setSocialPending(prev => ({ ...prev, google: true }));
                      authClient.signIn.social({
                        provider: 'google',
                        callbackURL: '/',
                      });
                    }}
                    disabled={socialPending.google}
                    variant="outline"
                    type="button"
                    className="w-full"
                  >
                    {socialPending.google ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <FaGoogle className="size-4" />
                    )}
                  </Button>
                  <Button
                    onClick={() => {
                      setSocialPending(prev => ({ ...prev, github: true }));
                      authClient.signIn.social({
                        provider: 'github',
                        callbackURL: '/',
                      });
                    }}
                    disabled={socialPending.github}
                    variant="outline"
                    type="button"
                    className="w-full"
                  >
                    {socialPending.github ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <FaGithub className="size-4" />
                    )}
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Already have an account?{' '}
                  <Link
                    href="/sign-in"
                    className="underline underline-offset-4 hover:text-primary"
                  >
                    Sign in
                  </Link>
                </div>
              </div>
            </form>
          </Form>

          <div className="bg-radial from-green-500 to-green-900 relative hidden md:flex flex-col gap-y-4 items-center justify-center">
            <img src="/logo.svg" alt="Image" className="h-[92px] w-[92px]" />
            <p className="text-2xl font-semibold text-white">Guide.AI</p>
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underlne *:[a]:underline-offset-4">
        By clicking continue, you agree to our{' '}
        <a href="#" className="underline underline-offset-4">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="#" className="underline underline-offset-4">
          Privacy Policy
        </a>
      </div>
    </div>
  );
};
