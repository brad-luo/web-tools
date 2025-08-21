# Web Tools - Useful Online Tools Collection

A collection of essential web development tools built with modern web technologies. This project provides five commonly used tools that developers and designers use daily.

## 🚀 Live Demo

[Deploy your own instance on Vercel](https://vercel.com)

## 🛠️ Tools Included

### 1. URL Encoder/Decoder
- **Encode**: Convert special characters in URLs to percent-encoded equivalents
- **Decode**: Convert percent-encoded characters back to their original form
- **Smart Handling**: Intelligently processes full URLs while preserving protocol and hostname
- **Use Cases**: API endpoints, query parameters, path encoding

### 2. Base64 Converter
- **Encode**: Convert text to Base64 format
- **Decode**: Convert Base64 back to original text
- **Unicode Support**: Handles international characters correctly
- **Use Cases**: Data transmission, embedding binary data in JSON, HTML/CSS image embedding

### 3. JSON Formatter
- **Format**: Beautify JSON with proper indentation
- **Minify**: Remove whitespace for production use
- **Validate**: Check JSON syntax and report errors
- **Customizable**: Adjustable indentation sizes (2, 4, 8 spaces)
- **Use Cases**: API responses, configuration files, data validation

### 4. Text Case Converter
- **Multiple Formats**: UPPERCASE, lowercase, Title Case, camelCase, PascalCase, snake_case, kebab-case
- **Special Cases**: Sentence case, aNtIcAsE, ReVeRsE
- **Batch Conversion**: Convert to all formats at once
- **Use Cases**: Variable naming, content formatting, data normalization

### 5. Color Picker & Converter
- **Visual Picker**: Intuitive color selection interface
- **Format Conversion**: HEX, RGB, HSL, CMYK
- **Color Palette**: Curated selection of popular colors
- **Random Generation**: Generate random colors for inspiration
- **Use Cases**: Web design, CSS development, color scheme creation

## 🏗️ Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/) - React framework with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **Icons**: [Lucide React](https://lucide.dev/) - Beautiful, customizable icons
- **Deployment**: [Vercel](https://vercel.com) - Optimized for Next.js

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/web-tools.git
   cd web-tools
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
web-tools/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles and Tailwind imports
│   ├── layout.tsx               # Root layout component
│   ├── page.tsx                 # Homepage with tool navigation
│   └── tools/                   # Individual tool pages
│       ├── url-encoder/         # URL Encoder/Decoder
│       ├── base64-converter/    # Base64 Converter
│       ├── json-formatter/      # JSON Formatter
│       ├── text-converter/      # Text Case Converter
│       └── color-picker/        # Color Picker & Converter
├── public/                       # Static assets
├── package.json                  # Dependencies and scripts
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── README.md                    # Project documentation
```

## 🎨 Design Features

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Dark Mode Ready**: Easy to implement with Tailwind CSS
- **Component-Based**: Reusable components for easy maintenance

## 🔧 Customization

### Adding New Tools

1. Create a new directory in `app/tools/`
2. Add your tool page component
3. Update the tools array in `app/page.tsx`
4. Add navigation and routing

### Styling

- Modify `tailwind.config.js` for theme customization
- Update `app/globals.css` for custom component styles
- Use the existing design system classes for consistency

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push

### Other Platforms

- **Netlify**: Use `npm run build` and deploy the `out` directory
- **AWS Amplify**: Connect your repository for automatic deployments
- **Traditional Hosting**: Build and upload the static files

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-tool`)
3. Commit your changes (`git commit -m 'Add amazing tool'`)
4. Push to the branch (`git push origin feature/amazing-tool`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) team for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first approach
- [Lucide](https://lucide.dev/) for the beautiful icons
- The open-source community for inspiration and tools

## 📞 Support

If you have any questions or need help:

- Create an issue on GitHub
- Check the documentation in the `/docs` folder
- Review the deployment guide for Vercel

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
