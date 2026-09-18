require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
const mongoUri = process.env.MONGODB_URI.replace(/^"|"$/g, '');
mongoose.connect(mongoUri).then(async () => {
  console.log('Connected!');
  const supportSchema = new mongoose.Schema({ name: String });
  const Support = mongoose.model('kindleworks support', supportSchema);
  await new Support({ name: 'Test User' }).save();
  console.log('Saved test doc!');
  process.exit(0);
}).catch(console.error);
