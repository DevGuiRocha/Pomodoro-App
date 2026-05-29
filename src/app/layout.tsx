import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pomodoro",
  description: "Um timer Pomodoro simples para foco e produtividade.",
};

// Aplica o tema antes da hidratação para evitar flash de tema errado (FOUC).
const themeScript = `
(function () {
  try {
    var choice = localStorage.getItem('pomodoro:theme');
    if (choice) choice = JSON.parse(choice);
    var dark =
      choice === 'dark' ||
      ((!choice || choice === 'system') &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (dark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
