import { Component } from 'react'
import data from './data/data.json'

export default class Example1 extends Component {
  render() {
    return (
      <section className="data-section">
        <div className="section-heading"><span className="section-index">02A</span><h3>Social links</h3></div>
        <ul className="social-list">
          {data.SocialMedias.map((url) => (
            <li key={url}><a href={url} target="_blank" rel="noreferrer">{new URL(url).hostname.replace('www.', '')}<span aria-hidden="true">↗</span></a></li>
          ))}
        </ul>
      </section>
    )
  }
}