import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Sparkles, BookOpen, Heart, Search, ShieldCheck, ChevronRight, Check } from 'lucide-react';
import logoImg from '../../assets/logo.png';

export const LandingPage = () => {
  const categories = [
    { name: 'Breakfast', emoji: '🍳', desc: 'Energize your day with hearty meals.' },
    { name: 'Lunch', emoji: '🥗', desc: 'Delicious bowls, salads, and meals.' },
    { name: 'Dinner', emoji: '🍝', desc: 'Elegant and comforting plates.' },
    { name: 'Snacks', emoji: '🍿', desc: 'Quick bites for immediate hunger.' },
    { name: 'Desserts', emoji: '🍰', desc: 'Sweet treats for your sweet tooth.' },
    { name: 'Beverages', emoji: '🍹', desc: 'Refreshing cocktails and juices.' }
  ];

  const features = [
    {
      title: 'AI Recipe Generator',
      desc: 'Input whatever ingredients you have left in your fridge, and watch Groq Llama 3.1 AI construct a gourmet recipe instantly.',
      icon: Sparkles,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20'
    },
    {
      title: 'Role-Based Portals',
      desc: 'Distinct dashboards for users to manage cookbooks, and admins to run metrics, moderation, and user databases.',
      icon: ShieldCheck,
      color: 'text-brand-500 bg-brand-50 dark:bg-brand-950/20'
    },
    {
      title: 'Explore & Search',
      desc: 'Browse recipe catalogs by title or category. Find cooking instructions instantly with keyword queries.',
      icon: Search,
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20'
    },
    {
      title: 'Bookmarks & Favorites',
      desc: 'Bookmark and store the meals you love. Instantly log them inside your Favorites drawer for easy lookups.',
      icon: Heart,
      color: 'text-red-500 bg-red-50 dark:bg-red-950/20'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-brand-500 selection:text-white transition-colors duration-200">

      {/* Header / Top Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-darkbg-950/80 backdrop-blur-md border-b border-gray-100 dark:border-darkbg-900 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <img src={logoImg} alt="CookVerse AI Logo" className="w-14 h-14 object-contain" />
            <span className="font-extrabold font-display text-3xl tracking-tight text-gray-900 dark:text-white">
              CookVerse <span className="text-brand-500">AI</span>
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-brand-500 transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="px-5 py-2.5 bg-brand-500 text-white text-sm font-semibold rounded-full hover:bg-brand-600 hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-brand-500/10">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Banner Section */}
      <section className="relative overflow-hidden pt-6 pb-24 md:pt-10 md:pb-32 max-w-7xl mx-auto px-6">
        {/* Dynamic ambient backgrounds */}
        <div className="absolute top-1/4 left-1/4 -translate-y-1/2 -translate-x-1/2 w-72 h-72 bg-brand-200/40 rounded-full blur-[100px] pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-1/4 -translate-y-1/2 translate-x-1/2 w-80 h-80 bg-amber-200/30 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-brand-50 text-brand-600 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse-subtle">
              <Sparkles size={12} />
              <span>Powered by Groq Llama 3.1</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-display leading-[1.1] tracking-tight text-gray-900">
              The Ultimate AI-Powered <br className="hidden md:inline" />
              <span className="text-gradient">Recipe Universe</span>
            </h1>

            <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
              CookVerse AI helps you explore cooking catalogs, compile personal cookbooks, and generate gourmet recipes instantly using remaining ingredients.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-full shadow-lg shadow-brand-500/20 text-center transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center space-x-2 group">
                <span>Join CookVerse Today</span>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/login" className="w-full sm:w-auto px-8 py-4 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold rounded-full text-center transition-all">
                Browse Recipes
              </Link>
            </div>
          </div>

          {/* Hero Graphic Card Mockup */}
          <div className="lg:col-span-5 relative w-full max-w-md mx-auto lg:max-w-none">
            <div className="relative bg-gradient-to-tr from-brand-100 to-amber-100 rounded-[3rem] p-4 shadow-2xl border border-white/60">
              {/* Recipe card mockup */}
              <div className="bg-white rounded-[2rem] overflow-hidden shadow-lg border border-gray-50">
                <img
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800"
                  alt="Delicious Bowl"
                  className="w-full h-52 object-cover"
                />
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full uppercase">Dinner</span>
                    <span className="text-xs text-gray-400">🔥 Generated in 2.3s</span>
                  </div>
                  <h3 className="font-extrabold text-xl text-gray-900">AI Honey Garlic Glazed Salmon</h3>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>⏱ 25 mins</span>
                    <span>•</span>
                    <span className="text-emerald-600 font-semibold uppercase">Easy</span>
                  </div>
                </div>
              </div>

              {/* Floating Widget 1 */}
              <div className="absolute -top-4 -right-4 bg-white p-4 rounded-2xl shadow-lg border border-gray-50 flex items-center space-x-3 max-w-[180px] animate-bounce-subtle">
                <div className="p-2 bg-brand-50 text-brand-500 rounded-lg">
                  <Sparkles size={16} fill="currentColor" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-950">AI Magic</h4>
                  <p className="text-[10px] text-gray-400">Ingredients parsed</p>
                </div>
              </div>

              {/* Floating Widget 2 */}
              <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-2xl shadow-lg border border-gray-50 flex items-center space-x-3 max-w-[180px]">
                <div className="p-2 bg-red-50 text-red-500 rounded-lg">
                  <Heart size={16} fill="currentColor" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-950">Bookmarks</h4>
                  <p className="text-[10px] text-gray-400">Added to Favorites</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20 px-6 border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold font-display text-gray-900 tracking-tight">
              Powerful Features for Culinary Innovators
            </h2>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed">
              Whether you are an aspiring amateur cook or a seasoned kitchen chef, CookVerse AI offers all tools to discover, manage, and scale your recipe collection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:scale-[1.01]">
                  <div className={`p-3.5 rounded-2xl w-fit ${feature.color} mb-6`}>
                    <Icon size={22} className="stroke-[1.5]" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-950 mb-3">{feature.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-3xl font-extrabold font-display text-gray-900">
              Why Choose CookVerse AI?
            </h2>
            <p className="text-gray-500 leading-relaxed text-sm md:text-base">
              Traditional recipes apps are hard to filter and require you to have pre-configured shopping lists. CookVerse AI changes this paradigm by placing Groq Llama 3.1 API directly into your kitchen, letting you construct customized, healthy recipes based strictly on what is currently in your fridge.
            </p>
            <div className="space-y-3.5">
              {[
                'Save time thinking about what to cook tonight',
                'Reduce global household food waste',
                'Discover recipes tailored to dietary category groupings',
                'Upload and moderate manual recipes safely'
              ].map((text, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-brand-50 text-brand-500 flex items-center justify-center rounded-full flex-shrink-0">
                    <Check size={12} className="stroke-[3]" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="bg-gradient-to-tr from-brand-500 to-brand-700 rounded-[3rem] p-8 text-white relative shadow-xl overflow-hidden">
              {/* background vector */}
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-xl" />

              <ChefHat size={60} className="mb-6 stroke-[1.2] opacity-80" />
              <blockquote className="text-lg font-medium leading-relaxed italic">
                "CookVerse AI is a game-changer! I had some paneer, tomato, and onion in my pantry and the AI recipe generated a delicious Paneer Tikka Masala in 5 seconds. It is now my favorite tool in the kitchen!"
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Preview Section */}
      <section className="bg-gray-50 py-20 px-6 border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold font-display tracking-tight text-gray-900">
              Browse Recipes By Category
            </h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Explore culinary masterpieces grouped dynamically into categories.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((cat, i) => (
              <Link
                key={i}
                to={`/login?redirect=/user/categories`}
                className="bg-white rounded-3xl p-6 border border-gray-100 text-center hover:border-brand-500 hover:shadow-md transition-all group hover:-translate-y-1"
              >
                <span className="text-3xl mb-4 block group-hover:scale-110 transition-transform">{cat.emoji}</span>
                <h4 className="font-bold text-gray-900 text-sm group-hover:text-brand-500 transition-colors mb-1">{cat.name}</h4>
                <p className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-6 max-w-5xl mx-auto text-center space-y-8 animate-fade-in">
        <h2 className="text-3xl md:text-4xl font-extrabold font-display tracking-tight text-gray-900">
          Ready to Elevate Your Culinary Experience?
        </h2>
        <p className="text-gray-500 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
          Create a free account today to save custom cookbooks, get AI recipe suggestions, bookmark favorites, and explore a community of food lovers.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-brand-500 text-white font-semibold rounded-full shadow-lg shadow-brand-500/10 hover:bg-brand-600 hover:scale-[1.01] transition-all">
            Get Started Free
          </Link>
          <Link to="/login" className="w-full sm:w-auto px-8 py-4 border border-gray-200 text-gray-700 font-semibold rounded-full hover:bg-gray-50 transition-all">
            Sign In to Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-400">
          <div className="flex items-center space-x-2">
            <img src={logoImg} alt="Logo" className="w-12 h-12 object-contain" />
            <span className="font-bold text-gray-700">CookVerse AI</span>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/login" className="hover:text-brand-500">Terms</Link>
            <Link to="/login" className="hover:text-brand-500">Privacy</Link>
            <Link to="/login" className="hover:text-brand-500">Contact Support</Link>
          </div>
        </div>
      </footer>

    </div>
  );
};
export default LandingPage;
