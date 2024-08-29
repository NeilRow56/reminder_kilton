import { UserButton } from "@clerk/nextjs";
import React from "react";
import { ThemeToggle } from "./ThemeToggle";
import Logo from "./Logo";

const Navbar = () => {
  return (
    <nav className="flex w-full items-center justify-between p-4 px-8 h-[60px]">
      <Logo />
      <div className="flex items-center gap-4">
        <UserButton />
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
