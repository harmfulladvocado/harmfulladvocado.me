import React from 'react'

import type { Project, ProjectAction } from '../types.ts'
import { ArrowIcon } from './icons.tsx'

interface ProjectCardProps {
  index: number
  project: Project
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ index, project }) => (
  <li className="project">
    <span className="project__index">{String(index + 1).padStart(2, '0')}</span>
    <div className="project__body">
      <div className="project__heading">
        <h3 className="project__name">{project.name}</h3>
        <span className="project__tag">{project.tag}</span>
      </div>
      <p className="project__description">{project.description}</p>
    </div>
    <div className="project__actions">
      {project.actions.map((action: ProjectAction) => (
        <a
          className="project__action"
          href={action.href}
          key={action.label}
          rel={action.external ? 'noreferrer' : undefined}
          target={action.external ? '_blank' : undefined}
        >
          <span>{action.label}</span>
          <ArrowIcon />
        </a>
      ))}
    </div>
  </li>
)
