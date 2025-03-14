import { 
  User, InsertUser, 
  Video, InsertVideo, 
  Category, InsertCategory,
  Purchase, InsertPurchase,
  Rating, InsertRating,
  VideoWithDetails,
  ProfessionalWithVideos
} from "@shared/schema";
import session from "express-session";
import memorystore from "memorystore";

const MemoryStoreFactory = memorystore(session);
type SessionStore = session.Store;

// Interface for storage operations
export interface IStorage {
  // Session store
  sessionStore: SessionStore;

  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Category operations
  getAllCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Video operations
  getVideo(id: number): Promise<Video | undefined>;
  getUserVideos(userId: number): Promise<Video[]>;
  getVideoWithDetails(id: number): Promise<VideoWithDetails | undefined>;
  getVideosWithDetails(categoryId?: number): Promise<VideoWithDetails[]>;
  createVideo(video: InsertVideo): Promise<Video>;

  // Professional operations
  getProfessionalsWithVideos(): Promise<ProfessionalWithVideos[]>;
  getProfessionalWithVideos(id: number): Promise<ProfessionalWithVideos | undefined>;

  // Purchase operations
  createPurchase(purchase: InsertPurchase): Promise<Purchase>;
  getUserPurchases(userId: number): Promise<Purchase[]>;
  getUserPurchasesWithVideos(userId: number): Promise<(Purchase & { video: VideoWithDetails })[]>;
  getUserPurchaseByVideoId(userId: number, videoId: number): Promise<Purchase | undefined>;
  getVideosPurchases(videoIds: number[]): Promise<Purchase[]>;

  // Rating operations
  createRating(rating: InsertRating): Promise<Rating>;
  updateRating(id: number, rating: InsertRating): Promise<Rating>;
  getUserRatings(userId: number): Promise<Rating[]>;
  getVideoRatings(videoId: number): Promise<Rating[]>;
  getVideosRatings(videoIds: number[]): Promise<Rating[]>;
  getUserRatingByVideoId(userId: number, videoId: number): Promise<Rating | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private videos: Map<number, Video>;
  private purchases: Map<number, Purchase>;
  private ratings: Map<number, Rating>;
  sessionStore: SessionStore;
  
  // IDs for autoincrement
  private userId: number;
  private categoryId: number;
  private videoId: number;
  private purchaseId: number;
  private ratingId: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.videos = new Map();
    this.purchases = new Map();
    this.ratings = new Map();
    
    this.userId = 1;
    this.categoryId = 1;
    this.videoId = 1;
    this.purchaseId = 1;
    this.ratingId = 1;

    this.sessionStore = new MemoryStoreFactory({
      checkPeriod: 86400000, // 24 hours
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const createdAt = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt,
      bio: insertUser.bio || null,
      experience: insertUser.experience || null,
      profileImage: insertUser.profileImage || null
    };
    this.users.set(id, user);
    return user;
  }

  // Category operations
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  // Video operations
  async getVideo(id: number): Promise<Video | undefined> {
    return this.videos.get(id);
  }

  async getUserVideos(userId: number): Promise<Video[]> {
    return Array.from(this.videos.values()).filter(
      (video) => video.userId === userId
    );
  }

  async getVideoWithDetails(id: number): Promise<VideoWithDetails | undefined> {
    const video = this.videos.get(id);
    if (!video) return undefined;

    const category = this.categories.get(video.categoryId);
    if (!category) return undefined;

    const professional = this.users.get(video.userId);
    if (!professional) return undefined;

    // Get ratings for this video
    const videoRatings = Array.from(this.ratings.values()).filter(
      (rating) => rating.videoId === id
    );

    // Calculate average rating
    let averageRating = 0;
    if (videoRatings.length > 0) {
      averageRating = videoRatings.reduce((sum, rating) => sum + rating.rating, 0) / videoRatings.length;
    }

    return {
      ...video,
      category,
      professional: {
        id: professional.id,
        name: professional.name,
        experience: professional.experience,
        profileImage: professional.profileImage
      },
      averageRating,
      ratingCount: videoRatings.length
    };
  }

  async getVideosWithDetails(categoryId?: number): Promise<VideoWithDetails[]> {
    let filteredVideos = Array.from(this.videos.values());
    
    // Filter by category if provided
    if (categoryId !== undefined) {
      filteredVideos = filteredVideos.filter(video => video.categoryId === categoryId);
    }

    // Map videos to include details
    const videosWithDetails: VideoWithDetails[] = [];
    
    for (const video of filteredVideos) {
      const videoWithDetails = await this.getVideoWithDetails(video.id);
      if (videoWithDetails) {
        videosWithDetails.push(videoWithDetails);
      }
    }

    return videosWithDetails;
  }

  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const id = this.videoId++;
    const createdAt = new Date();
    const video: Video = { 
      ...insertVideo, 
      id, 
      createdAt,
      thumbnailUrl: insertVideo.thumbnailUrl || null
    };
    this.videos.set(id, video);
    return video;
  }

  // Professional operations
  async getProfessionalsWithVideos(): Promise<ProfessionalWithVideos[]> {
    // Get all professionals
    const professionals = Array.from(this.users.values()).filter(
      (user) => user.userType === "professional"
    );

    const professionalsWithVideos: ProfessionalWithVideos[] = [];

    for (const professional of professionals) {
      const videos = await this.getVideosWithDetails();
      const professionalVideos = videos.filter(video => video.professional.id === professional.id);
      
      // Calculate average rating across all videos
      let totalRating = 0;
      let ratedVideosCount = 0;
      
      professionalVideos.forEach(video => {
        if (video.averageRating && video.averageRating > 0) {
          totalRating += video.averageRating;
          ratedVideosCount++;
        }
      });
      
      const averageRating = ratedVideosCount > 0 ? totalRating / ratedVideosCount : 0;
      
      professionalsWithVideos.push({
        ...professional,
        videos: professionalVideos,
        averageRating
      });
    }

    return professionalsWithVideos;
  }

  async getProfessionalWithVideos(id: number): Promise<ProfessionalWithVideos | undefined> {
    const professional = this.users.get(id);
    if (!professional || professional.userType !== "professional") return undefined;

    const videos = await this.getVideosWithDetails();
    const professionalVideos = videos.filter(video => video.professional.id === id);
    
    // Calculate average rating across all videos
    let totalRating = 0;
    let ratedVideosCount = 0;
    
    professionalVideos.forEach(video => {
      if (video.averageRating && video.averageRating > 0) {
        totalRating += video.averageRating;
        ratedVideosCount++;
      }
    });
    
    const averageRating = ratedVideosCount > 0 ? totalRating / ratedVideosCount : 0;
    
    return {
      ...professional,
      videos: professionalVideos,
      averageRating
    };
  }

  // Purchase operations
  async createPurchase(insertPurchase: InsertPurchase): Promise<Purchase> {
    const id = this.purchaseId++;
    const createdAt = new Date();
    const purchase: Purchase = { ...insertPurchase, id, createdAt };
    this.purchases.set(id, purchase);
    return purchase;
  }

  async getUserPurchases(userId: number): Promise<Purchase[]> {
    return Array.from(this.purchases.values()).filter(
      (purchase) => purchase.userId === userId
    );
  }

  async getUserPurchasesWithVideos(userId: number): Promise<(Purchase & { video: VideoWithDetails })[]> {
    const userPurchases = await this.getUserPurchases(userId);
    const purchasesWithVideos = [];
    
    for (const purchase of userPurchases) {
      const video = await this.getVideoWithDetails(purchase.videoId);
      if (video) {
        purchasesWithVideos.push({
          ...purchase,
          video
        });
      }
    }
    
    return purchasesWithVideos;
  }

  async getUserPurchaseByVideoId(userId: number, videoId: number): Promise<Purchase | undefined> {
    return Array.from(this.purchases.values()).find(
      (purchase) => purchase.userId === userId && purchase.videoId === videoId
    );
  }

  async getVideosPurchases(videoIds: number[]): Promise<Purchase[]> {
    return Array.from(this.purchases.values()).filter(
      (purchase) => videoIds.includes(purchase.videoId)
    );
  }

  // Rating operations
  async createRating(insertRating: InsertRating): Promise<Rating> {
    const id = this.ratingId++;
    const createdAt = new Date();
    const rating: Rating = { 
      ...insertRating, 
      id, 
      createdAt,
      comment: insertRating.comment || null 
    };
    this.ratings.set(id, rating);
    return rating;
  }

  async updateRating(id: number, insertRating: InsertRating): Promise<Rating> {
    const existingRating = this.ratings.get(id);
    if (!existingRating) {
      throw new Error(`Rating with id ${id} not found`);
    }

    const updatedRating: Rating = { 
      ...existingRating, 
      rating: insertRating.rating,
      comment: insertRating.comment || null
    };
    
    this.ratings.set(id, updatedRating);
    return updatedRating;
  }

  async getUserRatings(userId: number): Promise<Rating[]> {
    return Array.from(this.ratings.values()).filter(
      (rating) => rating.userId === userId
    );
  }

  async getVideoRatings(videoId: number): Promise<Rating[]> {
    return Array.from(this.ratings.values()).filter(
      (rating) => rating.videoId === videoId
    );
  }

  async getVideosRatings(videoIds: number[]): Promise<Rating[]> {
    return Array.from(this.ratings.values()).filter(
      (rating) => videoIds.includes(rating.videoId)
    );
  }

  async getUserRatingByVideoId(userId: number, videoId: number): Promise<Rating | undefined> {
    return Array.from(this.ratings.values()).find(
      (rating) => rating.userId === userId && rating.videoId === videoId
    );
  }
}

export const storage = new MemStorage();
