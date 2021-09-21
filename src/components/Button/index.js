/* eslint-disable no-unused-vars */
import './index.css'

const Button = props => {
  const {page} = props

  const renderPageButtons = () => {
    console.log()
  }

  return (
    <li>
      <button type="button" className="button">
        {page}
      </button>
    </li>
  )
}

export default Button
