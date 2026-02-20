import './App.css'
import { useEffect, useState } from 'react'

function App() {
  const [message, setMessage] = useState('Loading...')
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5000/api/message')
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`)
        }
        const data = await res.json()
        setMessage(data.message || 'No message received')
      } catch (err) {
        console.error(err)
        setError('Could not reach Flask backend. Is it running on port 5000?')
      }
    }

    fetchMessage()
  }, [])

  return (
    <>
      <h1>Sports App</h1>
      <p>This React frontend is talking to your Flask backend.</p>
      <div className="card">
        <h2>Backend message</h2>
        {error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          <p>{message}</p>
        )}
      </div>
    </>
  )
}

export default App


