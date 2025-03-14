import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { insertVideoSchema, Category } from "@shared/schema";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart, Loader2, VideoIcon, DollarSign, User2 } from "lucide-react";
import { formatDuration } from "@/lib/utils";

export default function ProfessionalDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreateVideoDialogOpen, setIsCreateVideoDialogOpen] = useState(false);
  
  // Fetch professional dashboard data
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["/api/dashboard/professional"],
    enabled: !!user && user.userType === "professional",
  });
  
  // Fetch categories for the form
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  // Create video form schema
  const videoFormSchema = z.object({
    title: z.string().min(5, "O título deve ter pelo menos 5 caracteres"),
    description: z.string().min(20, "A descrição deve ter pelo menos 20 caracteres"),
    videoUrl: z.string().url("URL do vídeo inválida"),
    thumbnailUrl: z.string().url("URL da thumbnail inválida").optional().or(z.literal("")),
    price: z.coerce.number().min(0.01, "O preço deve ser maior que zero"),
    duration: z.coerce.number().min(10, "A duração deve ser de pelo menos 10 segundos"),
    categoryId: z.coerce.number().min(1, "Escolha uma categoria"),
  });
  
  type VideoFormValues = z.infer<typeof videoFormSchema>;
  
  const form = useForm<VideoFormValues>({
    resolver: zodResolver(videoFormSchema),
    defaultValues: {
      title: "",
      description: "",
      videoUrl: "",
      thumbnailUrl: "",
      price: 19.9,
      duration: 300,
      categoryId: 0,
    },
  });
  
  // Create video mutation
  const createVideoMutation = useMutation({
    mutationFn: async (data: VideoFormValues) => {
      const res = await apiRequest("POST", "/api/videos", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/professional"] });
      toast({
        title: "Vídeo criado com sucesso!",
        description: "Seu vídeo foi adicionado à plataforma.",
      });
      form.reset();
      setIsCreateVideoDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar vídeo",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: VideoFormValues) => {
    createVideoMutation.mutate(data);
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Function to calculate total earnings
  const calculateTotalEarnings = () => {
    if (!dashboardData?.purchases) return 0;
    
    return dashboardData.purchases.reduce((total, purchase) => total + purchase.amount, 0);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="space-y-8">
              <Skeleton className="h-12 w-60" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
              </div>
              <Skeleton className="h-96 w-full" />
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold font-poppins text-gray-900 mb-2">
                    Painel Profissional
                  </h1>
                  <p className="text-gray-600">
                    Gerencie seus vídeos e acompanhe suas estatísticas
                  </p>
                </div>
                <Dialog open={isCreateVideoDialogOpen} onOpenChange={setIsCreateVideoDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="mt-4 md:mt-0 bg-primary hover:bg-primary/90">
                      <VideoIcon className="mr-2 h-4 w-4" /> Adicionar novo vídeo
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                      <DialogTitle>Adicionar novo vídeo</DialogTitle>
                      <DialogDescription>
                        Preencha os detalhes do seu vídeo para publicá-lo na plataforma.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Título do vídeo</FormLabel>
                              <FormControl>
                                <Input placeholder="Ex: O dia a dia de um Desenvolvedor Web" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Descrição</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Descreva o conteúdo do seu vídeo detalhadamente..." 
                                  className="min-h-32"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Preço (R$)</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.10" min="0.01" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="duration"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Duração (segundos)</FormLabel>
                                <FormControl>
                                  <Input type="number" min="10" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Ex: 300 = 5 minutos
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="categoryId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Categoria</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value.toString()}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione uma categoria" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {categories?.map(category => (
                                    <SelectItem 
                                      key={category.id} 
                                      value={category.id.toString()}
                                    >
                                      {category.displayName}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="videoUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>URL do vídeo</FormLabel>
                              <FormControl>
                                <Input placeholder="https://exemplo.com/seu-video.mp4" {...field} />
                              </FormControl>
                              <FormDescription>
                                URL direta para o arquivo de vídeo
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="thumbnailUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>URL da thumbnail (opcional)</FormLabel>
                              <FormControl>
                                <Input placeholder="https://exemplo.com/thumbnail.jpg" {...field} />
                              </FormControl>
                              <FormDescription>
                                Imagem de capa para o seu vídeo
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex justify-end space-x-4 pt-4">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setIsCreateVideoDialogOpen(false)}
                          >
                            Cancelar
                          </Button>
                          <Button 
                            type="submit" 
                            className="bg-primary hover:bg-primary/90"
                            disabled={createVideoMutation.isPending}
                          >
                            {createVideoMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Publicando...
                              </>
                            ) : (
                              "Publicar vídeo"
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-gray-700">Vídeos publicados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <VideoIcon className="h-8 w-8 text-secondary mr-3" />
                      <div>
                        <p className="text-3xl font-bold">{dashboardData?.videos.length || 0}</p>
                        <p className="text-sm text-gray-500">Total</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-gray-700">Vendas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <User2 className="h-8 w-8 text-primary mr-3" />
                      <div>
                        <p className="text-3xl font-bold">{dashboardData?.purchases.length || 0}</p>
                        <p className="text-sm text-gray-500">Total</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-gray-700">Faturamento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <DollarSign className="h-8 w-8 text-green-600 mr-3" />
                      <div>
                        <p className="text-3xl font-bold">R$ {calculateTotalEarnings().toFixed(2).replace('.', ',')}</p>
                        <p className="text-sm text-gray-500">Total</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Tabs defaultValue="videos">
                    <TabsList className="mb-6">
                      <TabsTrigger value="videos">Meus Vídeos</TabsTrigger>
                      <TabsTrigger value="stats">Estatísticas</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="videos">
                      <Card>
                        <CardHeader>
                          <CardTitle>Vídeos publicados</CardTitle>
                          <CardDescription>Gerencie seus vídeos na plataforma</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {dashboardData?.videos.length === 0 ? (
                            <div className="text-center py-6">
                              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <VideoIcon className="h-6 w-6 text-gray-400" />
                              </div>
                              <h3 className="text-xl font-semibold mb-2">Nenhum vídeo publicado</h3>
                              <p className="text-gray-600 mb-4">
                                Compartilhe seu conhecimento adicionando seu primeiro vídeo
                              </p>
                              <Button
                                className="bg-primary hover:bg-primary/90"
                                onClick={() => setIsCreateVideoDialogOpen(true)}
                              >
                                Adicionar vídeo
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-6">
                              {dashboardData.videos.map(video => {
                                // Find purchases for this video
                                const videoStats = {
                                  purchases: dashboardData.purchases.filter(p => p.videoId === video.id).length,
                                  revenue: dashboardData.purchases
                                    .filter(p => p.videoId === video.id)
                                    .reduce((sum, p) => sum + p.amount, 0),
                                  ratings: dashboardData.ratings.filter(r => r.videoId === video.id).length,
                                  averageRating: dashboardData.ratings
                                    .filter(r => r.videoId === video.id)
                                    .reduce((sum, r) => sum + r.rating, 0) / 
                                    dashboardData.ratings.filter(r => r.videoId === video.id).length || 0
                                };
                                
                                return (
                                  <div key={video.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                    <div className="flex flex-col md:flex-row">
                                      <div className="md:w-1/3">
                                        <div className="aspect-video">
                                          <img 
                                            src={video.thumbnailUrl || `https://source.unsplash.com/random/300x200/?${video.categoryId}`} 
                                            alt={video.title}
                                            className="w-full h-full object-cover"
                                          />
                                        </div>
                                      </div>
                                      <div className="p-4 flex-1">
                                        <h3 className="font-semibold text-lg mb-1">{video.title}</h3>
                                        <div className="flex flex-wrap items-center text-sm text-gray-600 mb-3">
                                          <span className="mr-3">
                                            <i className="ri-time-line mr-1"></i>
                                            {formatDuration(video.duration)}
                                          </span>
                                          <span className="mr-3">
                                            <i className="ri-price-tag-3-line mr-1"></i>
                                            R$ {video.price.toFixed(2).replace('.', ',')}
                                          </span>
                                          <span>
                                            <i className="ri-calendar-line mr-1"></i>
                                            {new Date(video.createdAt).toLocaleDateString('pt-BR')}
                                          </span>
                                        </div>
                                        <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                                          {video.description}
                                        </p>
                                        <div className="grid grid-cols-3 gap-4 mb-4">
                                          <div className="bg-gray-50 p-2 rounded text-center">
                                            <p className="text-xs text-gray-500">Vendas</p>
                                            <p className="font-semibold">{videoStats.purchases}</p>
                                          </div>
                                          <div className="bg-gray-50 p-2 rounded text-center">
                                            <p className="text-xs text-gray-500">Faturamento</p>
                                            <p className="font-semibold">R$ {videoStats.revenue.toFixed(2).replace('.', ',')}</p>
                                          </div>
                                          <div className="bg-gray-50 p-2 rounded text-center">
                                            <p className="text-xs text-gray-500">Avaliação</p>
                                            <p className="font-semibold flex items-center justify-center">
                                              {videoStats.averageRating ? (
                                                <>
                                                  <i className="ri-star-fill text-yellow-400 mr-1"></i>
                                                  {videoStats.averageRating.toFixed(1)}
                                                </>
                                              ) : 'N/A'}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="stats">
                      <Card>
                        <CardHeader>
                          <CardTitle>Desempenho dos Vídeos</CardTitle>
                          <CardDescription>Estatísticas de vendas e avaliações</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {dashboardData?.videos.length === 0 ? (
                            <div className="text-center py-6">
                              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <BarChart className="h-6 w-6 text-gray-400" />
                              </div>
                              <p className="text-gray-600">
                                Publique seu primeiro vídeo para ver estatísticas
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-8">
                              <div>
                                <h3 className="font-medium mb-4">Vendas por vídeo</h3>
                                <div className="space-y-4">
                                  {dashboardData.videos.map(video => {
                                    const salesCount = dashboardData.purchases.filter(p => p.videoId === video.id).length;
                                    const percentage = dashboardData.purchases.length > 0 
                                      ? (salesCount / dashboardData.purchases.length) * 100 
                                      : 0;
                                      
                                    return (
                                      <div key={video.id}>
                                        <div className="flex justify-between mb-1">
                                          <span className="text-sm font-medium truncate">{video.title}</span>
                                          <span className="text-sm font-medium">{salesCount}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                          <div 
                                            className="bg-primary h-2.5 rounded-full" 
                                            style={{ width: `${percentage}%` }}
                                          ></div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                              
                              <div>
                                <h3 className="font-medium mb-4">Avaliações recebidas</h3>
                                {dashboardData.ratings.length > 0 ? (
                                  <div className="space-y-4">
                                    {dashboardData.ratings.slice(0, 5).map(rating => {
                                      const video = dashboardData.videos.find(v => v.id === rating.videoId);
                                      
                                      return (
                                        <div key={rating.id} className="bg-gray-50 p-3 rounded-lg">
                                          <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium">{video?.title}</span>
                                            <div className="flex">
                                              {Array(5).fill(0).map((_, i) => (
                                                <i 
                                                  key={i} 
                                                  className={`${i < rating.rating ? 'ri-star-fill text-yellow-400' : 'ri-star-line text-gray-300'}`}
                                                ></i>
                                              ))}
                                            </div>
                                          </div>
                                          {rating.comment && (
                                            <p className="text-sm text-gray-600 mt-1">{rating.comment}</p>
                                          )}
                                          <p className="text-xs text-gray-500 mt-1">
                                            {new Date(rating.createdAt).toLocaleDateString('pt-BR')}
                                          </p>
                                        </div>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <p className="text-gray-600 text-center py-4">
                                    Ainda não há avaliações para seus vídeos
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
                
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Meu Perfil</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center mb-6">
                        <Avatar className="h-16 w-16 mr-4">
                          <AvatarImage src={user?.profileImage || ""} alt={user?.name} />
                          <AvatarFallback>{user?.name ? getInitials(user.name) : "U"}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium text-gray-900 truncate">{user?.name}</h4>
                          <p className="text-sm text-gray-600 truncate">{user?.email}</p>
                          <p className="text-xs text-gray-500 mt-1 truncate">
                            Profissional • {user?.experience} anos de experiência
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Biografia</h4>
                          <p className="text-sm text-gray-700 break-words">
                            {user?.bio || "Nenhuma biografia disponível"}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-2">Estatísticas gerais</h4>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-gray-50 p-3 rounded-lg text-center">
                              <p className="text-xs text-gray-500">Total de vendas</p>
                              <p className="font-semibold">{dashboardData?.purchases.length || 0}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg text-center">
                              <p className="text-xs text-gray-500">Avaliação média</p>
                              <p className="font-semibold flex items-center justify-center">
                                {dashboardData?.ratings.length ? (
                                  <>
                                    <i className="ri-star-fill text-yellow-400 mr-1"></i>
                                    {(dashboardData.ratings.reduce((sum, r) => sum + r.rating, 0) / dashboardData.ratings.length).toFixed(1)}
                                  </>
                                ) : 'N/A'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Dicas para criadores</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <i className="ri-lightbulb-line text-yellow-500 text-xl mr-2 mt-0.5 flex-shrink-0"></i>
                          <p className="text-sm text-gray-700 break-words">
                            Vídeos entre 5-15 minutos têm melhor engajamento na plataforma.
                          </p>
                        </div>
                        <div className="flex items-start">
                          <i className="ri-movie-line text-primary text-xl mr-2 mt-0.5"></i>
                          <p className="text-sm text-gray-700">
                            Mostre desafios reais da profissão para gerar mais interesse.
                          </p>
                        </div>
                        <div className="flex items-start">
                          <i className="ri-price-tag-3-line text-green-500 text-xl mr-2 mt-0.5"></i>
                          <p className="text-sm text-gray-700">
                            Preços entre R$15 e R$30 têm as melhores taxas de conversão.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
