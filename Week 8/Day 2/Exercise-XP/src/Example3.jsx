import { Component } from 'react'
import data from './data/data.json'

export default class Example3 extends Component {
  render() {
    return (
      <section className="data-section">
        <div className="section-heading"><span className="section-index">02C</span><h3>Experience</h3></div>
        <div className="experience-list">
          {data.Experiences.map((experience) => (
            <article className="experience-item" key={experience.companyName}>
              <div className="experience-mark" aria-hidden="true">{experience.companyName.slice(0, 1)}</div>
              <div className="experience-details">
                <h4><a href={experience.url} target="_blank" rel="noreferrer">{experience.companyName}</a></h4>
                {experience.roles.map((role) => (
                  <div className="role" key={`${experience.companyName}-${role.title}`}>
                    <strong>{role.title}</strong>
                    <p>{role.description}</p>
                    <span>{role.startDate} — {role.endDate} · {role.location}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    )
  }
}