import { format, add } from 'date-fns';
import { id } from 'date-fns/locale';

export const formatDate24HoursLater = (dateString) => {
  const date = new Date(dateString);
  const date24HoursLater = add(date, { hours: 24 });
  return format(date24HoursLater, "EEEE, dd MMMM yyyy, HH:mm", { locale: id });
};
