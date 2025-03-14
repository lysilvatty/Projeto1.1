import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { Link, useLocation } from "wouter";
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
import { Separator } from "@/components/ui/separator";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import VlogCard from "@/components/vlog/vlog-card";
import { Vlog, Category, User, Payment } from "@shared/schema";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("saved");

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

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">Meus Conteúdos</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="saved">Favoritos</TabsTrigger>
            <TabsTrigger value="watched">Assistidos</TabsTrigger>
            <TabsTrigger value="purchases">Compras</TabsTrigger>
          </TabsList>

          <TabsContent value="saved">
            <SavedVlogs />
          </TabsContent>

          <TabsContent value="watched">
            <WatchedVlogs />
          </TabsContent>

          <TabsContent value="purchases">
            <Purchases />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function SavedVlogs() {
  const { data: savedVlogs, isLoading } = useQuery<Vlog[]>({
    queryKey: ["/api/users/saved-vlogs"],
  });

  if (isLoading) {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(3).fill(0).map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-md animate-pulse h-96"></div>
      ))}
    </div>;
  }

  if (!savedVlogs || savedVlogs.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
          </div>
          <h3 className="text-lg font-medium mb-2">Nenhum vlog salvo</h3>
          <p className="text-gray-500 mb-6">Você ainda não salvou nenhum vlog como favorito.</p>
          <Button asChild>
            <Link href="/explore">Explorar Vlogs</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Vlogs salvos ({savedVlogs.length})</h2>
        <Button asChild variant="outline">
          <Link href="/explore">Explorar mais vlogs</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedVlogs.map((vlog) => (
          <VlogCard key={vlog.id} vlog={vlog} />
        ))}
      </div>
    </div>
  );
}

function WatchedVlogs() {
  const { data: watchedVlogs, isLoading } = useQuery<Vlog[]>({
    queryKey: ["/api/watched-vlogs"],
  });

  if (isLoading) {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(3).fill(0).map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-md animate-pulse h-96"></div>
      ))}
    </div>;
  }

  if (!watchedVlogs || watchedVlogs.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </div>
          <h3 className="text-lg font-medium mb-2">Nenhum vlog assistido</h3>
          <p className="text-gray-500 mb-6">Você ainda não assistiu nenhum vlog na plataforma.</p>
          <Button asChild>
            <Link href="/explore">Começar a assistir</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Histórico de vlogs ({watchedVlogs.length})</h2>
        <Button asChild variant="outline">
          <Link href="/explore">Explorar mais vlogs</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {watchedVlogs.map((vlog) => (
          <VlogCard key={vlog.id} vlog={vlog} />
        ))}
      </div>
    </div>
  );
}

function Purchases() {
  const { data: payments, isLoading: isLoadingPayments } = useQuery<Payment[]>({
    queryKey: ["/api/payments"],
  });

  const vlogIds = payments?.map(payment => payment.vlogId) || [];
  
  const { data: purchasedVlogs, isLoading: isLoadingVlogs } = useQuery<Vlog[]>({
    queryKey: ["/api/vlogs/purchased"],
    queryFn: async () => {
      if (vlogIds.length === 0) return [];
      
      // In a real app we'd have an endpoint to get these vlogs,
      // but for now we'll just get them all and filter
      const response = await fetch("/api/vlogs");
      const allVlogs = await response.json();
      return allVlogs.filter((vlog: Vlog) => vlogIds.includes(vlog.id));
    },
    enabled: vlogIds.length > 0,
  });

  const isLoading = isLoadingPayments || isLoadingVlogs;

  if (isLoading) {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(3).fill(0).map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-md animate-pulse h-96"></div>
      ))}
    </div>;
  }

  if (!payments || payments.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
          </div>
          <h3 className="text-lg font-medium mb-2">Nenhuma compra realizada</h3>
          <p className="text-gray-500 mb-6">Você ainda não adquiriu nenhum conteúdo premium.</p>
          <Button asChild>
            <Link href="/explore">Ver conteúdos premium</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Suas Compras</h2>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              {payments.map((payment) => {
                const vlog = purchasedVlogs?.find(v => v.id === payment.vlogId);
                return (
                  <div key={payment.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border-b last:border-0">
                    <div className="mb-4 md:mb-0">
                      <h3 className="font-medium">{vlog?.title || `Vlog #${payment.vlogId}`}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <span>R$ {payment.amount.toFixed(2)}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(payment.paidAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Badge variant={payment.status === 'completed' ? 'success' : 'secondary'}>
                        {payment.status === 'completed' ? 'Concluído' : payment.status}
                      </Badge>
                      {vlog && (
                        <Button asChild variant="ghost" size="sm" className="ml-4">
                          <Link href={`/vlogs/${vlog.id}`}>Assistir</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {purchasedVlogs && purchasedVlogs.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Conteúdos Premium</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {purchasedVlogs.map((vlog) => (
              <VlogCard key={vlog.id} vlog={vlog} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
