import { useEffect, useState } from 'react'

function Color() {
  const [favoriteColor, setFavoriteColor] = useState('red')

  useEffect(() => {
    window.alert('useEffect reached')
  }, [])

  const changeColor = () => setFavoriteColor('blue')

  return (
    <div className="component-output">
      <h3>My favorite color is <strong>{favoriteColor}</strong>.</h3>
      <div>
        <button className="action-button" type="button" onClick={changeColor}>
          Change color
        </button>
      </div>
    </div>
  )
}

export default Color