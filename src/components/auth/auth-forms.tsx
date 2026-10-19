"use client";

import { authFormCopy } from "@/content/forms/auth";

import { FORM_INPUT_CLASS } from "@/lib/design/controls";

import { useActionState, useState } from "react";
import {
  signInWithGoogle,
  signInWithPassword,
  signUpWithPassword,
  type AuthFormState,
} from "@/lib/actions/auth";
import { cn } from "@/lib/utils";
import { useScrollToFirstError } from "@/hooks/use-scroll-to-error";
import { BrandLogo } from "@/components/brand/brand-logo";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z"
      />
    </svg>
  );
}

function Note({ state }: { state: AuthFormState }) {
  if (state.notice)
    return (
      <p
        role="status"
        className="mt-4 rounded-lg bg-teal-50 px-3 py-2 text-sm text-teal-800"
      >
        {state.notice}
      </p>
    );
  if (state.error)
    return (
      <p
        role="alert"
        className="mt-4 rounded-lg bg-clay-tint px-3 py-2 text-sm text-clay-deep"
      >
        {state.error}
      </p>
    );
  return null;
}

export function AuthForms({
  next,
  initialMode = "signin",
}: {
  next: string;
  initialMode?: "signin" | "signup";
}) {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [signInState, signInAction, signingIn] = useActionState<
    AuthFormState,
    FormData
  >(signInWithPassword, {});
  const [signUpState, signUpAction, signingUp] = useActionState<
    AuthFormState,
    FormData
  >(signUpWithPassword, {});
  const signInRef = useScrollToFirstError(signInState.fieldErrors);
  const signUpRef = useScrollToFirstError(signUpState.fieldErrors);

  return (
    <div className="auth-panel w-full rounded-card border border-border bg-surface p-8">
      <div className="mb-8 flex justify-center">
        <BrandLogo />
      </div>
      <h1 className="text-center font-display text-2xl font-semibold leading-tight text-ink">
        {authFormCopy[mode].title}
      </h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        {authFormCopy[mode].description}
      </p>

      <form action={signInWithGoogle} className="mt-6">
        <input type="hidden" name="next" value={next} />
        <button type="submit" className="btn btn-ghost btn-block h-11 gap-3">
          <GoogleIcon />
          {authFormCopy.google}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        {authFormCopy.emailDivider}
        <span className="h-px flex-1 bg-border" />
      </div>

      {mode === "signin" ? (
        <form
          key="signin"
          ref={signInRef}
          action={signInAction}
          noValidate
          className="space-y-5"
        >
          <input type="hidden" name="next" value={next} />
          <div>
            <label
              htmlFor="signin-email"
              className="mb-2 block text-sm font-medium"
            >
              Email
            </label>
            <input
              id="signin-email"
              name="email"
              aria-invalid={!!signInState.fieldErrors?.email}
              aria-describedby={
                signInState.fieldErrors?.email
                  ? "signin-email-error"
                  : undefined
              }
              aria-label="Email"
              type="email"
              autoComplete="email"
              required
              className={FORM_INPUT_CLASS}
              placeholder="Email"
            />
            {signInState.fieldErrors?.email && (
              <p
                id="signin-email-error"
                className="mt-1 text-xs text-clay-deep"
              >
                {signInState.fieldErrors.email}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="signin-password"
              className="mb-2 block text-sm font-medium"
            >
              Password
            </label>
            <input
              id="signin-password"
              name="password"
              aria-invalid={!!signInState.fieldErrors?.password}
              aria-describedby={
                signInState.fieldErrors?.password
                  ? "signin-password-error"
                  : undefined
              }
              aria-label="Password"
              type="password"
              autoComplete="current-password"
              required
              className={FORM_INPUT_CLASS}
              placeholder="Password"
            />
            {signInState.fieldErrors?.password && (
              <p
                id="signin-password-error"
                className="mt-1 text-xs text-clay-deep"
              >
                {signInState.fieldErrors.password}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={signingIn}
            className="btn-sweep inline-flex h-12 w-full items-center justify-center rounded-input px-4 text-sm font-medium transition-transform active:scale-[0.99] disabled:opacity-70"
          >
            {signingIn
              ? authFormCopy.signin.pending
              : authFormCopy.signin.submit}
          </button>
          <Note state={signInState} />
        </form>
      ) : (
        <form
          key="signup"
          ref={signUpRef}
          action={signUpAction}
          noValidate
          className="space-y-5"
        >
          <input type="hidden" name="next" value={next} />
          <div>
            <label
              htmlFor="signup-name"
              className="mb-2 block text-sm font-medium"
            >
              Your name
            </label>
            <input
              id="signup-name"
              name="name"
              autoComplete="name"
              aria-invalid={!!signUpState.fieldErrors?.name}
              aria-describedby={
                signUpState.fieldErrors?.name ? "signup-name-error" : undefined
              }
              aria-label="Your name"
              required
              className={FORM_INPUT_CLASS}
              placeholder="Your name"
            />
            {signUpState.fieldErrors?.name && (
              <p id="signup-name-error" className="mt-1 text-xs text-clay-deep">
                {signUpState.fieldErrors.name}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="signup-username"
              className="mb-2 block text-sm font-medium"
            >
              Username
            </label>
            <input
              id="signup-username"
              name="username"
              autoComplete="username"
              aria-invalid={!!signUpState.fieldErrors?.username}
              aria-describedby={
                signUpState.fieldErrors?.username
                  ? "signup-username-error"
                  : undefined
              }
              aria-label="Username"
              required
              className={cn(FORM_INPUT_CLASS, "font-mono")}
              placeholder="username"
            />
            {signUpState.fieldErrors?.username && (
              <p
                id="signup-username-error"
                className="mt-1 text-xs text-clay-deep"
              >
                {signUpState.fieldErrors.username}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="signup-email"
              className="mb-2 block text-sm font-medium"
            >
              Email
            </label>
            <input
              id="signup-email"
              name="email"
              aria-invalid={!!signUpState.fieldErrors?.email}
              aria-describedby={
                signUpState.fieldErrors?.email
                  ? "signup-email-error"
                  : undefined
              }
              aria-label="Email"
              type="email"
              autoComplete="email"
              required
              className={FORM_INPUT_CLASS}
              placeholder="Email"
            />
            {signUpState.fieldErrors?.email && (
              <p
                id="signup-email-error"
                className="mt-1 text-xs text-clay-deep"
              >
                {signUpState.fieldErrors.email}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="signup-password"
              className="mb-2 block text-sm font-medium"
            >
              Password
            </label>
            <input
              id="signup-password"
              name="password"
              aria-invalid={!!signUpState.fieldErrors?.password}
              aria-describedby={
                signUpState.fieldErrors?.password
                  ? "signup-password-error"
                  : undefined
              }
              aria-label="Password"
              type="password"
              autoComplete="new-password"
              required
              className={FORM_INPUT_CLASS}
              placeholder="Password (8+ characters)"
            />
            {signUpState.fieldErrors?.password && (
              <p
                id="signup-password-error"
                className="mt-1 text-xs text-clay-deep"
              >
                {signUpState.fieldErrors.password}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={signingUp}
            className="btn-sweep inline-flex h-12 w-full items-center justify-center rounded-input px-4 text-sm font-medium transition-transform active:scale-[0.99] disabled:opacity-70"
          >
            {signingUp
              ? authFormCopy.signup.pending
              : authFormCopy.signup.submit}
          </button>
          <Note state={signUpState} />
        </form>
      )}

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {mode === "signin" ? (
          <>
            New here?{" "}
            <button
              type="button"
              onClick={() => setMode("signup")}
              className="font-medium text-teal-700 hover:underline"
            >
              Create an account
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => setMode("signin")}
              className="font-medium text-teal-700 hover:underline"
            >
              Sign in
            </button>
          </>
        )}
      </p>
    </div>
  );
}
