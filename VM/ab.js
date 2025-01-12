const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

// MongoDB connection URI (replace with your actual connection string)
const MONGO_URI ='mongodb+srv://datta:datta1234@tz.rqin8.mongodb.net/?retryWrites=true&w=majority&appName=tz';
console.log(MONGO_URI);

const seedAdminUser = async () => {
    try {
        // Connect to the MongoDB database
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        // Check if an admin user already exists
        const adminExists = await User.findOne({ role: 'Admin' });
        if (!adminExists) {
            const tzId = `TZ25V${Math.floor(100 + Math.random() * 900)}`;
            const password = 'Admin1234'; // Default password for admin
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create a new admin user
            const admin = new User({
                name:"Datta",
                tzId,
                password: hashedPassword,
                branch: 'N/A',
                year: 0,
                phone: '1234567890',
                club: 'AdminClub',
                role: 'Admin',
            });

            await admin.save();
            console.log(`Admin user created: ${tzId}, Password: ${password}`);
        } else {
            console.log('Admin user already exists');
        }
    } catch (error) {
        console.error('Error seeding admin user:', error);
    } finally {
        // Disconnect from the database
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

// Run the function to seed the admin user
seedAdminUser();
