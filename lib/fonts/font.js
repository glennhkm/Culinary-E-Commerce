import { Croissant_One, Poppins } from "next/font/google";

export const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const croissant_one = Croissant_One({
  weight: "400",
  subsets: ["latin"],
});
