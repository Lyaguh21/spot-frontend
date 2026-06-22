import { IMapMarker, IVisitAuthor, IVisitCoupleMember } from "@/entities/map";

type VisitWithPossibleAuthor = Pick<
  IMapMarker,
  | "authors"
  | "author"
  | "user"
  | "createdBy"
  | "creator"
  | "owner"
  | "couple"
  | "ratings"
>;

export const getVisitAuthor = (
  visit: Pick<
    IMapMarker,
    "author" | "user" | "createdBy" | "creator" | "owner"
  >,
): IVisitAuthor | null =>
  visit.author ??
  visit.user ??
  visit.createdBy ??
  visit.creator ??
  visit.owner ??
  null;

const isVisitAuthor = (value: unknown): value is IVisitAuthor =>
  Boolean(
    value &&
      typeof value === "object" &&
      "username" in value &&
      typeof (value as { username?: unknown }).username === "string",
  );

const getMemberAuthor = (member: IVisitCoupleMember): IVisitAuthor | null => {
  if (isVisitAuthor(member)) {
    return member;
  }

  return isVisitAuthor(member.user) ? member.user : null;
};

export const getVisitAuthors = (
  visit: Pick<
    IMapMarker,
    "authors" | "author" | "user" | "createdBy" | "creator" | "owner" | "couple"
  >,
): IVisitAuthor[] => {
  if (visit.authors?.length) {
    return visit.authors;
  }

  if (visit.couple?.members?.length) {
    return visit.couple.members.map(getMemberAuthor).filter(isVisitAuthor);
  }

  const author = getVisitAuthor(visit);

  return author ? [author] : [];
};

export const getVisitCardOwners = (
  visit: VisitWithPossibleAuthor,
  owners?: IVisitAuthor[],
): IVisitAuthor[] => {
  if (owners?.length) {
    return owners;
  }

  const authors = getVisitAuthors(visit);

  if (authors.length) {
    return authors;
  }

  return visit.ratings.map((rating) => ({
    username: rating.nickname,
    name: rating.nickname,
  }));
};
