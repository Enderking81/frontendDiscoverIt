// modelos de datos que devuelve la API (ver backend/docs/openapi.yaml)

export interface User {
  id: number;
  nickname: string;
  email: string;
  isAdmin: boolean;
}

export interface Session {
  token: string;
  user: User;
}

export interface Profile {
  bio: string | null;
  avatar: string | null;
  location: string | null;
  birthdate: string | null;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
}

export interface Place {
  id: number;
  name: string;
  description: string | null;
  location: string | null;
  categoryId: number;
  image: string | null;
  average_rating: number | null;
  latitude: number | null;
  longitude: number | null;
  Category?: Pick<Category, 'id' | 'name'>;
}

export interface Recommendation {
  id: number;
  idUser: number;
  points: Rating;
  description: string | null;
  createdAt: string;
  User?: Pick<User, 'id' | 'nickname'>;
}

export interface PlaceDetail extends Place {
  Recommendations: Recommendation[];
}

export interface MyProfile extends User {
  createdAt: string;
  Profile: Profile | null;
  Recommendations: Array<Omit<Recommendation, 'idUser' | 'User'> & { Place_Product: Pick<Place, 'id' | 'name'> | null }>;
  stats: { recommendations: number; favorites: number };
}

export interface AdminStats {
  users: number;
  places: number;
  categories: number;
  recommendations: number;
}

// tipos auxiliares
export type Rating = 1 | 2 | 3 | 4 | 5;
export type PlaceFilters = { categoryId?: number; search?: string };
export type PlaceInput = Partial<Omit<Place, 'id' | 'average_rating' | 'Category'>>;
export type CategoryInput = Pick<Category, 'name'> & Partial<Pick<Category, 'description'>>;
export type ProfileInput = Partial<Pick<User, 'nickname'> & Profile>;
export type RecommendationInput = { points: Rating; description?: string };

export interface ApiError {
  error: string;
  details?: Array<{ field: string; message: string }>;
}
