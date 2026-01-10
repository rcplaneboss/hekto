// import withPWAInit from "next-pwa";

// /** @type {import('next-pwa').PWAConfig} */
// const withPWA = withPWAInit({
//   dest: "public",         // Where the service worker will be generated
//   register: true,         // Register the service worker automatically
//   skipWaiting: true,      // Activate service worker immediately
//   disable: process.env.NODE_ENV === "development", // Disable in dev to avoid caching bugs
// });

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'vwhantfodlkbxrybrbce.supabase.co', 
//         port: '',
//         pathname: '/storage/v1/object/public/**',
//       },
//     ],
//   },

//   typescript: {
//     ignoreBuildErrors: true,
//   },

//   turbopack: {},

//   // Necessary for some PWA setups to avoid hydration issues
//   reactStrictMode: true,
// };

// export default withPWA(nextConfig);






import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vwhantfodlkbxrybrbce.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
};

export default nextConfig;
