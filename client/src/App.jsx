import './App.css'
import Main from './pages/main'
import SignIn from './pages/sign-in'
import SignUp from './pages/sign-up'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Transactions from './pages/transactions'
import Budget from './pages/budget'
import Reports from './pages/reports'
import Profile from './pages/profile'
import Dashboard from "./pages/dashboard"

function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/' element={<Main />} >
            <Route index element={<Dashboard />} />
            <Route path='/transactions' element={<Transactions />} />
            <Route path='/budget' element={<Budget />} />
            <Route path='/reports' element={<Reports />} />
            <Route path='/profile' element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
