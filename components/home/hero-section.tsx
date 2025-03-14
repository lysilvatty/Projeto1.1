import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center md:space-x-12">
          <div className="md:w-5/12 mb-12 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
              Descubra suas futuras possibilidades profissionais
            </h1>
            <p className="text-lg md:text-xl mb-8 text-blue-100 leading-relaxed">
              Conectamos você a profissionais experientes que compartilham a realidade de suas carreiras através de vídeos exclusivos e autênticos
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/explore">
                <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-semibold px-8 py-6 h-auto">
                  Explorar Carreiras
                </Button>
              </Link>
              <Link href="/auth">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-6 h-auto">
                  Sou Profissional
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="md:w-7/12 flex justify-center">
            <div className="relative w-full max-w-lg mx-auto md:mx-0 md:ml-auto">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 bg-yellow-400 text-blue-900 px-4 py-2 rounded-full text-sm font-bold z-10">
                Destaque
              </div>
              
              {/* Video card with animation */}
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all hover:scale-105 duration-300">
                <div className="aspect-video relative">
                  <img 
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1350&q=80" 
                    alt="Desenvolvedor de software trabalhando" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-6 w-full">
                      <div className="flex items-center mb-3">
                        <img 
                          src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=100&q=80" 
                          alt="Foto de perfil" 
                          className="w-12 h-12 rounded-full border-2 border-white mr-4"
                        />
                        <div>
                          <div className="text-white font-semibold text-lg">Ricardo Desenvolvedor</div>
                          <div className="text-blue-200 text-sm flex items-center">
                            <span className="bg-blue-500 w-2 h-2 rounded-full inline-block mr-2"></span>
                            Desenvolvimento Web • 12 anos exp.
                          </div>
                        </div>
                      </div>
                      <h3 className="text-white font-bold text-xl mb-2">Como é trabalhar com tecnologia em grandes empresas</h3>
                    </div>
                  </div>
                  
                  {/* Play button with glow effect */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="bg-blue-600 rounded-full p-4 shadow-lg shadow-blue-600/50 hover:bg-blue-700 transition-all transform hover:scale-110">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="white">
                        <polygon points="5 3 19 12 5 21 5 3"/>
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Video stats */}
                <div className="bg-white p-4 flex justify-between items-center">
                  <div className="flex items-center text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 12a10 10 0 0 1 20 0 10 10 0 0 1-20 0Z"></path>
                      <path d="M12 6v6l4 2"></path>
                    </svg>
                    <span className="ml-2">18:24</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center text-yellow-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                      <span className="ml-1 font-medium">4.8</span>
                    </div>
                    <div className="text-blue-600 font-semibold">Premium</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
