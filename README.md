# Portfolio Website

Personal portfolio website built with vanilla JavaScript, Vite, and modern web technologies.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run preview
```

## 📦 Deployment to GitHub Pages

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Automatic Deployment (Recommended)

The project includes a GitHub Actions workflow that automatically deploys when you push to the `main` branch:

1. Push your changes to the `main` branch
2. GitHub Actions will automatically build and deploy
3. Your site will be available at: `https://<your-username>.github.io/portfolio/`

### Manual Deployment

You can also deploy manually using the deploy script:

```bash
# Install gh-pages package if not already installed
pnpm install

# Build and deploy
pnpm run deploy
```

## ⚙️ Configuration

### Repository Name

If your repository name is different from `portfolio`, update the `base` path in `vite.config.js`:

```javascript
export default defineConfig({
  base: '/your-repo-name/',  // Change this to match your repo name
});
```

### GitHub Pages Settings

After the first deployment:

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Ensure the source is set to **GitHub Actions**
4. Your site will be live at `https://<your-username>.github.io/portfolio/`

## 🛠️ Tech Stack

- **Vite** - Build tool and dev server
- **GSAP** - Animations
- **Three.js** - 3D graphics
- **Lenis** - Smooth scrolling
- **Vanilla Tilt** - Tilt effects

## 📁 Project Structure

```
portfolio/
├── .github/workflows/
│   └── deploy.yml          # GitHub Actions deployment workflow
├── public/                 # Static assets
├── src/
│   ├── js/                # JavaScript modules
│   ├── styles/            # CSS files
│   └── main.js            # Entry point
├── index.html             # Main HTML file
├── package.json           # Dependencies and scripts
└── vite.config.js         # Vite configuration
```

## 📝 License

MIT
