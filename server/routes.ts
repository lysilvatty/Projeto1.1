import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { 
  insertVideoSchema, 
  insertPurchaseSchema, 
  insertRatingSchema,
  insertUserSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);

  // Initialize categories if they don't exist
  await initializeCategories();
  
  // Initialize demo data if needed
  await initializeDemoData();

  // Categories endpoints
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Videos endpoints
  app.get("/api/videos", async (req, res) => {
    try {
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      const videos = await storage.getVideosWithDetails(categoryId);
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch videos" });
    }
  });

  app.get("/api/videos/:id", async (req, res) => {
    try {
      const videoId = parseInt(req.params.id);
      const video = await storage.getVideoWithDetails(videoId);
      
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      
      res.json(video);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch video" });
    }
  });

  app.post("/api/videos", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user?.userType !== "professional") {
      return res.status(403).json({ message: "Only professionals can create videos" });
    }

    try {
      const validatedData = insertVideoSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const newVideo = await storage.createVideo(validatedData);
      res.status(201).json(newVideo);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid video data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create video" });
    }
  });

  // Professionals endpoints
  app.get("/api/professionals", async (req, res) => {
    try {
      const professionals = await storage.getProfessionalsWithVideos();
      res.json(professionals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch professionals" });
    }
  });

  app.get("/api/professionals/:id", async (req, res) => {
    try {
      const professionalId = parseInt(req.params.id);
      const professional = await storage.getProfessionalWithVideos(professionalId);
      
      if (!professional) {
        return res.status(404).json({ message: "Professional not found" });
      }
      
      res.json(professional);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch professional" });
    }
  });

  // Purchases endpoints
  app.post("/api/purchases", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user?.userType !== "student") {
      return res.status(403).json({ message: "Only students can make purchases" });
    }

    try {
      const validatedData = insertPurchaseSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      // Check if the video exists
      const video = await storage.getVideo(validatedData.videoId);
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }

      // Check if the student already purchased this video
      const existingPurchase = await storage.getUserPurchaseByVideoId(req.user.id, validatedData.videoId);
      if (existingPurchase) {
        return res.status(400).json({ message: "Video already purchased" });
      }

      const newPurchase = await storage.createPurchase(validatedData);
      res.status(201).json(newPurchase);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid purchase data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create purchase" });
    }
  });

  app.get("/api/purchases/user", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const purchases = await storage.getUserPurchases(req.user.id);
      res.json(purchases);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch purchases" });
    }
  });

  // Ratings endpoints
  app.post("/api/ratings", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user?.userType !== "student") {
      return res.status(403).json({ message: "Only students can create ratings" });
    }

    try {
      const validatedData = insertRatingSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      // Check if the video exists
      const video = await storage.getVideo(validatedData.videoId);
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }

      // Check if the student has purchased this video
      const purchase = await storage.getUserPurchaseByVideoId(req.user.id, validatedData.videoId);
      if (!purchase) {
        return res.status(403).json({ message: "You must purchase the video before rating it" });
      }

      // Check if the user already rated this video
      const existingRating = await storage.getUserRatingByVideoId(req.user.id, validatedData.videoId);
      let newRating;
      
      if (existingRating) {
        // Update existing rating
        newRating = await storage.updateRating(existingRating.id, validatedData);
      } else {
        // Create new rating
        newRating = await storage.createRating(validatedData);
      }
      
      res.status(201).json(newRating);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid rating data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create rating" });
    }
  });

  app.get("/api/ratings/video/:id", async (req, res) => {
    try {
      const videoId = parseInt(req.params.id);
      const ratings = await storage.getVideoRatings(videoId);
      res.json(ratings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ratings" });
    }
  });

  // Dashboard endpoints
  app.get("/api/dashboard/professional", async (req, res) => {
    if (!req.isAuthenticated() || req.user?.userType !== "professional") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const videos = await storage.getUserVideos(req.user.id);
      const videoIds = videos.map(video => video.id);
      
      // Get all purchases for these videos
      const purchases = await storage.getVideosPurchases(videoIds);
      
      // Get all ratings for these videos
      const ratings = await storage.getVideosRatings(videoIds);
      
      res.json({
        videos,
        purchases,
        ratings
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  app.get("/api/dashboard/student", async (req, res) => {
    if (!req.isAuthenticated() || req.user?.userType !== "student") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const purchases = await storage.getUserPurchasesWithVideos(req.user.id);
      const ratings = await storage.getUserRatings(req.user.id);
      
      res.json({
        purchases,
        ratings
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to initialize categories
async function initializeCategories() {
  const existingCategories = await storage.getAllCategories();
  
  if (existingCategories.length === 0) {
    const categoriesToCreate = [
      { name: "technology", displayName: "Tecnologia", color: "#3A86FF" },
      { name: "health", displayName: "Saúde", color: "#28A745" },
      { name: "engineering", displayName: "Engenharia", color: "#FFC107" },
      { name: "law", displayName: "Direito", color: "#0D47A1" },
      { name: "education", displayName: "Educação", color: "#6A1B9A" },
      { name: "marketing", displayName: "Marketing", color: "#DC3545" },
      { name: "finance", displayName: "Finanças", color: "#198754" },
      { name: "arts", displayName: "Artes", color: "#F44336" }
    ];

    for (const category of categoriesToCreate) {
      await storage.createCategory(category);
    }
  }
}

// Helper function to initialize demo data
async function initializeDemoData() {
  // Check if we already have demo data
  const existingVideos = await storage.getVideosWithDetails();
  if (existingVideos.length > 0) {
    return; // Already have demo data
  }

  try {
    // Create demo professional users
    const professionals = [
      {
        name: "Ricardo Desenvolvedor",
        email: "ricardo@example.com",
        username: "ricardodev",
        password: "password123",
        userType: "professional",
        bio: "Desenvolvedor full-stack com 12 anos de experiência em grandes empresas de tecnologia.",
        experience: 12,
        profileImage: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=300&q=80"
      },
      {
        name: "Ana Engenheira",
        email: "ana@example.com",
        username: "anaeng",
        password: "password123",
        userType: "professional",
        bio: "Engenheira civil especializada em projetos sustentáveis e infraestrutura urbana.",
        experience: 8,
        profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
      },
      {
        name: "Carlos Médico",
        email: "carlos@example.com",
        username: "carlosmed",
        password: "password123",
        userType: "professional",
        bio: "Médico cardiologista com experiência em hospitais públicos e privados.",
        experience: 15,
        profileImage: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&q=80"
      }
    ];

    // Create professional accounts
    const createdProfessionals = [];
    for (const pro of professionals) {
      const createdPro = await storage.createUser(pro);
      createdProfessionals.push(createdPro);
    }

    // Create demo student user
    const student = {
      name: "Maria Estudante",
      email: "maria@example.com",
      username: "mariaest",
      password: "password123",
      userType: "student",
      bio: "Estudante universitária buscando definir sua carreira profissional.",
      profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80"
    };
    const createdStudent = await storage.createUser(student);

    // Get categories
    const categories = await storage.getAllCategories();
    
    // Create demo videos
    const videos = [
      {
        title: "Como é trabalhar com tecnologia em grandes empresas",
        description: "Neste vídeo compartilho minha experiência trabalhando em empresas de tecnologia, desde startups até gigantes do setor. Falo sobre a rotina diária, desafios, projetos e como é a progressão de carreira.",
        videoUrl: "https://player.vimeo.com/video/565490255",
        thumbnailUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
        price: 29.99,
        duration: 1104, // 18:24 in seconds
        userId: createdProfessionals[0].id,
        categoryId: categories.find(c => c.name === "technology")?.id || 1
      },
      {
        title: "Um dia na vida de um engenheiro civil em canteiro de obras",
        description: "Acompanhe um dia completo do meu trabalho como engenheira civil em um grande canteiro de obras. Mostro desde as reuniões matinais de planejamento, inspeções de segurança, até os desafios técnicos enfrentados.",
        videoUrl: "https://player.vimeo.com/video/565490255",
        thumbnailUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80",
        price: 24.99,
        duration: 1520, // 25:20 in seconds
        userId: createdProfessionals[1].id,
        categoryId: categories.find(c => c.name === "engineering")?.id || 3
      },
      {
        title: "Visita ao hospital: rotina de um cardiologista",
        description: "Neste vídeo você vai conhecer a rotina de um médico cardiologista em um hospital de referência. Mostro consultas, exames, discussões de casos e os desafios da profissão.",
        videoUrl: "https://player.vimeo.com/video/565490255",
        thumbnailUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
        price: 34.99,
        duration: 1860, // 31:00 in seconds
        userId: createdProfessionals[2].id,
        categoryId: categories.find(c => c.name === "health")?.id || 2
      },
      {
        title: "Desenvolvimento de aplicativos mobile: bastidores",
        description: "Compartilho todo o processo de desenvolvimento de aplicativos mobile, desde a concepção da ideia até o lançamento nas lojas. Inclui dicas sobre tecnologias, metodologias e cases reais.",
        videoUrl: "https://player.vimeo.com/video/565490255",
        thumbnailUrl: "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?auto=format&fit=crop&w=800&q=80",
        price: 19.99,
        duration: 1320, // 22:00 in seconds
        userId: createdProfessionals[0].id,
        categoryId: categories.find(c => c.name === "technology")?.id || 1
      }
    ];

    // Create videos
    const createdVideos = [];
    for (const video of videos) {
      const createdVideo = await storage.createVideo(video);
      createdVideos.push(createdVideo);
    }

    // Create some purchases for the student
    const purchases = [
      {
        userId: createdStudent.id,
        videoId: createdVideos[0].id,
        amount: videos[0].price
      },
      {
        userId: createdStudent.id,
        videoId: createdVideos[2].id,
        amount: videos[2].price
      }
    ];

    // Create purchases
    for (const purchase of purchases) {
      await storage.createPurchase(purchase);
    }

    // Create some ratings
    const ratings = [
      {
        userId: createdStudent.id,
        videoId: createdVideos[0].id,
        rating: 5,
        comment: "Excelente vídeo! Ajudou muito a entender como é o dia a dia na área de desenvolvimento."
      },
      {
        userId: createdStudent.id,
        videoId: createdVideos[2].id,
        rating: 4,
        comment: "Muito informativo sobre a rotina médica. Gostaria de ter visto mais sobre a interação com pacientes."
      }
    ];

    // Create ratings
    for (const rating of ratings) {
      await storage.createRating(rating);
    }

    console.log("Demo data initialized successfully");
  } catch (error) {
    console.error("Error initializing demo data:", error);
  }
}
