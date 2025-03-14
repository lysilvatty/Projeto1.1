import { Skeleton } from "@/components/ui/skeleton";

// Mock testimonials data - this would typically come from an API
const testimonials = [
  {
    id: 1,
    name: "Ana Carolina",
    role: "Estudante de Ensino Médio",
    rating: 5,
    comment: "Os vídeos me ajudaram muito a entender o que realmente acontece no dia a dia de um engenheiro. Consegui ter certeza da minha escolha profissional antes mesmo de entrar na faculdade!",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
  },
  {
    id: 2,
    name: "Mateus Silva",
    role: "Universitário",
    rating: 4.5,
    comment: "Estava indeciso entre duas áreas no Direito. Ver os vídeos de profissionais atuantes me deu uma visão clara de cada especialidade e me ajudou a focar na carreira que mais combina comigo.",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
  },
  {
    id: 3,
    name: "Juliana Costa",
    role: "Profissional em Transição",
    rating: 5,
    comment: "Como pessoa em transição de carreira, os vídeos da plataforma foram essenciais para entender os desafios reais da área de tecnologia antes de iniciar meu curso. Economizei tempo e dinheiro!",
    imageUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80"
  }
];

export default function Testimonials() {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="ri-star-fill"></i>);
    }
    
    if (hasHalfStar) {
      stars.push(<i key="half" className="ri-star-half-fill"></i>);
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="ri-star-line"></i>);
    }
    
    return stars;
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold font-poppins mb-3">O que dizem nossos usuários</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Descubra como o Profissão na Prática tem ajudado estudantes a escolherem seus caminhos profissionais.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.imageUrl} 
                  alt={`Foto de ${testimonial.name}`} 
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <h4 className="font-bold">{testimonial.name}</h4>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex text-yellow-400">
                  {renderStars(testimonial.rating)}
                </div>
              </div>
              <p className="text-gray-700">"{testimonial.comment}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
