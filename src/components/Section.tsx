import React from 'react'

import { useInView } from '../hooks/useInView.ts'

interface SectionProps {
  children: React.ReactNode
  className?: string
  id: string
  number: string
  title: string
}

export const Section: React.FC<SectionProps> = ({ children, className, id, number, title }) => {
  const { inView, ref } = useInView<HTMLElement>()

  return (
    <section
      className={`section reveal ${inView ? 'reveal--visible' : ''} ${className ?? ''}`.trim()}
      id={id}
      ref={ref}
    >
      <header className="section__header">
        <span className="section__number">{number}</span>
        <h2 className="section__title">{title}</h2>
      </header>
      <div className="section__body">{children}</div>
    </section>
  )
}
