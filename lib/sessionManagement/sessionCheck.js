// export const isGuest = () => {
//   const session = JSON.parse(localStorage.getItem("user"));
//   if (!session) return true;
//   return false;
// };

// export const isAdmin = () => {
//   const session = JSON.parse(localStorage.getItem("user"));
//   if (!session) return false;
//   return session.role === "ADMIN";
// };

// export const isUser = () => {
//   const session = JSON.parse(localStorage.getItem("user"));
//   if (!session) return false;
//   return session.role === "USER";
// };

// export const dataUser = () => {
//   const session = JSON.parse(localStorage.getItem("user"));
//   if (!session) return null;
//   return session;
// };


import { getSession } from 'next-auth/react';

export const checkUserRole = async (context) => {
  const session = await getSession(context);
  if (session) {
    const { user } = session;
    // Contoh: user.role diambil dari token atau database, sesuaikan dengan skema autentikasi Anda
    const isAdmin = user.role === 'ADMIN';
    const isUser = user.role === 'USER';
    const data = user;
    return { isAdmin, isUser, isGuest: false, data };
  }
  return { isAdmin: false, isUser: false, isGuest: true, data: null};
};
