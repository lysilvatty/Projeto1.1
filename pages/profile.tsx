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
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useLocation } from "wouter";
import { User } from "@shared/schema";

const profileFormSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  bio: z.string().optional(),
  profileImage: z.string().url("URL inválida").optional().or(z.literal("")),
  profession: z.string().optional(),
  company: z.string().optional(),
  institution: z.string().optional(),
  area: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function Profile() {
  const { toast } = useToast();
  const { user, login } = useAuth();
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">Acesso Restrito</h1>
          <p className="mb-6">Você precisa estar logado para acessar esta página.</p>
          <Button onClick={() => setLocation("/")}>Voltar para página inicial</Button>
        </div>
      </div>
    );
  }

  const isProfessional = user.userType === "professional";

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      bio: user.bio || "",
      profileImage: user.profileImage || "",
      profession: user.profession || "",
      company: user.company || "",
      institution: user.institution || "",
      area: user.area || "",
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: ProfileFormValues) => {
      return apiRequest("PUT", `/api/users/${user.id}`, data);
    },
    onSuccess: async (response) => {
      const updatedUser = await response.json();
      login(updatedUser); // Update user in auth context
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      });
      
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user.id}`] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar perfil",
        description: "Ocorreu um erro ao atualizar suas informações.",
        variant: "destructive",
      });
      console.error("Error updating profile:", error);
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    setIsSubmitting(true);
    updateProfileMutation.mutate(data);
    setIsSubmitting(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-8">Meu Perfil</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Perfil</CardTitle>
              <CardDescription>
                {isProfessional ? "Seu perfil profissional" : "Seu perfil de estudante"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Avatar className="w-32 h-32 mb-4">
                {user.profileImage ? (
                  <AvatarImage src={user.profileImage} alt={user.name} />
                ) : (
                  <AvatarFallback className="text-4xl">
                    {user.name?.substring(0, 2).toUpperCase() || user.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-500 mb-2">@{user.username}</p>
              {isProfessional ? (
                <div className="text-center">
                  {user.profession && <p className="font-medium">{user.profession}</p>}
                  {user.company && <p className="text-sm text-gray-500">{user.company}</p>}
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm font-medium">Estudante</p>
                  {user.institution && <p className="text-sm text-gray-500">{user.institution}</p>}
                </div>
              )}
              <div className="mt-4 w-full">
                <Separator className="my-4" />
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Tipo de conta:</span>
                  <span className="font-medium">{isProfessional ? "Profissional" : "Estudante"}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Membro desde:</span>
                  <span className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => isProfessional 
                  ? setLocation("/dashboard/professional") 
                  : setLocation("/dashboard/student")
                }
              >
                Ir para o Dashboard
              </Button>
            </CardFooter>
          </Card>

          {/* Edit Profile Form */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Editar Perfil</CardTitle>
              <CardDescription>
                Atualize suas informações pessoais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome completo</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Biografia</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Conte um pouco sobre você..." 
                            className="min-h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Uma breve descrição sobre você, sua experiência ou interesses
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="profileImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL da Imagem de Perfil</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://exemplo.com/minha-foto.jpg" 
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Insira a URL de uma imagem para seu perfil
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {isProfessional ? (
                    <>
                      <Separator />
                      <h3 className="text-lg font-medium">Informações Profissionais</h3>

                      <FormField
                        control={form.control}
                        name="profession"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Profissão</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Empresa/Instituição</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              Onde você trabalha atualmente (opcional)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  ) : (
                    <>
                      <Separator />
                      <h3 className="text-lg font-medium">Informações Acadêmicas</h3>

                      <FormField
                        control={form.control}
                        name="institution"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Instituição de Ensino</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              Onde você estuda atualmente (opcional)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="area"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Área de Interesse</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              Qual área profissional você tem interesse (opcional)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Salvando..." : "Salvar alterações"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
