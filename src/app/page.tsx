import { profile } from "@/content/profile";
import { uiStrings } from "@/content/site";

export default function HomePage() {
  return (
    <main id="main" className="flex flex-1 flex-col justify-center gap-6 px-6 md:px-16">
      <h1 className="text-5xl font-semibold tracking-tight text-balance md:text-7xl">
        {profile.name}
      </h1>
      <p className="text-xl md:text-2xl">{profile.title}</p>
      <p className="max-w-prose text-base text-pretty">{uiStrings.underConstruction}</p>
    </main>
  );
}
