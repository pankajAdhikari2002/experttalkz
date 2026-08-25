const fs = require('fs');
const path = require('path');

function walk(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      content = content.replace(/localStorage\.getItem\('token'\)/g, "localStorage.getItem('expertTalkz_auth_token')");
      content = content.replace(/localStorage\.getItem\('user'\)/g, "localStorage.getItem('expertTalkz_active_user')");
      
      content = content.replace(/localStorage\.removeItem\('token'\)/g, "localStorage.removeItem('expertTalkz_auth_token')");
      content = content.replace(/localStorage\.removeItem\('user'\)/g, "localStorage.removeItem('expertTalkz_active_user')");
      
      fs.writeFileSync(fullPath, content);
    }
  });
}

walk('ProjectX/src/pages/Admin');
console.log('Fixed localstorage keys in admin pages');
