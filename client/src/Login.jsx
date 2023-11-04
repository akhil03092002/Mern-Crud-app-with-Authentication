import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
function Login() {
    const [email,setEmail]=useState()
    const [password,setPassword]=useState()
    const navigate=useNavigate()


    axios.defaults.withCredentials=true
  
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/login', { email, password }) 
            .then(res => {
                console.log(res.data);
                if (res.data.status === "success") {
                    if (res.data.role === "admin") {
                        navigate("/dashboard");
                    } else {
                        navigate('/home');
                    }
                }
            })
            .catch(err => console.log(err));
    };
  return (
    <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
        <div className="bg-white p-3 rounded w-25">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email">
                        <strong>Email</strong>
                    </label>
                    <input 
                    type="email" 
                        placeholder='enter email'
                        autoComplete='off'
                        name='email'
                        className='form-control rounded-0'
                        onChange={(e)=>setEmail(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="email">
                        <strong>password</strong>
                    </label>
                    <input 
                    type="password" 
                        placeholder='enter password'
                        autoComplete='off'
                        name='email'
                        className='form-control rounded-0'
                        onChange={(e)=>setPassword(e.target.value)}
                    />
                </div>
                <button type='submit' className='btn btn-success border w-100 bg-primary'>Login</button>
            </form>
            <p>Do not have account ?</p>
            <Link to="/" className='btn btn-default border w-100 bg-light'>Sign up</Link>
         

        </div>
    </div>
  )
}

export default Login
















//  axios.post('http://localhost:3001/login', { email, password }) 



