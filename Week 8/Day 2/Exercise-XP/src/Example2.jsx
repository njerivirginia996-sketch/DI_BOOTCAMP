import { Component } from 'react'
import data from './data/data.json'

export default class Example2 extends Component {
  render() {
    return (
      <section className="data-section">
        <div className="section-heading"><span className="section-index">02B</span><h3>Skill sets</h3></div>
        <div className="skill-groups">
          {data.Skills.map((group) => (
            <div className="skill-group" key={group.Area}>
              <h4>{group.Area}</h4>
              <ul className="skill-list">
                {group.SkillSet.map((skill) => (
                  <li key={skill.Name} className={skill.Hot ? 'is-hot' : ''}>
                    {skill.Name}{skill.Hot && <span aria-label="featured">★</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    )
  }
}