import React from 'react'
import { useRef, useState, useEffect } from 'react';
import eyeoff from '../assets/eye-off.svg'
import eye from '../assets/eye.svg'
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

const Manager = () => {
    const ref = useRef();
    const [form, setForm] = useState({ site: "", username: "", password: "" });
    const [passwordArray, setPasswordArray] = useState([]);

    const getPasswords = async () => {
        let req = await fetch("http://localhost:3000/")
        let passwords = await req.json();
        setPasswordArray(passwords);
    }
    useEffect(() => {
        getPasswords()
    }, [])

    const showPassword = () => {
        const input = ref.current.previousSibling;
        if (input.type === "password") {
            input.type = "text";
            ref.current.firstChild.src = eye;
        } else {
            input.type = "password";
            ref.current.firstChild.src = eyeoff;
        }
    }

    const savePassword = async () => {
        if (form.site && form.username && form.password) {
            let passwordId = form.id ? form.id : uuidv4();

            // Only delete if editing an existing password
            if (form.id) {
                await fetch("http://localhost:3000/", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: form.id }) })
            }

            setPasswordArray([...passwordArray, { ...form, id: passwordId }])
            await fetch("http://localhost:3000/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, id: passwordId }) })
            setForm({ site: "", username: "", password: "" });
            toast.success('Password saved successfully!', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        } else {
            alert("Please fill all fields!");
        }
    }

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    const copyText = (text) => {
        toast.success('🦄 copied to clipboard!', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
        });
        navigator.clipboard.writeText(text)
    }

    const deletePassword = async (id) => {

        if (window.confirm("Are you sure you want to delete this password?")) {
            setPasswordArray(passwordArray.filter(item => item.id !== id));
            await fetch("http://localhost:3000/", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: form.id }) })
            toast.success('Password deleted!', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        }
        setForm({ site: "", username: "", password: "" });
    }
    const editPassword = (id) => {
        setForm({ ...passwordArray.filter(i => i.id === id)[0], id: id })
        setPasswordArray(passwordArray.filter(item => item.id !== id))
    }

    return (
        <div>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
            <div className='mycontainer md:w-[70%] min-h-[85vh] m-auto text-center bg-slate-100'>
                <h1 className='text-4xl font-bold pt-6'>
                    <span className='text-green-500'>&lt;</span>
                    Pass
                    <span className='text-green-500'>OP/&gt;</span>
                </h1>

                <p className='text-green-900 text-lg'>Your own password manager</p>

                <div className='flex flex-col gap-8 p-4 items-center'>
                    <input value={form.site} onChange={handleChange} placeholder='Enter website URL' className='p-4 py-1 border border-green-500 w-full rounded-full bg-white' name='site' type="text" />

                    <div className='flex md:flex-row flex-col gap-8 w-full'>
                        <input value={form.username} onChange={handleChange} placeholder='Enter Username' className='p-4 py-1 border border-green-500 w-full rounded-full bg-white' name='username' type="text" />
                        <div className='relative w-full'>
                            <input value={form.password} onChange={handleChange} placeholder='Enter Password' className='p-4 py-1 border border-green-500 w-full rounded-full bg-white' name='password' type="password" />
                            <span ref={ref} onClick={showPassword} className='absolute right-[5px] top-[4px] cursor-pointer'><img src={eyeoff} alt="" /></span>
                        </div>
                    </div>

                    <button onClick={savePassword} className='flex justify-center items-center gap-2 bg-green-600 hover:bg-green-400 w-fit px-6 py-1 rounded-full'>
                        <lord-icon
                            src="https://cdn.lordicon.com/jgnvfzqg.json"
                            trigger="loop">
                        </lord-icon>
                        Save
                    </button>
                </div>

                <div className="passwords">
                    <h2 className='font-bold text-2xl py-4'>Your Passwords</h2>
                    {(passwordArray.length === 0) && (
                        <div>No passwords to show</div>
                    )}
                    {(passwordArray.length > 0) && (
                        <table className='table-auto w-full rounded-md overflow-hidden'>
                            <thead className='bg-green-800 text-white'>
                                <tr>
                                    <th className="py-2 text-white">Site</th>
                                    <th className="py-2 text-white">Username</th>
                                    <th className="py-2 text-white">Password</th>
                                    <th className="py-2 text-white">Actions</th>
                                </tr>
                            </thead>

                            <tbody className='bg-green-100'>
                                {passwordArray.map((password, index) => (
                                    <tr key={password.id || index}>
                                        <td className='border-b border-white py-2 '>
                                            <div className='flex justify-center items-center'>
                                                <span>{password.site}</span>
                                                <div className='lordiconcopy size-7 cursor-pointer' onClick={() => { copyText(password.site) }}>
                                                    <lord-icon
                                                        style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                                                        src="https://cdn.lordicon.com/iykgtsbt.json"
                                                        trigger="hover" >
                                                    </lord-icon>
                                                </div>
                                            </div>
                                        </td>

                                        <td className='border-b border-white py-2 '>
                                            <div className='flex justify-center items-center'>
                                                <span>{password.username}</span>
                                                <div className='lordiconcopy size-7 cursor-pointer' onClick={() => { copyText(password.username) }}>
                                                    <lord-icon
                                                        style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                                                        src="https://cdn.lordicon.com/iykgtsbt.json"
                                                        trigger="hover" >
                                                    </lord-icon>
                                                </div>
                                            </div>
                                        </td>

                                        <td className='border-b border-white py-2 '>
                                            <div className='flex justify-center items-center'>
                                                <span>{"*".repeat(password.password.length)}</span>
                                                <div className='lordiconcopy size-7 cursor-pointer' onClick={() => { copyText(password.password) }}>
                                                    <lord-icon
                                                        style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                                                        src="https://cdn.lordicon.com/iykgtsbt.json"
                                                        trigger="hover" >
                                                    </lord-icon>
                                                </div>
                                            </div>
                                        </td>

                                        <td className='justify-center py-2 border border-white text-center'>
                                            <span className='cursor-pointer mx-1' onClick={() => { editPassword(password.id) }}>
                                                <lord-icon
                                                    src="https://cdn.lordicon.com/gwlusjdu.json"
                                                    trigger="hover"
                                                    style={{ "width": "25px", "height": "25px" }}>
                                                </lord-icon>
                                            </span>
                                            <span className='cursor-pointer mx-1' onClick={() => { deletePassword(password.id) }}>
                                                <lord-icon
                                                    src="https://cdn.lordicon.com/skkahier.json"
                                                    trigger="hover"
                                                    style={{ "width": "25px", "height": "25px" }}>
                                                </lord-icon>
                                            </span>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

            </div>
        </div>
    )
}

export default Manager
