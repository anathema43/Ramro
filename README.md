Ramro E-commerce Application
This repository contains the frontend code for Ramro, an e-commerce platform designed to bring authentic local products from Darjeeling, Nepal, and Kalimpong to people living across India, especially those native to the region. The project focuses on a clean, performant, and responsive UI/UX.

🎯 Project Goal
To build a clean, performant, and responsive e-commerce website, focusing on local products from the Himalayan regions, with a delightful user experience.

🧰 Tech Stack
Frontend Framework: React

Build Tool: Vite

Styling: Tailwind CSS (v3.4.4)

State Management: Zustand

Routing: React Router DOM

Icons: Heroicons

Image Hosting: Cloudinary (for product images)

PostCSS Plugins: postcss (v8.4.38), autoprefixer (v10.4.19), @tailwindcss/postcss (for Tailwind CSS v3 integration)

📁 Folder Structure
The project follows a standard React application structure for modularity and maintainability:

ramro-ecommerce-app/
├── public/
│   ├── index.html
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── HeroSection.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProductCard.jsx
│   │   └── Sidebar.jsx
│   ├── pages/
│   │   ├── Cart.jsx
│   │   ├── Home.jsx (This is the Shop/Products page)
│   │   ├── LandingPage.jsx
│   │   └── ProductDetail.jsx
│   ├── store/
│   │   └── cartStore.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js

🚀 Setup & Running the Application
Follow these steps to get the Ramro e-commerce application up and running on your local machine.

Step 1: Create the Project & Install Core Dependencies
Create the project folder:
Open your terminal and navigate to where you want to create your project.

# Create the project directory and navigate into it
mkdir ramro-ecommerce-app
cd ramro-ecommerce-app

Initialize React with Vite:
This command sets up the basic React project structure.

npm create vite@latest . -- --template react

If prompted "Current directory is not empty...", choose "Remove existing files and continue" if you want a clean start.

Install core Node.js dependencies:

npm install

Step 2: Install Additional Libraries
Install React Router for navigation, Zustand for state management, and Heroicons for icons.

npm install react-router-dom zustand @heroicons/react

Step 3: Install and Configure Tailwind CSS
This is a crucial step for styling. We'll install a stable version of Tailwind CSS (v3) and its PostCSS plugins.

Install Tailwind CSS, PostCSS, and Autoprefixer:

npm install -D tailwindcss@3.4.4 postcss@8.4.38 autoprefixer@10.4.19

Initialize Tailwind CSS and PostCSS config files:
This command creates tailwind.config.js and postcss.config.js in your project root.

npx tailwindcss init -p

Troubleshooting npx tailwindcss init -p: If this command fails (e.g., "could not determine executable to run"), it's an environment issue. You'll need to manually create tailwind.config.js and postcss.config.js in your project root with the content provided in Step 5 below.

Step 4: Create Missing Folders & Files
These commands ensure your project has the correct directory structure.

Create component, page, and store folders:

mkdir -p src/components src/pages src/store

Create all necessary .jsx and .js files:

touch src/components/HeroSection.jsx \
      src/components/Navbar.jsx \
      src/components/ProductCard.jsx \
      src/components/Sidebar.jsx \
      src/pages/Cart.jsx \
      src/pages/Home.jsx \
      src/pages/LandingPage.jsx \
      src/pages/ProductDetail.jsx \
      src/store/cartStore.js