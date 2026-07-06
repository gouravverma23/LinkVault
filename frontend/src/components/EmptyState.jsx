import { motion } from 'framer-motion';
import { Bookmark } from 'lucide-react';

const EmptyState = ({ title = 'No bookmarks yet', message = 'Start saving your favorite links!', icon: Icon = Bookmark }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="w-20 h-20 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-primary-400" />
      </div>
      <h3 className="text-xl font-semibold text-dark-700 dark:text-dark-200 mb-2">{title}</h3>
      <p className="text-dark-400 dark:text-dark-500 text-center max-w-sm">{message}</p>
    </motion.div>
  );
};

export default EmptyState;
