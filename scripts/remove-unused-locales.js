const fs = require('fs');
const path = require('path');

module.exports = async (context) => {
  const { appOutDir } = context;
  const localesDir = path.join(appOutDir, 'locales');
  
  if (fs.existsSync(localesDir)) {
    console.log('Removing unused locale files...');
    
    // Keep only English and Swedish locale files
    const keepLocales = ['en-US.pak', 'sv.pak'];
    
    try {
      const files = fs.readdirSync(localesDir);
      
      files.forEach(file => {
        if (!keepLocales.includes(file)) {
          const filePath = path.join(localesDir, file);
          fs.unlinkSync(filePath);
          console.log(`Removed: ${file}`);
        }
      });
      
      console.log('Locale cleanup completed. Kept:', keepLocales.join(', '));
    } catch (error) {
      console.error('Error removing locale files:', error);
    }
  }
};

