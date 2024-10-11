import "./globals.css";


export const metadata = {
  title: "AI Code Editor",
  description: "AI Code Editor",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
      >
        {children}
      </body>
    </html>
  );
}
