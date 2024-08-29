import { PiggyBank, Save } from "lucide-react";
import React from "react";

function Logo() {
  return (
    <a href="/" className=" hidden items-center gap-2 sm:flex">
      <Save className="stroke h-8 w-8 shrink-0 stroke-amber-500 stroke-[1.5]" />
      <p className="hidden bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent lg:block">
        WpAccPac
      </p>
    </a>
  );
}

export function LogoMobile() {
  return (
    <p className=" bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-xl font-bold leading-tight tracking-tighter text-transparent sm:text-2xl md:text-3xl lg:hidden">
      WpAccPac
    </p>
  );
}

export default Logo;
