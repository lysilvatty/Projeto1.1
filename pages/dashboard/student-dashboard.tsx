import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import VideoPlayer from "@/components/video/video-player";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDuration } from "@/lib/utils";
import { StarIcon, BookOpen, Video } from "lucide-react";
import { Link } from "wouter";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);

  // Fetch student dashboard data
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["/api/dashboard/student"],
    enabled: !!user && user.userType === "student"
  });

  // Fetch all videos for recommendations
  const { data: allVideos, isLoading: isLoadingVideos } = useQuery({
    queryKey: ["/api/videos"],
  });

  // Function to get video details
  const getSelectedVideo = () => {
    if (!dashboardData || !selectedVideo) return null;
    
    return dashboardData.purchases.find(purchase => 
      purchase.video.id === selectedVideo
    )?.video || null;
  };

  // Get recommended videos (excluding purchased ones)
  const getRecommendedVideos = () => {
    if (!allVideos || !dashboardData) return [];
    
    const purchasedVideoIds = new Set(dashboardData.purchases.map(p => p.video.id));
    
    return allVideos
      .filter(video => !purchasedVideoIds.has(video.id))
      .slice(0, 4);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Set first video as selected by default
  if (dashboardData && dashboardData.purchases.length > 0 && !selectedVideo) {
    setSelectedVideo(dashboardData.purchases[0].video.id);
  }

  const selectedVideoData = getSelectedVideo();
  const recommendedVideos = getRecommendedVideos();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="space-y-8">
              <Skeleton className="h-12 w-60" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
              </div>
              <Skeleton className="h-96 w-full" />
            </div>
          ) : (
            <>
              {/* Welcome section */}
              <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold font-poppins text-gray-900 mb-2">
                  Olá, {user?.name?.split(' ')[0]}!
                </h1>
                <p className="text-gray-600">
                  Bem-vindo ao seu painel de estudante. Continue descobrindo profissões!
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-gray-700">Vídeos adquiridos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <Video className="h-8 w-8 text-primary mr-3" />
                      <div>
                        <p className="text-3xl font-bold">{dashboardData?.purchases.length || 0}</p>
                        <p className="text-sm text-gray-500">Total</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-gray-700">Avaliações feitas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <StarIcon className="h-8 w-8 text-yellow-500 mr-3" />
                      <div>
                        <p className="text-3xl font-bold">{dashboardData?.ratings.length || 0}</p>
                        <p className="text-sm text-gray-500">Total</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {dashboardData?.purchases.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <div className="mb-4 mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <BookOpen className="h-8 w-8 text-gray-400" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">Nenhum vídeo adquirido ainda</h2>
                  <p className="text-gray-600 mb-6">
                    Explore nossa biblioteca de vídeos e comece a descobrir o dia a dia das profissões que te interessam!
                  </p>
                  <Link href="/explore">
                    <Button className="bg-primary hover:bg-primary/90">
                      Explorar profissões
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Meus vídeos</CardTitle>
                        <CardDescription>Vídeos que você adquiriu</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Tabs defaultValue="videos">
                          <TabsList className="mb-6">
                            <TabsTrigger value="videos">Biblioteca</TabsTrigger>
                            <TabsTrigger value="history">Histórico</TabsTrigger>
                          </TabsList>

                          <TabsContent value="videos" className="space-y-6">
                            {/* Video player for selected video */}
                            {selectedVideoData && (
                              <div className="mb-6">
                                <VideoPlayer 
                                  videoUrl={selectedVideoData.videoUrl} 
                                  thumbnailUrl={selectedVideoData.thumbnailUrl}
                                />
                                <div className="mt-4">
                                  <h3 className="text-xl font-semibold">{selectedVideoData.title}</h3>
                                  <div className="flex items-center mt-1 text-gray-600">
                                    <span>{selectedVideoData.professional.name}</span>
                                    <span className="mx-2">•</span>
                                    <span>{selectedVideoData.category.displayName}</span>
                                    <span className="mx-2">•</span>
                                    <span>{formatDuration(selectedVideoData.duration)}</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* List of purchased videos */}
                            <div className="space-y-4">
                              <h3 className="font-semibold">Todos os vídeos</h3>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {dashboardData.purchases.map(purchase => (
                                  <div 
                                    key={purchase.id}
                                    className={`rounded-lg overflow-hidden border ${
                                      selectedVideo === purchase.video.id 
                                        ? 'border-primary'
                                        : 'border-gray-200'
                                    } cursor-pointer hover:shadow-md transition-shadow`}
                                    onClick={() => setSelectedVideo(purchase.video.id)}
                                  >
                                    <div className="aspect-video relative">
                                      <img 
                                        src={purchase.video.thumbnailUrl || `https://source.unsplash.com/random/300x200/?${purchase.video.category.name}`}
                                        alt={purchase.video.title}
                                        className="w-full h-full object-cover"
                                      />
                                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                                        <i className="ri-play-fill text-3xl text-white"></i>
                                      </div>
                                    </div>
                                    <div className="p-3">
                                      <h4 className="font-medium text-gray-900 line-clamp-1">{purchase.video.title}</h4>
                                      <p className="text-sm text-gray-600">{purchase.video.professional.name}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="history">
                            <div className="space-y-6">
                              <div className="text-center py-12">
                                <p className="text-gray-600">O histórico de visualizações estará disponível em breve</p>
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle>Recomendados para você</CardTitle>
                        <CardDescription>Baseados nos seus interesses</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {isLoadingVideos ? (
                          <div className="space-y-4">
                            {Array(3).fill(0).map((_, i) => (
                              <Skeleton key={i} className="h-24 w-full" />
                            ))}
                          </div>
                        ) : recommendedVideos.length > 0 ? (
                          <div className="space-y-4">
                            {recommendedVideos.map(video => (
                              <Link key={video.id} href={`/video/${video.id}`}>
                                <div className="flex cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors">
                                  <div className="w-20 h-20 rounded-lg overflow-hidden mr-3">
                                    <img 
                                      src={video.thumbnailUrl || `https://source.unsplash.com/random/100x100/?${video.category.name}`}
                                      alt={video.title}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-medium text-gray-900 line-clamp-2">{video.title}</h4>
                                    <p className="text-sm text-gray-600">{video.professional.name}</p>
                                    <div className="flex items-center mt-1 text-sm text-gray-500">
                                      <span>R$ {video.price.toFixed(2).replace('.', ',')}</span>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-gray-600">Nenhuma recomendação disponível no momento</p>
                          </div>
                        )}

                        <div className="mt-6">
                          <Link href="/explore">
                            <Button variant="outline" className="w-full">
                              Ver mais vídeos
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle>Meu perfil</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center">
                          <Avatar className="h-16 w-16 mr-4">
                            <AvatarImage src={user?.profileImage || ""} alt={user?.name} />
                            <AvatarFallback>{user?.name ? getInitials(user.name) : "U"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium text-gray-900">{user?.name}</h4>
                            <p className="text-sm text-gray-600">{user?.email}</p>
                            <p className="text-xs text-gray-500 mt-1">Estudante</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
