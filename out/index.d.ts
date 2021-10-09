export interface Order {
  id: integer; 
  petId: integer; 
  quantity: integer; 
  shipDate: string; 
  status: string; // Order Status
  complete: boolean; 
}

export interface Category {
  id: integer; 
  name: string; 
}

export interface User {
  id: integer; 
  username: string; 
  firstName: string; 
  lastName: string; 
  email: string; 
  password: string; 
  phone: string; 
  userStatus: integer; // User Status
}

export interface Tag {
  id: integer; 
  name: string; 
}

export interface Pet {
  id: integer; 
  category: Category; 
  name: string; 
  photoUrls: string[]; 
  tags: Tag[]; 
  status: string; // pet status in the store
}

export interface ApiResponse {
  code: integer; 
  type: string; 
  message: string; 
}

// goods model
export interface Goods {
  name: string; 
  price: number; 
  desc: string; 
}

