import React from 'react'

import site from '../content/site.json'
import { ArrowUpIcon } from './icons.tsx'

export const Footer: React.FC = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer__inner">
        <p className="footer__copyright">
          &copy; {year} {site.name}
        </p>
        <a className="footer__top" href="#main-content">
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
