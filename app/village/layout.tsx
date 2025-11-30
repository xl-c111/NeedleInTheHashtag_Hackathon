export default function VillageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark min-h-screen bg-slate-950">
      {children}
    </div>
  );
}
