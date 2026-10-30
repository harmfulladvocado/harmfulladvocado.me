import React from 'react'

import type { Skill } from '../types.ts'

interface SkillBarProps {
  index: number
  skill: Skill
}

export const SkillBar: React.FC<SkillBarProps> = ({ index, skill }) => (
  <div
    className="skill"
    style={
      {
        '--skill-index': String(index),
        '--skill-value': `${skill.percent}%`,
      } as React.CSSProperties
    }
  >
    <div className="skill__meta">
      <span className="skill__name">{skill.name}</span>
      <span className="skill__hours">{skill.label}</span>
    </div>
    <div
      aria-label={`${skill.name} proficiency`}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={skill.percent}
      className="skill__track"
      role="progressbar"
    >
      <span className="skill__fill" />
    </div>
  </div>
)
