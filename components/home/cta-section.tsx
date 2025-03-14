import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="py-16 bg-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-4xl font-bold font-poppins mb-6">Pronto para conhecer a realidade das profissões?</h2>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-white">Junte-se a milhares de estudantes que estão tomando decisões mais conscientes sobre seu futuro profissional.</p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
          <Link href="/auth">
            <Button size="lg" className="px-8 py-6 bg-white text-primary hover:bg-white/90 font-bold text-lg">
              Criar minha conta agora
            </Button>
          </Link>
          <Link href="/explore">
            <Button size="lg" variant="outline" className="px-8 py-6 border-2 border-white text-white hover:bg-white hover:text-primary font-bold text-lg">
              Explorar profissões
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
