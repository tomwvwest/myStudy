import { Open_Sans } from "next/font/google";
import "./globals.css";
import { UserProvider } from "./contexts/userContext";
import { Menu } from "./components/menu/Menu";

const openSans = Open_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "myStudy",
  description: "Learning has never been easier",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={openSans.className}>
        <UserProvider>
          <Menu />
          <div className="ml-56 px-20 py-20 h-screen">{children}</div>
        </UserProvider>
      </body>
    </html>
  );
}
