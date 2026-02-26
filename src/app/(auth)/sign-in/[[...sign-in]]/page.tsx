import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Auto<span className="text-indigo-400">Content</span>
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-2">
            Sign in to your workspace
          </p>
        </div>
        <SignIn />
      </div>
    </div>
  );
}
