/** @type {import('next').NextConfig} */
const nextConfig = {
  // أخبار NewsAPI تجي من نطاقات كثيرة ومجهولة، فنستخدم <img> عادي
  // بدل next/image عشان ما نحتاج نضيف كل نطاق يدويًا.
  reactStrictMode: true,
};

export default nextConfig;
