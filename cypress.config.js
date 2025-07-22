import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    // This is the line we are adding.
    // It tells Cypress the address of your application.
    baseUrl: 'http://localhost:5173',
    
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});