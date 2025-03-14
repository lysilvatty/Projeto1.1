import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function HowItWorks() {
  return (
    <section className="py-16 bg-gray-50" id="como-funciona">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Como a Plataforma Funciona
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Descubra como nossa plataforma conecta estudantes e profissionais para compartilhar experiências reais de carreira
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Card 1 - Explore Profissões */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group flex flex-col">
            <div className="relative h-48 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80" 
                alt="Pessoas explorando profissões em um computador" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-blue-600/30"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-1">Explore Profissões</h3>
                <div className="w-16 h-1 bg-yellow-400 rounded-full mb-2"></div>
              </div>
            </div>
            <div className="p-6 flex-grow">
              <p className="text-gray-700 mb-6">
                Navegue por diversas categorias profissionais e descubra carreiras que combinam com seu perfil e interesses.
              </p>
            </div>
            <div className="px-6 pb-6">
              <Link href="/explore" className="block">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium h-12 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg">
                  Ver Categorias
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Card 2 - Assista Vlogs Exclusivos */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group flex flex-col">
            <div className="relative h-48 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1551817958-20204d6ab212?auto=format&fit=crop&w=800&q=80" 
                alt="Pessoa assistindo a um vídeo sobre profissões" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-blue-600/30"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-1">Assista Vlogs Exclusivos</h3>
                <div className="w-16 h-1 bg-yellow-400 rounded-full mb-2"></div>
              </div>
            </div>
            <div className="p-6 flex-grow">
              <p className="text-gray-700 mb-6">
                Acesse conteúdos gravados por profissionais experientes mostrando a realidade do dia a dia em suas carreiras.
              </p>
            </div>
            <div className="px-6 pb-6">
              <Link href="/videos" className="block">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium h-12 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg">
                  Ver Vlogs
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Card 3 - Conecte-se e Tire Dúvidas */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group flex flex-col">
            <div className="relative h-48 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80" 
                alt="Pessoas conversando sobre carreiras profissionais" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-blue-600/30"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-1">Conecte-se e Tire Dúvidas</h3>
                <div className="w-16 h-1 bg-yellow-400 rounded-full mb-2"></div>
              </div>
            </div>
            <div className="p-6 flex-grow">
              <p className="text-gray-700 mb-6">
                Interaja diretamente com os profissionais, tire suas dúvidas e receba orientações personalizadas sobre a carreira.
              </p>
            </div>
            <div className="px-6 pb-6">
              <Link href="/professionals" className="block">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium h-12 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg">
                  Encontrar Profissionais
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* User types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-2xl shadow-lg">
          {/* Section Header */}
          <div className="col-span-1 md:col-span-2 text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Para quem é nossa plataforma</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Conectamos estudantes em busca de orientação com profissionais experientes dispostos a compartilhar seu conhecimento
            </p>
          </div>
          
          {/* For Students */}
          <div className="bg-blue-50 rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg flex flex-col">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-5">
              <h3 className="text-xl font-bold">Para Estudantes</h3>
            </div>
            <div className="p-6 flex-grow">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="text-green-600 h-5 w-5 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Descubra a realidade das profissões antes de escolher sua carreira</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="text-green-600 h-5 w-5 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Compre vídeos individuais ou assine um plano mensal</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="text-green-600 h-5 w-5 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Interaja e tire dúvidas com profissionais experientes</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="text-green-600 h-5 w-5 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Receba recomendações personalizadas baseadas em seus interesses</span>
                </li>
              </ul>
            </div>
            <div className="px-6 pb-6 mt-6">
              <Link href="/auth" className="block">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300">
                  Criar Perfil de Estudante
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Button>
              </Link>
            </div>
          </div>
          
          {/* For Professionals */}
          <div className="bg-blue-50 rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg flex flex-col">
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-5">
              <h3 className="text-xl font-bold">Para Profissionais</h3>
            </div>
            <div className="p-6 flex-grow">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="text-green-600 h-5 w-5 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Monetize seu conhecimento e experiência profissional</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="text-green-600 h-5 w-5 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Crie vídeos mostrando o dia a dia real da sua profissão</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="text-green-600 h-5 w-5 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Defina o valor dos seus conteúdos e receba pagamentos</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="text-green-600 h-5 w-5 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Construa reputação e visibilidade na sua área de atuação</span>
                </li>
              </ul>
            </div>
            <div className="px-6 pb-6 mt-6">
              <Link href="/auth" className="block">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300">
                  Tornar-me Profissional Parceiro
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
