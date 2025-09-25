
const Overlay = ({ isSignUp, setIsSignUp }) => {

    const handleClick = () => {
        setIsSignUp(!isSignUp);
        let container = document.querySelector('#overlay-container');
        if (isSignUp) {   
            container.classList.remove('animate_right');
            container.classList.add('animate_left');
        }
        else {
            container.classList.add('animate_right');
            container.classList.remove('animate_left');
        }
    }
    return (
        <div
            id='overlay-container'
            className='absolute bg-indigo-600 h-[79%] w-[29%] flex flex-col justify-center items-center text-white text-center shadow-3xl z-10'
            style={isSignUp ? {
                transform:'translate(-14rem)', borderBottomLeftRadius: '20px', borderTopLeftRadius: '20px'
            } : { transform: 'translate(14.6rem)', borderBottomRightRadius: '20px', borderTopRightRadius: '20px' }} >
            <h1 className='font-bold pb-3 text-2xl'>Hello Friends!</h1>
            <p>Enter your personal details and start <br /> journey with us</p>
            <button className='border-2 pt-3.5 pb-3.5 pl-7 pr-7 mt-5 rounded-3xl text-white font-bold'
                onClick={handleClick}
            >Sign Up</button>
        </div>
    )
}

export default Overlay