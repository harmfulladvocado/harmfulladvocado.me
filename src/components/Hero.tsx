import React from 'react'

import homepage from '../content/homepage.json'
import site from '../content/site.json'
import socialsData from '../content/socials.json'
import { useInView } from '../hooks/useInView.ts'
import type { SocialLink } from '../types.ts'
import { calculateAge } from '../utils/age.ts'
import { RichText } from './RichText.tsx'
import { SocialLinks } from './SocialLinks.tsx'

const SOCIALS: SocialLink[] = socialsData.links as SocialLink[]
const AGE: number = calculateAge(site['age-epoch'])

export const Hero: React.FC = () => {
  const { inView, ref } = useInView<HTMLElement>()

  return (
    <section className={`hero reveal ${inView ? 'reveal--visible' : ''}`.trim()} ref={ref}>
      <div className="hero__content">
        <p className="hero__intro">
          <RichText
            template={homepage.hero.intro}
            values={{
              age: <span className="hero__age">{AGE}</span>,
              minekot: (
                <a className="hero__link" href={site['minekot-url']} rel="noreferrer" target="_blank">
                  {homepage.hero['minekot-label']}
                </a>
              ),
            }}
          />
        </p>
        <SocialLinks links={SOCIALS} />
      </div>
      <div className="hero__stage" aria-hidden="true">
        <div className="hero__avatar-frame">
          <img
            alt=""
            className="hero__avatar"
            decoding="async"
            height="160"
            src="/images/pfp.svg"
            width="160"
          />
        </div>
      </div>
    </section>
  )
}
