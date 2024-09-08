import {Link, useNavigate} from "react-router-dom"
import {useForm} from "react-hook-form";
import { useState,  } from "react";



const SignIn = () => {

  const { register, handleSubmit, formState: { errors } } = useForm();

  const [login, setLogin] = useState("");

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (response.ok) {
        setLogin('Sign In successful');
        console.log('Login successful:', result);
        navigate("/");

      } else {
        setLogin('Invalid email or password');
        console.log('Login failed:', result.message);
      }
    } catch (error) {
      setLogin('An error occurred during login');
      console.error('Error during login:', error.message);
    }
  };
  

  return(
    <div className="sign-in">
      <h1>Sign In to Track Your Finance</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="sign-in-form">
        <h2>Email:</h2>
        <input type="email" {...register("email")} placeholder="Email" />
        <h2>Password:</h2>
        <input type="password" {...register("password")} placeholder="Password"/>
        <p className={login === 'Sign In successful' ? 'success' : 'error'}>
        {login}
        </p>
        <button type="submit">Sign In</button>
        <p className="dont-accaount">Don't Have an Account?</p>
        <Link to="/sign-up" className="dont-singup">Sign Up</Link>
      </form>

    </div>
  )
}

export default SignIn