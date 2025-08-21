# Web Tools - Useful Online Tools Collection

A collection of essential web development tools built with modern web technologies. This project provides six commonly used tools that developers and designers use daily, with secure authentication and a beautiful user interface.

## 🚀 Live Demo

[Deploy your own instance on Vercel](https://vercel.com)

## 🔐 Authentication

This application uses **NextAuth.js** with OAuth providers for secure authentication:

- **GitHub OAuth** - Sign in with your GitHub account
- **Google OAuth** - Sign in with your Google account
- **Session Management** - 7-day login sessions with automatic extension
- **Extensible** - Easy to add more OAuth providers

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

### 6. Markdown Editor
- **Live Preview**: Real-time Markdown rendering
- **Formatting Toolbar**: Quick access to common Markdown syntax
- **Export Options**: Download as Markdown (.md) or HTML files
- **Split View**: Side-by-side editor and preview
- **Use Cases**: Documentation, README files, blog posts, note-taking

## 🏗️ Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/) - React framework with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) - Secure authentication for Next.js
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **Icons**: [Lucide React](https://lucide.dev/) - Beautiful, customizable icons
- **Deployment**: [Vercel](https://vercel.com) - Optimized for Next.js

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- GitHub OAuth App (for authentication)
- Google OAuth App (for authentication)

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

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```bash
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-super-secret-key-at-least-32-characters-long
   GITHUB_ID=your-github-client-id
   GITHUB_SECRET=your-github-client-secret
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

   **Generate NEXTAUTH_SECRET:**
   ```bash
   openssl rand -base64 32
   ```

4. **Configure OAuth Applications**
   
   See [`docs/auth-configuration.md`](docs/auth-configuration.md) for detailed setup instructions.

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
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
│   ├── api/auth/[...nextauth]/  # NextAuth.js API routes
│   ├── components/              # Reusable React components
│   │   └── UserHeader.tsx       # User authentication header
│   ├── lib/                     # Utility functions
│   │   └── auth.ts              # Authentication utilities
│   ├── login/                   # Login page
│   ├── tools/                   # Individual tool pages
│   │   ├── url-encoder/         # URL Encoder/Decoder
│   │   ├── base64-converter/    # Base64 Converter
│   │   ├── json-formatter/      # JSON Formatter
│   │   ├── text-converter/      # Text Case Converter
│   │   ├── color-picker/        # Color Picker & Converter
│   │   └── markdown-editor/     # Markdown Editor
│   ├── auth.ts                  # NextAuth.js configuration
│   ├── globals.css              # Global styles and Tailwind imports
│   ├── layout.tsx               # Root layout component
│   ├── page.tsx                 # Homepage with tool navigation
│   └── providers.tsx            # Authentication providers wrapper
├── docs/                         # Documentation
│   ├── auth-configuration.md    # OAuth setup guide
│   ├── vercel-deployment.md     # Original deployment guide
│   └── vercel-deployment-auth.md # Auth deployment guide
├── public/                       # Static assets
├── types/                        # TypeScript type definitions
│   └── next-auth.d.ts           # NextAuth.js type extensions
├── middleware.ts                 # Next.js middleware for auth
├── package.json                  # Dependencies and scripts
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── README.md                    # Project documentation
```

## 🎨 Design Features

- **Secure Authentication**: OAuth integration with GitHub and Google
- **Session Management**: Persistent login with automatic extension
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Modern UI**: Clean, intuitive interface with smooth animations
- **User Experience**: Personalized welcome messages and user avatars
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Component-Based**: Reusable components for easy maintenance

## 🔧 Customization

### Adding New Tools

1. Create a new directory in `app/tools/`
2. Add your tool page component
3. Update the tools array in `app/page.tsx`
4. Add navigation and routing

### Adding OAuth Providers

1. Install the provider package for NextAuth.js
2. Add provider configuration in `app/auth.ts`
3. Update environment variables
4. Add provider button in `app/login/page.tsx`

### Styling

- Modify `tailwind.config.js` for theme customization
- Update `app/globals.css` for custom component styles
- Use the existing design system classes for consistency

## 🚀 Deployment

### Vercel (Recommended)

For detailed deployment instructions with authentication, see [`docs/vercel-deployment-auth.md`](docs/vercel-deployment-auth.md).

**Quick Steps:**

1. **Set up OAuth applications** with your production domain
2. **Configure environment variables** in Vercel dashboard:
   ```
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXTAUTH_SECRET=[generate with: openssl rand -base64 32]
   GITHUB_ID=your-github-client-id
   GITHUB_SECRET=your-github-client-secret
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```
3. **Push your code** to GitHub
4. **Connect repository** to Vercel
5. **Deploy automatically** on every push

### Other Platforms

- **Netlify**: Configure environment variables and use `npm run build`
- **AWS Amplify**: Set up OAuth environment variables and connect repository
- **Traditional Hosting**: Not recommended due to serverless authentication requirements

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
- Review the authentication setup guide: [`docs/auth-configuration.md`](docs/auth-configuration.md)
- Review the deployment guide: [`docs/vercel-deployment-auth.md`](docs/vercel-deployment-auth.md)

## 🔧 Environment Variables

| Variable               | Description                    | Required | Example                                  |
| ---------------------- | ------------------------------ | -------- | ---------------------------------------- |
| `NEXTAUTH_URL`         | Your application URL           | ✅        | `https://your-domain.vercel.app`         |
| `NEXTAUTH_SECRET`      | Secret key for JWT signing     | ✅        | Generated with `openssl rand -base64 32` |
| `GITHUB_ID`            | GitHub OAuth App Client ID     | ✅        | From GitHub Developer Settings           |
| `GITHUB_SECRET`        | GitHub OAuth App Client Secret | ✅        | From GitHub Developer Settings           |
| `GOOGLE_CLIENT_ID`     | Google OAuth Client ID         | ✅        | From Google Cloud Console                |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret     | ✅        | From Google Cloud Console                |

---

**Built with ❤️ using Next.js, TypeScript, NextAuth.js, and Tailwind CSS**
