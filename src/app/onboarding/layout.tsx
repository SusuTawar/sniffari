export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-neutral px-4">
      <header className="flex items-center py-6">
        <span className="text-xl font-bold text-primary">Sniffari</span>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center">
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  );
}
