import GitHub from "@/assets/svg/github.svg";
import Linkedin from "@/assets/svg/linkedin.svg";
import Paragraph from "@/components/paragraph";
import Title from "@/components/title";
import Link from "next/link";

export default function Home() {
  return (
    <article>
      <Title>Troy Mackenzie-Smee</Title>
      <Paragraph className="mt-6">
        I'm a software engineer with interests spanning web development,
        finance, blockchain, and game design. I love to work creatively and
        learn new things.
      </Paragraph>

      <Paragraph className="mt-6">
        In the past, I've designed and built decentralized finance applications,
        3D maps for Minecraft servers, and optimised vector database search
        algorithms.
      </Paragraph>

      <Paragraph className="mt-6">
        Check out my{" "}
        <Link
          href="/projects"
          className="underline decoration-stone-400 decoration-dotted underline-offset-4 hover:decoration-stone-600"
        >
          projects
        </Link>{" "}
        to see what else I've been working on.
      </Paragraph>

      <div className="mt-6 w-10 border-t border-stone-300" />

      <div className="mt-6 flex gap-x-3">
        <a
          href="https://www.linkedin.com/in/troymacsmee/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Linkedin className="size-6 text-stone-500 transition-colors hover:text-stone-800" />
        </a>
        <a
          href="https://github.com/tmacsmee"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GitHub className="size-6 text-stone-500 transition-colors hover:text-stone-800" />
        </a>
      </div>
    </article>
  );
}
