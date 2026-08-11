export default function Title({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-xl font-semibold tracking-tighter text-stone-900 md:text-2xl">
      {children}
    </h1>
  );
}
