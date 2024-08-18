import "./globals.css";
import "./data-tables-css.css";
// import "./satoshi.css";
import "./cambria.css";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body >{children}
      <Toaster position="top-right" richColors  />
      </body>
    </html>
  );
}
