import {useForm} from "react-hook-form";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup"
import {Link, useNavigate} from "react-router-dom"


const SignUp = () => {

  const schema = yup.object().shape({
    fullname: yup.string().required("Your Name is Required"),
    email: yup.string().email("Email is Incorrect").required("Email is Required"),
    password: yup.string().min(6, "Password Must be at Least 6 Charecters").max(30, "Password Must be less than 30 charecters").matches(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$.]).*$/,
      "Password Must Contain at Least One Uppercase Letter, One Number, and One Special Character (@, $, or .)"
    ).required("Password is Required"),
    confirmPassword: yup.string().oneOf([yup.ref("password"), null],"Passwords Don't Match"),
  });

  const {register, handleSubmit, formState:{errors}} = useForm({resolver: yupResolver(schema)});

  const navigate = useNavigate();

  const onSubmit = async (data) => {
   
    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        console.log('User registered successfully:', result);
        navigate("/");
      } else {
        console.error('Error:', result.msg);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return(
    <div className="sign-up">
      <h1>Sign Up to Track Your Finance</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="sign-up-form">
        <h2>Full Name:</h2>
        <input type="text" placeholder="Full Name" {...register("fullname")} />
        <p className="error-sign-up">{errors.fullname?.message}</p>
        <h2>Email:</h2>
        <input type="email" placeholder="Email" {...register("email")} />
        <p className="error-sign-up">{errors.email?.message}</p>
        <h2>Password:</h2>
        <input type="password" placeholder="Password" {...register("password")} />
        <p className="error-sign-up">{errors.password?.message}</p>
        <h2>Confirm Password:</h2>
        <input type="password" placeholder="Confirm Password" {...register("confirmPassword")} />
        <p className="error-sign-up">{errors.confirmPassword?.message}</p>
        <button type="submit">Sign Up</button>
        <p className="do-accaount">Already Have an Account?</p>
        <Link to="/sign-in" className="do-singin">Sign In</Link>
      </form>
    </div>
  )

}


export default SignUp;