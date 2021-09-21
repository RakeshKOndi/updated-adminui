/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */
import {Component} from 'react'
import {GrNext, GrPrevious} from 'react-icons/gr'
import UserRow from './components/Rows'
import PaginationButtons from './components/Button'
import './App.css'

class App extends Component {
  state = {usersData: [], perPageUsers: []}

  componentDidMount() {
    this.getUsersData()
  }

  getUsersData = async () => {
    const apiUrl =
      'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json'

    const options = {
      method: 'GET',
      ContentType: 'application/json',
    }

    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const data = await response.json()
      console.log(data, 'Json Response')

      this.setState({usersData: data, perPageUsers: data.slice(0, 10)})
    }
  }

  getNumberOfPages = () => {
    const {usersData} = this.state

    const pageNumbers = []

    for (let i = 1; i < Math.ceil(usersData.length / 10 + 1); i++) {
      pageNumbers.push(i)
    }

    return pageNumbers
  }

  renderSearchBar = () => (
    <div className="search-cont">
      <input
        type="search"
        className="search-input"
        placeholder="Search by Name or Email or Role"
      />
    </div>
  )

  renderTable = () => {
    const {perPageUsers} = this.state

    return (
      <div className="table-cont">
        <table>
          <thead>
            <tr>
              <th className="header">
                <input
                  type="checkbox"
                  id="header-checkbox"
                  className="column-checkbox"
                />
              </th>
              <th className="header">Name</th>
              <th className="header">Email</th>
              <th className="header">Role</th>
              <th className="header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {perPageUsers.map(user => (
              <UserRow user={user} key={user.id} />
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  render() {
    const {usersData} = this.state
    const pageArrays = this.getNumberOfPages()
    console.log(pageArrays, 'pageNumbers')

    return (
      <div className="app">
        <section className="body-section">
          {this.renderSearchBar()}
          {this.renderTable()}
        </section>
        <footer>
          <button type="button" className="delete-selected">
            Delete Selected
          </button>
          <ul className="buttons-cont">
            <button type="button" className="next-buttons">
              <GrPrevious />
            </button>
            {pageArrays.map(page => (
              <PaginationButtons key={page} page={page} />
            ))}
            <button type="button" className="next-buttons">
              <GrNext />
            </button>
          </ul>
        </footer>
      </div>
    )
  }
}

export default App
