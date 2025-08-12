# YAPL Website

[![Website](https://img.shields.io/website?url=https%3A%2F%2Fyapl.dev)](https://yapl.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/yapl-lang/yapl?style=social)](https://github.com/yapl-lang/yapl)

The official website for YAPL (Yet Another Prompt Language) - a tiny, composable prompt templating language designed for AI agents.

## 🌟 Features

- **Modern Design**: Clean, responsive design with dark mode support
- **Interactive Playground**: Test YAPL templates directly in the browser
- **Comprehensive Examples**: Real-world examples showcasing YAPL features
- **VS Code Integration**: Direct links to the VS Code extension
- **Performance Optimized**: Fast loading with minimal dependencies

## 🚀 Quick Start

The website is a static HTML file that can be served from any web server:

```bash
# Clone the repository
git clone https://github.com/yapl-lang/yapl-website.git
cd yapl-website

# Serve locally (using any static server)
python -m http.server 8000
# or
npx serve .
# or
php -S localhost:8000
```

Visit `http://localhost:8000` to view the website.

## 📁 Project Structure

```
yapl-website/
├── index.html          # Main website file
├── icon.png           # YAPL logo
└── README.md          # This file
```

## 🎨 Design System

The website uses:
- **Colors**: Pink/Rose gradient theme (`#f472b6` to `#ec4899`)
- **Typography**: Inter for text, JetBrains Mono for code
- **Framework**: Tailwind CSS (CDN)
- **Icons**: Custom YAPL logo and VS Code integration

## 🔧 Development

The website is built with vanilla HTML, CSS, and JavaScript for maximum compatibility and performance:

- **No build process required**
- **CDN-based dependencies** (Tailwind CSS, Prism.js)
- **Progressive enhancement** for JavaScript features
- **Mobile-first responsive design**

### Key Components

1. **Hero Section**: Introduction with quick start options
2. **Features Grid**: Core YAPL capabilities
3. **Installation Tabs**: Multiple package manager options
4. **Examples Section**: Interactive code samples
5. **Playground**: Live template rendering
6. **VS Code Integration**: Extension promotion

## 🌐 Deployment

The website can be deployed to any static hosting service:

- **GitHub Pages**: Automatic deployment from repository
- **Netlify**: Drag and drop deployment
- **Vercel**: Git-based deployment
- **Cloudflare Pages**: Fast global CDN

## 📝 Content Updates

To update examples or content:

1. **Examples**: Edit the code blocks in the Examples section
2. **Playground**: Modify the default template and variables
3. **Features**: Update the feature grid cards
4. **Installation**: Add new package managers in the tabs

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test across different browsers
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [YAPL Main Repository](https://github.com/yapl-lang/yapl)
- [VS Code Extension](https://marketplace.visualstudio.com/items?itemName=yapl.yapl-vscode)
- [Documentation](https://yapl.dev)
- [NPM Package](https://www.npmjs.com/package/@yapl/yapl-ts)

---

Made with 💖 and YAPL