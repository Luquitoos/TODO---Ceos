import { DM_Sans } from "next/font/google"; //
import "./globals.css"; //

const dmSans = DM_Sans({ //
  variable: "--font-dm-sans", //
  subsets: ["latin"], //
});

export const metadata = {
  title: "CEOS To-Do", //
  description: "Sua lista de tarefas.", //
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body
        className={`${dmSans.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}