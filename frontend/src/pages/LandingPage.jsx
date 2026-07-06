import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bookmark,
  Search,
  FolderOpen,
  BarChart3,
  Shield,
  Zap,
  ArrowRight,
  Star,
  Globe,
  Heart,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

const features = [
  {
    icon: Bookmark,
    title: 'Save Anything',
    desc: 'Save links from anywhere with automatic title, description, and preview fetching.',
    color: 'from-primary-500 to-primary-600',
  },
  {
    icon: FolderOpen,
    title: 'Organize Smart',
    desc: 'Create collections, add tags, and categorize your bookmarks effortlessly.',
    color: 'from-accent-500 to-accent-600',
  },
  {
    icon: Search,
    title: 'Find Instantly',
    desc: 'Powerful full-text search across titles, descriptions, tags, and URLs.',
    color: 'from-cyan-500 to-cyan-600',
  },
  {
    icon: BarChart3,
    title: 'Track Analytics',
    desc: 'See your most visited links, click counts, and bookmark statistics.',
    color: 'from-amber-500 to-amber-600',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    desc: 'Your bookmarks are encrypted and only accessible by you.',
    color: 'from-rose-500 to-rose-600',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    desc: 'Built with modern tech for blazing fast performance and instant loading.',
    color: 'from-violet-500 to-violet-600',
  },
];

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950 overflow-hidden">
      {/* Navbar */}
      <nav className="relative z-20 flex items-center justify-between px-6 lg:px-12 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
            <Bookmark className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold gradient-text">LinkVault</span>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn-primary text-sm">
              Dashboard <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn-ghost text-sm">Log In</Link>
              <Link to="/register" className="btn-primary text-sm">
                Get Started <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 lg:px-12 pt-16 pb-24 lg:pt-24 lg:pb-32">
        {/* Background elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-primary-400/20 via-accent-400/10 to-transparent rounded-full blur-3xl dark:from-primary-600/10 dark:via-accent-600/5" />
        <div className="absolute top-40 right-10 w-16 h-16 bg-primary-400/30 dark:bg-primary-500/20 rounded-2xl rotate-12 animate-float" />
        <div className="absolute top-60 left-10 w-12 h-12 bg-accent-400/30 dark:bg-accent-500/20 rounded-full animate-float" style={{ animationDelay: '2s' }} />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-medium mb-6">
              <Star className="w-4 h-4 fill-current" />
              Your Smart Bookmark Manager
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-dark-900 dark:text-white mb-6 leading-tight">
              Save, Organize &<br />
              <span className="gradient-text">Discover Your Links</span>
            </h1>

            <p className="text-lg lg:text-xl text-dark-500 dark:text-dark-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Stop losing important links. LinkVault helps you save, organize, and find your bookmarks in seconds with powerful search, collections, and analytics.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to={isAuthenticated ? '/dashboard' : '/register'}
                className="btn-primary !px-8 !py-3.5 text-base shadow-xl shadow-primary-500/30"
              >
                <Zap className="w-5 h-5 mr-2" />
                Start Saving — It's Free
              </Link>
              <a href="#features" className="btn-secondary !px-8 !py-3.5 text-base">
                <Globe className="w-5 h-5 mr-2" />
                Explore Features
              </a>
            </div>
          </motion.div>

          {/* Floating cards */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-16 relative"
          >
            <div className="glass-card p-6 max-w-2xl mx-auto">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-accent-400" />
                </div>
                <div className="flex-1 h-8 bg-dark-100 dark:bg-dark-700 rounded-lg flex items-center px-3">
                  <Search className="w-3.5 h-3.5 text-dark-400 mr-2" />
                  <span className="text-xs text-dark-400">Search your bookmarks...</span>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { title: 'React Documentation', url: 'react.dev', tag: 'Frontend' },
                  { title: 'Tailwind CSS', url: 'tailwindcss.com', tag: 'Design' },
                  { title: 'Node.js Best Practices', url: 'github.com', tag: 'Backend' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.15 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-dark-50 dark:bg-dark-800 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
                      <Bookmark className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-dark-700 dark:text-dark-200 truncate">{item.title}</p>
                      <p className="text-xs text-dark-400 truncate">{item.url}</p>
                    </div>
                    <span className="tag-chip text-[10px]">{item.tag}</span>
                    <Heart className="w-4 h-4 text-dark-300 dark:text-dark-600 group-hover:text-rose-400 transition-colors" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 lg:px-12 py-24 bg-white dark:bg-dark-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-5xl font-bold text-dark-800 dark:text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-dark-500 dark:text-dark-400 max-w-2xl mx-auto">
              Powerful features to help you save, organize, and rediscover your important links.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 hover:shadow-xl transition-all duration-300 group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-dark-800 dark:text-dark-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-dark-500 dark:text-dark-400 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 lg:px-12 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="glass-card p-12 lg:p-16 relative overflow-hidden">
            <div className="absolute inset-0 gradient-bg opacity-5" />
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-bold text-dark-800 dark:text-white mb-4">
                Ready to Organize Your Links?
              </h2>
              <p className="text-lg text-dark-500 dark:text-dark-400 mb-8 max-w-xl mx-auto">
                Join thousands of users who trust LinkVault to manage their bookmarks efficiently.
              </p>
              <Link
                to={isAuthenticated ? '/dashboard' : '/register'}
                className="btn-primary !px-10 !py-4 text-base"
              >
                Get Started for Free <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="px-6 lg:px-12 py-8 border-t border-dark-100 dark:border-dark-800">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Bookmark className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold gradient-text">LinkVault</span>
          </div>
          <p className="text-sm text-dark-400 dark:text-dark-500">
            © {new Date().getFullYear()} LinkVault. Built with ❤️
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
