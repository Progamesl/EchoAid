# EchoAid - AI-Powered Emotional Wellness Companion

A React-based web application that helps users track their emotional well-being through AI-powered journaling and sentiment analysis.

## 🌟 Features

- **AI-Powered Journaling**: Write about your day and get instant sentiment analysis
- **Voice Recording**: Record your thoughts and get automatic transcription
- **Emotion Tracking**: Visualize your emotional journey over time
- **Smart Analysis**: Get personalized insights and wellness suggestions
- **Local Storage**: All data is stored locally in your browser
- **Dark/Light Mode**: Toggle between themes for comfortable use
- **Multi-language Support**: English and Spanish interfaces
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EcoAid
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
EcoAid/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── auth/          # Authentication components
│   │   ├── journal/       # Journaling features
│   │   ├── history/       # Emotion tracking
│   │   ├── layout/        # Navigation and layout
│   │   ├── resources/     # Mental health resources
│   │   └── ui/            # Reusable UI components
│   ├── contexts/          # React contexts
│   │   ├── LocalAuthContext.tsx    # Local authentication
│   │   └── ThemeContext.tsx        # Theme and language
│   ├── pages/             # Page components
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   │   ├── aiAnalysis.ts  # Sentiment analysis
│   │   ├── translations.ts # Internationalization
│   │   └── cn.ts          # Utility functions
│   ├── App.tsx            # Main app component
│   └── index.tsx          # App entry point
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Data Storage**: Local Storage (browser)
- **AI Analysis**: Custom sentiment analysis algorithm
- **Routing**: React Router DOM
- **Build Tool**: Create React App

## 📊 Features in Detail

### Journal Dashboard
- Write journal entries with real-time AI analysis
- Voice recording with automatic transcription
- Sentiment analysis with emotion detection
- Personalized wellness suggestions

### Emotion Heatmap
- Visual calendar showing daily emotional states
- Monthly and yearly emotion tracking
- Color-coded sentiment visualization
- Statistical overview of emotional patterns

### Settings & Customization
- Theme switching (light/dark mode)
- Language selection (English/Spanish)
- Data export functionality
- Account management

## 🔧 Development

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Run ESLint

### Local Development

The app uses local storage for data persistence, so no external services are required. All user data, journal entries, and settings are stored in the browser's localStorage.

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first styling
- Lucide for the beautiful icons
- The open-source community for inspiration and tools 