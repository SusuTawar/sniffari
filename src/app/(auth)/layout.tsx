export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-gradient-to-b from-primary to-primary-dark p-4">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
