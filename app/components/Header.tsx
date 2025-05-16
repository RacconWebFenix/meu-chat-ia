import Image from "next/image";

export default function Header() {
  return (
    <header className="w-full bg-white flex flex-col items-center pt-6 pb-8 shadow-md border-b border-[#53b5e6] rounded">
      {/* Logo */}
      <Image
        src="/assets/logo-comercio-integrado.png"
        alt="Comércio Integrado"
        width={120}
        height={60}
        priority
      />

      {/* Título */}
      <h1 className="mt-2 text-xl md:text-2xl font-bold text-black text-center rounded ">
        Comércio Integrado Materiais & Suprimentos
      </h1>
    </header>
  );
}
