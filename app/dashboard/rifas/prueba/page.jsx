"use client"

import {Card, CardHeader, Image, Button, Input} from "@nextui-org/react";
import { useRef } from "react";
import axios from 'axios';

export default function Prueba(){

    const inputFile = useRef(null);

    const clickInputFile = () => inputFile.current.click();

    const handleSubmitExcel = async e => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("file", file);
        console.log(formData);
        console.log(file);
        try {
            // Realiza la solicitud POST al servidor Node.js para enviar el archivo
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/submit-tickets-excel`, {
              method: 'POST',
              body: formData,
            });
      
            // Maneja la respuesta del servidor
            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.error('Error al enviar el archivo:', error);
        }
    }

    return(
        <>
        <Button color="warning" endContent={<ion-icon name="cloud-upload"></ion-icon>} onPress={clickInputFile}>Subir boletos</Button>
                <Input type="file" className="hidden" onChange={handleSubmitExcel} ref={inputFile}/></>
    )
}