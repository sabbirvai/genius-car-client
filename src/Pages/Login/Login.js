import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import img from '../../assets/images/login/login.svg';
import { AuthContext } from '../../contexts/AuthProvider/AuthProvider';
import { FcGoogle } from "react-icons/fc";
import { BsFacebook, BsGithub } from "react-icons/bs";
import { toast } from 'react-toastify';

const Login = () => {

    const { login, signInWithGoogle, signInWithGitHub } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const from = location.state?.from?.pathname || '/';

    const handleLogin = event =>{
        event.preventDefault();
        const form = event.target;
        const email = form.email.value;
        const password = form.password.value;

        login(email, password)
            .then(result => {
                toast.success('Login Success!')
                const user = result.user;
                const currentUser = {
                    email: user.email
                }
                console.log(currentUser);

                // get jwt token
                fetch('https://genius-car-server-virid-sigma.vercel.app/jwt', {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify(currentUser)
                })       
                    .then(res => res.json())
                    .then(data => {
                        console.log(data);
                        // local Storage is the easiest but not the best place
                        localStorage.setItem('Genius-token', data.token)
                        navigate(from, {replace: true})
                    })
            })
            .catch(error => toast.error(error.message))
    }

    const handleGoogleSignIn = () => {
        signInWithGoogle()
            .then(result => {
            console.log(result.user);
            navigate(from, {replace: true})    
        })
    }

    const handleGirHub = () => {
        signInWithGitHub()
            .then(result => {
            console.log(result.user);
            navigate(from, {replace: true})    
        })
    }

    return (
        <div className="hero w-full my-20">
            <div className="hero-content grid gap-20 md:grid-cols-2 flex-col lg:flex-row">
                <div className="text-center lg:text-left">
                    <img className='w-3/4' src={img} alt="" />
                </div>
                <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100 py-20">
                    <h1 className="text-5xl text-center font-bold">Login</h1>
                    <form onSubmit={handleLogin} className="card-body">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input type="text" name='email' placeholder="email" className="input input-bordered" />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input type="password" name='password' placeholder="password" className="input input-bordered" />
                            <label className="label">
                                <Link to="" className="label-text-alt link link-hover">Forgot password?</Link> 
                            </label>
                        </div>
                        <div className="form-control mt-6">
                            <input className="btn btn-primary" type="submit" value="Login" />
                        </div>
                    </form>

                    <div className='flex items-center pt-4 space-x-1'>
                        <div className='flex-1 h-px sm:w-16 dark:bg-gray-700'></div>
                        <p className='px-3 text-sm dark:text-gray-400'>
                            Login with social accounts
                        </p>
                        <div className='flex-1 h-px sm:w-16 dark:bg-gray-700'></div>
                        
                    </div>

                    <div className='flex justify-center space-x-4 m-0'>
                        <button onClick={handleGoogleSignIn} aria-label='Log in with Google' className='p-3 rounded-sm'><FcGoogle/></button>
                            {/* onClick={handleFacebook}       */}
                        <button aria-label='Log in with Facebook' className='p-3 rounded-sm'>
                            <BsFacebook/> </button>
                        <button onClick={handleGirHub} aria-label='Log in with GitHub' className='p-3 rounded-sm'>
                            <BsGithub/>
                        </button>
                    </div>

                    <p className='text-center'>New to Genius Car <Link className='text-orange-600 font-bold' to="/signup">Sign Up</Link> </p>
                </div>
            </div>
        </div>
    );
};

export default Login;