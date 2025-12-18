<div align="center">
<img width="1200" height="475" alt="Cafe Kothay Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# Cafe Kothay

**A modern digital menu platform for restaurants and cafes**

[Live Demo](https://cafekothay.netlify.app) • [Report Bug](https://github.com/mahadidev/cafe-kothay/issues) • [Request Feature](https://github.com/mahadidev/cafe-kothay/issues)

</div>

## 📖 About

Cafe Kothay (meaning "Where is the cafe?") is a minimalist, aesthetic digital menu platform designed to help modern restaurants and cafes create, manage, and share their menus with zero friction. This open-source project features a beautiful glassmorphism design and provides a complete solution for digital menu management.

### ✨ Key Features

- **🎨 Beautiful UI**: Modern glassmorphism design with smooth animations
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **🔐 User Authentication**: Secure authentication system with Supabase
- **📊 Dashboard**: Comprehensive analytics and menu management dashboard
- **📋 Menu Management**: Create, edit, and organize menu items with categories
- **📍 Location Services**: Integrated map functionality for restaurant locations
- **📤 QR Code Generation**: Generate QR codes for easy menu sharing
- **🔍 Search & Filter**: Advanced search and category filtering for customers
- **📈 Analytics**: Track menu views and customer engagement

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Glassmorphism design
- **Backend**: Supabase (Authentication & Database)
- **Maps**: Leaflet.js for location services
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **QR Codes**: React QR Code

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mahadidev/cafe-kothay.git
   cd cafe-kothay
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
cafe-kothay/
├── components/           # Reusable UI components
├── views/               # Page components
│   ├── dashboard/       # Owner dashboard
│   ├── landing/         # Landing page
│   ├── profile/         # Public menu view
│   ├── documentation/   # Documentation
│   └── legal/          # Legal pages
├── services/           # Business logic & API calls
├── src/               # Global styles and types
└── public/            # Static assets
```

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Developed by Mahadi Hasan**

This is a non-profit, practice project built for learning purposes and to contribute to the open-source community.

- **Portfolio**: [https://mahadidev.vercel.app](https://mahadidev.vercel.app)
- **GitHub**: [@mahadidev](https://github.com/mahadidev)

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for the amazing backend-as-a-service platform
- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework
- [React](https://reactjs.org) for the powerful UI library
- The open-source community for inspiration and tools

## 🔮 Future Plans

- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Menu templates
- [ ] Social media integration
- [ ] Mobile app (React Native)
- [ ] Table reservation system
- [ ] Online ordering integration

---

<div align="center">

**⭐ Star this repo if it helped you!**

Made with ❤️ for the restaurant community

</div>