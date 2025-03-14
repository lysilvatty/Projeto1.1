import { useQuery } from "@tanstack/react-query";
import { ProfessionalWithVideos } from "@shared/schema";
import ProfessionalCard from "@/components/professional/professional-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function FeaturedProfessionals() {
  const { data: professionals, isLoading } = useQuery<ProfessionalWithVideos[]>({
    queryKey: ["/api/professionals"],
  });

  // Only display professionals who have at least one video
  const featuredProfessionals = professionals
    ? professionals
        .filter(prof => prof.videos.length > 0)
        .slice(0, 4)
    : [];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold font-poppins mb-8">Profissionais em Destaque</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <Skeleton className="w-full h-64" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-8 w-full rounded-lg mt-2" />
                </div>
              </div>
            ))
          ) : featuredProfessionals.length > 0 ? (
            featuredProfessionals.map(professional => (
              <ProfessionalCard key={professional.id} professional={professional} />
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              Nenhum profissional em destaque encontrado.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
