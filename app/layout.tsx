import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Amber Zhang — 影像与内容创作',
  description: 'Amber Zhang：复旦大学广电，AI短剧、纪录片与品牌内容创作者。',
  openGraph: {
    title: 'Amber Zhang — 影像与内容创作',
    description: '复旦大学广电，AI短剧、纪录片与品牌内容创作者。',
    images: ['https://zze-visual-portfolio.citrus-tang-5115.chatgpt.site/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Amber Zhang — 影像与内容创作',
    description: '复旦大学广电，AI短剧、纪录片与品牌内容创作者。',
    images: ['https://zze-visual-portfolio.citrus-tang-5115.chatgpt.site/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
