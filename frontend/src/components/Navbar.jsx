import React from 'react'

const Navbar = () => {
    return (
        <nav className='flex justify-between items-center bg-slate-900 text-white p-4 md:px-44'>
            <div className='font-bold'>
                <span className='text-green-500'>&lt;</span>
                Pass
                <span className='text-green-500'>OP/&gt;</span>
            </div>
            <div className='flex gap-4'>
                <a href='#' className='hover:font-bold'>Home</a>
                <a href='#' className='hover:font-bold'>About</a>
                <a href='#' className='hover:font-bold'>Contact</a>
            </div>

            
        </nav>
    )
}

export default Navbar
