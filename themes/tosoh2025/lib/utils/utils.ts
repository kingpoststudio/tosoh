export const isUpcoming = (date: number) => {
  const now = new Date();
  const dateEvent = date ? new Date(date) : null;

  if (!dateEvent) return false;
  if (dateEvent) {
    if (now < dateEvent) return true;
  }
};

export const isPast = (date: number) => {
  const now = new Date();
  const dateEvent = date ? new Date(date) : null;

  if (!dateEvent) return false;
  if (dateEvent) {
    if (now > dateEvent) return true;
  }
};
