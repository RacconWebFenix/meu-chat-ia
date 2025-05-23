import Image from "next/image";

export default function Header() {
  return (
    <header className="w-full bg-white flex justify-center pt-6 pb-8 shadow-md border-b border-[#53b5e6] rounded">
      <div className="flex flex-col md:flex-row items-center md:justify-between gap-6 w-full max-w-4xl px-4">
        {/* Logo */}
        <div>
          <Image
            src="/assets/logo-comercio-integrado.png"
            alt="Comércio Integrado"
            width={250}
            height={60}
            priority
          />
        </div>
        {/* Título */}
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-black text-center rounded">
            Comércio Integrado Materiais & Suprimentos
          </h1>
        </div>
      </div>
    </header>
  );
}
