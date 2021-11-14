/* eslint-disable no-unused-vars */
import './index.css'

const Button = props => {
  const {page, setPerPageUsers, isActive} = props

  const buttonSelected = isActive ? 'selected-button' : ''

  const renderPageButtons = () => {
    setPerPageUsers(page)
  }

  return (
    <li>
      <button
        type="button"
        onClick={renderPageButtons}
        className={`button ${buttonSelected}`}
      >
        {page}
      </button>
    </li>
  )
}

export default Button
