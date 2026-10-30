import React from 'react'

import site from '../content/site.json'
import { scrollToElement } from '../utils/scroll.ts'
import { ArrowUpIcon } from './icons.tsx'

export const Footer: React.FC = () => {
  const year = new Date().getFullYear()

  const handleTopClick = (event: React.MouseEvent<HTMLAnchorElement>): void => {
    const main = document.getElementById('main-content')

    if (main !== null) {
      event.preventDefault()
      scrollToElement(main)
    }
  }

  return (
    <footer className="footer">
      <div className="footer__inner">
        <p className="footer__copyright">
          &copy; {year} {site.name}
        </p>
        <a className="footer__top" href="#main-content" onClick={handleTopClick}>
          <ArrowUpIcon />
          <span>{site['back-to-top-label']}</span>
        </a>
        <a
          className="footer__link"
          href={site['footer-source-url']}
          rel="noreferrer"
          target="_blank"
        >
          {site['footer-source-label']}
        </a>
      </div>
    </footer>
  )
}
