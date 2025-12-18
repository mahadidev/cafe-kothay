export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData extends LoginCredentials {
  restaurantName: string;
  location: string;
  logoUrl?: string;
}
