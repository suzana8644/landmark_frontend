export type EventCategory = {
  eventCategoryId: number;
  name: string;
  description: string;
  image: EventImage[];
  imageId?: string;
  themes: Theme[];
};

export type ThemeImage = {
  imageId: number;
  url: string;
  themeId: string;
  theme: Theme;
};

export type EventImage = {
  imageId: number;
  url: string;
  eventCategoryId: string;
  event: EventCategory;
};

export type Organizer = {
  organizerId: number;
  email: string;
  name: string;
  phoneNumber: string;
  whatsappId: string;
  themes: Theme[];
};

export type Theme = {
  themeId: number;
  name: string;
  image: ThemeImage[];
  imageId?: string;
  description: string;
  price: number;
  additionalDetails: string;
  organizer: Organizer;
  organizerId: string;
  eventCategoryId: string;
  eventCategory: EventCategory;
};

export type Customer = {
  customerId: number;
  name: string;
  phoneNumber: string;
  bookings: Booking[];
};

export type Booking = {
  bookingId: number;
  customerId: string;
  themeId?: string;
  date: Date;
  status: string;
  notes: string;
  customer: Customer;
};

export type Message = {
  messageId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  message: string;
};
