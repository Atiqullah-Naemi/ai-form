export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-center items-center min-h-[100vh] h-full w-full">
      {children}
    </div>
  );
}
