import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ProfessionalWithVideos } from "@shared/schema";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import VideoCard from "@/components/video/video-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export default function ProfessionalPage() {
  const { id } = useParams<{ id: string }>();
  const professionalId = parseInt(id);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const { data: professional, isLoading } = useQuery<ProfessionalWithVideos>({
    queryKey: [`/api/professionals/${professionalId}`],
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível carregar o perfil do profissional",
        variant: "destructive",
      });
      navigate("/explore");
    }
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="space-y-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <Skeleton className="h-32 w-32 rounded-full" />
                  <div className="flex-1 space-y-4 text-center md:text-left">
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array(4).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-64 rounded-lg" />
                ))}
              </div>
            </div>
          ) : professional ? (
            <>
              {/* Professional Profile */}
              <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <Avatar className="h-32 w-32">
                    <AvatarImage 
                      src={professional.profileImage || ""} 
                      alt={professional.name} 
                      className="object-cover"
                    />
                    <AvatarFallback className="text-2xl">{getInitials(professional.name)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-4 text-center md:text-left">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold font-poppins text-gray-900">{professional.name}</h1>
                      <p className="text-gray-600">
                        {professional.experience} anos de experiência
                        {professional.averageRating ? (
                          <span className="ml-2">
                            • <i className="ri-star-fill text-yellow-400"></i> {professional.averageRating.toFixed(1)}
                          </span>
                        ) : null}
                      </p>
                    </div>
                    
                    {professional.bio && (
                      <p className="text-gray-700 whitespace-pre-line">{professional.bio}</p>
                    )}
                    
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      {professional.videos.map(video => video.category).filter((category, index, self) => 
                        index === self.findIndex(c => c.id === category.id)
                      ).map(category => (
                        <span 
                          key={category.id} 
                          className="px-3 py-1 rounded-full text-sm font-medium"
                          style={{ backgroundColor: `${category.color}20`, color: category.color }}
                        >
                          {category.displayName}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Videos Section */}
              <Tabs defaultValue="videos">
                <div className="flex justify-between items-center mb-6">
                  <TabsList>
                    <TabsTrigger value="videos">Vídeos ({professional.videos.length})</TabsTrigger>
                    <TabsTrigger value="about">Sobre</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="videos">
                  {professional.videos.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {professional.videos.map(video => (
                        <VideoCard key={video.id} video={video} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <i className="ri-video-line text-xl text-gray-400"></i>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum vídeo publicado</h3>
                      <p className="text-gray-600 mb-4">
                        Este profissional ainda não publicou nenhum vídeo
                      </p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="about">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-4">Sobre {professional.name}</h2>
                    
                    {professional.bio ? (
                      <p className="text-gray-700 whitespace-pre-line mb-6">{professional.bio}</p>
                    ) : (
                      <p className="text-gray-600 italic mb-6">Nenhuma biografia disponível</p>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Experiência</h3>
                        <p className="text-gray-700">{professional.experience} anos de experiência profissional</p>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Áreas de especialização</h3>
                        <div className="flex flex-wrap gap-2">
                          {professional.videos.map(video => video.category).filter((category, index, self) => 
                            index === self.findIndex(c => c.id === category.id)
                          ).map(category => (
                            <span 
                              key={category.id} 
                              className="px-3 py-1 rounded-full text-sm font-medium"
                              style={{ backgroundColor: `${category.color}20`, color: category.color }}
                            >
                              {category.displayName}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Profissional não encontrado</h2>
              <p className="text-gray-600 mb-6">O profissional que você procura não está disponível</p>
              <Button onClick={() => navigate("/explore")}>
                Voltar para explorar
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
