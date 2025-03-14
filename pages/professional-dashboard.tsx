import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import VlogCard from "@/components/vlog/vlog-card";
import { Vlog, Category, User, insertVlogSchema } from "@shared/schema";
import { useLocation } from "wouter";

// Extend insertVlogSchema with additional validation
const vlogFormSchema = insertVlogSchema.extend({
  title: z.string().min(5, "O título deve ter pelo menos 5 caracteres"),
  description: z.string().min(20, "A descrição deve ter pelo menos 20 caracteres"),
  videoUrl: z.string().url("Insira uma URL válida para o vídeo"),
  thumbnailUrl: z.string().url("Insira uma URL válida para a miniatura").optional(),
  categoryId: z.number().positive("Selecione uma categoria"),
  duration: z.number().min(30, "A duração deve ser de pelo menos 30 segundos"),
  isPremium: z.boolean(),
  price: z.number().min(0, "O preço não pode ser negativo").optional(),
});

type VlogFormValues = z.infer<typeof vlogFormSchema>;

export default function ProfessionalDashboard() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("vlogs");

  // Redirect to login if not authenticated or not a professional
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">Acesso Restrito</h1>
          <p className="mb-6">Você precisa estar logado como profissional para acessar esta página.</p>
          <Button onClick={() => setLocation("/")}>Voltar para página inicial</Button>
        </div>
      </div>
    );
  }

  if (user.userType !== "professional") {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">Área exclusiva para profissionais</h1>
          <p className="mb-6">Esta área é exclusiva para usuários com perfil de profissional.</p>
          <Button onClick={() => setLocation("/")}>Voltar para página inicial</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">Dashboard do Profissional</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="vlogs">Meus Vlogs</TabsTrigger>
            <TabsTrigger value="upload">Novo Vlog</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="vlogs">
            <MyVlogs />
          </TabsContent>

          <TabsContent value="upload">
            <UploadVlog />
          </TabsContent>

          <TabsContent value="analytics">
            <Analytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function MyVlogs() {
  const { user } = useAuth();
  const professionalId = user?.id;

  const { data: vlogs, isLoading } = useQuery<Vlog[]>({
    queryKey: ["/api/vlogs", { professionalId }],
    enabled: !!professionalId,
  });

  if (isLoading) {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(3).fill(0).map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-md animate-pulse h-96"></div>
      ))}
    </div>;
  }

  if (!vlogs || vlogs.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <h3 className="text-lg font-medium mb-2">Nenhum vlog cadastrado</h3>
          <p className="text-gray-500 mb-6">Você ainda não compartilhou nenhum vlog sobre sua profissão.</p>
          <Button onClick={() => document.querySelector('[data-value="upload"]')?.click()}>
            Compartilhar meu primeiro vlog
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Seus vlogs ({vlogs.length})</h2>
        <Button onClick={() => document.querySelector('[data-value="upload"]')?.click()}>
          Adicionar Novo Vlog
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vlogs.map((vlog) => (
          <VlogCard key={vlog.id} vlog={vlog} />
        ))}
      </div>
    </div>
  );
}

function UploadVlog() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: categories, isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const form = useForm<VlogFormValues>({
    resolver: zodResolver(vlogFormSchema),
    defaultValues: {
      title: "",
      description: "",
      videoUrl: "",
      thumbnailUrl: "",
      professionalId: user?.id || 0,
      categoryId: 0,
      duration: 180, // 3 minutes default
      isPremium: false,
      price: 0,
    },
  });

  const uploadVlogMutation = useMutation({
    mutationFn: (data: VlogFormValues) => {
      return apiRequest("POST", "/api/vlogs", data);
    },
    onSuccess: () => {
      toast({
        title: "Vlog enviado com sucesso!",
        description: "Seu vlog foi compartilhado na plataforma.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/vlogs"] });
      form.reset();
      document.querySelector('[data-value="vlogs"]')?.click();
    },
    onError: (error) => {
      toast({
        title: "Erro ao enviar vlog",
        description: "Ocorreu um erro ao enviar seu vlog. Tente novamente.",
        variant: "destructive",
      });
      console.error("Error uploading vlog:", error);
    },
  });

  const onSubmit = (data: VlogFormValues) => {
    setIsSubmitting(true);
    // If premium is false, ensure price is 0
    if (!data.isPremium) {
      data.price = 0;
    }

    uploadVlogMutation.mutate(data);
    setIsSubmitting(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compartilhar novo vlog</CardTitle>
        <CardDescription>
          Compartilhe sua experiência profissional através de um vlog informativo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título do Vlog</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Um dia na vida de um Desenvolvedor de Software" {...field} />
                  </FormControl>
                  <FormDescription>
                    Um título descritivo e atrativo para seu vlog
                  </FormDescription>
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
                      placeholder="Descreva detalhadamente o conteúdo do seu vlog, o que os espectadores irão aprender e por que é relevante."
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Uma descrição detalhada ajuda estudantes a entender o que esperar do seu vlog
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingCategories ? (
                          <SelectItem value="loading" disabled>Carregando...</SelectItem>
                        ) : (
                          categories?.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Escolha a categoria que melhor define sua profissão
                    </FormDescription>
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
                      <Input 
                        type="number" 
                        min="30"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Duração do vídeo em segundos (ex: 180 = 3 minutos)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="videoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL do Vídeo</FormLabel>
                  <FormControl>
                    <Input placeholder="https://exemplo.com/seu-video.mp4" {...field} />
                  </FormControl>
                  <FormDescription>
                    Insira a URL do seu vídeo já hospedado (YouTube, Vimeo, etc)
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
                  <FormLabel>URL da Miniatura (Opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://exemplo.com/miniatura.jpg" {...field} />
                  </FormControl>
                  <FormDescription>
                    Adicione uma imagem de capa para seu vídeo
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <FormField
              control={form.control}
              name="isPremium"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Conteúdo Premium</FormLabel>
                    <FormDescription>
                      Marque se deseja disponibilizar este vlog como conteúdo premium pago
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch("isPremium") && (
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço (R$)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Defina um valor para acesso a este conteúdo
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Publicar Vlog"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function Analytics() {
  const { user } = useAuth();
  const professionalId = user?.id;

  const { data: vlogs } = useQuery<Vlog[]>({
    queryKey: ["/api/vlogs", { professionalId }],
    enabled: !!professionalId,
  });

  const totalViews = vlogs?.reduce((acc, vlog) => acc + vlog.viewCount, 0) || 0;
  const totalVlogs = vlogs?.length || 0;
  const premiumVlogs = vlogs?.filter(vlog => vlog.isPremium).length || 0;
  const averageRating = vlogs?.reduce((acc, vlog) => acc + vlog.rating, 0) || 0;
  const formattedAverageRating = totalVlogs > 0 ? (averageRating / totalVlogs).toFixed(1) : "N/A";
  
  const mostViewedVlog = vlogs?.sort((a, b) => b.viewCount - a.viewCount)[0];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Visualizações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews}</div>
            <p className="text-xs text-muted-foreground">
              Em todos os seus vlogs
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Vlogs Publicados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVlogs}</div>
            <p className="text-xs text-muted-foreground">
              {premiumVlogs} premium, {totalVlogs - premiumVlogs} gratuitos
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avaliação Média
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              {formattedAverageRating}
              {formattedAverageRating !== "N/A" && (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400 ml-2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Baseado em todas as avaliações
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ganhos Estimados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {(totalViews * 0.05).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Baseado no número de visualizações
            </p>
          </CardContent>
        </Card>
      </div>

      {mostViewedVlog && (
        <Card>
          <CardHeader>
            <CardTitle>Vlog Mais Visto</CardTitle>
            <CardDescription>
              Este é seu conteúdo mais popular na plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <div className="aspect-video bg-gray-200 rounded-md mb-3 overflow-hidden">
                  {mostViewedVlog.thumbnailUrl ? (
                    <img 
                      src={mostViewedVlog.thumbnailUrl} 
                      alt={mostViewedVlog.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-500">{mostViewedVlog.title}</span>
                    </div>
                  )}
                </div>
                <h3 className="font-semibold">{mostViewedVlog.title}</h3>
                <p className="text-sm text-gray-500">{mostViewedVlog.viewCount} visualizações</p>
              </div>
              
              <div className="md:w-2/3">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Análise de Desempenho</h4>
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Engajamento</span>
                          <span>85%</span>
                        </div>
                        <Progress value={85} />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Retenção</span>
                          <span>72%</span>
                        </div>
                        <Progress value={72} />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Compartilhamentos</span>
                          <span>45%</span>
                        </div>
                        <Progress value={45} />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Sugestões para melhorias</h4>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-start gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mt-1"><path d="M20 6 9 17l-5-5"/></svg>
                        <span>Seus espectadores gostam do formato e duração do conteúdo</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 mt-1"><circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-5"/></svg>
                        <span>Considere criar uma série relacionada a este tópico</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500 mt-1"><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><circle cx="12" cy="17" r=".5"/></svg>
                        <span>Explore mais detalhes práticos sobre sua rotina de trabalho</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Desempenho de Visualizações</CardTitle>
          <CardDescription>
            Visualizações dos seus vlogs nas últimas semanas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center">
            <p className="text-muted-foreground">Dados detalhados de visualizações serão exibidos aqui</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
