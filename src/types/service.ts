export interface Service {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  image: string;
  provider: {
    _id: string;
    name: string;
    avatar?: string;
    location: string;
  };
  rating: number;
  reviews: number;
  location: string;
  popularity: number;
  availability: boolean;
  createdAt: string;
} 