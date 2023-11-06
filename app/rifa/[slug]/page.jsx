"use client"
import { useEffect, useState, useCallback } from "react";
import axios from 'axios';
import {Card, CardHeader, CardBody, CardFooter, Divider, Image, ScrollShadow, Input, Button} from "@nextui-org/react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Chip} from "@nextui-org/react";

export default function RifaPage({params}){

    const [giveway, setGiveway] = useState({});
    const [tickets, setTickets] = useState([]);
    const [ticketsSelected, setTicketsSelected] = useState([]);
    const [filtertInput, setFilter] = useState('');
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [warningChip, setWarningChip] = useState(true);
    
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

    const handleSelectTicket = ticket => {
        console.log(ticket);
        setTicketsSelected(ticketsSelected.concat(ticket));
    }  

    const filterTickets = e =>{
        console.log(e.target.value);
        setFilter(e.target.value);
        if(filtertInput !== ''){
            const set_filter = tickets.filter( ticket => {
                const num_string = ticket.toString();
                return num_string.includes(e.target.value);
            })
            console.log(set_filter);
            setTickets(set_filter)
        }else{
            // setTickets()
        }
    }

    const handleDeleteTicket = ticket => {
        const update_tickets_selected = ticketsSelected.filter(t => t !== ticket);
        setTicketsSelected(update_tickets_selected)
    }

    return(
        <section className="w-full min-h-screen flex items-center justify-around flex-col md:flex-row">
            <Card className="md:w-2/5 w-4/5 my-10 md:mb-0">
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
            <div className="md:w-1/2 w-4/5 mb-20 md:mb-0">
                <h2 className="text-white text-xl text-center mb-5">Selecciona tus boletos:</h2>
                <div className="flex items-center my-5">
                    <Input
                    key="outside-left"
                    type="number"
                    min={0}
                    label="Busca un boleto"
                    labelPlacement="outside-left"
                    placeholder="Núm. del boleto"
                    color="success"
                    value={filtertInput}
                    onChange={filterTickets}
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
                    {tickets.map( t => <div className="w-10 h-10 m-2 rounded-full flex justify-center items-center bg-white cursor-pointer" key={t} onClick={() =>handleSelectTicket(t)}>{t}</div>)}
                    </div>
                </ScrollShadow>
                <Divider className="bg-white"/>
                {warningChip && <Chip onClose={() => setWarningChip(false)} variant="shadow" color="warning" className="mt-5">
                    Pulsa los tickets azules para desceleccionarlos.
                </Chip>}
                <div>
                    <p className="my-5 text-white flex items-center flex-wrap">Boletos seleccionados: {ticketsSelected.length > 0?ticketsSelected.map(t =>(
                        <p className="w-7 h-7 m-2 rounded-full flex justify-center items-center bg-blue-600 cursor-pointer p-2 text-xs" key={t} onClick={()=>handleDeleteTicket(t)}>{t}</p>
                    )):null}</p>
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