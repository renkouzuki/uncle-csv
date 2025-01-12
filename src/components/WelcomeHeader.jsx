import { motion } from "framer-motion";
import { TableProperties, Sparkles } from "lucide-react";

const WelcomeHeader = () => {
  return (
    <div className="mb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center gap-3 mb-2"
      >
        <TableProperties className="w-8 h-8 text-blue-500" />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
          NotExcel™ Pro Max Plus
        </h1>
        <Sparkles className="w-8 h-8 text-purple-500" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-gray-500 dark:text-gray-400"
      >
        <p className="text-sm">Excel at home: We have Excel at home</p>
        <div className="flex items-center justify-center gap-2 mt-1 text-xs">
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
            Drag n' Drop
          </span>
          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
            Color Magic
          </span>
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">
            CSV Powers
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default WelcomeHeader;
