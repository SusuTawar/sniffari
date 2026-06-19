import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <SignIn
      fallbackRedirectUrl="/swipe"
      appearance={{
        elements: {
          rootBox: "w-full",
          card: "rounded-2xl shadow-none border-none",
          headerTitle: "text-ink font-bold",
          headerSubtitle: "text-muted",
          socialButtonsBlockButton: "rounded-xl border-muted/30",
          dividerLine: "bg-muted/20",
          dividerText: "text-muted",
          formFieldLabel: "text-ink font-medium",
          formFieldInput:
            "rounded-xl border-muted/30 focus:border-primary focus:ring-primary/20",
          formButtonPrimary:
            "rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold shadow-none",
          footerActionLink: "text-primary hover:text-primary-dark",
          footer: "bg-transparent",
        },
      }}
    />
  );
}
