export const isGuest = (window) => {
  const session = window.JSON.parse(localStorage.getItem("user"));
  if (!session) return true;
  return false;
};

export const isAdmin = (window) => {
  const session = window.JSON.parse(localStorage.getItem("user"));
  if (!session) return false;
  return session.role === "ADMIN";
};

export const isUser = (window) => {
  const session = window.JSON.parse(localStorage.getItem("user"));
  if (!session) return false;
  return session.role === "USER";
};

export const dataUser = (window) => {
  const session = window.JSON.parse(localStorage.getItem("user"));
  if (!session) return null;
  return session;
};
