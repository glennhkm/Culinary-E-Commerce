import { format } from "date-fns";
import { id } from "date-fns/locale";

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, "EEEE, dd MMMM yyyy, HH:mm", { locale: id });
};


