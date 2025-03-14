import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Sheet, 
  SheetContent,
  SheetTrigger 
} from "@/components/ui/sheet";
import LoginModal from "@/components/auth/login-modal";
import RegisterModal from "@/components/auth/register-modal";
import { useAuth } from "@/lib/auth";

export default function Navbar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const openLoginModal = () => {
    setIsLoginOpen(true);
    setIsRegisterOpen(false);
  };

  const openRegisterModal = () => {
    setIsRegisterOpen(true);
    setIsLoginOpen(false);
  };

  const closeModals = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
  };

  const handleLogout = () => {
    logout();
  };

  const dashboardLink = user?.userType === 'professional' 
    ? '/dashboard/professional' 
    : '/dashboard/student';

  return (
    <>
      <header className={`bg-white transition-shadow ${scrolled ? 'shadow-md' : 'shadow'}`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/">
                <span className="text-primary text-2xl font-bold cursor-pointer">ProfissãoVlog</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link href="/explore">
                <a className={`text-dark-medium hover:text-primary font-medium ${location === '/explore' ? 'text-primary' : ''}`}>
                  Explorar
                </a>
              </Link>
              <Link href="/#how-it-works">
                <a className="text-dark-medium hover:text-primary font-medium">Como Funciona</a>
              </Link>
              <Link href={user?.userType === 'professional' ? '/dashboard/professional' : '/dashboard/professional'}>
                <a className={`text-dark-medium hover:text-primary font-medium ${location === '/dashboard/professional' ? 'text-primary' : ''}`}>
                  Para Profissionais
                </a>
              </Link>
            </nav>

            {/* Auth Buttons or User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <span>{user.name || user.username}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <a className="w-full cursor-pointer">Perfil</a>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={dashboardLink}>
                        <a className="w-full cursor-pointer">Dashboard</a>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="ghost" onClick={openLoginModal}>Entrar</Button>
                  <Button onClick={openRegisterModal}>Cadastrar</Button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col h-full">
                  <div className="py-4">
                    <Link href="/">
                      <span className="text-primary text-xl font-bold">ProfissãoVlog</span>
                    </Link>
                  </div>
                  <nav className="flex flex-col space-y-4">
                    <Link href="/explore">
                      <a className={`text-dark-medium hover:text-primary font-medium py-2 ${location === '/explore' ? 'text-primary' : ''}`}>
                        Explorar
                      </a>
                    </Link>
                    <Link href="/#how-it-works">
                      <a className="text-dark-medium hover:text-primary font-medium py-2">
                        Como Funciona
                      </a>
                    </Link>
                    <Link href={user?.userType === 'professional' ? '/dashboard/professional' : '/dashboard/professional'}>
                      <a className={`text-dark-medium hover:text-primary font-medium py-2 ${location === '/dashboard/professional' ? 'text-primary' : ''}`}>
                        Para Profissionais
                      </a>
                    </Link>
                  </nav>
                  <div className="mt-auto pb-8">
                    {user ? (
                      <div className="space-y-2">
                        <Link href="/profile">
                          <a className="block w-full">
                            <Button variant="outline" className="w-full justify-start">
                              Perfil
                            </Button>
                          </a>
                        </Link>
                        <Link href={dashboardLink}>
                          <a className="block w-full">
                            <Button variant="outline" className="w-full justify-start">
                              Dashboard
                            </Button>
                          </a>
                        </Link>
                        <Button onClick={handleLogout} variant="default" className="w-full">
                          Sair
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Button onClick={openLoginModal} variant="outline" className="w-full">
                          Entrar
                        </Button>
                        <Button onClick={openRegisterModal} className="w-full">
                          Cadastrar
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={closeModals}
        onRegisterClick={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={closeModals}
        onLoginClick={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </>
  );
}
