// This script tests and fixes MongoDB connection issues
const fs = require('fs');
const mongoose = require('mongoose');
 
// Test MongoDB connection
async function testMongoDBConnection() {
  try {
    console.log('Testing MongoDB connection...');
    await mongoose.connect('mongodb://localhost:27017/helpdesk');
    console.log('✅ MongoDB connection successful!');
    
    // Check if there are any collections
    const collections = await mongoose.connection.db.collections();
    console.log(`Found ${collections.length} collections in the database.`);
    
    if (collections.length > 0) {
      console.log('Collections:');
      for (const collection of collections) {
        console.log(`- ${collection.collectionName}`);
        const count = await collection.countDocuments();
        console.log(`  (${count} documents)`);
      }
    }
    
    await mongoose.connection.close();
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    await mongoose.connection.close();
    return false;
  }
}

// Create or update .env.local file
function updateEnvFile() {
  console.log('Updating environment files...');
  
  const envContent = `MONGODB_URI=mongodb://localhost:27017/helpdesk
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=super-secret-key-for-helpdesk-app
OPENAI_API_KEY=your-openai-api-key`;

  try {
    // Write to .env.local
    fs.writeFileSync('.env.local', envContent);
    console.log('✅ .env.local file updated');
    
    // Also create a regular .env file for redundancy
    fs.writeFileSync('.env', envContent);
    console.log('✅ .env file updated');
    
    return true;
  } catch (error) {
    console.error('❌ Failed to update environment files:', error.message);
    return false;
  }
}

// Check and update next.config.js
function checkNextConfig() {
  try {
    const configPath = './next.config.js';
    let content = fs.readFileSync(configPath, 'utf8');
    
    // Check if env section exists
    if (!content.includes('env:')) {
      console.log('Updating Next.js configuration...');
      
      // Replace the end of the config with our new version
      content = content.replace(
        /};(\s*)module\.exports/,
        `  env: {
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/helpdesk',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'super-secret-key-for-helpdesk-app',
  },
};$1module.exports`
      );
      
      fs.writeFileSync(configPath, content);
      console.log('✅ next.config.js updated with environment variables');
    } else {
      console.log('✅ next.config.js already has environment configuration');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Failed to update Next.js configuration:', error.message);
    return false;
  }
}

// Check and update lib/mongodb.ts
function checkMongoDBLib() {
  try {
    const filePath = './lib/mongodb.ts';
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if the file needs to be updated
    if (content.includes('throw new Error')) {
      console.log('Updating MongoDB connection library...');
      
      // Replace the beginning of the file
      content = content.replace(
        /import mongoose from 'mongoose';(\s*)const MONGODB_URI = process\.env\.MONGODB_URI;(\s*)if \(!MONGODB_URI\) {(\s*).*(\s*).*(\s*).*(\s*)}/,
        `import mongoose from 'mongoose';$1// Use environment variable or fallback to local connection string$1const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/helpdesk';`
      );
      
      fs.writeFileSync(filePath, content);
      console.log('✅ lib/mongodb.ts updated with fallback connection string');
    } else {
      console.log('✅ lib/mongodb.ts already has fallback connection string');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Failed to update MongoDB library:', error.message);
    return false;
  }
}

// Run all checks and fixes
async function runFixes() {
  console.log('=== AI Helpdesk MongoDB Connection Fix ===');
  
  // Update environment files
  updateEnvFile();
  
  // Check Next.js config
  checkNextConfig();
  
  // Check MongoDB library
  checkMongoDBLib();
  
  // Test MongoDB connection after fixes
  const connectionSuccess = await testMongoDBConnection();
  
  if (connectionSuccess) {
    console.log('\n✅ All fixes applied successfully!');
    console.log('\nInstructions:');
    console.log('1. Stop any running Next.js server');
    console.log('2. Run: npm run dev');
    console.log('3. Access the application at: http://localhost:3000');
  } else {
    console.log('\n❌ Some issues remain with the MongoDB connection.');
    console.log('Please ensure your local MongoDB server is running.');
  }
}

// Run the fixes
runFixes(); 
