import { Link } from "wouter";
import { ProfessionalWithVideos } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProfessionalCardProps {
  professional: ProfessionalWithVideos;
}

export default function ProfessionalCard({ professional }: ProfessionalCardProps) {
  const { id, name, userType, profileImage, experience, bio, averageRating } = professional;
  
  return (
    <Link href={`/professional/${id}`}>
      <Card className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
        <div className="relative pb-[100%]">
          <img 
            src={profileImage || `https://source.unsplash.com/random/500x500/?person`} 
            alt={`Perfil de ${name}`} 
            className="absolute object-cover w-full h-full"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent pt-10 pb-3 px-4">
            <h3 className="text-white font-bold text-lg">{name}</h3>
            <p className="text-gray-200 text-sm">{userType === "professional" ? "Profissional" : "Estudante"}</p>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center mb-3">
            <i className="ri-star-fill text-yellow-400"></i>
            <span className="ml-1 text-sm font-medium">
              {averageRating ? averageRating.toFixed(1) : 'Novo'}
            </span>
            <span className="mx-2 text-gray-300">•</span>
            <span className="text-gray-600 text-sm">{experience} anos de exp.</span>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            {bio ? (bio.length > 100 ? `${bio.substring(0, 100)}...` : bio) : 'Profissional experiente compartilhando conhecimentos sobre sua área.'}
          </p>
          <Button 
            variant="outline" 
            className="w-full py-2 border border-primary text-primary hover:bg-primary hover:text-white"
          >
            Ver perfil
          </Button>
        </div>
      </Card>
    </Link>
  );
}
