import { Component, createElement as h } from 'react'

export default class Customers extends Component {
  constructor(props) {
    super(props)
    this.state = { customers: [], loading: true, error: '' }
  }

  async componentDidMount() {
    try {
      const response = await fetch('/api/customers/')
      if (!response.ok) throw new Error(`Request failed with status ${response.status}`)
      const customers = await response.json()
      this.setState({ customers, loading: false })
    } catch (error) {
      this.setState({ error: error.message || 'Unable to load customers.', loading: false })
    }
  }

  render() {
    const { customers, loading, error } = this.state

    return h('section', { className: 'data-panel', 'aria-labelledby': 'customers-title' },
      h('div', { className: 'panel-heading' },
        h('span', { className: 'panel-index' }, '02'),
        h('div', null,
          h('p', { className: 'endpoint-label' }, 'GET /api/customers/'),
          h('h2', { id: 'customers-title' }, 'Customers'),
        ),
      ),
      h('ul', { className: 'record-list' },
        loading && h('li', { className: 'panel-message' }, 'Loading customers…'),
        error && h('li', { className: 'panel-message error-message', role: 'alert' }, error),
        customers.map((customer) => h('li', { className: 'record', key: customer.id },
          h('span', { className: 'record-id' }, String(customer.id).padStart(2, '0')),
          h('span', { className: 'record-name' }, `${customer.firstName} ${customer.lastName}`),
          h('span', { className: 'record-arrow', 'aria-hidden': true }, '↗'),
        )),
      ),
    )
  }
}