import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About | Troy Mackenzie-Smee",
}

export default function AboutPage() {
  return (
    <div className="pt-36 flex-1">
      <h1 className="text-white font-bold text-5xl">Troy Mackenzie-Smee</h1>
      <h2 className="text-slate-400 text-2xl font-medium mt-1.5">
        Full-stack developer.
      </h2>
    </div>
  )
}
