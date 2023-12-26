"use client"
import { useEffect, useState, useCallback, useRef } from "react";
import axios from 'axios';
import {Card, CardHeader, CardBody, CardFooter, Divider, Image, ScrollShadow, Input, Button} from "@nextui-org/react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Chip, Select, SelectItem} from "@nextui-org/react";
import emailjs from "@emailjs/browser";
import { useRouter } from "next/navigation";

export default function RifaPage({params}){

    const [giveway, setGiveway] = useState({});
    const [tickets, setTickets] = useState([]);
    const [ticketsSelected, setTicketsSelected] = useState([]);
    const [filtertInput, setFilter] = useState('');
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [warningChip, setWarningChip] = useState(true);
    const [infoTicket, setInfoTicket] = useState({
        last_name: '',
        mother_last_name: '',
        name: '',
        email: '',
        phone: '',
    });
    const methods_payments = [{
        label: "Efectivo",
        key: "cash"
    },{
        label: "Tarjeta (Mercado Pago)",
        key: "mercadopago"
    }]
    const [selectPayment, setSelectPayment] = useState(new Set([]));
    const [confirmPayment, setConfirmPayment] = useState(false);
    const [loaddingPayment, setLoaddingPayment] = useState(false);
    const paymentPhoto = useRef(null);
    const [photoPayment, setPhotoPayment] = useState(null);
    const [error, setError] = useState(false);
    const [imgsAwards, setImgsAwards] = useState([]);
    const router = useRouter();
    const [loaddingPage, setLoaddingPage] = useState(false);
    
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
            setLoaddingPage(false);
            // const awards_fetch = await axios.post(`${process.env.NEXT_PUBLIC_URL_API}/getAwards`, {
            //     awards: response.data.data.awards
            // });
            // console.log(awards_fetch.data.data);
            // setImgsAwards(awards_fetch.data.data);
        }
    }, [params]);

    useEffect(() => {
        setLoaddingPage(true)
        getGiveway();
        emailjs.init(process.env.NEXT_PUBLIC_INIT_EMAILJS);
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
        setError(false)
        setTicketsSelected(update_tickets_selected)
    }

    const handleClickInputPaymentPhoto = () => paymentPhoto.current.click();

    const handleBuyTickets = async () => {
        if(photoPayment===null || ticketsSelected.length == 0 || infoTicket.last_name === '' || infoTicket.mother_last_name === '' || infoTicket.name === '' || infoTicket.email === '' || infoTicket.phone === ''){
            setError(true)
        }else{
            setLoaddingPayment(true)
            console.log(ticketsSelected);
            console.log(infoTicket);
            console.log(selectPayment);
            const formData = new FormData();
            formData.append('img_payment', photoPayment);
            formData.append('numbers', ticketsSelected);
            formData.append('last_name', infoTicket.last_name);
            formData.append('mother_last_name', infoTicket.mother_last_name);
            formData.append('name', infoTicket.name)
            formData.append('email', infoTicket.email)
            formData.append('phone', infoTicket.phone)
            formData.append('date_shop', new Date())
            formData.append('giveway_id', params.slug)
            console.log(formData);
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/tickets/buy`, {
                method: 'POST',
                body: formData
            })
            const data = await response.json();
            console.log(data.data._id)
            
            const sendFeedback = (templateID, variables) => {
                emailjs.send(process.env.NEXT_PUBLIC_EMAILJS_SERVICE, templateID, variables).then( res => {
                    console.log(res);
                }).catch(err => {
                    console.log(err, "No se envío el correo");
                })
            }
            const templateID = process.env.NEXT_PUBLIC_TEMPLATE_ID_FOR_WARNIGN;
            sendFeedback(templateID,{
                link: `${process.env.NEXT_PUBLIC_URL_FRONT}/comprobante/${data.data._id}`
            })
            setConfirmPayment(true);
            setLoaddingPayment(false);
            setInfoTicket({...infoTicket}, {last_name: '', mother_last_name: '', name: '', email: '', phone: ''});
            setTicketsSelected([]);
            router.refresh()
        }
    }

    const handleInfoTickets = e => setInfoTicket({...infoTicket, [e.target.name]: e.target.value});

    const handleSubmitPhotoPayment = e =>{
        const file = e.target.files[0]
        setPhotoPayment(file)
        setError(false)
    }
    if(loaddingPage) return <div className="h-screen w-full flex flex-col items-center justify-center"><span class="loaderPageGiveway"></span><p className="font-bold text-center text-white">Cargando...</p></div>
    return(
        <section className="w-full min-h-screen flex items-center justify-around flex-col md:flex-row">
            <Card className="md:w-2/5 w-11/12 my-10 md:mb-0">
                    <CardHeader className="flex gap-3">
                        <Image
                        alt="nextui logo"
                        isBlurred
                        height={40}
                        radius="sm"
                        src="/img/logotipo.png"
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
                            <Card shadow="sm" key={i} className="h-[150px] w-[150px]">
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
                    {tickets.map( t => giveway.purchased_tickets.includes(t) ? <div className="w-10 h-10 m-2 rounded-full flex justify-center items-center bg-white opacity-40" key={t}>{t}</div>: <div className="w-10 h-10 m-2 rounded-full flex justify-center items-center bg-white cursor-pointer" key={t} onClick={() =>handleSelectTicket(t)}>{t}</div>)}
                    </div>
                </ScrollShadow>
                <Divider className="bg-white"/>
                {warningChip && <Chip onClose={() => setWarningChip(false)} variant="shadow" color="warning" className="mt-5 text-xs md:text-base">
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
                        {loaddingPayment?<div className="text-center text-white"><span className="loader_space"></span><p className="mt-10 text-xl font-bold">Procesando pago...</p></div>:confirmPayment?<div className="flex flex-col items-center">
                            <h3 className="text-green-500 font-bold my-2">Tús datos fueron enviados con éxito.</h3>
                            <p className="text-white my-2 mb-4 text-center">Se han registrado tus datos, te enviaremos tus boletos al correo que proporcionaste, por favor este al pendiente.</p>
                        </div>:<><Divider className="bg-white"/>
                        <p className="text-white text-sm">Realiza el pago dependiendo del número de boletos que escogiste, son $50 pesos por boleto. Los datos para realizar la transferencia son: <span className="font-bold">No. de cuenta: <small className="italic text-yellow-500">1834 1307 0528 67</small> | Clabe interbancaria: <small className="italic text-yellow-500">1275 4001 3070 5286 70</small> | No. de tarjeta: <small className="italic text-yellow-500">4027 6658 3937 7380</small>. (Banco Azteca).</span> Ah nombre de Axel Emiliano Martinez Guardado. (Adjunta tu comprobante de pago.)</p>
                        <Divider className="bg-white"/>
                        <Input size="sm" type="text" label="Apellido Paterno" value={infoTicket.last_name} onChange={handleInfoTickets} name="last_name"/>
                        <Input size="sm" type="text" label="Apellido Materno"  value={infoTicket.mother_last_name} onChange={handleInfoTickets} name="mother_last_name"/>
                        <Input size="sm" type="text" label="Nombre(s)"  value={infoTicket.name} onChange={handleInfoTickets} name="name"/>
                        <Input size="sm" type="email" label="Correo"  value={infoTicket.email} onChange={handleInfoTickets} name="email"/>
                        <Input size="sm" type="phone" label="Telefono" value={infoTicket.phone} onChange={handleInfoTickets} name="phone"/>
                        {/* <Select
                            label="Metodo de pago"
                            placeholder="selecciona metodo de pago"
                            selectedKeys={selectPayment}
                            onSelectionChange={setSelectPayment}
                            >
                            {methods_payments.map( method =>(
                                <SelectItem key={method.key} value={method.key}>{method.label}</SelectItem>
                            ))}
                        </Select> */}
                        <Divider className="bg-white"/>
                        {photoPayment === null ?<Button size="sm" radius="full" color="warning" endContent={<ion-icon name="camera"></ion-icon>} className="mt-5 mr-5 font-bold" onPress={handleClickInputPaymentPhoto}>Adjuntar comprobante</Button>:<Button size="sm" radius="full" color="success" endContent={<ion-icon name="checkmark-circle"></ion-icon>} className="mt-5 mr-5 w-fit font-bold">Comprobante Listo!!</Button>}
                        <Input type="file" className="hidden" ref={paymentPhoto} onChange={handleSubmitPhotoPayment}/>
                        <Divider className="bg-white"/></>
                        }
                    </ModalBody>
                    <ModalFooter>
                        {confirmPayment?<>
                            <Button color="success" onPress={onClose}>
                            Finalizar
                            </Button>
                        </>:
                        <>
                            <Button color="danger" variant="light" onPress={onClose}>
                            Cancelar
                            </Button>
                            <Button color="success" onPress={handleBuyTickets} variant="shadow">
                            ¡Participar!
                            </Button>
                            {error && <Chip color="danger" variant="flat" onClose={()=>setError(false)}>Datos incompletos</Chip>}
                        </>}
                    </ModalFooter>
                    </>
            )}
            </ModalContent>
        </Modal>
        </section>
    )
}