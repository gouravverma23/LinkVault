import { motion } from 'framer-motion';

const StatsCard = ({ icon: Icon, label, value, color = 'primary', delay = 0 }) => {
  const colorMap = {
    primary: 'from-primary-500 to-primary-600',
    accent: 'from-accent-500 to-accent-600',
    rose: 'from-rose-500 to-rose-600',
    amber: 'from-amber-500 to-amber-600',
  };

  const bgMap = {
    primary: 'bg-primary-50 dark:bg-primary-900/20',
    accent: 'bg-accent-50 dark:bg-accent-900/20',
    rose: 'bg-rose-50 dark:bg-rose-900/20',
    amber: 'bg-amber-50 dark:bg-amber-900/20',
  };

  const iconColorMap = {
    primary: 'text-primary-500',
    accent: 'text-accent-500',
    rose: 'text-rose-500',
    amber: 'text-amber-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="glass-card p-6 hover:shadow-lg transition-shadow duration-300"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-dark-400 dark:text-dark-500 mb-1">{label}</p>
          <p className="text-3xl font-bold text-dark-800 dark:text-dark-100">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl ${bgMap[color]} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${iconColorMap[color]}`} />
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
