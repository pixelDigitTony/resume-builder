import type { Resume } from '../../types/resume'
import type { SidebarLayout } from '../../types/pageLayout'
import { normalizeEmail, normalizePhone } from '../../utils/linkUtils'
import { ContactLink } from './ContactLink'
import { ProfilePhoto } from './ProfilePhoto'
import {
  GithubIcon,
  GlobeIcon,
  LinkedinIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
} from './SidebarIcons'

interface SidebarSectionProps {
  resume: Resume
  layout: SidebarLayout
}

export function SidebarSection({ resume, layout }: SidebarSectionProps) {
  const { personal, skillGroups, education, languages, customLinks } = resume
  const selectedSkillGroups = skillGroups.filter((group) =>
    layout.skillGroupIds.includes(group.id),
  )
  const visibleLanguages = languages.filter(Boolean)
  const hasContact =
    personal.phone ||
    personal.email ||
    personal.location ||
    personal.linkedin ||
    personal.github ||
    personal.portfolio ||
    (customLinks ?? []).some((link) => link.url.trim())

  return (
    <aside className="resume-sidebar">
      {layout.showPhoto && (
        <ProfilePhoto photoUrl={personal.photoUrl} fullName={personal.fullName} />
      )}

      {layout.showContact && hasContact && (
        <section
          className="resume-sidebar-block"
          data-sidebar-block="contact"
          data-sidebar-block-type="contact"
        >
          <h2 className="resume-sidebar-heading">Contact</h2>
          <ul className="resume-sidebar-list">
            {personal.phone && (
              <li className="resume-contact-item">
                <div className="resume-contact-row">
                  <span className="resume-contact-icon" aria-hidden="true">
                    <PhoneIcon className="resume-sidebar-icon" />
                  </span>
                  <a className="resume-link resume-contact-text" href={normalizePhone(personal.phone)}>
                    {personal.phone}
                  </a>
                </div>
              </li>
            )}
            {personal.email && (
              <li className="resume-contact-item">
                <div className="resume-contact-row">
                  <span className="resume-contact-icon" aria-hidden="true">
                    <MailIcon className="resume-sidebar-icon" />
                  </span>
                  <a className="resume-link resume-contact-text" href={normalizeEmail(personal.email)}>
                    {personal.email}
                  </a>
                </div>
              </li>
            )}
            {personal.location && (
              <li className="resume-contact-item">
                <div className="resume-contact-row">
                  <span className="resume-contact-icon" aria-hidden="true">
                    <MapPinIcon className="resume-sidebar-icon" />
                  </span>
                  <span className="resume-contact-text">{personal.location}</span>
                </div>
              </li>
            )}
            <ContactLink
              href={personal.linkedin}
              fallbackLabel="LinkedIn"
              icon={<LinkedinIcon className="resume-sidebar-icon" />}
            />
            <ContactLink
              href={personal.github}
              fallbackLabel="GitHub"
              icon={<GithubIcon className="resume-sidebar-icon" />}
            />
            <ContactLink
              href={personal.portfolio}
              fallbackLabel="Portfolio"
              icon={<GlobeIcon className="resume-sidebar-icon" />}
            />
            {(customLinks ?? []).map((link) => (
              <ContactLink
                key={link.id}
                href={link.url}
                label={link.label}
                fallbackLabel="Link"
                icon={<GlobeIcon className="resume-sidebar-icon" />}
              />
            ))}
          </ul>
        </section>
      )}

      {selectedSkillGroups.length > 0 && (
        <section className="resume-sidebar-block">
          {layout.showSkillsHeading && (
            <h2
              className="resume-sidebar-heading"
              data-sidebar-block="skills-heading"
              data-sidebar-block-type="skills-heading"
            >
              Skills
            </h2>
          )}
          <div className="resume-skill-groups">
            {selectedSkillGroups.map((group) => (
              <div
                key={group.id}
                className="resume-skill-group"
                data-sidebar-block={`skill-${group.id}`}
                data-sidebar-block-type="skill-group"
                data-skill-group-id={group.id}
              >
                <h3 className="resume-sidebar-strong">{group.label}</h3>
                <div className="resume-skill-labels">
                  {group.skills.filter(Boolean).map((skill, index) => (
                    <span key={`${skill}-${index}`} className="resume-skill-label">
                      <span className="resume-skill-label-text">{skill}</span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {layout.showLanguages && visibleLanguages.length > 0 && (
        <section
          className="resume-sidebar-block"
          data-sidebar-block="languages"
          data-sidebar-block-type="languages"
        >
          <h2 className="resume-sidebar-heading">Languages</h2>
          <div className="resume-skill-labels">
            {visibleLanguages.map((language, index) => (
              <span key={`${language}-${index}`} className="resume-skill-label">
                <span className="resume-skill-label-text">{language}</span>
              </span>
            ))}
          </div>
        </section>
      )}

      {layout.showEducation && (
        <section
          className="resume-sidebar-block resume-sidebar-block--end"
          data-sidebar-block="education"
          data-sidebar-block-type="education"
        >
          <h2 className="resume-sidebar-heading">Education</h2>
          <div className="resume-sidebar-text">
            <p className="resume-sidebar-strong">{education.degree}</p>
            <p>{education.institution}</p>
            <p>{education.location}</p>
            {education.graduationYear && <p>Class of {education.graduationYear}</p>}
          </div>
        </section>
      )}
    </aside>
  )
}
