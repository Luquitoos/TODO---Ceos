import AuthHeader from '@/components/auth/AuthHeader';
import LoginForm from '@/components/auth/LoginForm';
import AuthImagePlaceholder from '@/components/auth/AuthImagePlaceholder';
import AppFooter from '@/components/layout/AppFooter';

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <AuthHeader />

      <main className="flex flex-1 flex-col items-center justify-center p-6 pt-36 md:pt-32">
        <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl">
          <LoginForm />
          <AuthImagePlaceholder />
        </div>
      </main>

      <AppFooter />
    </div>
  );
}