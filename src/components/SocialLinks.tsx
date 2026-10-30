import React from 'react'

import type { SocialLink } from '../types.ts'
import { DiscordIcon, GitHubIcon } from './icons.tsx'

interface SocialLinksProps {
  links: SocialLink[]
}

export const SocialLinks: React.FC<SocialLinksProps> = ({ links }) => (
  <ul className="socials">
    {links.map((link: SocialLink) => (
      <li key={link.label}>
        <a
          className="socials__link"
          href={link.href}
          rel="noreferrer"
          target="_blank"
          title={link.label}
        >
          {link.icon === 'github' && <GitHubIcon />}
          {link.icon === 'discord' && <DiscordIcon />}
          {link.icon === 'spigot' && (
            <img
              alt=""
              aria-hidden="true"
              className="socials__image"
              height="22"
              src="/images/spigotmc.ico"
              width="22"
            />
          )}
          <span className="socials__label">{link.label}</span>
        </a>
      </li>
    ))}
  </ul>
)
