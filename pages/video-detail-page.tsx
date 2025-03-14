import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { VideoWithDetails, Rating, insertRatingSchema } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import VideoPlayer from "@/components/video/video-player";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { formatDuration } from "@/lib/utils";
import { StarIcon } from "lucide-react";
import { z } from "zod";

export default function VideoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const videoId = parseInt(id);
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("description");

  // Fetch video details
  const { data: video, isLoading: isLoadingVideo } = useQuery<VideoWithDetails>({
    queryKey: [`/api/videos/${videoId}`],
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível carregar este vídeo",
        variant: "destructive",
      });
      navigate("/explore");
    }
  });

  // Fetch video ratings
  const { data: ratings, isLoading: isLoadingRatings } = useQuery<Rating[]>({
    queryKey: [`/api/ratings/video/${videoId}`],
    enabled: !!videoId,
  });

  // Check if user has purchased this video
  const { data: purchases, isLoading: isLoadingPurchases } = useQuery({
    queryKey: ["/api/purchases/user"],
    enabled: !!user,
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const hasPurchased = purchases?.some(purchase => purchase.videoId === videoId);

  // Create purchase mutation
  const purchaseMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/purchases", {
        videoId,
        amount: video?.price,
        paymentMethod: "pix",
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/purchases/user"] });
      toast({
        title: "Compra realizada com sucesso!",
        description: "Agora você pode assistir a este vídeo.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro na compra",
        description: error.message || "Não foi possível completar a compra",
        variant: "destructive",
      });
    },
  });

  // Rating form
  const ratingSchema = z.object({
    rating: z.coerce.number().min(1).max(5),
    comment: z.string().optional(),
  });

  const form = useForm<z.infer<typeof ratingSchema>>({
    resolver: zodResolver(ratingSchema),
    defaultValues: {
      rating: 5,
      comment: "",
    },
  });

  // Create rating mutation
  const ratingMutation = useMutation({
    mutationFn: async (data: z.infer<typeof ratingSchema>) => {
      const res = await apiRequest("POST", "/api/ratings", {
        videoId,
        rating: data.rating,
        comment: data.comment,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/ratings/video/${videoId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/videos/${videoId}`] });
      toast({
        title: "Avaliação enviada",
        description: "Obrigado por avaliar este vídeo!",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao enviar avaliação",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmitRating = (data: z.infer<typeof ratingSchema>) => {
    ratingMutation.mutate(data);
  };

  // Handle purchase button click
  const handlePurchase = () => {
    if (!user) {
      toast({
        title: "Faça login para continuar",
        description: "É necessário estar logado para comprar vídeos",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (user.userType === "professional") {
      toast({
        title: "Somente para estudantes",
        description: "Apenas estudantes podem adquirir vídeos",
        variant: "destructive",
      });
      return;
    }

    purchaseMutation.mutate();
  };

  // Function to render star rating
  const renderStarRating = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <StarIcon 
        key={i} 
        className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  // Get the user's rating for this video
  const userRating = user && ratings?.find(rating => rating.userId === user.id);

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
          {isLoadingVideo ? (
            <div className="space-y-6">
              <Skeleton className="w-full h-[60vh] rounded-lg" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Skeleton className="h-72 w-full rounded-lg" />
                </div>
                <div>
                  <Skeleton className="h-72 w-full rounded-lg" />
                </div>
              </div>
            </div>
          ) : video ? (
            <>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
                <div className="aspect-video w-full max-h-[60vh]">
                  <VideoPlayer 
                    videoUrl={video.videoUrl} 
                    thumbnailUrl={video.thumbnailUrl}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Video info and tabs */}
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold font-poppins text-gray-900 mb-2">{video.title}</h1>
                    <div className="flex items-center text-gray-600">
                      <span className="flex items-center">
                        <i className="ri-time-line mr-1"></i> {formatDuration(video.duration)}
                      </span>
                      <span className="mx-2">•</span>
                      <span className="flex items-center">
                        <i className="ri-star-fill text-yellow-400 mr-1"></i> 
                        {video.averageRating ? video.averageRating.toFixed(1) : 'Novo'}
                      </span>
                      {video.ratingCount ? (
                        <>
                          <span className="mx-2">•</span>
                          <span>{video.ratingCount} avaliações</span>
                        </>
                      ) : null}
                    </div>
                  </div>

                  <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                    <TabsList>
                      <TabsTrigger value="description">Descrição</TabsTrigger>
                      <TabsTrigger value="reviews">Avaliações</TabsTrigger>
                    </TabsList>

                    <TabsContent value="description" className="mt-6">
                      <div className="bg-white rounded-lg shadow-sm p-6">
                        <p className="text-gray-700 whitespace-pre-line">{video.description}</p>
                        
                        <div className="mt-8 pt-6 border-t border-gray-200">
                          <h3 className="text-lg font-semibold mb-4">Sobre o profissional</h3>
                          <div className="flex items-center">
                            <Avatar className="h-16 w-16 mr-4">
                              <AvatarImage src={video.professional.profileImage || ""} alt={video.professional.name} />
                              <AvatarFallback>{getInitials(video.professional.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold text-gray-900">{video.professional.name}</h4>
                              <p className="text-gray-600">{video.category.displayName} • {video.professional.experience} anos exp.</p>
                              <Button 
                                variant="link" 
                                className="px-0 text-secondary"
                                onClick={() => navigate(`/professional/${video.professional.id}`)}
                              >
                                Ver perfil completo
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="reviews" className="mt-6">
                      <div className="bg-white rounded-lg shadow-sm p-6">
                        {isLoadingRatings ? (
                          <div className="space-y-6">
                            {Array(3).fill(0).map((_, i) => (
                              <div key={i} className="flex">
                                <Skeleton className="h-12 w-12 rounded-full mr-4" />
                                <div className="space-y-2 flex-1">
                                  <Skeleton className="h-4 w-1/4" />
                                  <Skeleton className="h-4 w-4/5" />
                                  <Skeleton className="h-4 w-3/5" />
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : ratings && ratings.length > 0 ? (
                          <div className="space-y-6">
                            {ratings.map(rating => (
                              <div key={rating.id} className="border-b border-gray-100 pb-4 last:border-0">
                                <div className="flex items-start">
                                  <Avatar className="h-10 w-10 mr-3">
                                    <AvatarFallback>US</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="flex items-center">
                                      <p className="font-semibold">Usuário</p>
                                      <span className="mx-2 text-gray-400">•</span>
                                      <p className="text-gray-500 text-sm">
                                        {new Date(rating.createdAt).toLocaleDateString('pt-BR')}
                                      </p>
                                    </div>
                                    <div className="flex mt-1 mb-2">
                                      {renderStarRating(rating.rating)}
                                    </div>
                                    {rating.comment && (
                                      <p className="text-gray-700">{rating.comment}</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                              <i className="ri-star-line text-xl text-gray-400"></i>
                            </div>
                            <p className="text-gray-600">Ainda não há avaliações para este vídeo</p>
                          </div>
                        )}

                        {user && hasPurchased && !userRating && (
                          <div className="mt-8 pt-6 border-t border-gray-200">
                            <h3 className="text-lg font-semibold mb-4">Avalie este vídeo</h3>
                            <Form {...form}>
                              <form onSubmit={form.handleSubmit(onSubmitRating)} className="space-y-4">
                                <FormField
                                  control={form.control}
                                  name="rating"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Sua avaliação</FormLabel>
                                      <FormControl>
                                        <div className="flex">
                                          {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                              type="button"
                                              key={star}
                                              onClick={() => field.onChange(star)}
                                              className="focus:outline-none"
                                            >
                                              <StarIcon
                                                className={`h-8 w-8 ${
                                                  star <= field.value
                                                    ? 'text-yellow-400 fill-yellow-400'
                                                    : 'text-gray-300'
                                                }`}
                                              />
                                            </button>
                                          ))}
                                        </div>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="comment"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Seu comentário (opcional)</FormLabel>
                                      <FormControl>
                                        <Textarea
                                          placeholder="Compartilhe sua opinião sobre este vídeo..."
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <Button 
                                  type="submit" 
                                  className="bg-primary hover:bg-primary/90"
                                  disabled={ratingMutation.isPending}
                                >
                                  {ratingMutation.isPending ? 'Enviando...' : 'Enviar avaliação'}
                                </Button>
                              </form>
                            </Form>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Purchase card */}
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Adquirir este vídeo</CardTitle>
                      <CardDescription>Acesso vitalício ao conteúdo</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-6">
                        <span className="text-3xl font-bold text-gray-900">R$ {video.price.toFixed(2).replace('.', ',')}</span>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">O que você aprenderá:</h4>
                          <ul className="space-y-2">
                            <li className="flex items-start">
                              <i className="ri-check-line text-green-500 mr-2 mt-1"></i>
                              <span>Experiência real de um profissional da área</span>
                            </li>
                            <li className="flex items-start">
                              <i className="ri-check-line text-green-500 mr-2 mt-1"></i>
                              <span>Desafios do dia a dia desta profissão</span>
                            </li>
                            <li className="flex items-start">
                              <i className="ri-check-line text-green-500 mr-2 mt-1"></i>
                              <span>Dicas para quem deseja seguir esta carreira</span>
                            </li>
                          </ul>
                        </div>

                        {hasPurchased ? (
                          <Button className="w-full bg-green-600 hover:bg-green-700" disabled>
                            <i className="ri-check-line mr-2"></i> Vídeo adquirido
                          </Button>
                        ) : (
                          <Button 
                            className="w-full bg-primary hover:bg-primary/90" 
                            onClick={handlePurchase}
                            disabled={purchaseMutation.isPending || !user || user.userType === "professional"}
                          >
                            {purchaseMutation.isPending ? (
                              'Processando...'
                            ) : (
                              <>
                                <i className="ri-shopping-cart-line mr-2"></i> Comprar agora
                              </>
                            )}
                          </Button>
                        )}

                        <div className="flex items-center justify-center text-sm text-gray-600">
                          <i className="ri-lock-line mr-1"></i>
                          <span>Pagamento seguro</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Vídeo não encontrado</h2>
              <p className="text-gray-600 mb-6">O vídeo que você procura não está disponível</p>
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

// Helper function for fetch
function getQueryFn({ on401 }: { on401: "returnNull" }) {
  return async ({ queryKey }: { queryKey: string[] }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (on401 === "returnNull" && res.status === 401) {
      return null;
    }

    if (!res.ok) {
      throw new Error(`${res.status}: ${res.statusText}`);
    }
    
    return await res.json();
  };
}
