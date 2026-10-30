import React from 'react'

import homepage from '../content/homepage.json'
import { Section } from './Section.tsx'

const PARAGRAPHS: string[] = homepage.about.paragraphs
const LAST_INDEX = PARAGRAPHS.length - 1

export const AboutSection: React.FC = () => (
  <Section
    className="section--about"
    id="about"
    number={homepage.sections.about.number}
    title={homepage.sections.about.title}
  >
    {PARAGRAPHS.map((paragraph: string, index: number) => (
      <p
        className={`about__text ${index === LAST_INDEX ? 'about__text--muted' : ''}`.trim()}
        key={paragraph}
      >
        {paragraph}
      </p>
    ))}
  </Section>
)
