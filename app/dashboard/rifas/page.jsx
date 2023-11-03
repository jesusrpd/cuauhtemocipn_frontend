"use client"

import { useEffect, useState } from "react";
import axios from 'axios';
import Loader from "@/components/Loader";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Divider} from "@nextui-org/react";

export default function Rifas(){

    const [giveways, setGiveways] = useState([]);
    const [loading, setLoading] = useState(true);
    const {isOpen, onOpen, onClose} = useDisclosure();

    useEffect(() => {
        const getGiveways = async () => {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/getGiveways`);
            console.log(response.data);
            if(response.data.success){
                setGiveways(response.data.data);
            }else{
                console.log('Algo salio mal');
            }
            setLoading(false);
        };
        getGiveways()
    },[]);
    if(loading) return <Loader/> 
    return(
        <section className="w-11/12 min-h-screen flex items-center justify-center">
            <Button color="danger" variant="shadow" endContent={<ion-icon name="trophy-outline"></ion-icon>} className="absolute top-10 right-20" onPress={onOpen}>
                Crear rifa
            </Button>  
            {giveways.length > 0 ? (
                giveways.map( g => {
                    <p>1 giveway</p>
                })
            ) : <p className="text-white text-2xl font-bold text-center">No hay ninguna rifa creada aún...☹️ </p>}

            {/* MODAL */}
            <Modal backdrop="blur" isOpen={isOpen} onClose={onClose} className="bg-gray-800">
                <ModalContent>
                {(onClose) => (
                    <>
                    <ModalHeader className="flex flex-col gap-1 bg-gray-800 text-white">Configuración de la rifa</ModalHeader>
                    <ModalBody className="bg-gray-800 text-white">
                        <Divider className="my-4 bg-green-500"/>
                        <h3>Detalles</h3>
                        <div className="flex flex-wrap">
                            <Input type="text" variant="underlined" label="Titulo de la rifa" size="sm" color="default" className="mr-2"/>
                            <Input type="number" variant="underlined" label="Número de boletos" size="sm" color="default"/>
                            <Input type="date" variant="underlined" label="Número de boletos" size="sm" color="default"/>
                        </div>
                        <Divider className="my-4 bg-green-500" />
                        <h3>Premios</h3>
                        <div className="flex">
                            <Button className="bg-gray-700 text-white" radius="full" size="sm">Crear premio</Button>
                        </div>
                        <Divider className="my-4 bg-green-500" />
                        <h3>Bases de la rifa</h3>
                        <div className="flex">
                            <Button className="bg-gray-700 text-white" radius="full" size="sm">Crear regla</Button>
                        </div>
                        <Divider className="my-4 bg-green-500" />
                    </ModalBody>
                    <ModalFooter className="bg-gray-800">
                        <Button color="danger" variant="light" onPress={onClose}>
                        Cancelar
                        </Button>
                        <Button color="success" onPress={onClose} variant="shadow">
                        Crear
                        </Button>
                    </ModalFooter>
                    </>
                )}
                </ModalContent>
            </Modal>
        </section>
    )
}