import {
  IconArmchair,
  IconBalloon,
  IconBeer,
  IconBike,
  IconBook,
  IconBuildingStore,
  IconBurger,
  IconCamera,
  IconChefHat,
  IconCoffee,
  IconCup,
  IconDeviceTv,
  IconDog,
  IconFlower,
  IconGlass,
  IconHeart,
  IconHearts,
  IconIceCream2,
  IconMapPin,
  IconMicrophone,
  IconMovie,
  IconMusic,
  IconPalette,
  IconPizza,
  IconPlant,
  IconRun,
  IconShoppingBag,
  IconStar,
  IconSwimming,
  IconTheater,
  IconTicket,
  IconToolsKitchen2,
  IconTree,
  IconTrees,
} from "@tabler/icons-react";
import type { ReactNode } from "react";

export type MarkerColorKey =
  | "violet"
  | "orange"
  | "green"
  | "blue"
  | "pink"
  | "red"
  | "cyan"
  | "neon"
  | "emerald"
  | "lime"
  | "amber"
  | "rose"
  | "sky"
  | "grape"
  | "sunset"
  | "mint"
  | "steel"
  | "rainbow";

export type MarkerIconKey =
  | "heart"
  | "star"
  | "cafe"
  | "coffee"
  | "cup"
  | "bench"
  | "hearts"
  | "trees"
  | "plant"
  | "flower"
  | "music"
  | "microphone"
  | "cinema"
  | "theater"
  | "tv"
  | "camera"
  | "shop"
  | "store"
  | "book"
  | "pizza"
  | "burger"
  | "chef"
  | "iceCream"
  | "bar"
  | "glass"
  | "bike"
  | "dog"
  | "sport"
  | "swim"
  | "ticket"
  | "balloon"
  | "palette"
  | "place";

export const markerColorOptions: {
  key: MarkerColorKey;
  label: string;
  colors: [string, string];
}[] = [
  { key: "violet", label: "Фиолетовый", colors: ["#D946EF", "#60A5FA"] },
  { key: "orange", label: "Оранжевый", colors: ["#FB923C", "#FACC15"] },
  { key: "green", label: "Зеленый", colors: ["#22C55E", "#A3E635"] },
  { key: "blue", label: "Синий", colors: ["#38BDF8", "#2563EB"] },
  { key: "pink", label: "Розовый", colors: ["#EC4899", "#A855F7"] },
  { key: "red", label: "Красный", colors: ["#EF4444", "#F97316"] },
  { key: "cyan", label: "Бирюзовый", colors: ["#14B8A6", "#8B5CF6"] },
  { key: "neon", label: "Неон", colors: ["#10B981", "#06B6D4"] },
  { key: "emerald", label: "Изумруд", colors: ["#34D399", "#059669"] },
  { key: "lime", label: "Лайм", colors: ["#84CC16", "#22C55E"] },
  { key: "amber", label: "Янтарь", colors: ["#F59E0B", "#F97316"] },
  { key: "rose", label: "Роза", colors: ["#FB7185", "#EC4899"] },
  { key: "sky", label: "Небо", colors: ["#7DD3FC", "#3B82F6"] },
  { key: "grape", label: "Виноград", colors: ["#A78BFA", "#7C3AED"] },
  { key: "sunset", label: "Закат", colors: ["#F97316", "#DB2777"] },
  { key: "mint", label: "Мята", colors: ["#5EEAD4", "#22C55E"] },
  { key: "steel", label: "Серый", colors: ["#94A3B8", "#475569"] },
];

export const markersColors: { [key: string]: [string, string] } = {
  ...Object.fromEntries(
    markerColorOptions.map(({ key, colors }) => [key, colors]),
  ),
};

export const markerIconOptions: {
  key: MarkerIconKey;
  label: string;
  icon: ReactNode;
}[] = [
  { key: "heart", label: "Любимое", icon: <IconHeart /> },
  { key: "star", label: "Звезда", icon: <IconStar /> },
  { key: "cafe", label: "Кафе", icon: <IconToolsKitchen2 /> },
  { key: "coffee", label: "Кофе", icon: <IconCoffee /> },
  { key: "cup", label: "Напитки", icon: <IconCup /> },
  { key: "bench", label: "Лавочка", icon: <IconArmchair /> },
  { key: "hearts", label: "Романтическое", icon: <IconHearts /> },
  { key: "trees", label: "Парк", icon: <IconTrees /> },
  { key: "plant", label: "Растения", icon: <IconPlant /> },
  { key: "flower", label: "Цветы", icon: <IconFlower /> },
  { key: "music", label: "Музыка", icon: <IconMusic /> },
  { key: "microphone", label: "Сцена", icon: <IconMicrophone /> },
  { key: "cinema", label: "Кино", icon: <IconMovie /> },
  { key: "theater", label: "Театр", icon: <IconTheater /> },
  { key: "tv", label: "Экран", icon: <IconDeviceTv /> },
  { key: "camera", label: "Фото", icon: <IconCamera /> },
  { key: "shop", label: "Покупки", icon: <IconShoppingBag /> },
  { key: "store", label: "Магазин", icon: <IconBuildingStore /> },
  { key: "book", label: "Книги", icon: <IconBook /> },
  { key: "pizza", label: "Пицца", icon: <IconPizza /> },
  { key: "burger", label: "Еда", icon: <IconBurger /> },
  { key: "chef", label: "Ресторан", icon: <IconChefHat /> },
  { key: "iceCream", label: "Десерт", icon: <IconIceCream2 /> },
  { key: "bar", label: "Бар", icon: <IconBeer /> },
  { key: "glass", label: "Коктейли", icon: <IconGlass /> },
  { key: "bike", label: "Велосипед", icon: <IconBike /> },
  { key: "dog", label: "Питомцы", icon: <IconDog /> },
  { key: "sport", label: "Спорт", icon: <IconRun /> },
  { key: "swim", label: "Вода", icon: <IconSwimming /> },
  { key: "ticket", label: "Билеты", icon: <IconTicket /> },
  { key: "balloon", label: "Праздник", icon: <IconBalloon /> },
  { key: "palette", label: "Творчество", icon: <IconPalette /> },
  { key: "place", label: "Место", icon: <IconMapPin /> },
];

export const markersIcons: { [key: string]: ReactNode } = {
  ...Object.fromEntries(markerIconOptions.map(({ key, icon }) => [key, icon])),
};

export type visitStatus = "PLANNED" | "VISITED";

export type IVisitAuthor = {
  id?: number | string;
  username: string;
  name?: string;
  avatarUrl?: string;
};

export type IVisitCoupleMember = IVisitAuthor | { user: IVisitAuthor };

export type IVisitCoupleAuthor = {
  id?: number | string;
  generatedName?: string;
  members?: IVisitCoupleMember[];
};

export interface IMapMarker {
  id?: string;
  ownerType: "USER" | "COUPLE";
  authors?: IVisitAuthor[] | null;
  author?: IVisitAuthor | null;
  user?: IVisitAuthor | null;
  createdBy?: IVisitAuthor | null;
  creator?: IVisitAuthor | null;
  owner?: IVisitAuthor | null;
  couple?: IVisitCoupleAuthor | null;
  externalId?: string;
  title: string;
  description: string;
  icon: MarkerIconKey;
  color: MarkerColorKey;
  lng?: number;
  lat?: number;
  coupleId?: string;
  ratings: {
    nickname: string;
    rating: number;
  }[];
  isFavorite?: boolean;
  visitDate: string;
  address?: string;
  photos?: string[];
  status: visitStatus;
}

export interface IMapPlace {
  title: string;
  lat: number;
  lng: number;
  address?: string;
}

export interface IMapPlaceVisits {
  place: IMapPlace;
  visits: Pick<
    IMapMarker,
    | "id"
    | "externalId"
    | "ownerType"
    | "authors"
    | "author"
    | "user"
    | "createdBy"
    | "creator"
    | "owner"
    | "couple"
    | "coupleId"
    | "title"
    | "description"
    | "ratings"
    | "isFavorite"
    | "photos"
    | "icon"
    | "color"
    | "lat"
    | "lng"
    | "address"
    | "visitDate"
    | "status"
  >[];
}

export interface ICreateVisitRequest extends IMapMarker {}

export interface IUpdateVisitRequest extends Omit<
  IMapMarker,
  "lat" | "lng" | "ownerType"
> {}

export type IVisitsResponse = IMapPlaceVisits[];
