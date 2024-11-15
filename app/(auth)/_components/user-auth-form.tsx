'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { cn } from '@/lib/utils';
import { userAuthSchema } from '@/lib/validations/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Icons } from '@/components/icons';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  mode: 'signin' | 'signup';
}

type FormData = z.infer<typeof userAuthSchema>;

export function UserAuthForm({ className, mode, ...props }: UserAuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema)
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    if (mode === 'signup') {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const signInResult = await signIn('credentials', {
          email: data.email.toLowerCase(),
          password: data.password,
          redirect: false
        });

        if (signInResult?.ok) {
          router.push('/dashboard');
        } else {
          toast({
            title: 'Something went wrong.',
            description: 'Your sign in request failed. Please try again.',
            variant: 'destructive'
          });
        }
      } else {
        toast({
          title: 'Something went wrong.',
          description: 'Your sign up request failed. Please try again.',
          variant: 'destructive'
        });
      }
    } else {
      const signInResult = await signIn('credentials', {
        email: data.email.toLowerCase(),
        password: data.password,
        redirect: false,
        callbackUrl: searchParams?.get('from') || '/dashboard'
      });

      if (signInResult?.ok) {
        router.push('/dashboard');
      } else {
        toast({
          title: 'Something went wrong.',
          description: 'Your sign in request failed. Please try again.',
          variant: 'destructive'
        });
      }
    }

    setIsLoading(false);
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading || isGoogleLoading}
              {...register('email')}
            />
            {errors?.email && (
              <p className="px-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="Password"
              type="password"
              autoCapitalize="none"
              autoComplete="current-password"
              autoCorrect="off"
              disabled={isLoading || isGoogleLoading}
              {...register('password')}
            />
            {errors?.password && (
              <p className="px-1 text-xs text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {mode === 'signin' ? 'Sign In with Email' : 'Sign Up with Email'}
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        type="button"
        disabled={isLoading || isGoogleLoading}
        onClick={() => {
          setIsGoogleLoading(true);
          signIn('google', { callbackUrl: '/dashboard' });
        }}
      >
        {isGoogleLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}{' '}
        Google
      </Button>
    </div>
  );
}
