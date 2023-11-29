"use client"

import Image from "next/image";
import { useEffect } from "react";
import Link from 'next/link';

export default function DashboardLayout({children}){

    useEffect(() => {
        let menuToggle = document.querySelector(".menuToggle");
        let sidebar = document.querySelector(".sidebar");
        menuToggle.onclick = () => {
            menuToggle.classList.toggle("active");
            sidebar.classList.toggle("active");
        };

        let MenuList = document.querySelectorAll(".Menulist li");
        function activeLInk(){
            MenuList.forEach(( item => {
                item.classList.remove("active");
                this.classList.add("active");
            }))
        };
        MenuList.forEach(item => item.addEventListener('click', activeLInk));
    },[]);
    
    return(
    <main className="flex items-center">
        <section className="sidebar">
            <div className="menuToggle"></div>
            <ul>
                <li style={{"--bg": "#151A21"}}>
                    <Link href="/dashboard/inicio">
                        <div className="icon"></div>
                        <div className="text pl-0 mt-9"> Cuauhtécmoc IPN</div>
                    </Link>
                </li>
                <div className="Menulist">
                    <li style={{"--bg": "#4fbd5e"}} className="active">
                        <Link href="/dashboard/inicio">
                            <div className="icon"><ion-icon name="home-outline"></ion-icon></div>
                            <div className="text">Inicio</div>
                        </Link>
                    </li>
                    <li style={{"--bg": "#FAA500"}}>
                        <Link href="/dashboard/rifas">
                            <div className="icon"><ion-icon name="trophy-outline"></ion-icon></div>
                            <div className="text">Rifas</div>
                        </Link>
                    </li>
                    <li style={{"--bg": "#00BEFA"}}>
                        <Link href="/dashboard/ajustes">
                            <div className="icon"><ion-icon name="settings-outline"></ion-icon></div>
                            <div className="text">Ajustes</div>
                        </Link>
                    </li>
                </div>
                <div className="bottom">
                    <li style={{"--bg": "#151A21"}}>
                        <a href="#">
                            <div className="icon">
                                <div className="imgBx">
                                    <Image src="/img/logotipo.png" alt="icon home" width={32} height={32}/>
                                </div>
                            </div>
                            <div className="text">Dashboard</div>
                        </a>
                    </li>
                    <li style={{"--bg": "#FA0078"}}>
                        <a href="#">
                            <div className="icon"><ion-icon name="log-in-outline"></ion-icon></div>
                            <div className="text">Salir</div>
                        </a>
                    </li>
                </div>
            </ul>
        </section>
        {children}
    </main>
    )
}