import UAuth from '@uauth/js'
import React, {useEffect, useState} from 'react'
import ReactDOM from 'react-dom'

const uauth = new UAuth({
  clientID: '096fea0f-d284-4896-b847-c8e21e7f173e',
  scope: 'openid wallet',
  redirectUri: 'http://localhost:5000',
})

const App: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error>()
  const [user, setUser] = useState<any>()
  const [authorization, setAuthorization] = useState<any>()

  // Check to see if the user is inside the cache
  useEffect(() => {
    setLoading(true)
    uauth
      .user()
      .then(setUser)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  // Login with a popup and save the user
  const handleLogin = () => {
    setLoading(true)
    uauth
      .loginWithPopup()
      .then(setAuthorization)
      .then(() => uauth.user().then(setUser))
      .catch(setError)
      .finally(() => setLoading(false))
  }

  // Logout and delete user
  const handleLogout = () => {
    setLoading(true)
    uauth
      .logout()
      .then(() => setUser(undefined))
      .catch(setError)
      .finally(() => setLoading(false))
  }

  if (loading) {
    return <>Loading...</>
  }

  if (error) {
    console.error(error)
    return <>{String(error.stack)}</>
  }

  if (user && authorization) {
    return (
      <>
        <b>User</b>
        <pre>{JSON.stringify(user, null, 2)}</pre>
        <br />
        <b>Proof</b>
        <pre>
          {JSON.stringify(uauth.getAuthorizationProof(authorization), null, 2)}
        </pre>
        <br />
        <b>Authorization</b>
        <pre>{JSON.stringify(authorization, null, 2)}</pre>
        <button onClick={handleLogout}>Logout</button>
      </>
    )
  }

  return <button onClick={handleLogin}>Login with Unstoppable</button>
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
)
