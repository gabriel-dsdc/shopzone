import { IReview } from "./IReview";
import { IUser } from "./IUser";

export enum Category {
  AnimalsAndPets = "Animals and Pets",
  BeautyHealthAndPersonalCare = "Beauty, Health and Personal Care",
  BooksMagazinesAndComics = "Books, Magazines and Comics",
  ClothingAndAccessories = "Clothing and Accessories",
  ConsolesComputersAndGames = "Consoles, Computers and Games",
  Electronics = "Electronics",
  FoodAndDrinks = "Food and Drinks",
  GiftCards = "Gift Cards",
  HomeFurnitureGardenAndTools = "Home, Furniture, Garden and Tools",
  KidsBabiesAndToys = "Kids, Babies and Toys",
  SmartHome = "Smart Home",
  SportsAndFitness = "Sports and Fitness",
  Vehicles = "Vehicles",
  Others = "Others",
}

export interface IProduct {
  id: string;
  userId: IUser["id"];
  name: string;
  images: string[];
  description: string;
  price: number;
  quantity: number;
  category: Category;
  brand: string;
  authors: string[];
  reviews: IReview["id"][];
  stripePriceId: string;
}
