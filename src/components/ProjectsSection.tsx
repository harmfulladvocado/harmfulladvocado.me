import React from 'react'

import homepage from '../content/homepage.json'
import projectsData from '../content/projects.json'
import type { Project } from '../types.ts'
import { ProjectCard } from './ProjectCard.tsx'
import { Section } from './Section.tsx'

const PROJECTS: Project[] = projectsData.projects

export const ProjectsSection: React.FC = () => (
  <Section
    className="section--projects"
    id="projects"
    number={homepage.sections.projects.number}
    title={homepage.sections.projects.title}
  >
    <ul className="projects">
      {PROJECTS.map((project: Project, index: number) => (
        <ProjectCard index={index} key={project.id} project={project} />
      ))}
    </ul>
  </Section>
)
