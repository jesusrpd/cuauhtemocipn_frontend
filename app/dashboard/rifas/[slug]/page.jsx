"use client"

import { useEffect, useState, useRef } from "react";
import axios from 'axios';
import QRCode from 'qrcode.react';
import {Card, CardHeader, Image, Button, Input, Progress, CardBody, CardFooter, Divider} from "@nextui-org/react";

export default function DetailRifa({params}){

    const [giveway, setGiveway] = useState({});
    const inputFile = useRef(null);
    const [value, setValue] = useState(0);
    const [loaddingSubmit, setLoaddingSubmit] = useState(false);
    const [finishSubmit, setFinishSubmit] = useState(false);

    useEffect(() => {
        const getGiveway = async () => {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/getGiveway/${params.slug}`);
            console.log(response.data);
            setGiveway(response.data.data);
        }
        getGiveway()
    },[params.slug]);

    const clickInputFile = () => inputFile.current.click();

    const handleSubmitExcel = async e => {
        setLoaddingSubmit(true)
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("giveway_id", params.slug);
        console.log(formData);
        console.log(file);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/submit-tickets-excel`, {
              method: 'POST',
              body: formData,
            });
      
            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.error('Error al enviar el archivo:', error);
        }
        setLoaddingSubmit(false);
        setFinishSubmit(true);
        setInterval(() => {
            setValue((v) => (v >= 100 ? 0 : v + 10));
            setFinishSubmit(false)
        }, 5000);
    }

    return(
        <div className="w-full min-h-screen">
            <h2 className="text-white font-bold text-xl text-center my-5">{giveway.title}</h2>
            {finishSubmit && <div className="py-2 px-5 rounded-xl bg-green-300 text-green-700 absolute bottom-10 right-5">Excel con tickets subidos exitosamente!! <ion-icon name="checkmark-done-circle"></ion-icon>
                <Progress
                    aria-label="Downloading..."
                    size="md"
                    value={value}
                    color="success"
                    className="max-w-md bg-transparent"
                />
            </div>}
            <div className="absolute top-10 right-5">
                {loaddingSubmit?<Button color="success" isLoading>Cargando...</Button>:<><Button color="warning" endContent={<ion-icon name="cloud-upload"></ion-icon>} onPress={clickInputFile}>Subir boletos</Button>
                <Input type="file" className="hidden" onChange={handleSubmitExcel} ref={inputFile}/></>}
            </div>
            <div className="md:p-10 flex flex-wrap">
                <div className="p-5 rounded-xl bg-white m-1">
                    <h3 className="text-center font-bold">PREMIOS</h3>
                    <div className="flex items-center">
                        {giveway?.awards?.map( (award,i) => (
                            <Card shadow="sm" key={i} className="h-[150px] w-[150px] mx-1 mt-1">
                                <CardBody className="overflow-visible p-0">
                                    <Image
                                    shadow="sm"
                                    radius="lg"
                                    width="100%"
                                    alt={award.name}
                                    className="w-full object-cover h-[100px]"
                                    src={award.img}
                                    />
                                </CardBody>
                                <CardFooter className="text-small justify-between">
                                    <b className="text-gray-900">{award.name}</b>
                                    <p className="text-default-500">{award.model}</p>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
                <div className="p-5 rounded-xl bg-white m-1">
                    <h3 className="text-center font-bold">BASES</h3>
                    <ul className="list-disc">
                        {giveway?.bases?.map(b => <li key={b}>{b}</li>)}
                    </ul>
                </div>
                <div className="p-5 rounded-xl bg-white m-1">
                    <h3 className="text-center font-bold">DETALLES</h3>
                    <p>Fecha de expiración {giveway.expiration_date}</p>
                    <p>Costo por boleto ${giveway.cost_for_ticket}</p>
                </div>
                <div className="p-5 rounded-xl bg-white m-1">
                    <h3 className="text-center font-bold">RESUMEN</h3>
                    <p>Boletos fisicos: 76/1000</p>
                    <p>Boletos digitales: 76/1000</p>
                    <p>QR de la rifa: <QRCode value={`${process.env.NEXT_PUBLIC_URL_FRONT}/rifa/${params.slug}`}/> </p>
                    <Divider/>
                    <p>Recaudado: $500</p>
                </div>
            </div>
        </div>
    )
}