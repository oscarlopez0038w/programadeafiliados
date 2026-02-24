import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-main",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body>
        {children}
      </body>
    </html>
  );
}
