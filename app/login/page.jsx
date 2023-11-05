"use client"
import {Input} from "@nextui-org/react";
import { useState } from "react";
import axios from 'axios';
import Cookie from 'js-cookie';
import { useRouter } from 'next/navigation';
import { EyeFilledIcon } from "@/components/EyeFilledIcon";
import { EyeSlashFilledIcon } from "@/components/EyeSlashFilledIcon";
import {Button} from "@nextui-org/react";
import Image from "next/image";

export default function Login(){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const router = useRouter();

    const toggleVisibility = () => setIsVisible(!isVisible);

    const handleSubmit = async () => {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_URL_API}/login`, {email, password});
        console.log(response.data.data);
        Cookie.set("user", JSON.stringify(response.data.data.user), {path: '/'});
        Cookie.set("token", JSON.stringify(response.data.data.token), {path: '/'});
        router.push('/dashboard/inicio');
    };

    return(
        <main className="w-full min-h-screen flex items-center bg-hero-login bg-cover">
            <div className="absolute top-0 left-0 bg-black w-full h-screen opacity-70"></div>
            <div className="w-fit px-10 py-5 m-auto flex flex-col justify-center items-center z-20">
                <Image src="/img/logotipo.jpeg" alt="logotipo Cuauhtémoc IPN" width={100} height={100} className="mb-5 rounded-full"/>
                <h2 className="text-white font-bold text-xl">Login Cuauhtémoc IPN</h2>
                <Input type="email" variant="underlined" label="Email" className="mb-5" classNames="text-white" value={email} onValueChange={setEmail}/>
                <Input
                    label="Password"
                    variant="underlined"
                    placeholder="Enter your password"
                    endContent={
                        <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                        {isVisible ? (
                            <EyeSlashFilledIcon className="text-2xl text-white pointer-events-none" />
                        ) : (
                            <EyeFilledIcon className="text-2xl text-white pointer-events-none" />
                        )}
                        </button>
                    }
                    type={isVisible ? "text" : "password"}
                    className="max-w-xs text-white"
                    value={password}
                    onValueChange={setPassword}
                />
                <Button radius="full" variant="shadow" color="success" className="mt-5 w-full" onPress={handleSubmit}>Iniciar Sesión</Button>
            </div>
        </main>
    )
}