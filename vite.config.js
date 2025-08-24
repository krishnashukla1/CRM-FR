// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// export default defineConfig({
//   base: './', // ✅ Add this for Render deployment
//  plugins: [react(),
//   tailwindcss(),

//   ],
// })


// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import tailwindcss from '@tailwindcss/vite';

// export default defineConfig({
//   base: '/', // ✅ Use '/' for Render or Netlify
//   plugins: [react(), tailwindcss()],
//   server: {
//     // This is only for local dev, still helpful
//     historyApiFallback: true,
//   },
// });


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// ✅ No need to install extra middleware
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    open: true,
    // ✅ This line below automatically handles SPA fallback
    fs: {
      strict: false,
    }
  },
   optimizeDeps: {
    include: ['jwt-decode']
  }
});






