import { defineConfig } from '@playwright/test';

// tests end-to-end: levantan backend y frontend (o reutilizan los que ya estén corriendo)
// requisito: MySQL corriendo, migraciones y seeders aplicados y el .env del backend configurado
export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  // los recorridos comparten datos dentro de cada archivo, así que corren de a uno
  workers: 1,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    baseURL: 'http://localhost:4200',
    channel: 'chrome', // usa el Chrome instalado, no hace falta descargar navegadores
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 900 } } },
    // en celular se repiten los controles de calidad y la navegación del invitado
    { name: 'mobile', use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }, testMatch: /(quality|guest-navigation)\.spec\.ts/ }
  ],
  webServer: [
    {
      command: 'npm start',
      cwd: '../backendDiscoverIt',
      url: 'http://localhost:3000/api/categories',
      reuseExistingServer: true,
      timeout: 60_000
    },
    {
      command: 'pnpm start',
      url: 'http://localhost:4200',
      reuseExistingServer: true,
      timeout: 120_000
    }
  ]
});
