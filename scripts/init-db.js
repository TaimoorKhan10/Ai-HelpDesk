// This script initializes the database with sample data
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    return mongoose.connection;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

// Define models
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    maxlength: [50, 'Name cannot be more than 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const KnowledgeBaseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  content: {
    type: String,
    required: [true, 'Please provide content'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['general', 'technical', 'billing', 'feature', 'faq'],
  },
  tags: {
    type: [String],
    default: [],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create models
const User = mongoose.models.User || mongoose.model('User', UserSchema);
const KnowledgeBase = mongoose.models.KnowledgeBase || mongoose.model('KnowledgeBase', KnowledgeBaseSchema);

// Initialize database with sample data
const initializeDatabase = async () => {
  try {
    // Create admin user
    const adminUser = await User.findOneAndUpdate(
      { email: 'admin@example.com' },
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
      },
      { upsert: true, new: true, setDefaultsOnInsert: true, select: '+password' }
    );

    console.log('Admin user created:', adminUser.email);

    // Create regular user
    const regularUser = await User.findOneAndUpdate(
      { email: 'user@example.com' },
      {
        name: 'Regular User',
        email: 'user@example.com',
        password: 'password123',
        role: 'user',
      },
      { upsert: true, new: true, setDefaultsOnInsert: true, select: '+password' }
    );

    console.log('Regular user created:', regularUser.email);

    // Create knowledge base articles
    const knowledgeBaseArticles = [
      {
        title: 'How to reset your password',
        content: 'To reset your password, click on the "Forgot Password" link on the login page. You will receive an email with instructions to reset your password. Follow the link in the email and enter your new password.',
        category: 'general',
        tags: ['password', 'login', 'account'],
        createdBy: adminUser._id,
      },
      {
        title: 'Billing FAQ',
        content: 'Our billing cycle runs from the 1st to the last day of each month. You will be charged on the 1st day of each month for the upcoming month. If you upgrade or downgrade your plan mid-month, your bill will be prorated accordingly.',
        category: 'billing',
        tags: ['billing', 'payment', 'subscription'],
        createdBy: adminUser._id,
      },
      {
        title: 'Technical troubleshooting guide',
        content: 'If you are experiencing technical issues, please try the following steps:\n1. Clear your browser cache and cookies\n2. Try using a different browser\n3. Check your internet connection\n4. Disable any browser extensions\n5. Restart your computer\n\nIf you are still experiencing issues, please contact our support team.',
        category: 'technical',
        tags: ['troubleshooting', 'technical', 'issues'],
        createdBy: adminUser._id,
      },
    ];

    // Insert knowledge base articles
    for (const article of knowledgeBaseArticles) {
      await KnowledgeBase.findOneAndUpdate(
        { title: article.title },
        article,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log('Knowledge base article created:', article.title);
    }

    console.log('Database initialization complete');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Run the initialization
const run = async () => {
  const db = await connectToDatabase();
  await initializeDatabase();
  await db.close();
  console.log('Database connection closed');
};

run(); 