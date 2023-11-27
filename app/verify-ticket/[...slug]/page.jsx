"use client"

import { useEffect, useState } from "react";
import axios from 'axios';

export default function VerifyTicket({params}){

    const [success, setSuccess] = useState(true);

    useEffect(() => {
        const verifyTokenId = async () => {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_URL_API}/auth-ticket/`, params.slug);
            if(response.data.success){
                setSuccess(true)
            }else{
                setSuccess(false)
            }
        }
        verifyTokenId()
    },[params.slug])

    return(
        <div className="w-full h-screen flex items-center justify-center">
            <div className="p-5 w-11/12 md:w-1/2 bg-white rounded-xl m-auto flex flex-col items-center">
                {success?<>
                    <h2 className="text-center text-green-800 font-bold">Tu ticket esta autenticado y verificado por <small className="fon-bold">CUAUHTÉMOC IPN</small>.</h2>
                    <br />
                    <p className="text-center text-gray-800 my-5">Cuenta con el protocolo de seguridad para evitar el duplicamiento de tus boletos.</p>
                    <div>
                        <ion-icon name="lock-closed" size="large" style={{"color": "green"}}></ion-icon>
                    </div>
                </>:<>
                    <h2 className="text-center text-red-800 font-bold">Tu ticket no esta autenticado y verificado por <small className="fon-bold">CUAUHTÉMOC IPN</small>.</h2>
                    <br />
                    <p className="text-center text-gray-800 my-5">Tu ticket no tiene valides para el sorteo.</p>
                    <div>
                    <ion-icon name="document-lock" size="large" style={{"color": "red"}}></ion-icon>
                    </div>
                </>}
            </div>
        </div>
    )
}