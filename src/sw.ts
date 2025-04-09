/// <reference types="vite-plugin-pwa/client" />

console.log('Custom Service Worker loaded!')

self.addEventListener('install', () => {
  console.log('Service Worker installed')
})

self.addEventListener('activate', () => {
  console.log('Service Worker activated')
})