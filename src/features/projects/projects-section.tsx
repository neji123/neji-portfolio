import { getTranslations } from "next-intl/server";

import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { TagList } from "@/components/ui/tag-list";
import { projects } from "@/content/projects";
import { type Locale } from "@/i18n/locales";
import { localize } from "@/lib/localize";

import { ProjectLink } from "./project-link";
import { ProjectShot } from "./project-shot";

type ProjectsSectionProps = {
  locale: Locale;
};

export async function ProjectsSection({ locale }: ProjectsSectionProps) {
  const tSections = await getTranslations({ locale, namespace: "Sections" });
  const t = await getTranslations({ locale, namespace: "Projects" });

  const featured = projects.filter((project) => project.featured && project.image);
  const shown = projects.filter((project) => !project.featured && project.image);
  const privateWork = projects.filter((project) => project.link.kind === "private");

  return (
    <Section id="projects" labelledBy="projects-heading">
      <div className="flex flex-col gap-20 md:gap-28">
        <SectionHeading id="projects-heading">{tSections("projects")}</SectionHeading>

        {/* The featured product: a wide spread, picture first. */}
        {featured.map((project) => {
          const name = localize(project.name, locale);
          return (
            <article
              key={project.id}
              aria-labelledby={`${project.id}-name`}
              className="grid items-center gap-x-12 gap-y-8 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]"
            >
              {project.image ? (
                <ProjectShot
                  image={project.image}
                  alt={t("screenshotAlt", { name })}
                  sizes="(min-width: 768px) 58vw, 100vw"
                />
              ) : null}
              <Reveal from="start" className="flex flex-col gap-5">
                <h3 id={`${project.id}-name`} className="type-display">
                  {name}
                </h3>
                <p className="type-lead">{project.description[locale]}</p>
                <TagList items={project.stack} label={t("stack")} />
                {project.link.kind === "live" ? (
                  <ProjectLink url={project.link.url} label={t("visit", { name })} />
                ) : null}
              </Reveal>
            </article>
          );
        })}

        {/* The other live sites, side by side. */}
        <div className="grid gap-x-12 gap-y-16 md:grid-cols-2">
          {shown.map((project) => {
            const name = localize(project.name, locale);
            return (
              <article
                key={project.id}
                aria-labelledby={`${project.id}-name`}
                className="flex flex-col gap-6"
              >
                {project.image ? (
                  <ProjectShot
                    image={project.image}
                    alt={t("screenshotAlt", { name })}
                    sizes="(min-width: 768px) 46vw, 100vw"
                  />
                ) : null}
                <Reveal className="flex flex-col gap-4">
                  <h3 id={`${project.id}-name`} className="type-head">
                    {name}
                  </h3>
                  <p className="max-w-[52ch] type-body">{project.description[locale]}</p>
                  <TagList items={project.stack} label={t("stack")} />
                  {project.link.kind === "live" ? (
                    <ProjectLink url={project.link.url} label={t("visit", { name })} />
                  ) : null}
                </Reveal>
              </article>
            );
          })}
        </div>

        {/* Private work: no screenshot to show, so a dense list instead of empty frames. */}
        <Reveal stagger>
          <ul className="flex flex-col gap-2">
            {privateWork.map((project) => (
              <li
                key={project.id}
                data-reveal-item
                className="grid gap-x-12 gap-y-4 bg-surface p-6 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] md:p-8"
              >
                <div className="flex flex-col gap-1">
                  <h3 className="type-lead font-semibold">{localize(project.name, locale)}</h3>
                  <p className="type-small text-muted">{t("private")}</p>
                </div>
                <div className="flex flex-col gap-4">
                  <p className="max-w-[60ch] type-body">{project.description[locale]}</p>
                  <TagList items={project.stack} label={t("stack")} />
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
