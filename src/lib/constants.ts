export const BRAND = {
  name: "NOVAÉ",
  tagline: "EVERYDAY, ELEVATED.",
};

export const NAV_LINKS = [
  { label: "NEW IN", href: "/shop?filter=new-in" },
  { label: "WOMEN", href: "/shop/women" },
  { label: "MEN", href: "/shop/men" },
  { label: "COLLECTIONS", href: "/collections" },
  { label: "ABOUT", href: "/about" },
  { label: "JOURNAL", href: "/journal" },
];

export const CONTACT = {
  email: "support@novae.in",
  whatsapp: "+91 90000 21450",
  hours: "Monday–Saturday, 10:00 AM – 6:00 PM IST",
};

export const FREE_SHIPPING_THRESHOLD = 1999;
export const STANDARD_SHIPPING = 149;
export const DELIVERY_ESTIMATE = "3–6 business days";
export const RETURNS_WINDOW = "7 days";

export const SIZE_GUIDE = {
  women: [
    { size: "XS", chest: 34, waist: 28, hip: 36 },
    { size: "S", chest: 36, waist: 30, hip: 38 },
    { size: "M", chest: 38, waist: 32, hip: 40 },
    { size: "L", chest: 40, waist: 34, hip: 42 },
    { size: "XL", chest: 42, waist: 36, hip: 44 },
  ],
  men: [
    { size: "S", chest: 37, waist: 31, hip: 39 },
    { size: "M", chest: 39, waist: 33, hip: 41 },
    { size: "L", chest: 41, waist: 35, hip: 43 },
    { size: "XL", chest: 43, waist: 37, hip: 45 },
    { size: "XXL", chest: 45, waist: 39, hip: 47 },
  ],
};

export function formatINR(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}
