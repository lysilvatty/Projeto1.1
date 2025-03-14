import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
    onClose();
  };

  return (
    <div 
      className={`fixed inset-0 bg-white z-50 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}
    >
      <div className="flex flex-col h-full p-4">
        <div className="flex justify-between items-center mb-8">
          <Link href="/" onClick={onClose}>
            <span className="text-2xl font-bold text-primary font-poppins">
              Hop<span className="text-secondary">Well</span>
            </span>
          </Link>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </Button>
        </div>
        <nav className="flex flex-col space-y-6 text-lg">
          <Link href="/explore" onClick={onClose}>
            <span className="font-medium text-gray-700 hover:text-primary transition-colors cursor-pointer">Explorar</span>
          </Link>
          <Link href="/explore" onClick={onClose}>
            <span className="font-medium text-gray-700 hover:text-primary transition-colors cursor-pointer">Profissões</span>
          </Link>
          <a href="#como-funciona" className="font-medium text-gray-700 hover:text-primary transition-colors" onClick={onClose}>Como Funciona</a>
          <a href="#contato" className="font-medium text-gray-700 hover:text-primary transition-colors" onClick={onClose}>Contato</a>
        </nav>
        <div className="mt-auto flex flex-col space-y-4 pt-8">
          {user ? (
            <>
              <div onClick={onClose}>
                <Link href={user.userType === "professional" ? "/dashboard/professional" : "/dashboard/student"}>
                  <Button className="w-full bg-secondary hover:bg-secondary/90 text-white">
                    Meu Painel
                  </Button>
                </Link>
              </div>
              <Button 
                variant="outline" 
                className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                onClick={handleLogout}
              >
                Sair
              </Button>
            </>
          ) : (
            <>
              <div onClick={onClose}>
                <Link href="/auth">
                  <Button variant="outline" className="w-full text-secondary border-secondary hover:bg-secondary hover:text-white">
                    Entrar
                  </Button>
                </Link>
              </div>
              <div onClick={onClose}>
                <Link href="/auth">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                    Cadastrar
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
