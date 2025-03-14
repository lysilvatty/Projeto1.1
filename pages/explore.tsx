import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import VlogCard from "@/components/vlog/vlog-card";
import CategoryCard from "@/components/vlog/category-card";
import { Vlog, Category } from "@shared/schema";

export default function Explore() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/explore");
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  
  const { data: vlogs, isLoading: isLoadingVlogs } = useQuery<Vlog[]>({
    queryKey: ["/api/vlogs", { categoryId: selectedCategory }],
  });
  
  const { data: categories, isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  // Handle query params from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get("category");
    if (categoryParam) {
      setSelectedCategory(parseInt(categoryParam));
    }
  }, []);
  
  // Filter vlogs based on search and category
  const filteredVlogs = vlogs?.filter(vlog => {
    if (searchTerm && !vlog.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    if (activeTab === "premium" && !vlog.isPremium) {
      return false;
    } else if (activeTab === "free" && vlog.isPremium) {
      return false;
    }
    
    return true;
  });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // You could update URL query params here if needed
  };
  
  const handleCategorySelect = (id: number) => {
    setSelectedCategory(id === selectedCategory ? null : id);
    
    // Update URL query params
    const params = new URLSearchParams(window.location.search);
    if (id === selectedCategory) {
      params.delete("category");
    } else {
      params.set("category", id.toString());
    }
    setLocation(`/explore?${params.toString()}`);
  };
  
  const getCategoryName = (id: number) => {
    return categories?.find(cat => cat.id === id)?.name || "";
  };
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="bg-white py-8 border-b">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Explore Profissões</h1>
          
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  placeholder="Pesquise por título, descrição ou profissão..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </div>
              </div>
              <Button type="submit">Buscar</Button>
            </div>
          </form>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedCategory && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {getCategoryName(selectedCategory)}
                <button onClick={() => handleCategorySelect(selectedCategory)} className="ml-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </Badge>
            )}
            {searchTerm && (
              <Badge variant="secondary" className="flex items-center gap-1">
                "{searchTerm}"
                <button onClick={() => setSearchTerm("")} className="ml-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </Badge>
            )}
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="free">Gratuitos</TabsTrigger>
              <TabsTrigger value="premium">Premium</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </section>
      
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Categories Sidebar */}
            <div className="md:w-1/4">
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4">Áreas de atuação</h2>
                <div className="space-y-2">
                  {isLoadingCategories ? (
                    Array(8).fill(0).map((_, i) => (
                      <div key={i} className="animate-pulse h-10 bg-gray-200 rounded"></div>
                    ))
                  ) : (
                    categories?.map(category => (
                      <button
                        key={category.id}
                        onClick={() => handleCategorySelect(category.id)}
                        className={`flex items-center w-full p-2 rounded-md hover:bg-gray-100 transition ${
                          selectedCategory === category.id ? 'bg-gray-100 font-medium' : ''
                        }`}
                      >
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center mr-2"
                          style={{ backgroundColor: `${category.color}20`, color: category.color }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        </div>
                        <span>{category.name}</span>
                        <span className="ml-auto text-xs text-gray-500">{category.vlogCount}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="md:w-3/4">
              <div className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">
                    {selectedCategory 
                      ? `Vlogs de ${getCategoryName(selectedCategory)}`
                      : "Todos os vlogs"}
                  </h2>
                  <div className="text-sm text-gray-500">
                    {filteredVlogs?.length || 0} vlogs encontrados
                  </div>
                </div>
                
                {isLoadingVlogs ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array(4).fill(0).map((_, i) => (
                      <div key={i} className="animate-pulse h-80 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                ) : filteredVlogs?.length === 0 ? (
                  <div className="text-center py-12">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-400 mb-4"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                    <h3 className="text-lg font-medium mb-2">Nenhum vlog encontrado</h3>
                    <p className="text-gray-500">Tente ajustar os filtros ou termos de pesquisa</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredVlogs?.map(vlog => (
                      <VlogCard key={vlog.id} vlog={vlog} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
