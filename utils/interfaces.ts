// EventCategory
export type EventCategory = {
  eventCategoryId: string;
  name: string;
  description: string;
  image: string;
  themes: Theme[];
};

// Image
export type Image = {
  imageId: string;
  url: string;
  themeId: string;
  theme: Theme;
};

// Organizer
export type Organizer = {
  organizerId: string;
  email: string;
  name: string;
  phoneNumber: string;
  whatsappId: string;
  themes: Theme[];
};

// Theme
export type Theme = {
  themeId: string;
  name: string;
  image: Image[];
  description: string;
  price: number;
  additionalDetails: string;
  organizer: Organizer;
  organizerId: string;
  eventCategory: EventCategory;
  eventCategoryId: string;
};

// Customer
export type Customer = {
  customerId: string;
  name: string;
  phoneNumber: string;
  bookings: Booking[];
};

// Booking
export type Booking = {
  bookingId: string;
  customerId: string;
  themeId?: string | null; // Optional reference to Theme
  date: Date; // Use the proper Date type
  status: string;
  notes: string;
  customer: Customer;
};
