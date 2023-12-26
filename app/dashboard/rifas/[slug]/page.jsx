"use client"

import { useEffect, useState, useRef } from "react";
import axios from 'axios';
import QRCode from 'qrcode.react';
import {Card, Image, Button, Input, Progress, CardBody, CardFooter, Divider, Textarea} from "@nextui-org/react";
import { FaRegTimesCircle } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import Cookie from 'js-cookie';

export default function DetailRifa({params}){

    const [giveway, setGiveway] = useState({});
    const inputFile = useRef(null);
    const [value, setValue] = useState(0);
    const [loaddingSubmit, setLoaddingSubmit] = useState(false);
    const [finishSubmit, setFinishSubmit] = useState(false);
    const [loaddingPage, setLoaddingPage] = useState(true);
    const [editAwards, setEditAwards] = useState(false);
    const [editBases, setEditBases] = useState(false);
    const [baseEditText, setBaseEditText] = useState("");
    const [editDetails, setEditDetails] = useState(false);
    const [detailsData, setDetailsData] = useState({ expiration_date: "", cost_for_ticket: 0})

    useEffect(() => {
        const getGiveway = async () => {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/getGiveway/${params.slug}`);
            console.log(response.data);
            const fechaObjeto = new Date(response.data.data.expiration_date)
            const dia = fechaObjeto.getDate();
            const mes = fechaObjeto.getMonth() + 1; // ¡Recuerda que los meses comienzan desde 0!
            const año = fechaObjeto.getFullYear();
            // Formatear la fecha como DD-MM-YYYY
            const fechaFormateada = `${dia < 10 ? '0' + dia : dia}-${mes < 10 ? '0' + mes : mes}-${año}`;
            const givegayFormat = {
                ...response.data.data,
                expiration_date: fechaFormateada
            }
            setGiveway(givegayFormat);
            setLoaddingPage(false)
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

    const handleUpdate = async (type_update) => {
        const token = JSON.parse(Cookie.get('token'));
        if(type_update == "bases"){
            const new_bases = baseEditText.split(',')
            const response = await axios.put(`${process.env.NEXT_PUBLIC_URL_API}/giveway/${params.slug}`, {bases: new_bases}, {headers: {'Authorization': `Bearer ${token}`}});
            console.log(response.data)
            setGiveway({...giveway, bases: response.data.data.bases})
            setBaseEditText("")
            setEditBases(false)
        }else if(type_update == "details"){
            console.log("details")
            console.log(detailsData)
            const format_update = {
                expiration_date: detailsData.expiration_date === ""?giveway.expiration_date:detailsData.expiration_date,
                cost_for_ticket: detailsData.cost_for_ticket === 0? giveway.cost_for_ticket:detailsData.cost_for_ticket
            }
            const response = await axios.put(`${process.env.NEXT_PUBLIC_URL_API}/giveway/${params.slug}`, format_update, {headers: {'Authorization': `Bearer ${token}`}});
            console.log(response.data)
            const fechaObjeto = new Date(response.data.data.expiration_date)
            const dia = fechaObjeto.getDate();
            const mes = fechaObjeto.getMonth() + 1; // ¡Recuerda que los meses comienzan desde 0!
            const año = fechaObjeto.getFullYear();
            // Formatear la fecha como DD-MM-YYYY
            const fechaFormateada = `${dia < 10 ? '0' + dia : dia}-${mes < 10 ? '0' + mes : mes}-${año}`;
            setGiveway({...giveway, cost_for_ticket: response.data.data.cost_for_ticket, expiration_date: fechaFormateada})
            setDetailsData("")
            setEditDetails(false)
        }
    }

    const editData = ()=> {
        setEditBases(true);
        setBaseEditText(giveway?.bases.join(','));
    }

    const handleChangeDetails = e => {
        setDetailsData({...detailsData, [e.target.name]: e.target.value})
    }

    if(loaddingPage) return <div className="h-screen w-full flex flex-col items-center justify-center"><span class="loaderPageGiveway"></span><p className="font-bold text-center text-white">Cargando...</p></div>
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
                <div className="p-5 rounded-xl bg-white m-1 relative">
                    <Button isIconOnly color="warning" aria-label="Like" className="absolute top-1 right-1">
                        <FaEdit />
                    </Button>  
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
                <div className="p-5 rounded-xl bg-white m-1 relative">
                    {editBases ?(
                        <div className="absolute top-1 right-1">
                            <Button isIconOnly color="success" className="mr-2" aria-label="Like" onPress={() => handleUpdate("bases")}>
                                <FaCheckCircle />
                            </Button> 
                            <Button isIconOnly color="danger" aria-label="Like" onPress={() => setEditBases(false)}>
                                <FaRegTimesCircle />
                            </Button>       
                        </div>
                    ) : <Button isIconOnly color="warning" aria-label="Like" className="absolute top-1 right-1" onPress={editData}>
                        <FaEdit />
                    </Button>    
                    }
                    <h3 className="text-center font-bold">BASES</h3>
                    {editBases?(
                        <ul className="list-disc">
                            {      <Textarea
                                    label="Bases"
                                    labelPlacement="outside"
                                    placeholder="Enter your description"
                                    value={baseEditText}
                                    onValueChange={setBaseEditText}
                                />}
                        </ul>
                    ):(
                        <ul className="list-disc">
                            {giveway?.bases?.map(b => <li key={b}>{b}</li>)}
                        </ul>
                    )}
                </div>
                <div className="p-5 rounded-xl bg-white m-1 relative">
                    {editDetails ?(
                        <div className="absolute top-1 right-1">
                            <Button isIconOnly color="success" className="mr-2" aria-label="Like" onPress={() => handleUpdate("details")}>
                                <FaCheckCircle />
                            </Button> 
                            <Button isIconOnly color="danger" aria-label="Like" onPress={() => setEditDetails(false)}>
                                <FaRegTimesCircle />
                            </Button>       
                        </div>
                    ) : <Button isIconOnly color="warning" aria-label="Like" className="absolute top-1 right-1" onPress={() => setEditDetails(true)}>
                        <FaEdit />
                    </Button>    
                    } 
                    <h3 className="text-center font-bold">DETALLES</h3>
                    {editDetails?(
                        <>
                            <Input type="date" size="sm" className="my-2" min={new Date().toISOString().split('T')[0]} name="expiration_date" onChange={handleChangeDetails}/>
                            <Input
                                type="number"
                                value={detailsData.cost_for_ticket}
                                name="cost_for_ticket"
                                placeholder="0"
                                endContent={<div className="pointer-events-none flex items-center">
                                    <span className="text-default-400 text-small">$</span></div>}
                                className="mr-2"
                                onChange={handleChangeDetails}
                            />
                        </>
                    ):(
                        <>
                            <p>Fecha de expiración {giveway.expiration_date}</p>
                            <p>Costo por boleto ${giveway.cost_for_ticket}</p>
                        </>
                    )}
                </div>
                <div className="p-5 rounded-xl bg-white m-1">
                    <h3 className="text-center font-bold">RESUMEN</h3>
                    <p>QR de la rifa: <QRCode value={`${process.env.NEXT_PUBLIC_URL_FRONT}/rifa/${params.slug}`}/> </p>
                    <Divider/>
                    <p>Recaudado: $500</p>
                </div>
            </div>
        </div>
    )
}