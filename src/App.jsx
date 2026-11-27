import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router'
import './App.css'
import RequireAuth from './components/RequireAuth.jsx'
import AuthCallback from './pages/AuthCallback.jsx'
import Create from './pages/Create.jsx'
import Feed from './pages/Feed.jsx'
import Landing from './pages/Landing.jsx'
import MyProfile from './pages/MyProfile.jsx'
import Profile from './pages/Profile.jsx'
import SignIn from './pages/SignIn.jsx'

export default function App() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<SignIn />} />
      <Route path="/signup" element={<SignIn />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/home" element={<Feed />} />
      <Route path="/profile/:handle" element={<Profile />} />
      <Route element={<RequireAuth />}>
        <Route path="/create" element={<Create />} />
        <Route path="/profile" element={<MyProfile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
