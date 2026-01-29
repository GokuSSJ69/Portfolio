import { useState } from "react";
import { motion } from "motion/react"
import { Link } from "react-scroll";

function Navigation() {
  const commonClasses = "nav-link cursor-pointer";
  const commonProps = {
    spy: true,
    smooth: true,
    offset: -70,
    duration: 500,
    className: commonClasses,
  };

  return (
    <ul className="nav-ul">
      <li className="nav-li">
        <Link {...commonProps} to="home">
          Home
        </Link>
      </li>
      <li className="nav-li">
        <Link {...commonProps} to="about">
          About
        </Link>
      </li>
      <li className="nav-li">
        <Link {...commonProps} to="work">
          Work
        </Link>
      </li>
      <li className="nav-li">
        <Link {...commonProps} to="testimonial">
          Testimonial
        </Link>
      </li>
      <li className="nav-li">
        <Link {...commonProps} to="contact">
          Contact
        </Link>
      </li>
    </ul>
  );
}

const Navbar = () => {
  const[isOpen, setIsOpen] = useState(false);
  return (
    <div className="fixed inset-x-0 z-20 w-full backdrop-blur-lg bg-primary/40">
        <div className="mx-auto c-space max-w-7xl">
            <div className="flex items-center justify-between py-2 sm:py-0">
                <a href="/" className="text-xl font-bold transition-colors text-neutral-400 hover:text-white">Irfan</a>
                <button onClick={()=> setIsOpen(!isOpen)} className="flex cursor-pointer text-neutral-400 hover:text-white focus:outline-none sm:hidden">
                    <img src={isOpen? "assets/close.svg " : "assets/menu.svg"} className="w-6 h-6" alt="toggle"/>
                </button>
                <nav className="hidden sm:flex">
                  <Navigation/>
                </nav>
            </div>
        </div>
        {isOpen && (<motion.div className="block overflow-hidden text-center sm:hidden"initial={{opacity: 0, x: -10}}
        animate={{opacity: 1, x: 0}}
        style={{ maxHeight: "100vh"}}
        transition={{ duration: 1 }}
        ><nav className="pb-5">
          <Navigation/>
        </nav>
        </motion.div>)}
    </div>
  )
}

export default Navbar