import { Metadata } from "next"
import { IoMdConstruct } from "react-icons/io"

export const metadata: Metadata = {
  title: "Writing | Troy Mackenzie-Smee",
}

export default function WritingPage() {
  return (
    <main className="flex flex-col items-center self-stretch">
      <h1 className="text-4xl font-bold text-slate-600">
        Page under construction
      </h1>
      <IoMdConstruct className="mt-5 size-16 text-slate-400" />
    </main>
  )
}
