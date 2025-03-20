# 🎮 Pokedex App

A modern, responsive Pokedex application built with Vue 3, TypeScript, and Vite. This application provides a comprehensive interface for exploring and learning about Pokemon, featuring real-time data fetching, offline capabilities, and a beautiful user interface.

## 🌟 Features

- **Real-time Pokemon Data**: Fetch and display Pokemon information from the PokeAPI
- **Offline Support**: Browse Pokemon data even without internet connection
- **Responsive Design**: Seamless experience across desktop and mobile devices
- **Type Safety**: Built with TypeScript for enhanced development experience
- **Modern UI**: Clean and intuitive interface with smooth animations
- **Search & Filter**: Find Pokemon by name, type, or other attributes
- **Detailed Views**: Comprehensive information about each Pokemon
- **Share Functionality**: Share Pokemon information with others

## 🛠️ Tech Stack

- **Framework**: Vue 3
- **Language**: TypeScript
- **Build Tool**: Vite
- **State Management**: Pinia
- **Router**: Vue Router
- **Styling**: Scoped CSS
- **Testing**: Vitest with Vue Test Utils
- **API**: PokeAPI v2

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/frakxman/pokedex-app.git
   cd pokedex-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🧪 Testing

Run the test suite:
```bash
npm run test
```

## 📁 Project Structure

```
pokedex-app/
├── src/
│   ├── assets/        # Images and static resources
│   ├── components/    # Reusable Vue components
│   ├── interfaces/    # TypeScript interfaces
│   ├── router/        # Vue Router configuration
│   ├── services/      # API and data services
│   ├── stores/        # Pinia state stores
│   └── tests/         # Test files
├── public/            # Static assets
├── cypress/           # E2E test files
└── index.html         # Entry HTML file
```

## 🔧 Configuration

The application can be configured through environment variables:

- `VITE_API_BASE_URL`: Base URL for the PokeAPI
- `VITE_APP_TITLE`: Application title

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [PokeAPI](https://pokeapi.co/) for providing the Pokemon data
- [Vue.js](https://vuejs.org/) team for the amazing framework
- All contributors who have helped shape this project

## 📞 Support

For support, please open an issue in the GitHub repository or contact the maintainers.

---

Made with ❤️ by Frakxman
