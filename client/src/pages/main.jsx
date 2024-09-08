import {Link, Outlet} from "react-router-dom"
import Logo from "../assets/555.png";



const Main = () => {


  return(
    <div>
        <nav className="navbar">
          <Link to="/">
           <img src={Logo} alt="Logo" className="logo" />
        </Link>
        <div className="nav-container">
          <div className="nav-links">
            <Link to="/" className="nav-item">Dashboard</Link>
            <Link to="/transactions" className="nav-item">Transactions</Link>
            <Link to="/budget" className="nav-item">Budget</Link>
            <Link to="/reports" className="nav-item">Reports</Link>
            <Link to="/profile" className="nav-item">My Profile</Link>
          </div>
          <Link to="/profile">
            <img src={Logo} alt="Profile" className="profile-pic" />
          </Link>
        </div>
      </nav>
      <div className="container">
        <div className="left-bar">
          <Link to="/" className="left-bar-item">Dashboard</Link>
          <Link to="/transactions" className="left-bar-item">Transactions</Link>
          <Link to="/budget" className="left-bar-item">Budget</Link>
          <Link to="/reports" className="left-bar-item">Reports</Link>
          <Link to="/profile" className="left-bar-item">My Profile</Link>
        </div>
        <div className="main">
          <Outlet/>
        </div>
      </div>
    </div>
  )
};

export default Main;