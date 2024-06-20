export const isGuest = () => {
  const session = JSON.parse(localStorage.getItem("user"));
  if (!session) return true;
  return false;
};

export const isAdmin = () => {
  const session = JSON.parse(localStorage.getItem("user"));
  if (!session) return false;
  return session.role === "ADMIN";
};

export const isUser = () => {
  const session = JSON.parse(localStorage.getItem("user"));
  if (!session) return false;
  return session.role === "USER";
};

export const dataUser = () => {
  const session = JSON.parse(localStorage.getItem("user"));
  if (!session) return null;
  return session;
};
