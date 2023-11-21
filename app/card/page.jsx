export default function Card(){
    return(
        <section className="w-full w- min-h-screen bg-white flex items-center justify-center">
            <div className="bg-slate-900 w-64 h-80 rounded-lg shadow-2xl p-5 flex items-end relative">
                <div className="text-2xl font-bold flex-col text-center absolute right-2 top-5 text-white"><span>BOLETO</span><p>8</p></div>
                <div className="">
                    <p className="text-white text-xs"><span className="font-bold text-yellow-500">Nombre:</span> Jesús Rodrigo Pérez Delgado.</p>
                    <p className="text-white text-xs"><span className="font-bold text-yellow-500">Correo:</span> jesusrodrigo881@gmail.com</p>
                    <p className="text-white text-xs"><span className="font-bold text-yellow-500">Teléfono:</span> 55370461</p>
                </div>
            </div>
        </section>
    )
}