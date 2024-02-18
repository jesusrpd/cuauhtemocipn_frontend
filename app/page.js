"use client"

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, NavbarMenuToggle, NavbarMenu, NavbarMenuItem} from "@nextui-org/react";
import React from "react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const clickRef = useRef();
  useEffect(() =>{

    window.addEventListener('scroll', () => {
      const nav = document.getElementById('navbar')
      if(window.scrollY > 0){
          nav.classList.add('sticky')
      }else{
          nav.classList.remove('sticky')
      }
  })

    const scrollers = document.querySelectorAll(".scroller");
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      addAnimation();
    }
    function addAnimation() {
      scrollers.forEach((scroller) => {
        // add data-animated="true" to every `.scroller` on the page
        scroller.setAttribute("data-animated", true);

        // Make an array from the elements within `.scroller-inner`
        const scrollerInner = scroller.querySelector(".scroller__inner");
        const scrollerContent = Array.from(scrollerInner.children);

        // For each item in the array, clone it
        // add aria-hidden to it
        // add it into the `.scroller-inner`
        scrollerContent.forEach((item) => {
          const duplicatedItem = item.cloneNode(true);
          duplicatedItem.setAttribute("aria-hidden", true);
          scrollerInner.appendChild(duplicatedItem);
        });
      });

    }
  },[])

  useEffect(() => {
    //step 1: get DOM
let nextDom = document.getElementById('next');
let prevDom = document.getElementById('prev');

let carouselDom = document.querySelector('.carousel');
let SliderDom = carouselDom.querySelector('.carousel .list');
let thumbnailBorderDom = document.querySelector('.carousel .thumbnail');
let thumbnailItemsDom = thumbnailBorderDom.querySelectorAll('.item');
let timeDom = document.querySelector('.carousel .time');

thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
let timeRunning = 3000;
let timeAutoNext = 7000;

nextDom.onclick = function(){
    showSlider('next');    
}

prevDom.onclick = function(){
    showSlider('prev');    
}
let runTimeOut;
let runNextAuto = setTimeout(() => {
    clickRef.current.click()
}, timeAutoNext)
function showSlider(type){
    let  SliderItemsDom = SliderDom.querySelectorAll('.carousel .list .item');
    let thumbnailItemsDom = document.querySelectorAll('.carousel .thumbnail .item');
    
    if(type === 'next'){
        SliderDom.appendChild(SliderItemsDom[0]);
        thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
        carouselDom.classList.add('next');
    }else{
        SliderDom.prepend(SliderItemsDom[SliderItemsDom.length - 1]);
        thumbnailBorderDom.prepend(thumbnailItemsDom[thumbnailItemsDom.length - 1]);
        carouselDom.classList.add('prev');
    }
    clearTimeout(runTimeOut);
    runTimeOut = setTimeout(() => {
        carouselDom.classList.remove('next');
        carouselDom.classList.remove('prev');
    }, timeRunning);

    clearTimeout(runNextAuto);
    runNextAuto = setTimeout(() => {
      clickRef.current.click()
    }, timeAutoNext)
  }
  },[])

  const menuItems = [
    "Inicio",
    "Cuauhtémoc",
    "Subbsecciones",
    "Competencias",
    "Reclutamiento",
  ];

  return (
    <main className="w-full">
          <Navbar id="navbar" onMenuOpenChange={setIsMenuOpen} className="text-white p-2 md:p-5 z-50 fixed top-0 left-0 bg-transparent">
            <NavbarMenu className="bg-black-cuau">
              {menuItems.map((item, index) => (
                <NavbarMenuItem key={`${item}-${index}`}>
                  <Link
                    className="w-full text-white font-bold"
                    href="#"
                    size="lg"
                  >
                    {item}
                  </Link>
                </NavbarMenuItem>
              ))}
            </NavbarMenu>
            <NavbarContent justify="end">
              <NavbarMenuToggle
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                className="sm:hidden"
              />
              <NavbarBrand>
                <Image alt="logotipo cuauhtémoc" src="/img/icons/logotipowhite.png" width={60} height={60}/>
              </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden sm:flex gap-0" justify="end">
              <NavbarItem>
                <Link href="#" className="font-bold text-white">
                  Inicio
                </Link>
              </NavbarItem>
              <NavbarItem isActive>
                <Link href="#cuauhtemoc" aria-current="page" className="font-bold text-white">
                  Cuauhtémoc
                </Link>
              </NavbarItem>
              <NavbarItem>
                <Link color="foreground" href="#subsecciones" className="font-bold text-white">
                  Subsecciones
                </Link>
              </NavbarItem>
              <NavbarItem>
                <Link color="foreground" href="#competencias" className="font-bold text-white">
                  Competencias
                </Link>
              </NavbarItem>
              <NavbarItem>
                <Link color="foreground" href="#reclutamiento" className="font-bold text-white">
                  Reclutamiento
                </Link>
              </NavbarItem>
            </NavbarContent>
            
          </Navbar>
          {/* <nav id="navbar" className="flex items-center w-full justify-between z-50">
            <Image alt="logotipo cuauhtémoc" src="/img/icons/logotipowhite.png" width={60} height={60}/>
            <ul className="flex items-center text-white font-bold">
              <li className="mx-4"><a href="#inicio" className="btn-underline">Inicio</a></li>
              <li className="mx-4"><a href="#cuauhtemoc" className="btn-underline">Cuauhtémoc</a></li>
              <li className="mx-4"><a href="#subsecciones" className="btn-underline">Subsecciones</a></li>
              <li className="mx-4"><a href="#competencias" className="btn-underline">Competencias</a></li>
              <li className="mx-4"><a href="#reclutamiento" className="btn-underline">Reclutamiento</a></li>
            </ul>
          </nav> */}
      <div className="fixed left-2 bottom-4">
        <Image alt="icon instagram" src="/img/icons/instagram.svg" width={30} height={30}/>
        <Image alt="icon facebook" src="/img/icons/facebook.svg" width={30} height={30} className="mt-4"/>
      </div>
      <section className="min-h-screen w-full bg-home-loading bg-cover bg-no-repeat">
        <section id="inicio" className="w-full h-screen flex flex-col justify-center">
          <h1 className="font-bold text-white text-5xl md:text-7xl text-center mb-12 italic">CUAUHTÉMOC<br/><span className="text-ipn-color">IPN</span></h1>
          <div className="text-white text-base pl-5">
            <h2 className=" text-2xl md:text-4xl italic font-bold">Vuela con nosotros...</h2>
            <p className="my-2 mb-10 md:mb-5 font-bold">En Cuauhtémoc IPN, la innovación se eleva al espacio<br/>con la pasión y dedicación de cada miembro. 🚀</p>
            <a className="text-white font-bold px-2 py-2 border-1 rounded-md hover:text-black hover:bg-white transition-all" variant="bordered" href="#cuauhtemoc">
              Conocenos...
            </a>  
          </div>
        </section>
        <section id="cuauhtemoc" className="w-full h-screen flex items-center flex-col md:flex-row">
          <div className="w-11/12 md:w-1/2 flex flex-col items-center">
            <Image alt="img de cuauhtémoc" src="/img/ilustrate/cuauhtemoc.png" width={600} height={500}/>
            <p className="text-base text-white">“Cuauhtémoc IPN: Innovando en el espacio, elevando el nombre de nuestra institución.”</p>
          </div>
          <div className="w-11/12 mt-10 md:mt-0 md:w-1/2 flex flex-col items-center">
            <h2 className="text-center text-white font-bold mb-10 text-4xl">CUAUHTÉMOC IPN<br/>AEROESPACE</h2>
            <p className="text-white leading-8 text-justify w-11/12 md:w-3/4">Cuauhtémoc IPN, fundado en 2017, inició su trayectoria compitiendo en competencias nacionales con satélites CanSat, integrado por al menos 7 estudiantes de ESIME Ticoman.<br/>Hoy en día, somos un equipo interdisciplinario de más de 30 miembros, destacando en competencias internacionales con el tercer lugar a nivel mundial y el primer lugar en Latinoamérica. Nos dedicamos a innovar y llevar en alto el nombre de nuestra institución, reconociendo que cada miembro es esencial para nuestro éxito.</p>
          </div>
        </section>
      </section>
      <section className="h-48 bg-black w-full flex items-center pb-10">
      <div class="scroller" data-direction="right" data-speed="slow">
        <div class="scroller__inner">
          <Image className="exclusion-mode mx-5 md:mx-16" src="/img/organizaciones/grupossc.png" alt="grupo ssc" width={60} height={100} />
          <Image className="exclusion-mode mx-5 md:mx-16" src="/img/organizaciones/CDA.png" alt="CDA" width={50} height={50} />
          <Image className="exclusion-mode mx-5 md:mx-16" src="/img/organizaciones/ipn.png" alt="ipn" width={50} height={50} />
          <Image className="exclusion-mode mx-5 md:mx-10" src="/img/organizaciones/cuauhtemoc.png" alt="cuauhtémoc" width={150} height={50} />
          <Image className="exclusion-mode mx-5 md:mx-10" src="/img/organizaciones/pcbmexico.png" alt="pcb méxico" width={300} height={50} />
          <Image className="exclusion-mode mx-5 md:mx-10" src="/img/organizaciones/fundacionpolitecnico.png" alt="fundación politecnico" width={150} height={50} />
        </div>
      </div>
      </section>
      <section id="subsecciones" className="carousel">
       <div className="list">
            <div className="item">
                <Image src="/img/carrusel/image/img1.jpg" alt="img 1" width={1000} height={1000}/>
                <div className="content">
                    
                    <div className="topic">EPS (Electronic Power System)</div>
                    <div className="des">
                        Subsección en cargado de los circuitos y la manufactura de las placas PCB. Agregar más contenido sobre esta subsección y agregar más contenido en el render.
                    </div>
                    
                </div>
            </div>
            <div className="item">
                <Image src="/img/carrusel/image/img2.jpg" alt="img 2" width={1000} height={1000} />
                <div className="content">
                    
                    <div className="topic">Mecanica</div>
                    <div className="des">
                        Mecanica es el diseño de estructuras, manufactura de las piezas que component el satelite, diseño y analizis para asegurarse de que el satelite soporte todos los esfuerzos a los que será sometido durante la competencia.
                    </div>
                    
                </div>
            </div>
            <div className="item">
                <Image src="/img/carrusel/image/img3.jpg" alt="img3" width={1000} height={1000}/>
                <div className="content">
                    
                    <div className="topic">Aarodinamica</div>
                    <div className="des">
                        Aerodinámica es la subsección encargada de hacer los cálculos necesarios para la fabricación de paracaídas, asegurando la recuperación de los prototipos.
                    </div>
                    
                </div>
            </div>
            <div className="item">
                <Image src="/img/carrusel/image/img4.jpg" alt="img4" width={1000} height={1000}/>
                <div className="content">
                    
                    <div className="topic">CCH</div>
                    <div className="des">
                        CDH es el encargado de la programción de los prototipos, además de crear una interfaz que sea capaz de mostrar los datos en tiempo real que transmite el satélite al momento del vuelo.
                    </div>
                    
                </div>
            </div>
        </div>
        <div className="thumbnail">
            <div className="item">
                <Image src="/img/carrusel/image/img1.jpg" alt="img1" width={1000} height={1000}/>
                <div className="content">
                    <div className="title font-bold">
                        EPS
                    </div>
                    <div className="description">
                        
                    </div>
                </div>
            </div>
            <div className="item">
                <Image src="/img/carrusel/image/img2.jpg" alt="img2" width={1000} height={1000}/>
                <div className="content">
                    <div className="title font-bold">
                        Mecanica
                    </div>
                    <div className="description">
                        
                    </div>
                </div>
            </div>
            <div className="item">
                <Image src="/img/carrusel/image/img3.jpg" alt="img3" width={1000} height={1000}/>
                <div className="content">
                    <div className="title font-bold">
                        Aerodinámica
                    </div>
                    <div className="description">
                        
                    </div>
                </div>
            </div>
            <div className="item">
                <Image src="/img/carrusel/image/img4.jpg" alt="img4" width={1000} height={1000}/>
                <div className="content">
                    <div className="title font-bold">
                        CCH
                    </div>
                    <div className="description">
                        
                    </div>
                </div>
            </div>
        </div>
        <div className="arrows">
            <button id="prev">prev</button>
            <button id="next" ref={clickRef}>next</button>
        </div>
        <div className="time"></div>
    </section>
      <section className="w-full h-80 bg-frase bg-cover bg-no-repeat md:bg-contain flex justify-center items-center border-y-2 border-y-white">
        <h3 className="text-white text-2xl md:text-4xl font-bold text-center px-4 md:px-0">El éxito de Cuauhtémoc, radica en cada miembro del equipo.</h3>
      </section>
      <section id="competencias" className="w-full min-h-screen bg-black-cuau text-white flex flex-col justify-evenly items-center pb-10">
        <div className="w-full flex flex-col items-center">
          <h2 className="text-2xl font-bold my-5 md:mb-5">Competencias</h2>
          <p className="text-base w-11/12 md:w-2/4 text-justify leading-8">En Cuauhtémoc participamos en varias competencias nacionales e internacionales, dentro de las nacionales en las que participamos esta CanSat Cucei, Comeback, Telemetri e Eunice. Quedando en alguna de estas en primer lugar a nivel nacional.<br/><br/>
          Dentro de la internacional esta Cansat Competition, el cual se realiza en E.U. Virginia, en esta competencia se ha logrado el 5to y 3er lugar a nivel mundial, destacando en primer lugar a nivel Latinoamericano. Abajo podrás ver algunas de nuestras mencionadas anteriormente.</p>
        </div>
        <div className="w-full">
          <div className="flex flex-col items-center md:flex-row md:items-center md:justify-evenly">
            <div className="w-fit my-2 md:my-0">
              <div class="container competition-color">
                <div class="box box-competition">
                <Image alt="competition 2023" src="/img/competencias/Competition2023.png" width={195} height={136}/>
                <h3 className="text-white font-bold text-lg my-2">Competition 2023</h3>
                <p className="text-white text-xs leading-4 text-justify">Esta competencia se realizo en Virginia E.U. Participaron 40 equipos de los cuales 20 eran de E.u. y el resto de los equipos de diferentes países, entre ellos, Polonia, China, Francia etc.</p>
                </div>
              </div>
            </div>
            <div className="w-fit my-2 md:my-0">
              <div class="container cucei-color">
                <div class="box box-cucei">
                <Image alt="competition 2023" src="/img/competencias/CanSatCucei.png" width={195} height={136}/>
                <h3 className="text-white font-bold text-lg my-2">CanSat Cucei 2022</h3>
                <p className="text-white text-xs leading-4 text-justify">LLevada a cabo en Guadalajara, en esta competencia se realizo un satélite tipo CanSat, el cual fue elevado a 500m de altura con ayuda de un drone.</p>
                </div>
              </div>
            </div>
            <div className="w-fit my-2 md:my-0">
              <div class="container comeback-color">
                <div class="box box-comeback">
                <Image alt="competition 2023" src="/img/competencias/Comeback.png" width={195} height={136}/>
                <h3 className="text-white font-bold text-lg my-2">Comeback 2022</h3>
                <p className="text-white text-xs leading-4 text-justify">Esta competencia se realizo en Queretaro. 
                El prototipo de este satélite de tipo robert, simulando una misión de marte, donde en cuanto el robert aterrzara, tenía que regresar a su punto de lanzamiento inicial.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="reclutamiento" className="w-full min-h-screen bg-white flex flex-col items-center md:flex-row md:items-center md:justify-around">
        <div className="w-11/12 md:w-1/2">
          <h2 className="text-2xl md:text-4xl font-bold italic my-10 md:mb-10 text-center leading-10 text-black">RECLUTAMIENTO CUAUHTÉMOC<br/><span className="text-ipn-color">IPN</span> AEROESPACE</h2>
          <p className="text-justify leading-10 px-0 md:px-10 text-black">Cada año dentro del equipo se hace un reclutamiento para las nuevas generaciones de Cuauhtémoc. El reclutamiento se divide en 2 partes.<br/>Reclutamiento para aquellas personas que estudian una ingeniería dentro del IPN y puedan competir dentro del equipo <span className="text-ipn-color font-bold">(new member).</span></p><br/>
          <p className="text-justify leading-10 px-0 md:px-10 text-black">El segundo bloque es para aquella personas que aún no entran a universidad pero se encuentran estudiando dentro del IPN y les gustraía ir ganando experiencia, pueden unirse como miembros de redes sociales del equipo <span className="text-ipn-color font-bold">(new social).</span></p>
        </div>
        <div className="w-1/2 md:w-fit">
          <Image alt="rocket" src="/img/ilustrate/rocket.png" width={350} height={600}/>
        </div>
      </section>
      <footer className="w-full h-fit py-10 md:py-0 md:h-80 bg-black-cuau flex flex-col items-center md:flex-row md:items-end">
        <div className="w-5/6 md:w-fit mb-10 md:mb-0">
          <Image alt="cuauhtémoc ipn" src="/img/ilustrate/cuauhtemocipn.png" width={517} height={300}/>
        </div>
        <div className="text-white flex flex-col w-11/12 text-center md:w-fit pb-20 md:pl-10">
          <p className="mb-10">Para contactarnos puedes hacerlo por medio del correo o por nuestras redes sociales.</p>
          <div className="flex md: md:justify-around md:items-center">
            <div className="text-center">
              <p className="mb-5">cuauhtemocipn@gmail.com</p>
              <p>Todos los derechos reservados por el autor.</p>
            </div>
            <div>
              <h3>Redes sociales</h3>
              <div>
              <a href="https://www.instagram.com/cuauhtemocipn/" target="_blank" class="Btn">
              <span class="svgContainer">
                <svg fill="white" class="svgIcon" viewBox="0 0 448 512" height="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path></svg>
              </span>
              <span class="BG"></span>
              </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
