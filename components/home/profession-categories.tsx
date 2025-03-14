import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Category, VideoWithDetails } from "@shared/schema";
import VideoCard from "@/components/video/video-card";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfessionCategories() {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  
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

  // Set first category as active by default
  useEffect(() => {
    if (categories && categories.length > 0 && activeCategory === null) {
      setActiveCategory(null); // "All" category
    }
  }, [categories, activeCategory]);

  const handleCategoryClick = (id: number | null) => {
    setActiveCategory(id);
  };

  // Only show up to 4 videos initially
  const displayVideos = videos ? videos.slice(0, 4) : [];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Explore Profissões</h2>
            <p className="text-gray-600 max-w-2xl">Encontre insights valiosos de diferentes áreas profissionais através da experiência de quem já atua no mercado</p>
          </div>
          <Link href="/explore" className="mt-4 md:mt-0">
            <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50">
              Ver todas áreas
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Button>
          </Link>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-10">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex space-x-4 pb-6">
              <button 
                className={`category-pill whitespace-nowrap px-6 py-3 rounded-lg ${activeCategory === null 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'} font-medium transition-all duration-200`}
                onClick={() => handleCategoryClick(null)}
              >
                Todas as áreas
              </button>
              
              {isLoadingCategories ? (
                Array(5).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-32 rounded-lg" />
                ))
              ) : (
                categories?.map((category) => (
                  <button 
                    key={category.id}
                    className={`category-pill whitespace-nowrap px-6 py-3 rounded-lg ${
                      activeCategory === category.id 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    } font-medium transition-all duration-200`}
                    onClick={() => handleCategoryClick(category.id)}
                    style={activeCategory === category.id ? {} : {}}
                  >
                    {category.displayName}
                  </button>
                ))
              )}
            </div>
          </div>

          {isLoadingVideos && (
            <div className="text-center py-6">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-500">Carregando vídeos...</p>
            </div>
          )}
          
          {!isLoadingVideos && displayVideos.length === 0 && (
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Nenhum vídeo disponível</h3>
              <p className="text-gray-500 mb-4">Em breve teremos conteúdos exclusivos de profissionais desta área.</p>
              <Button 
                variant="outline" 
                onClick={() => setActiveCategory(null)}
                className="border-blue-500 text-blue-600 hover:bg-blue-50"
              >
                Explorar todas categorias
              </Button>
            </div>
          )}
        </div>
        
        {!isLoadingVideos && displayVideos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {displayVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
        
        {!isLoadingVideos && displayVideos.length > 0 && (
          <div className="text-center mt-12">
            <Link href="/explore">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 h-auto rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                <span className="mr-2">Descobrir mais profissões</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
