import { useEffect, useState } from 'react'
import { EyeOff } from 'lucide-react';
import '../Login.css'
import Overlay from '../components/Overlay';
import axios from 'axios';

const SignInHandler = (props) => {
    const [isSignUp, setIsSignUp] = useState(true);
    const [signInStatus, setSignInStatus] = useState(0);
    const [state, setState] = useState({
        name: "",
        email: "",
        password: ""
    });

    let urlPage = "signin";
    if (isSignUp)
        urlPage = "signup";
    const handleChange = (evt) => {
        evt.preventDefault();
        const value = evt.target.value;
        setState({
            ...state,
            [evt.target.name]: value
        });
        let eye = document.querySelector('.hide-eye');
        if (state.password.length > 0) {
            eye.classList.remove('hidden');
        }
        else
            eye.classList.add('hidden');
    }

    const handleEyeClick = () => {
        let pass_input = document.querySelector('.password-input');
        if (pass_input.type === 'text')
            pass_input.type = 'password';
        else
            pass_input.type = 'text';
    }

    const postData = async () => {
        await axios.post(`${ import.meta.env.Railway_URL }/${ urlPage }`, state).then((response) => {
            if (response.status === 200) {
                props.setLoggedIn(true);
                console.log(state.email, " Name: ", state.name);
                localStorage.setItem('userName', JSON.stringify(state.email));
                if (state.name)
                    localStorage.setItem('name', JSON.stringify(state.name));
                else
                    localStorage.setItem('name', JSON.stringify(response.data.data.name));
                console.log("Name in login: ", response.data.data.name);
                setState({
                    name: "",
                    email: "",
                    password: "",
                });
                let warning = document.getElementById('warningLine');
                warning.style.display = 'none';
                localStorage.setItem('LoggedIn', 'true');
                props.setActiveTab('dashboard');
                console.log("Ye baat");
            }
            else
                console.log("No baat Failed");
            setSignInStatus(response.status);
            console.log("Data Recieved: ", response.status, signInStatus);
        }).catch((err) => {
            console.log("Error message is this: ", err);
            setSignInStatus(err.response.status);
        })
    }

    const handleSubmit = (evt) => {
        evt.preventDefault();
        if (state.password.length < 8) {
            setSignInStatus(400);
            return;
        }
        postData();
        console.log(state, signInStatus, props.LoggedIn);
        let warning = document.getElementById('warningLine');
        warning.style.display = 'inline';
        setState({
            name: "",
            email: "",
            password: "",
        });
        // props.setActiveTab('dashboard');
        // window.location.reload();
    }

    useEffect(() => {
        if (props.type === "signIn")
            setIsSignUp(false);
    }, [props.type])
    useEffect(() => {
        if (isSignUp) {
            let container = document.querySelector('#signup-container');
            container.classList.remove('animate_form_right');
            container.classList.add('animate_form_left');
        }
        else {
            let container = document.querySelector('#signin-container');
            container.classList.add('animate_form_right');
            container.classList.remove('animate_form_left');
        }
    }, [isSignUp])
    return (
        <div className='flex items-center justify-center h-full w-full'>
            {!isSignUp && (
                <div id='signin-container' className='relative bg-white pr-12 pl-12 pt-16 pb-16 text-center shadow-gray-500 shadow-2xl rounded-l-3xl'
                    style={{ transform: 'translate(-10rem)' }}>
                    <h1 className='pb-10 text-[24px] font-bold'>Sign In</h1>
                    <div className='Login_input flex flex-col justify-center items-center'>
                        <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            value={state.email}
                            required
                            onChange={handleChange}
                            style={signInStatus === 404 ? { border: '1px solid red' } : {}}
                        />
                        <input
                            className='password-input'
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={state.password}
                            required
                            onChange={handleChange}
                            style={signInStatus === 400 ? { border: '1px solid red' } : {}}
                        />
                        <span className='hide-eye cursor-pointer hidden' onClick={handleEyeClick} style={{ transform: 'translate(7.5rem, -4.5rem)' }}>
                            <EyeOff />
                        </span>
                        <p id='warningLine' className='text-[10px] text-red-600 hidden' style={{ transform: 'translate(-5rem, -1.5rem)' }}>Incorrect credentials. Try Again</p>
                    </div>
                    <p className='pb-7 text-blue-600'>Forgot Your Password</p>
                    <button type='submit' className='bg-indigo-600 pt-3.5 pb-3.5 pl-7 pr-7 rounded-3xl text-white font-bold' onClick={handleSubmit}>Sign In</button>
                </div>
            )}
            <Overlay isSignUp={isSignUp} setIsSignUp={setIsSignUp} />
            {isSignUp && (
                <div id='signup-container' className='relative bg-white pr-12 pl-14 pt-10 pb-12 text-center shadow-gray-500 shadow-2xl rounded-r-3xl'
                    style={{ transform: 'translate(10.6rem)' }}>
                    <h1 className='pb-10 text-[24px] font-bold'>Sign Up</h1>
                    <div className='Signup_input flex flex-col justify-center items-center'>
                        <input
                            type="text"
                            placeholder="Name"
                            name="name"
                            value={state.name}
                            required
                            onChange={handleChange}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            value={state.email}
                            required
                            onChange={handleChange}
                        />
                        <input
                            className='password-input'
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={state.password}
                            required
                            onChange={handleChange}
                        />
                    </div>
                    <span className='hide-eye cursor-pointer hidden relative left-65 bottom-14' onClick={handleEyeClick}>
                        <EyeOff />
                    </span>
                    <p className='pb-7 text-blue-600'>Forgot Your Password</p>
                    <button type='submit' className='bg-indigo-600 pt-3.5 pb-3.5 pl-7 pr-7 rounded-3xl text-white font-bold' onClick={handleSubmit}>Sign Up</button>
                </div>
            )}
        </div>
    )
}

export default SignInHandler