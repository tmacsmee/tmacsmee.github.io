import GitHub from "@/assets/svg/github.svg";
import Linkedin from "@/assets/svg/linkedin.svg";
import Paragraph from "@/components/paragraph";
import Title from "@/components/title";

export default function Home() {
  return (
    <article>
      <Title>Troy Mackenzie-Smee</Title>
      <Paragraph className="mt-6">
        I'm a software engineer with interests spanning web development,
        finance, blockchain, and game design. I love to work creatively and
        learn new things.
      </Paragraph>

      <div className="mt-6 w-10 border-t border-stone-300" />

      <div className="mt-6 flex gap-x-3">
        <a
          href="https://www.linkedin.com/in/tmacsmee/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Linkedin className="size-6 text-stone-500 hover:text-stone-800" />
        </a>
        <a
          href="https://github.com/tmacsmee"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GitHub className="size-6 text-stone-500 hover:text-stone-800" />
        </a>
      </div>
    </article>
  );
}
