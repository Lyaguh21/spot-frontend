import { ICoupleState } from "@/entities/couple";
import { IMapMarker } from "@/entities/map";
import { IUserState } from "@/entities/user";

type FeedOwner = Pick<IUserState, "id" | "username" | "avatarUrl" | "name">;

export interface IFeedItem extends Omit<IMapMarker, "description"> {
  description: string | null;
  place: {
    id: string;
    title: string;
    lat: number;
    lng: number;
    address: string | null;
  };
  couple: Pick<ICoupleState, "id" | "generatedName" | "members"> | null;
  user: FeedOwner | null;
}
