import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Category, VideoWithDetails } from "@shared/schema";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import VideoCard from "@/components/video/video-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: categories, isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: videos, isLoading: isLoadingVideos } = useQuery<VideoWithDetails[]>({
    queryKey: ["/api/videos", activeCategory],
    queryFn: async ({ queryKey }) => {
      const categoryId = queryKey[1];
      const url = categoryId 
        ? `/api/videos?categoryId=${categoryId}` 
        : "/api/videos";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch videos");
      return res.json();
    }
  });

  const handleCategoryClick = (id: number | null) => {
    setActiveCategory(id);
  };

  // Filter videos by search query
  const filteredVideos = videos?.filter(video => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      video.title.toLowerCase().includes(query) ||
      video.description.toLowerCase().includes(query) ||
      video.professional.name.toLowerCase().includes(query) ||
      video.category.displayName.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold font-poppins text-gray-900 mb-2">Explore profissões</h1>
              <p className="text-gray-600">Descubra o dia a dia de diversas carreiras com profissionais experientes</p>
            </div>
            <div className="mt-4 md:mt-0 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  className="pl-10 pr-4 py-2 w-full md:w-80"
                  placeholder="Buscar profissões, vídeos ou profissionais"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
            <h2 className="text-lg font-semibold mb-4">Filtrar por categoria</h2>
            <div className="overflow-x-auto hide-scrollbar">
              <div className="flex space-x-3 pb-2">
                <button 
                  className={`category-pill whitespace-nowrap px-4 py-2 rounded-full ${activeCategory === null ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800'} font-medium`}
                  onClick={() => handleCategoryClick(null)}
                >
                  Todas
                </button>
                
                {isLoadingCategories ? (
                  Array(5).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-9 w-28 rounded-full" />
                  ))
                ) : (
                  categories?.map((category) => (
                    <button 
                      key={category.id}
                      className={`category-pill whitespace-nowrap px-4 py-2 rounded-full ${activeCategory === category.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800'} font-medium`}
                      onClick={() => handleCategoryClick(category.id)}
                      style={{ borderColor: activeCategory === category.id ? 'transparent' : category.color }}
                    >
                      {category.displayName}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Videos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoadingVideos ? (
              Array(8).fill(0).map((_, i) => (
                <div key={i} className="rounded-xl overflow-hidden shadow-md bg-white">
                  <Skeleton className="w-full h-48" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-8 w-1/3 rounded-full" />
                    </div>
                  </div>
                </div>
              ))
            ) : filteredVideos && filteredVideos.length > 0 ? (
              filteredVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <i className="ri-search-line text-2xl text-gray-400"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum resultado encontrado</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery 
                    ? `Não encontramos resultados para "${searchQuery}"`
                    : "Não há vídeos disponíveis para esta categoria"}
                </p>
                {searchQuery && (
                  <Button 
                    variant="outline" 
                    onClick={() => setSearchQuery("")}
                  >
                    Limpar busca
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
