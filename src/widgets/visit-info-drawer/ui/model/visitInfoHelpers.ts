import { IMapMarker } from "@/entities/map";

export const visitInputStyles = {
  label: {
    color: "#8ea2d4",
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 6,
  },
  input: {
    minHeight: 44,
    color: "#eaf1ff",
    backgroundColor: "rgba(14, 27, 62, 0.74)",
    border: "1px solid rgba(104, 132, 210, 0.22)",
    borderRadius: 14,
    boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.04)",
  },
};

export const getAverageRating = (ratings: IMapMarker["ratings"]) => {
  if (!ratings.length) {
    return null;
  }

  return (
    ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length
  );
};

export const formatRating = (rating: number) =>
  Number.isInteger(rating) ? String(rating) : rating.toFixed(2);

export const formatVisitDate = (date: string) =>
  new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

export const getDatePickerValue = (date?: string) => {
  const sourceDate = date ? new Date(date) : new Date();
  const offsetMs = sourceDate.getTimezoneOffset() * 60 * 1000;

  return new Date(sourceDate.getTime() - offsetMs).toISOString().slice(0, 10);
};
