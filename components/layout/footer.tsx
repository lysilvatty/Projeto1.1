import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-dark text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand and description */}
          <div className="md:col-span-1">
            <Link href="/">
              <span className="flex items-center mb-4 text-2xl font-bold text-white font-poppins cursor-pointer">
                Hop<span className="text-primary">Well</span>
              </span>
            </Link>
            <p className="text-gray-400 mb-6">
              Conectando você aos profissionais que vivem o dia a dia das carreiras que você sonha seguir.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="ri-instagram-line text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="ri-facebook-circle-line text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="ri-linkedin-box-line text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="ri-youtube-line text-xl"></i>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/explore">
                  <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">Explorar</span>
                </Link>
              </li>
              <li>
                <a href="#como-funciona" className="text-gray-400 hover:text-white transition-colors">Como Funciona</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Planos e Preços</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Perguntas Frequentes</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a>
              </li>
            </ul>
          </div>
          
          {/* For Professionals */}
          <div>
            <h4 className="text-lg font-bold mb-4">Para Profissionais</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/auth">
                  <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">Torne-se Parceiro</span>
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Diretrizes de Conteúdo</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Pagamentos</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Dicas para Vídeos</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Sucesso do Criador</a>
              </li>
            </ul>
          </div>
          
          {/* Contact and Legal */}
          <div>
            <h4 className="text-lg font-bold mb-4">Contato e Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#contato" className="text-gray-400 hover:text-white transition-colors">Fale Conosco</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Termos de Uso</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Política de Privacidade</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Política de Cookies</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">© 2023 HopWell. Todos os direitos reservados.</p>
            <div className="flex items-center space-x-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="32" viewBox="0 0 48 32" className="h-8">
                <path fill="#FFF" d="M0 0h48v32H0z" opacity="0.07"/>
                <path fill="#FFF" d="M2 0h44a2 2 0 0 1 2 2v28a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2z" opacity="0.1"/>
                <path fill="#FFF" d="M4 0h40a4 4 0 0 1 4 4v24a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z" opacity="0.2"/>
                <path fill="#FFF" d="M6.72 7.272h34.56a3 3 0 0 1 3 3v11.456a3 3 0 0 1-3 3H6.72a3 3 0 0 1-3-3V10.272a3 3 0 0 1 3-3z" opacity="0.3"/>
                <path fill="#FFF" d="M14.4 14h19.2c.664 0 1.2.536 1.2 1.2v1.6c0 .664-.536 1.2-1.2 1.2H14.4c-.664 0-1.2-.536-1.2-1.2v-1.6c0-.664.536-1.2 1.2-1.2z" opacity="0.2"/>
                <path fill="#3395FF" d="M11.55 9.818c.397 0 .778.058 1.145.172.367.115.69.282.968.501.278.22.5.49.667.811.167.322.25.696.25 1.122 0 .454-.099.831-.296 1.132-.197.3-.465.541-.804.723.49.142.863.378 1.122.708.258.33.388.75.388 1.26 0 .473-.09.878-.27 1.216-.18.338-.421.613-.723.824-.302.212-.65.367-1.043.467-.392.1-.799.15-1.22.15H8.34V9.818h3.21zm-.188 3.615c.305 0 .557-.073.753-.222.196-.148.295-.378.295-.688 0-.176-.033-.321-.099-.434a.705.705 0 0 0-.265-.268 1.138 1.138 0 0 0-.38-.135 2.242 2.242 0 0 0-.432-.038h-1.56v1.784h1.688zm.098 3.675c.153 0 .303-.015.45-.046.148-.032.28-.084.396-.157a.798.798 0 0 0 .278-.301c.07-.129.105-.29.105-.484 0-.383-.109-.654-.327-.813-.219-.16-.504-.24-.857-.24h-1.83v2.04h1.785z"/>
                <path d="M17.206 16.77c0-.526.078-.994.234-1.404.156-.41.368-.756.636-1.039a2.73 2.73 0 0 1 .957-.648c.367-.15.756-.226 1.168-.226.41 0 .8.075 1.168.226.367.15.69.365.966.648.277.283.496.629.657 1.039.161.41.242.878.242 1.404 0 .525-.08.99-.242 1.393-.161.404-.38.743-.657 1.016a2.823 2.823 0 0 1-.966.62c-.368.142-.757.214-1.168.214-.412 0-.801-.072-1.168-.213a2.789 2.789 0 0 1-.957-.62 2.714 2.714 0 0 1-.636-1.016c-.156-.402-.234-.868-.234-1.393zm1.344 0c0 .26.034.498.103.717.07.219.168.408.296.569.129.16.282.287.46.38.179.093.38.14.603.14.222 0 .423-.047.602-.14.18-.093.333-.22.461-.38.128-.16.227-.35.296-.57.07-.218.105-.456.105-.716 0-.26-.034-.501-.105-.724a1.654 1.654 0 0 0-.296-.578 1.326 1.326 0 0 0-.46-.382 1.42 1.42 0 0 0-.603-.136c-.222 0-.423.045-.603.136a1.326 1.326 0 0 0-.46.382 1.654 1.654 0 0 0-.295.578 2.12 2.12 0 0 0-.103.724zm5.338 2.975V13.06h2.352c.438 0 .822.047 1.151.14.33.093.607.226.832.398.225.173.394.383.507.632.114.25.17.531.17.845 0 .324-.06.61-.18.86a1.83 1.83 0 0 1-.516.644c-.222.18-.494.317-.816.411-.321.095-.681.142-1.08.142h-.963v2.613h-1.457zm1.457-3.87h.805c.13 0 .259-.012.387-.038a.992.992 0 0 0 .337-.13.699.699 0 0 0 .234-.243.745.745 0 0 0 .087-.373.632.632 0 0 0-.303-.572c-.201-.13-.467-.196-.796-.196h-.75v1.553zm7.841 3.87l-2.463-6.684h1.55l1.654 4.878h.035l1.587-4.878h1.456l-2.4 6.684h-1.42zm7.193 0V13.06h4.86v1.233h-3.403v1.392h3.146v1.233h-3.146v1.594h3.57v1.233h-5.027z" fill="#FFF"/>
                <path d="M40.85 20.607c-.125.07-.313.14-.563.21a2.65 2.65 0 0 1-.717.105c-.26 0-.505-.042-.733-.126a1.647 1.647 0 0 1-.594-.376 1.784 1.784 0 0 1-.4-.62c-.097-.248-.146-.528-.146-.839v-3.098h1.344v2.881c0 .333.071.585.214.757.143.172.341.258.594.258.097 0 .188-.003.273-.008.085-.006.163-.014.234-.023.072-.01.138-.022.2-.034a.767.767 0 0 0 .14-.047l.155 1.05z" fill="#3395FF"/>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="32" viewBox="0 0 48 32" className="h-8">
                <path fill="#FFF" d="M0 0h48v32H0z" opacity="0.07"/>
                <path fill="#FFF" d="M2 0h44a2 2 0 0 1 2 2v28a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2z" opacity="0.1"/>
                <path fill="#FFF" d="M4 0h40a4 4 0 0 1 4 4v24a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z" opacity="0.2"/>
                <path fill="#FFF" d="M6.72 7.272h34.56a3 3 0 0 1 3 3v11.456a3 3 0 0 1-3 3H6.72a3 3 0 0 1-3-3V10.272a3 3 0 0 1 3-3z" opacity="0.3"/>
                <path fill="#FFF" d="M14.4 14h19.2c.664 0 1.2.536 1.2 1.2v1.6c0 .664-.536 1.2-1.2 1.2H14.4c-.664 0-1.2-.536-1.2-1.2v-1.6c0-.664.536-1.2 1.2-1.2z" opacity="0.2"/>
                <path fill="#4757B1" d="M18.901 17.434h-2.404V11.42h2.404v6.015zM17.7 10.377a1.396 1.396 0 1 1 0-2.793 1.396 1.396 0 0 1 0 2.793zm10.3 7.057h-2.396v-2.925c0-.897-.018-2.05-1.25-2.05-1.252 0-1.443 0.976-1.443 1.984v2.991h-2.396v-6.015h2.3v1.055h.032c.322-.607 1.108-1.25 2.283-1.25 2.443 0 2.894 1.605 2.894 3.696v2.514z"/>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="28" viewBox="0 0 48 28" className="h-8">
                <rect width="48" height="28" fill="#fff" rx="4"/>
                <path fill="#32BCAD" d="M27 13.913v8.609h9.336v-6.325h-5.663v3.217h2.454v1.325H28.77v-6.826h7.565V9.478H27zm-6 4.138L17.707 14h-2.388L11 18.11v-8.63H6v15.108h5V19.26l.5-.544 3.252 5.872h5.496L14.6 14.565l6.4-5.087h-5.494"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
