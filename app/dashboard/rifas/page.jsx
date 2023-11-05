"use client"

import { useEffect, useState, useRef } from "react";
import axios from 'axios';
import Loader from "@/components/Loader";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Divider, Badge, Avatar, Chip, Card, CardHeader, CardBody, CardFooter, Link} from "@nextui-org/react";
import Cookie from 'js-cookie';
import Image from "next/image";
import QRCode from 'qrcode.react';

export default function Rifas(){

    const [giveways, setGiveways] = useState([]);
    const [loading, setLoading] = useState(true);
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [errorLoading, setErrorLoading] = useState(false);
    const [createAward, setCreateAward] = useState(false);
    const [createBase, setCreateBase] = useState(false);
    const inputAward = useRef(null);
    const [createGivewayLoadding, setCreateGivewayLoadding] = useState(false);
    const [giveway, setGiveway] = useState({
        title: '',
        total_tickets: 0,
        awards: [],
        bases: [],
        expiration_date: new Date().toISOString().split('T')[0],
    });
    const [dataAward, setDataAward] = useState({
        name: '',
        model: '',
        img: null
    });
    const [showQR, setShowQR] = useState(null)
    const [rule, setRule] = useState('')

    useEffect(() => {
        const getGiveways = async () => {
            const token = JSON.parse(Cookie.get('token'));
            const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/getGiveways`, {headers: {'Authorization': `Bearer ${token}`}});
            console.log(response.data);
            if(response.data.success){
                setGiveways(response.data.data);
            }else{
                console.log('Algo salio mal');
                setErrorLoading(true);
            }
            setLoading(false);
        };
        getGiveways()
    },[]);

    const handleClose = () => {
        setCreateAward(false);
        setDataAward({...dataAward, name: '', model: '', img: null});
        setGiveway({...giveway, awards: [], bases: [], title: '', total_tickets: '', expiration_date: new Date().toISOString().split('T')[0]});
        setShowQR(null);
        onClose()
    }

    const handleClickInputFile = () => inputAward.current.click();

    const handleSubmitImgAward = e => {
        const file = e.target.files[0]
        const reader = new FileReader();
        reader.onloadend = () => {
          setDataAward({...dataAward, img: reader.result}); 
        }
        if(file){
          reader.readAsDataURL(file);
        } 
    }

    const handleCancelAward = () => {
        setDataAward({...dataAward, name: '', model: '', img: null});
        setCreateAward(false);
    }

    const handleCreateAward = () => {
        setGiveway({...giveway, awards: giveway.awards.concat(dataAward)});
        setDataAward({...dataAward, name: '', model: '', img: null});
        setCreateAward(false);
    }

    const handleChange = e => {
        const { name, value } = e.target;
        setDataAward({
          ...dataAward,
          [name]: value,
        });
    };

    const handleEditAward = () => {
        console.log('click');
    }

    const handleCandelRule = () => {
        setCreateBase(false);
        setRule('')
    }

    const handleCreateRule = () => {
        setGiveway({...giveway, bases: giveway.bases.concat(rule)});
        setCreateBase(false);
        setRule('')
    }

    const handleDeletRule = rule => {
        console.log(giveway.bases)
        const set_rules = giveway.bases.filter( r => r !== rule);
        console.log(set_rules);
        setGiveway({...giveway, bases: set_rules});
    }

    const handleChangeGivewayInput = e => {
        const { name, value } = e.target;
        setGiveway({
          ...giveway,
          [name]: value,
        });
        console.log(giveway);
    };

    const handleCreateGiveway = async () => {
        setCreateGivewayLoadding(!createGivewayLoadding);
        const token = JSON.parse(Cookie.get('token'));
        console.log(giveway);
        const response = await axios.post(`${process.env.NEXT_PUBLIC_URL_API}/createGiveway`, giveway, {headers: {'Authorization': `Bearer ${token}`}});
        console.log(response.data);
        setShowQR("hola muno")
        const giveways = await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/getGiveways`, {headers: {'Authorization': `Bearer ${token}`}});
        if(response.data.success){

            setGiveways(giveways.data.data);
        }else{
            console.log('Algo salio mal');
            setErrorLoading(true);
        }
        setLoading(false);
        setCreateGivewayLoadding(false);
    }

    if(loading) return <Loader/> 
    return(
        <section className="w-11/12 min-h-screen flex items-center justify-center">
            {errorLoading?<Chip color="danger" variant="shadow" className="absolute bottom-10 right-10" onClose={() => setErrorLoading(false)}>Error al cargar la página!!!</Chip>:null}
            <Button color="warning" variant="shadow" endContent={<ion-icon name="trophy-outline"></ion-icon>} className="absolute top-10 right-20" onPress={onOpen}>
                Crear rifa
            </Button>  
            {giveways.length > 0 ? (
                giveways.map( (g,i) => (
                    <Card className="max-w-[400px]" key={i}>
                    <CardHeader className="flex gap-3">
                      <Image
                        alt="nextui logo"
                        height={40}
                        radius="sm"
                        src="/img/bg/satelite.jpg"
                        width={40}
                      />
                      <div className="flex flex-col">
                        <p className="text-md">{g.title}</p>
                        <p className="text-small text-default-500">{g.total_tickets}</p>
                      </div>
                    </CardHeader>
                    <Divider/>
                    <CardBody>
                      <p>Make beautiful websites regardless of your design experience.</p>
                    </CardBody>
                    <Divider/>
                    <CardFooter>
                      <Link
                        isExternal
                        showAnchorIcon
                        href="https://github.com/nextui-org/nextui"
                      >
                        Visit source code on GitHub.
                      </Link>
                    </CardFooter>
                  </Card>
                ))
            ) : <p className="text-white text-2xl font-bold text-center">No hay ninguna rifa creada aún...☹️ </p>}

            {/* MODAL */}
            <Modal backdrop="blur" isOpen={isOpen} onClose={handleClose} className="bg-gray-800">
                <ModalContent>
                {(onClose) => (
                    <>
                    <ModalHeader className="flex flex-col gap-1 bg-gray-800 text-white">{createGivewayLoadding?"Creando Rifa...":showQR===null?"Configuración de la rifa":"¡¡Rifa creada exitosamente!!"}</ModalHeader>
                    <ModalBody className="bg-gray-800 text-white">
                        {createGivewayLoadding ? <span className="loader_2"></span> : showQR === null ? (<div>
                            <Divider className="my-4 bg-green-500 opacity-20"/> 
                            <h3>Detalles</h3>
                            <div className="flex flex-wrap">
                                <Input type="text" variant="underlined" label="Titulo de la rifa" size="sm" color="warning" className="mr-2 text-white" value={giveway.title} name="title" onChange={handleChangeGivewayInput}/>
                                <div className="flex items-center w-full justify-between">
                                    <Input
                                        type="number"
                                        label="Núm. de boletos"
                                        placeholder="1"
                                        value={giveway.total_tickets}
                                        variant="underlined"
                                        name="total_tickets"
                                        color="warning"
                                        onChange={handleChangeGivewayInput}
                                        endContent={
                                            <div className="pointer-events-none flex items-center">
                                            <span className="text-default-400 text-small">$</span>
                                            </div>
                                        }
                                        className="w-1/2 mr-2"
                                    />
                                    <Input type="date" variant="underlined" label="Fecha fin de la rifa" size="sm" color="warning" className="w-1/2 ml-2" min={new Date().toISOString().split('T')[0]} name="expiration_date" value={giveway.expiration_date} onChange={handleChangeGivewayInput}/>
                                </div>
                            </div>
                            <Divider className="my-4 bg-green-500 opacity-20" />
                            <h3>Premios</h3>
                            <div className="flex">
                                {createAward ? 
                                <div>
                                    <div className="flex items-center">
                                        <Input type="text" variant="underlined" label="Nombre" size="sm" color="warning" className="mr-2 text-white w-1/2" value={dataAward.name} onChange={handleChange} name="name"/>
                                        <Input type="text" variant="underlined" label="Modelo" size="sm" color="warning" className="mr-2 text-white w-1/2" value={dataAward.model} onChange={handleChange} name="model"/>
                                    </div>
                                    <div className="flex items-center mt-5">
                                        <Button size="sm" radius="full" color="warning" endContent={<ion-icon name="cloud-upload"></ion-icon>} className="mt-5 mr-5" onPress={handleClickInputFile}>Subir foto</Button>
                                        <Input type="file" className="hidden" onChange={handleSubmitImgAward} ref={inputAward}/>
                                        {dataAward.img !== null ?<div className="rounded-xl p-2 w-fit bg-white">
                                            <Image src={dataAward.img} alt="img upload" width={60} height={60}/>
                                        </div> : null}
                                        <Divider className="bg-green-500 opacity-20" orientation="vertical"/>
                                        <div>
                                            <Button size="sm" radius="full" variant="light" color="danger" className="mx-5" onPress={handleCancelAward}>Cancelar</Button>
                                            <Button size="sm" radius="full" color="success" onPress={handleCreateAward} type="submit">Crear</Button>
                                        </div>
                                    </div>
                                </div> 
                                : <div className="flex flex-col">
                                    <div className="flex">
                                        {giveway.awards.length > 0 ? giveway.awards.map( (award,i) =>(
                                            <div key={i} className="my-4 mx-2">
                                                <Badge content={<ion-icon name="create" className="cursor-pointer"></ion-icon>} color="primary">
                                                    <Avatar
                                                    radius="md"
                                                    size="lg"
                                                    src={award.img}
                                                    onClick={handleEditAward}
                                                    />
                                                </Badge>
                                            </div>
                                        )) : <p className="text-xs opacity-40 my-2">No se han creado premios aún...</p>}
                                    </div>
                                    <Button className="bg-gray-700 text-white" radius="full" size="sm" onPress={() => setCreateAward(!createAward)}>Crear premio</Button>
                                </div>}
                            </div>
                            <Divider className="my-4 bg-green-500 opacity-20" />
                            <h3>Bases de la rifa</h3>
                            <div className="flex">
                                {createBase ?(
                                    <div className="flex items-center">
                                        <Input type="text" variant="underlined" label="Regla..." value={rule} onValueChange={setRule}/>
                                        <Button size="sm" radius="full" variant="light" color="danger" className="mx-5" onPress={handleCandelRule}>Cancelar</Button>
                                        <Button size="sm" radius="full" color="success" onPress={handleCreateRule} type="submit">Crear</Button>
                                    </div>
                                ) :(
                                    <div className="flex flex-col mt-2">
                                        {giveway.bases.length > 0 ? giveway.bases.map( (b,i) =>(
                                            <Chip key={i} onClose={() => handleDeletRule(b)} variant="flat" color="warning" className="my-1">
                                                {b}
                                            </Chip>
                                        )) : <p className="text-xs opacity-40 my-2">No se han creado alguna regla aún...</p>}
                                        <Button className="bg-gray-700 text-white mt-2" radius="full" size="sm" onPress={() => setCreateBase(true)}>Crear regla</Button>
                                    </div>
                                )}
                            </div>
                            <Divider className="my-4 bg-green-500 opacity-20" />
                        </div>): (<div className="flex flex-col items-center justify-center">
                            <p className="text-center my-4 text-xs px-10 leading-5">Ya puedes empezar a compartir tu código QR para empezar a vender tus boletos. 😁</p>
                            <div className="bg-white p-2 rounded-lg">
                                <QRCode value={showQR}/>
                            </div>
                        </div>)}
                    </ModalBody>
                    <ModalFooter className="bg-gray-800">
                        {createGivewayLoadding?null: showQR === null ? (
                            <>
                            <Button color="danger" variant="light" onPress={onClose}>
                        Cancelar
                        </Button>
                        <Button color="success" onPress={handleCreateGiveway} variant="shadow">
                        Crear
                        </Button></>
                        ): <Button color="success" onPress={handleClose} variant="shadow">
                        Finalizar
                        </Button>}
                    </ModalFooter>
                    </>
                )}
                </ModalContent>
            </Modal>
        </section>
    )
}