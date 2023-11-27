"use client"

import { useEffect, useState } from "react";
import axios from 'axios';
import {Card, CardHeader, CardBody, Image, CardFooter, Button} from "@nextui-org/react";
import emailjs from "@emailjs/browser";

export default function ComprobantPaymentPage({params}){

    const [ticket, setTicket] = useState({});
    const [confirm, setConfirm] = useState(false);

    useEffect(() => {
        const getDataPayment = async () => {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/confirm-payment/${params.slug}`)
            console.log(response.data.data);
            setTicket(response.data.data);
        };
        getDataPayment();
    },[params.slug]);

    const handleConfirmTicket = async () => {
        const response = await  axios.post(`${process.env.NEXT_PUBLIC_URL_API}/generate-token-tickets`, {email: ticket.email, _id: ticket._id, phone: ticket.phone});
        if(response.data.success){
            console.log(response.data.data);
            emailjs.init(process.env.NEXT_PUBLIC_INIT_EMAILJS)
            const sendFeedback = (templateID, variables) => {
                emailjs.send(process.env.NEXT_PUBLIC_EMAILJS_SERVICE, templateID, variables).then( res => {
                    console.log(res);
                }).catch(err => {
                    console.log(err, "No se envío el correo");
                })
            }
            const templateID = process.env.NEXT_PUBLIC_TEMPLATE_ID_FOR_LINK_TICKETS;
            sendFeedback(templateID,{
                link: `${process.env.NEXT_PUBLIC_URL_API}/generate-tickets/${ticket._id}?auth=${response.data.data}`,
                email_destiny: ticket.email
            })
            setConfirm(true)
        }
    }

    return(
        <div className="w-full h-screen flex items-center justify-center">
            <Card className="py-4 w-fit">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <p className="text-tiny uppercase font-bold">Comprado el: {ticket.date_shop}</p>
                <p className="text-default-500">Boletos: {ticket?.numbers?.map(n => <small key={n}>{n},</small>)}</p>
                <h4 className="font-bold text-large">{`${ticket.name} ${ticket.last_name} ${ticket.mother_last_name}`}</h4>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
                <Image
                alt="Card background"
                className="object-cover rounded-xl"
                src={ticket.imgBase64}
                width={270}
                />
            </CardBody>
            <CardFooter>
                {confirm ? <p className="text-green-500 font-bold">Ticket confirmado.</p> : <><Button size="sm" color="success" variant="shadow" onPress={handleConfirmTicket}>Confirmar</Button>  
                <Button size="sm" color="danger" variant="shadow" className="ml-5">Rechazar</Button></>}  
            </CardFooter>
            </Card>
        </div>
    )
}