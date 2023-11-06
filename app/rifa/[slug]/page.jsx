"use client"
import { useEffect, useState, useCallback } from "react";
import axios from 'axios';
import {Card, CardHeader, CardBody, CardFooter, Divider, Image, ScrollShadow, Input, Button} from "@nextui-org/react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from "@nextui-org/react";

export default function RifaPage({params}){

    const [giveway, setGiveway] = useState({});
    const [tickets, setTickets] = useState([]);
    const {isOpen, onOpen, onClose} = useDisclosure();
    
    const getGiveway = useCallback(async () => {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/getGiveway/${params.slug}`);
        if (response.data.success) {
            console.log(response.data.data);
            setGiveway(response.data.data)
            const array_tickets = []
            for (let ticket = 1; ticket <= response.data.data.total_tickets; ticket++) {
                array_tickets.push(ticket);
            }
            setTickets(array_tickets);
        }
    }, [params]);

    useEffect(() => {
        getGiveway();
    }, [getGiveway]);

    return(
        <section className="w-full min-h-screen flex items-center justify-around">
            <Card className="w-2/5">
                    <CardHeader className="flex gap-3">
                        <Image
                        alt="nextui logo"
                        isBlurred
                        height={40}
                        radius="sm"
                        src="/img/logotipo.jpeg"
                        width={40}
                        />
                        <div className="flex flex-col">
                        <p className="text-md">Bases de la rifa</p>
                        <p className="text-small text-default-500">{giveway.title}</p>
                        </div>
                    </CardHeader>
                    <Divider/>
                    <CardBody>
                        <p className="mb-4 font-bold text-xl">Premios</p>
                        <div className="flex items-center flex-wrap">{giveway?.awards?.map( (award,i) =>(
                            <div key={i}>
                                <p>{award?.name}</p>
                                <Image
                                    alt="nextui logo"
                                    isBlurred
                                    height={60}
                                    radius="sm"
                                    src={award.img}
                                    width={60}
                                />
                            </div>
                        ))}</div>
                    </CardBody>
                    <Divider/>
                    <CardFooter>
                        <div className="flex flex-col">
                            <p className="mb-4 font-bold text-xl">Bases</p>
                            <ul>
                                {giveway?.bases?.map((b,i) =>(
                                    <li key={i}>{b}</li>
                                ))}
                            </ul>
                        </div>
                    </CardFooter>
            </Card>
            <div className="w-1/2">
                <h2 className="text-white text-xl text-center mb-5">Selecciona tus boletos:</h2>
                <div className="flex items-center my-5">
                    <Input
                    key="outside-left"
                    type="text"
                    label="Busca un boleto"
                    labelPlacement="outside-left"
                    placeholder="Núm. del boleto"
                    color="success"
                    />
                </div>
                <div className="my-5 flex items-center w-full justify-around">
                    <div className="flex flex-col items-center">
                        <div className="w-10 h-10 m-b-2 rounded-full flex justify-center items-center bg-white">#</div>
                        <p className="text-white">Disponible</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-10 h-10 m-b-2 rounded-full flex justify-center items-center bg-white opacity-40">#</div>
                        <p className="text-white">No Disponible</p>
                    </div>
                </div>
                <Divider className="bg-white"/>
                <ScrollShadow size={100} className="w-full h-[300px] text-center">
                    <div className="flex flex-wrap items-center">
                    {tickets.map( t => <div className="w-10 h-10 m-2 rounded-full flex justify-center items-center bg-white" key={t}>{t}</div>)}
                    </div>
                </ScrollShadow>
                <div>
                    <p className="my-5 text-white">Boletos seleccionados: </p>
                    <Button color="success" variant="shadow" onPress={onOpen}>
                        Confirmar boletos
                    </Button>  
                </div>
            </div>

        <Modal backdrop="blur" isOpen={isOpen} onClose={onClose} className="bg-gray-800">
            <ModalContent>
            {(onClose) => (
                <>
                <ModalHeader className="flex flex-col gap-1 text-white">Pago de boletos</ModalHeader>
                    <ModalBody>
                        <Divider className="bg-white"/>
                        <p className="text-white">Ya solo falta realizar tu pago para que entres a la rifa, escoge un método de pago.</p>
                        <Divider className="bg-white"/>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={onClose}>
                        Cancelar
                        </Button>
                        <Button color="success" onPress={onClose} variant="shadow">
                        ¡Participar!
                        </Button>
                    </ModalFooter>
                    </>
            )}
            </ModalContent>
        </Modal>
        </section>
    )
}