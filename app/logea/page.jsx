"use client"
import {Input} from "@nextui-org/react";
import { useState } from "react";
import axios from 'axios';
import Cookie from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function Login(){

    const [userLogin, setUserLogin] = useState({email: '', password: ''});
    const router = useRouter();

    const handleSubmit = async e => {
        e.preventDefault();
        const response = await axios.post(`${process.env.NEXT_PUBLIC_URL_API}/login`, userLogin);
        console.log(response.data.data);
        Cookie.set("user", response.data.data.user, {path: '/'});
        Cookie.set("token", response.data.data.token, {path: '/'});
        router.push('/dashboard');
    }

    const handleChange = e =>setUserLogin({...userLogin, [e.target.name]: e.target.value})

    return(
        <main className="w-full min-h-screen">
            <form onSubmit={handleSubmit} className="w-80 bg-green-600 m-auto mt-20 rounded-lg p-10">
                <Input type="email" label="Email" onChange={handleChange} name="email"/>
                <Input type="text" label="Password" placeholder="Enter your email"  name="password" onChange={handleChange}/>
                <button type="submit" className="bg-red-500 text-white rounded-3xl p-5 mt-5">Iniciar sesión</button>
            </form>
        </main>
    )
}