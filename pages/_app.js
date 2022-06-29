import '../styles/globals.css'
import { useMemo, useState } from 'react'
import { UserContext } from '../context/UserContext'

export default function App ({ Component, pageProps }) {
  const [user, setUser] = useState(null)
  const value = useMemo(() => ({ user, setUser }), [user, setUser])

  return (
    <UserContext.Provider value={value}>
      <Component {...pageProps} />
    </UserContext.Provider>
  )
}
