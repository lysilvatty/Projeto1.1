import { useState, useEffect } from "react";
import { Redirect } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import LoginForm from "@/components/auth/login-form";
import { Button } from "@/components/ui/button";

// Importando com caminho relativo para evitar problemas com alias
import StudentRegisterForm from "../components/auth/student-register-form";
import ProfessionalRegisterForm from "../components/auth/professional-register-form";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const [userType, setUserType] = useState<string>("student");
  const { user, isLoading } = useAuth();

  // If user is already logged in, redirect to appropriate dashboard
  if (!isLoading && user) {
    const dashboardUrl = user.userType === 'professional' ? 
      '/dashboard/professional' : 
      '/dashboard/student';
    return <Redirect to={dashboardUrl} />;
  }

  // Handle selecting between student and professional for registration
  const handleUserTypeSelect = (type: string) => {
    setUserType(type);
    setActiveTab("register");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-10 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Form Section */}
            <div className="md:w-1/2 p-6 md:p-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                {activeTab === "login" ? "Bem-vindo(a) de volta!" : 
                 activeTab === "user-select" ? "Como você quer usar a plataforma?" :
                 userType === "student" ? "Crie sua conta de estudante" : "Crie sua conta profissional"}
              </h2>
              <p className="text-gray-600 mb-6">
                {activeTab === "login" 
                  ? "Acesse sua conta para continuar explorando carreiras e profissões." 
                  : activeTab === "user-select"
                  ? "Escolha como você quer participar da nossa plataforma."
                  : userType === "student"
                  ? "Aprenda com profissionais experientes e explore diversas carreiras antes de tomar sua decisão." 
                  : "Compartilhe sua experiência profissional, crie conteúdos e ajude estudantes a conhecerem sua área."}
              </p>
              
              {activeTab === "user-select" ? (
                <div className="space-y-6 mt-8">
                  <div 
                    className="border p-6 rounded-xl cursor-pointer hover:border-blue-500 hover:shadow-md transition-all"
                    onClick={() => handleUserTypeSelect("student")}
                  >
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-3 rounded-full mr-4 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M12 14l9-5-9-5-9 5 9 5z" />
                          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-lg text-gray-900">Sou Estudante</h3>
                        <p className="text-gray-600 text-sm break-words">Quero aprender sobre diferentes profissões</p>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className="border p-6 rounded-xl cursor-pointer hover:border-indigo-500 hover:shadow-md transition-all"
                    onClick={() => handleUserTypeSelect("professional")}
                  >
                    <div className="flex items-start">
                      <div className="bg-indigo-100 p-3 rounded-full mr-4 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-lg text-gray-900">Sou Profissional</h3>
                        <p className="text-gray-600 text-sm break-words">Quero compartilhar minha experiência profissional</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center mt-6">
                    <button 
                      className="text-blue-600 hover:text-blue-800 font-medium"
                      onClick={() => setActiveTab("login")}
                    >
                      Já tem uma conta? Faça login
                    </button>
                  </div>
                </div>
              ) : (
                <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="login">Entrar</TabsTrigger>
                    <TabsTrigger value="register">Cadastrar</TabsTrigger>
                  </TabsList>
                  <TabsContent value="login">
                    <LoginForm />
                  </TabsContent>
                  <TabsContent value="register">
                    {/* Registration option selection buttons */}
                    <div className="mb-6 flex flex-col space-y-3">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className={`py-8 flex justify-start w-full ${userType === "student" ? "border-blue-500 bg-blue-50" : ""}`}
                        onClick={() => setUserType("student")}
                      >
                        <div className="bg-blue-100 p-2 rounded-full mr-3 flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                          </svg>
                        </div>
                        <div className="text-left min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">Sou Estudante</h3>
                          <p className="text-sm text-gray-600 break-words">Quero explorar carreiras e assistir a vlogs profissionais</p>
                        </div>
                      </Button>
                      
                      <Button 
                        type="button" 
                        variant="outline" 
                        className={`py-8 flex justify-start w-full ${userType === "professional" ? "border-indigo-500 bg-indigo-50" : ""}`}
                        onClick={() => setUserType("professional")}
                      >
                        <div className="bg-indigo-100 p-2 rounded-full mr-3 flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="text-left min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">Sou Profissional</h3>
                          <p className="text-sm text-gray-600 break-words">Quero compartilhar minha experiência e criar conteúdo</p>
                        </div>
                      </Button>
                    </div>
                    
                    {/* Conditional form based on user type */}
                    {userType === "student" ? (
                      <StudentRegisterForm />
                    ) : (
                      <ProfessionalRegisterForm />
                    )}
                  </TabsContent>
                </Tabs>
              )}
            </div>
            
            {/* Hero Section */}
            <div className="md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-6 md:p-10 flex items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">
                  Descubra a realidade das profissões
                </h3>
                <p className="text-lg mb-6 text-blue-100">
                  Conecte-se com profissionais experientes e conheça o dia a dia de diversas carreiras antes de tomar sua decisão.
                </p>
                <ul className="space-y-4 text-white">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="text-yellow-400 h-5 w-5 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-medium">Vídeos exclusivos de profissionais atuantes</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="text-yellow-400 h-5 w-5 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-medium">Conheça os desafios reais de cada carreira</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="text-yellow-400 h-5 w-5 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-medium">Interaja e tire suas dúvidas diretamente</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="text-yellow-400 h-5 w-5 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-medium">Tome decisões mais conscientes sobre seu futuro</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
