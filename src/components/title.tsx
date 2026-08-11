export default function Title({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-xl font-semibold tracking-tighter sm:text-2xl md:text-3xl">
      {children}
    </h1>
  );
}
