import Provider from "./components/Provider";
import "./globals.css";

export const metadata = {
  title: "ALG_Store",
  description: "Ecommerce project",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
