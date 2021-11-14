/* eslint-disable no-undef */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */
import {Component} from 'react'
import {GrNext, GrPrevious} from 'react-icons/gr'
import Rows from './components/Rows'
import Button from './components/Button'

import './App.css'

const viewStatus = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  dataView: 'SUCCESS',
  noDataView: 'NODATA',
  failure: 'FAILURE',
}

class App extends Component {
  state = {
    // eslint-disable-next-line react/no-unused-state
    dataViewStatus: viewStatus.initial,
    masterCopyUsersData: [],
    usersData: [],
    perPageUsers: [],
    search: '',
    checkAll: false,
    selectedButton: 1,
  }

  componentDidMount() {
    this.getUsersData()
  }

  getUsersData = async () => {
    this.setState({dataViewStatus: viewStatus.inProgress})
    const apiUrl =
      'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json'

    const options = {
      method: 'GET',
      ContentType: 'application/json',
    }

    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const data = await response.json()

      const formattedData = data.map(item => ({
        id: item.id,
        name: item.name,
        email: item.email,
        role: item.role,
        checked: false,
      }))

      this.setState({
        masterCopyUsersData: formattedData,
        usersData: formattedData,
        perPageUsers: formattedData.slice(0, 10),
        dataViewStatus: viewStatus.dataView,
      })
    } else {
      this.setState({dataViewStatus: viewStatus.failure})
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

  setPerPageUsers = page => {
    const {usersData} = this.state
    const startIndex = page * 10 - 10
    const endIndex = startIndex + 10

    this.setState({
      perPageUsers: usersData.slice(startIndex, endIndex),
      selectedButton: page,
      checkAll: false,
    })
  }

  toggleCheckboxes = () => {
    this.setState(prevState => ({
      perPageUsers: prevState.perPageUsers.map(user => {
        if (user.checked) {
          return {...user, checked: false}
        }
        return {...user, checked: true}
      }),
      checkAll: !prevState.checkAll,
    }))
  }

  toggleCheckbox = id => {
    this.setState(prevState => ({
      perPageUsers: prevState.perPageUsers.map(user => {
        if (user.id === id) {
          return {...user, checked: !user.checked}
        }
        return user
      }),
    }))
  }

  deleteUser = id => {
    this.setState(prevState => ({
      perPageUsers: prevState.perPageUsers.filter(user => user.id !== id),
    }))
  }

  deleteSelectedUsers = () => {
    const {checkAll} = this.state

    // eslint-disable-next-line no-unused-expressions
    checkAll && this.setState({perPageUsers: [], checkAll: false})
  }

  changeSearchQuery = event => {
    this.setState({search: event.target.value})
  }

  enterSearchQuery = event => {
    const {search, masterCopyUsersData} = this.state

    if (event.key === 'Enter') {
      const searchResultData = masterCopyUsersData.filter(user => {
        const userName = user.name.toLowerCase().includes(search.toLowerCase())
        const userEmail = user.email
          .toLowerCase()
          .includes(search.toLowerCase())
        const userRole = user.role.toLowerCase().includes(search.toLowerCase())

        if (userName || userEmail || userRole) {
          return user
        }
        return null
      })

      console.log(searchResultData)

      this.setState({
        usersData: searchResultData,
        perPageUsers: searchResultData.slice(0, 10),
        search: '',
      })
    }
  }

  goToFirstPage = () => {
    this.setPerPageUsers(1)
  }

  goToPreviousPage = () => {
    const {selectedButton} = this.state
    // const pageNumbers = this.getNumberOfPages().length;
    const prevPage = selectedButton - 1
    this.setPerPageUsers(prevPage > 1 ? prevPage : 1)
  }

  goToLastPage = () => {
    const lastPage = this.getNumberOfPages().length
    this.setPerPageUsers(lastPage)
  }

  goToNextPage = () => {
    const {selectedButton} = this.state
    const pageNumbers = this.getNumberOfPages().length
    const nextPage = selectedButton + 1
    this.setPerPageUsers(nextPage < pageNumbers ? nextPage : pageNumbers)
  }

  renderSearchBar = () => {
    const {search} = this.state

    return (
      <div className="search-container">
        <input
          type="search"
          value={search}
          onChange={this.changeSearchQuery}
          onKeyDown={this.enterSearchQuery}
          className="search-input"
          placeholder="Search by name,email or role"
        />
      </div>
    )
  }

  renderTable = () => {
    const {perPageUsers, checkAll} = this.state

    return (
      <>
        <div className="table-container">
          <table>
            <thead>
              <tr className="table-header">
                <th className="column-header">
                  <input
                    type="checkbox"
                    id="header-checkbox"
                    className="column-checkbox"
                    onChange={this.toggleCheckboxes}
                    checked={checkAll}
                  />
                </th>
                <th className="column-header">Name</th>
                <th className="column-header">Email</th>
                <th className="column-header">Role</th>
                <th className="column-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {perPageUsers.map(user => (
                <Rows
                  user={user}
                  toggleCheckbox={this.toggleCheckbox}
                  deleteUser={this.deleteUser}
                  key={user.id}
                />
              ))}
            </tbody>
          </table>
        </div>
        {this.renderFooterSection()}
      </>
    )
  }

  renderFooterSection = () => {
    const {selectedButton} = this.state

    const pageArrays = this.getNumberOfPages()

    return (
      <footer>
        <button
          type="button"
          onClick={this.deleteSelectedUsers}
          className="delete-selected"
        >
          Delete Selected
        </button>
        <ul className="buttons-container">
          <button
            type="button"
            onClick={this.goToPreviousPage}
            className="prev-buttons"
          >
            <GrPrevious />
          </button>
          {pageArrays.map(page => (
            <Button
              key={page}
              setPerPageUsers={this.setPerPageUsers}
              isActive={selectedButton === page}
              page={page}
            />
          ))}
          <button
            type="button"
            onClick={this.goToNextPage}
            className="prev-buttons"
          >
            <GrNext />
          </button>
        </ul>
      </footer>
    )
  }

  getStatusView = () => {
    const {dataViewStatus} = this.state

    switch (dataViewStatus) {
      case viewStatus.dataView:
        return this.renderTable()

      default:
        return null
    }
  }

  render() {
    console.log('Render')

    return (
      <div className="app">
        <section className="app-body-section">
          {this.renderSearchBar()} {this.getStatusView()}
        </section>
      </div>
    )
  }
}

export default App
