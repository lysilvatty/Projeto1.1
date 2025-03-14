import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import VideoPlayer from "@/components/vlog/video-player";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import { Vlog, User, Category, Review } from "@shared/schema";

export default function VlogDetails() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [match, params] = useRoute("/vlogs/:id");
  const vlogId = match ? parseInt(params.id) : 0;
  
  const [userRating, setUserRating] = useState<number>(0);
  const [reviewComment, setReviewComment] = useState<string>("");
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  
  // Fetch vlog details
  const { data: vlog, isLoading: isLoadingVlog } = useQuery<Vlog>({
    queryKey: [`/api/vlogs/${vlogId}`],
    enabled: !!vlogId,
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível carregar o vlog",
        variant: "destructive",
      });
    },
  });
  
  // Fetch professional info
  const { data: professional, isLoading: isLoadingProfessional } = useQuery<User>({
    queryKey: [`/api/users/${vlog?.professionalId}`],
    enabled: !!vlog?.professionalId,
  });
  
  // Fetch category info
  const { data: category, isLoading: isLoadingCategory } = useQuery<Category>({
    queryKey: [`/api/categories/${vlog?.categoryId}`],
    enabled: !!vlog?.categoryId,
  });
  
  // Fetch reviews
  const { data: reviews, isLoading: isLoadingReviews } = useQuery<Review[]>({
    queryKey: [`/api/vlogs/${vlogId}/reviews`],
    enabled: !!vlogId,
  });
  
  // Check if user has access (for premium content)
  const { data: accessData, isLoading: isLoadingAccess } = useQuery<{ hasPaid: boolean }>({
    queryKey: [`/api/payments/check/${vlogId}`],
    enabled: !!vlogId && !!user && !!vlog?.isPremium,
  });
  
  // Submit review mutation
  const reviewMutation = useMutation({
    mutationFn: (reviewData: { vlogId: number; rating: number; comment?: string }) => {
      return apiRequest("POST", "/api/reviews", reviewData);
    },
    onSuccess: () => {
      toast({
        title: "Sucesso!",
        description: "Sua avaliação foi enviada com sucesso.",
      });
      setReviewComment("");
      queryClient.invalidateQueries({ queryKey: [`/api/vlogs/${vlogId}/reviews`] });
      queryClient.invalidateQueries({ queryKey: [`/api/vlogs/${vlogId}`] });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível enviar sua avaliação.",
        variant: "destructive",
      });
    },
  });
  
  // Save vlog mutation
  const saveVlogMutation = useMutation({
    mutationFn: (vlogId: number) => {
      return apiRequest("POST", "/api/saved-vlogs", { vlogId });
    },
    onSuccess: () => {
      setIsBookmarked(true);
      toast({
        title: "Vlog salvo!",
        description: "Este vlog foi adicionado aos seus favoritos.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users/saved-vlogs"] });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o vlog.",
        variant: "destructive",
      });
    },
  });
  
  // Unsave vlog mutation
  const unsaveVlogMutation = useMutation({
    mutationFn: (vlogId: number) => {
      return apiRequest("DELETE", `/api/saved-vlogs/${vlogId}`);
    },
    onSuccess: () => {
      setIsBookmarked(false);
      toast({
        title: "Vlog removido!",
        description: "Este vlog foi removido dos seus favoritos.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users/saved-vlogs"] });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível remover o vlog dos favoritos.",
        variant: "destructive",
      });
    },
  });
  
  // Mark as watched mutation
  const watchVlogMutation = useMutation({
    mutationFn: (data: { vlogId: number; watchDuration: number }) => {
      return apiRequest("POST", "/api/watched-vlogs", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/watched-vlogs"] });
      queryClient.invalidateQueries({ queryKey: [`/api/vlogs/${vlogId}`] });
    },
  });
  
  // Payment mutation for premium content
  const paymentMutation = useMutation({
    mutationFn: (paymentData: { vlogId: number; amount: number; status: string }) => {
      return apiRequest("POST", "/api/payments", paymentData);
    },
    onSuccess: () => {
      toast({
        title: "Pagamento processado!",
        description: "Agora você tem acesso ao conteúdo premium.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/payments/check/${vlogId}`] });
    },
    onError: () => {
      toast({
        title: "Erro no pagamento",
        description: "Não foi possível processar o pagamento.",
        variant: "destructive",
      });
    },
  });
  
  const handleRatingChange = (rating: number) => {
    setUserRating(rating);
  };
  
  const handleReviewSubmit = () => {
    if (!user) {
      toast({
        title: "Necessário fazer login",
        description: "Faça login para avaliar este vlog.",
        variant: "destructive",
      });
      return;
    }
    
    if (userRating === 0) {
      toast({
        title: "Avaliação necessária",
        description: "Por favor, selecione uma classificação de 1 a 5 estrelas.",
        variant: "destructive",
      });
      return;
    }
    
    reviewMutation.mutate({
      vlogId,
      rating: userRating,
      comment: reviewComment,
    });
  };
  
  const handleToggleBookmark = () => {
    if (!user) {
      toast({
        title: "Necessário fazer login",
        description: "Faça login para salvar este vlog.",
        variant: "destructive",
      });
      return;
    }
    
    if (isBookmarked) {
      unsaveVlogMutation.mutate(vlogId);
    } else {
      saveVlogMutation.mutate(vlogId);
    }
  };
  
  const handleWatch = (duration: number) => {
    if (user) {
      watchVlogMutation.mutate({
        vlogId,
        watchDuration: duration,
      });
    }
  };
  
  const handlePurchase = () => {
    if (!user) {
      toast({
        title: "Necessário fazer login",
        description: "Faça login para comprar este conteúdo premium.",
        variant: "destructive",
      });
      return;
    }
    
    if (!vlog) return;
    
    // In a real application, this would redirect to a payment gateway
    // For demonstration, we'll just simulate a successful payment
    paymentMutation.mutate({
      vlogId,
      amount: vlog.price || 0,
      status: "completed",
    });
  };
  
  const hasAccess = !vlog?.isPremium || (accessData && accessData.hasPaid);
  
  if (isLoadingVlog) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-300 rounded-lg mb-6"></div>
          <div className="h-8 bg-gray-300 w-3/4 rounded mb-4"></div>
          <div className="h-4 bg-gray-300 w-1/2 rounded mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="h-24 bg-gray-300 rounded mb-4"></div>
              <div className="h-96 bg-gray-300 rounded"></div>
            </div>
            <div>
              <div className="h-60 bg-gray-300 rounded mb-4"></div>
              <div className="h-40 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!vlog) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-400 mb-6"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
        <h1 className="text-2xl font-bold mb-2">Vlog não encontrado</h1>
        <p className="text-gray-600 mb-6">O vlog que você está procurando não está disponível ou foi removido.</p>
        <Button asChild>
          <Link href="/explore">Explorar outros vlogs</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link href="/explore" className="text-primary hover:underline flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="m15 18-6-6 6-6"/></svg>
            Voltar para Explorar
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            <Card className="overflow-hidden mb-8">
              <div className="relative">
                {vlog.isPremium && !hasAccess && (
                  <div className="absolute inset-0 bg-gray-900 bg-opacity-70 flex flex-col items-center justify-center text-white z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-4"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    <h3 className="text-xl font-bold mb-2">Conteúdo Premium</h3>
                    <p className="text-gray-200 mb-4 text-center max-w-md">
                      Este é um conteúdo exclusivo para assinantes premium.
                    </p>
                    <Button onClick={handlePurchase}>
                      Acessar por R${vlog.price?.toFixed(2)}
                    </Button>
                  </div>
                )}
                
                {/* Video Player */}
                <VideoPlayer 
                  videoUrl={vlog.videoUrl}
                  thumbnailUrl={vlog.thumbnailUrl}
                  title={vlog.title}
                  disabled={vlog.isPremium && !hasAccess}
                  onProgress={handleWatch}
                />
              </div>
              
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    {category && (
                      <Badge 
                        style={{ backgroundColor: `${category.color}20`, color: category.color }}
                        className="mb-2"
                      >
                        {category.name}
                      </Badge>
                    )}
                    {vlog.isPremium && (
                      <Badge variant="secondary" className="ml-2 mb-2">Premium</Badge>
                    )}
                  </div>
                  <div className="flex items-center">
                    {Array(5).fill(0).map((_, i) => (
                      <svg 
                        key={i}
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill={i < Math.round(vlog.rating) ? "currentColor" : "none"}
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="text-yellow-400"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    ))}
                    <span className="ml-1 text-sm">
                      {vlog.rating.toFixed(1)} ({vlog.ratingCount})
                    </span>
                  </div>
                </div>
                <CardTitle className="text-2xl">{vlog.title}</CardTitle>
                <CardDescription className="flex items-center justify-between">
                  <span>{vlog.viewCount} visualizações</span>
                  <button 
                    onClick={handleToggleBookmark}
                    className={`text-gray-500 hover:text-primary ${isBookmarked ? 'text-primary' : ''}`}
                  >
                    {isBookmarked ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                    )}
                  </button>
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <Separator className="mb-4" />
                <h3 className="font-semibold mb-2">Descrição</h3>
                <p className="text-gray-700 whitespace-pre-line">{vlog.description}</p>
              </CardContent>
            </Card>
            
            {/* Reviews Section */}
            <Card>
              <CardHeader>
                <CardTitle>Avaliações e Comentários</CardTitle>
              </CardHeader>
              <CardContent>
                {user ? (
                  <div className="mb-8">
                    <h3 className="font-semibold mb-2">Avalie este vlog</h3>
                    <div className="flex items-center mb-4">
                      {Array(5).fill(0).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => handleRatingChange(i + 1)}
                          className="mr-1"
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="24" 
                            height="24" 
                            viewBox="0 0 24 24" 
                            fill={i < userRating ? "currentColor" : "none"}
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            className="text-yellow-400 hover:text-yellow-500 transition"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                          </svg>
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-gray-500">
                        {userRating > 0 ? `${userRating} estrelas` : "Selecione uma classificação"}
                      </span>
                    </div>
                    <Textarea
                      placeholder="Compartilhe sua opinião sobre este vlog..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="mb-4"
                    />
                    <Button 
                      onClick={handleReviewSubmit}
                      disabled={reviewMutation.isPending}
                    >
                      {reviewMutation.isPending ? "Enviando..." : "Enviar Avaliação"}
                    </Button>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-md p-4 mb-8 text-center">
                    <p className="mb-4">Faça login para avaliar este vlog</p>
                    <Button asChild variant="outline">
                      <Link href="/">Entrar</Link>
                    </Button>
                  </div>
                )}
                
                <Separator className="mb-6" />
                
                <h3 className="font-semibold mb-4">Comentários ({reviews?.length || 0})</h3>
                
                {isLoadingReviews ? (
                  <div className="space-y-4">
                    {Array(3).fill(0).map((_, i) => (
                      <div key={i} className="animate-pulse flex items-start space-x-4">
                        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-300 w-1/4 rounded mb-2"></div>
                          <div className="h-3 bg-gray-300 w-1/5 rounded mb-2"></div>
                          <div className="h-20 bg-gray-300 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : reviews?.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-gray-400"><path d="M17 6.1H3"/><path d="M21 12.1H3"/><path d="M15.1 18H3"/></svg>
                    <p>Nenhum comentário ainda. Seja o primeiro a avaliar!</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reviews?.map(review => (
                      <div key={review.id} className="border-b border-gray-200 pb-4 mb-4 last:border-0">
                        <div className="flex items-start">
                          <Avatar className="h-10 w-10 mr-4">
                            <AvatarFallback>
                              {review.id % 26 + 65 /* ASCII for A */}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center mb-1">
                              <h4 className="font-medium mr-2">Usuário {review.userId}</h4>
                              <div className="flex">
                                {Array(5).fill(0).map((_, i) => (
                                  <svg 
                                    key={i}
                                    xmlns="http://www.w3.org/2000/svg" 
                                    width="14" 
                                    height="14" 
                                    viewBox="0 0 24 24" 
                                    fill={i < review.rating ? "currentColor" : "none"}
                                    stroke="currentColor" 
                                    strokeWidth="2" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    className="text-yellow-400"
                                  >
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                                  </svg>
                                ))}
                              </div>
                            </div>
                            <div className="text-sm text-gray-500 mb-2">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </div>
                            {review.comment && (
                              <p className="text-gray-700">{review.comment}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div>
            {/* Professional Info */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Sobre o profissional</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingProfessional ? (
                  <div className="animate-pulse space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-300 w-1/2 rounded mb-2"></div>
                        <div className="h-3 bg-gray-300 w-1/3 rounded"></div>
                      </div>
                    </div>
                    <div className="h-20 bg-gray-300 rounded"></div>
                  </div>
                ) : professional ? (
                  <div>
                    <div className="flex items-center mb-4">
                      <Avatar className="h-16 w-16 mr-4">
                        <AvatarImage src={professional.profileImage} />
                        <AvatarFallback className="text-lg">
                          {professional.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">{professional.name}</h3>
                        <p className="text-gray-600">{professional.profession}</p>
                        {professional.company && (
                          <p className="text-sm text-gray-500">{professional.company}</p>
                        )}
                      </div>
                    </div>
                    {professional.bio && (
                      <p className="text-gray-700 mb-4">{professional.bio}</p>
                    )}
                    <Button asChild variant="outline" className="w-full">
                      <Link href={`/explore?professionalId=${professional.id}`}>
                        Ver todos os vlogs
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Informações do profissional não disponíveis
                  </p>
                )}
              </CardContent>
            </Card>
            
            {/* Related Vlogs */}
            <Card>
              <CardHeader>
                <CardTitle>Vlogs relacionados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* We would fetch related vlogs here */}
                  <div className="text-center py-8 text-gray-500">
                    <p>Não há vlogs relacionados disponíveis no momento.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
