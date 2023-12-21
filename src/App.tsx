import AuthLayout from './_auth/AuthLayout'
import SigninForm from './_auth/forms/SigninForm'
import SignupForm from './_auth/forms/SignupForm'
import RootLayout from './_root/RootLayout'
import AllUsers from './_root/pages/AllUsers'
import CreatePost from './_root/pages/CreatePost'
import Explore from './_root/pages/Explore'
import Home from './_root/pages/Home'
import PostDetails from './_root/pages/PostDetails'
import Profile from './_root/pages/Profile'
import Saved from './_root/pages/Saved'
import UpdatePost from './_root/pages/UpdatePost'
import UpdateProfile from './_root/pages/UpdateProfile'
import { Toaster } from './components/ui/toaster'
import './globals.css'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <main className='flex h-screen'>
      <Routes>
        <Route element={<AuthLayout />} >
          <Route path="/sign-in" element={<SigninForm />} />
          <Route path="/sign-up" element={<SignupForm />} />
        </Route>

        <Route element={<RootLayout />} >
          <Route index element={<Home />} />
          <Route path='/explore' element={<Explore />} />
          <Route path='/saved' element={<Saved />} />
          <Route path='/all-users' element={<AllUsers />} />
          <Route path='/create-post' element={<CreatePost />} />
          <Route path='/update-post/:id' element={<UpdatePost />} />
          <Route path='/posts/:id' element={<PostDetails />} />
          <Route path='/profile/:id/*' element={<Profile />} /> 
          <Route path='/update-profile/:id' element={<UpdateProfile />} />
        </Route>
      </Routes>

      <Toaster />
    </main>
  )
}

export default App
