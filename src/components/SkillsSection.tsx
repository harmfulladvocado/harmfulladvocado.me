import React from 'react'

import homepage from '../content/homepage.json'
import skillsData from '../content/skills.json'
import { useInView } from '../hooks/useInView.ts'
import type { Skill } from '../types.ts'
import { Section } from './Section.tsx'
import { SkillBar } from './SkillBar.tsx'

const SKILLS: Skill[] = skillsData.skills

export const SkillsSection: React.FC = () => {
  const { inView, ref } = useInView<HTMLDivElement>()

  return (
    <Section
      className="section--stack"
      id="stack"
      number={homepage.sections.stack.number}
      title={homepage.sections.stack.title}
    >
      <div className={`skills ${inView ? 'skills--visible' : ''}`.trim()} ref={ref}>
        {SKILLS.map((skill: Skill, index: number) => (
          <SkillBar index={index} key={skill.name} skill={skill} />
        ))}
      </div>
    </Section>
  )
}
