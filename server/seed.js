require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Ritual = require('./models/Ritual');
const Pandit = require('./models/Pandit');
const Booking = require('./models/Booking');

const ritualsData = [
  {
    name: 'Satyanarayan Katha',
    description: 'A holy ritual performed to express gratitude to Lord Vishnu, usually done on Purnima (full moon days) or for special occasions like housewarming, marriage, or general prosperity.',
    duration: '2 hours',
    requiredMaterials: [
      'Satyanarayan Photo/Idol',
      'Banana leaves (4)',
      'Flowers and Garlands',
      'Panchamrit (Milk, Curd, Ghee, Honey, Sugar)',
      'Sandalwood paste (Chandan)',
      'Incense sticks (Agarbatti)',
      'Fruits (5 types)',
      'Suji Halwa (Prasad)'
    ],
    basePriceRange: { min: 2000, max: 4000 },
    locationType: 'Both',
    image: 'https://images.unsplash.com/photo-1609137144813-2d216d299496?w=600&auto=format&fit=crop&q=60'
  },
  {
    name: 'Griha Pravesh Puja',
    description: 'A sacred ceremony performed before moving into a new home to purify the environment and protect the house from negative energies.',
    duration: '3 hours',
    requiredMaterials: [
      'Kalash (Brass or Copper)',
      'Coconut (with husk)',
      'Mango leaves',
      'Ganga Jal',
      'Havan Kund & Wood',
      'Red fabric (1 meter)',
      'Ghee (1 kg)',
      'Turmeric & Kumkum'
    ],
    basePriceRange: { min: 4500, max: 8000 },
    locationType: 'Home',
    image: 'https://images.unsplash.com/photo-1561571994-3c61c554181a?w=600&auto=format&fit=crop&q=60'
  },
  {
    name: 'Maha Mrityunjaya Havan',
    description: 'A powerful fire ritual dedicated to Lord Shiva to cure illnesses, ward off evil spirits, ensure longevity, and bring good health.',
    duration: '4 hours',
    requiredMaterials: [
      'Shiva Photo',
      'Mrityunjaya Yantra',
      'Havan Samagri (5kg)',
      'Dry Coconut (Gola)',
      'Sesame seeds (Til)',
      'Camphor (Kapoor)',
      'Ghee (1.5 kg)',
      'Sandalwood chips'
    ],
    basePriceRange: { min: 6000, max: 12000 },
    locationType: 'Both',
    image: 'https://images.unsplash.com/photo-1608925553951-871d3c01579b?w=600&auto=format&fit=crop&q=60'
  },
  {
    name: 'Naamkaran Puja',
    description: 'The naming ceremony of a newborn baby, performed after the initial purification period, wishing the child a healthy and successful life.',
    duration: '2 hours',
    requiredMaterials: [
      'New clothes for the baby',
      'Rice grains (1 kg)',
      'Honey & Gold ring/spoon',
      'Sweets for distribution',
      'Betel leaves and nuts',
      'Flowers'
    ],
    basePriceRange: { min: 2500, max: 4500 },
    locationType: 'Both',
    image: 'https://images.unsplash.com/photo-1621274790572-7c325d6bc67f?w=600&auto=format&fit=crop&q=60'
  },
  {
    name: 'Mundan Sanskar',
    description: 'The ceremony of shaving a child’s hair for the first time, believed to cleanse the child of any past life karma and promote healthy hair growth.',
    duration: '1.5 hours',
    requiredMaterials: [
      'Turmeric paste',
      'Curd & Milk',
      'New clothes',
      'Scissors/Razor (sterilized)',
      'Sweets',
      'Betel leaves'
    ],
    basePriceRange: { min: 2000, max: 3500 },
    locationType: 'Both',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=60'
  },
  {
    name: 'Ganesha Puja',
    description: 'Performed before starting any new venture, business, or education to seek blessings of Lord Ganesha, the remover of all obstacles.',
    duration: '1 hour',
    requiredMaterials: [
      'Ganesha Idol',
      'Durva grass',
      'Modak/Laddus (Prasad)',
      'Red flowers/Hibiscus',
      'Incense and lamp',
      'Coconut'
    ],
    basePriceRange: { min: 1500, max: 3000 },
    locationType: 'Both',
    image: 'https://images.unsplash.com/photo-1567591974573-ef3c6beff97f?w=600&auto=format&fit=crop&q=60'
  }
];

const seedData = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is not defined in environment!');
      process.exit(1);
    }

    console.log('Connecting to database for seeding...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Database connected.');

    // Clear existing data
    console.log('Wiping database collections...');
    await Booking.deleteMany({});
    await Pandit.deleteMany({});
    await Ritual.deleteMany({});
    await User.deleteMany({});
    console.log('Database collections wiped.');

    // Seed Rituals
    console.log('Seeding Rituals...');
    const rituals = await Ritual.insertMany(ritualsData);
    console.log(`Successfully seeded ${rituals.length} Ritual categories.`);

    // Seed Users
    console.log('Seeding Users...');
    
    // Admin
    const adminUser = await User.create({
      name: 'Aditya Raj (Admin)',
      email: 'admin@pujaconnect.com',
      password: 'admin123', // Will be hashed in pre-save
      role: 'admin',
      phone: '9876543210'
    });

    // Customer
    const customerUser = await User.create({
      name: 'Rohan Sharma',
      email: 'customer@gmail.com',
      password: 'user123',
      role: 'customer',
      phone: '9000111222'
    });

    // Pandits
    const panditUser1 = await User.create({
      name: 'Pandit Rajesh Sharma',
      email: 'sharma@pujaconnect.com',
      password: 'pandit123',
      role: 'pandit',
      phone: '9999888877'
    });

    const panditUser2 = await User.create({
      name: 'Acharya Dwarika Shastri',
      email: 'shastri@pujaconnect.com',
      password: 'pandit123',
      role: 'pandit',
      phone: '8888777766'
    });

    const panditUser3 = await User.create({
      name: 'Pandit Vivek Pandey',
      email: 'pandey@pujaconnect.com',
      password: 'pandit123',
      role: 'pandit',
      phone: '7777666655'
    });

    console.log('Users seeded successfully.');

    // Find ritual IDs
    const satyanarayanId = rituals.find(r => r.name === 'Satyanarayan Katha')._id;
    const grihapraveshId = rituals.find(r => r.name === 'Griha Pravesh Puja')._id;
    const havanId = rituals.find(r => r.name === 'Maha Mrityunjaya Havan')._id;
    const naamkaranId = rituals.find(r => r.name === 'Naamkaran Puja')._id;
    const mundanId = rituals.find(r => r.name === 'Mundan Sanskar')._id;
    const ganeshaId = rituals.find(r => r.name === 'Ganesha Puja')._id;

    // Seed Pandit Profiles
    console.log('Seeding Pandit Profiles...');

    // Pandit 1: Rajesh Sharma - Verified, Delhi
    await Pandit.create({
      user: panditUser1._id,
      bio: 'Namaste! I am Pandit Rajesh Sharma, a resident of Delhi, having graduated from Kashi Vidyapeeth with an Acharya degree in Sanskrit Liturgy. I have over 15 years of experience in conducting Griha Pravesh, Satyanarayan, Havan, and weddings with deep astrological accuracy and authentic Vedic chanting.',
      languages: ['Hindi', 'Sanskrit'],
      location: 'Delhi',
      experience: 15,
      rituals: [
        { ritual: satyanarayanId, price: 3100 },
        { ritual: grihapraveshId, price: 5500 },
        { ritual: havanId, price: 6500 },
        { ritual: ganeshaId, price: 2100 }
      ],
      availabilitySlots: [
        { day: 'Monday', slots: ['09:00 AM - 12:00 PM', '03:00 PM - 06:00 PM'] },
        { day: 'Tuesday', slots: ['09:00 AM - 12:00 PM'] },
        { day: 'Wednesday', slots: ['09:00 AM - 12:00 PM', '03:00 PM - 06:00 PM'] },
        { day: 'Thursday', slots: ['09:00 AM - 12:00 PM'] },
        { day: 'Friday', slots: ['09:00 AM - 12:00 PM', '03:00 PM - 06:00 PM'] },
        { day: 'Saturday', slots: ['08:00 AM - 01:00 PM', '04:00 PM - 08:00 PM'] },
        { day: 'Sunday', slots: ['08:00 AM - 01:00 PM', '04:00 PM - 08:00 PM'] }
      ],
      isVerified: 'verified',
      rating: 4.9,
      profilePic: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' // Placeholder/Avatar
    });

    // Pandit 2: Dwarika Shastri - Verified, Varanasi
    await Pandit.create({
      user: panditUser2._id,
      bio: 'Acharya Dwarika Shastri here. Born and bred in the holy land of Varanasi, I have spent 18 years dedicated to sacred religious services. Expert in Maha Mrityunjaya chants, astrological advice, child name matching (Naamkaran), and hair shaving (Mundan) ceremonies. Offering complete ritual explanations so clients feel connected to the devotions.',
      languages: ['Hindi', 'Sanskrit', 'Maithili'],
      location: 'Varanasi',
      experience: 18,
      rituals: [
        { ritual: satyanarayanId, price: 3500 },
        { ritual: havanId, price: 7500 },
        { ritual: naamkaranId, price: 3100 },
        { ritual: mundanId, price: 2500 }
      ],
      availabilitySlots: [
        { day: 'Monday', slots: ['08:00 AM - 11:30 AM', '04:00 PM - 07:30 PM'] },
        { day: 'Tuesday', slots: ['08:00 AM - 11:30 AM', '04:00 PM - 07:30 PM'] },
        { day: 'Wednesday', slots: ['08:00 AM - 11:30 AM'] },
        { day: 'Thursday', slots: ['08:00 AM - 11:30 AM', '04:00 PM - 07:30 PM'] },
        { day: 'Friday', slots: ['08:00 AM - 11:30 AM', '04:00 PM - 07:30 PM'] },
        { day: 'Saturday', slots: ['08:00 AM - 01:00 PM'] },
        { day: 'Sunday', slots: ['08:00 AM - 01:00 PM', '03:00 PM - 07:00 PM'] }
      ],
      isVerified: 'verified',
      rating: 4.8,
      profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    });

    // Pandit 3: Vivek Pandey - Pending, Delhi
    await Pandit.create({
      user: panditUser3._id,
      bio: 'Namaste! I am Pandit Vivek Pandey, practicing Vedic priest with 8 years of active service in North Delhi. Highly experienced in Ganesha Puja, Mundan, and small Havans. Dedicated to providing respectful, tidy, and punctual spiritual support.',
      languages: ['Hindi'],
      location: 'Delhi',
      experience: 8,
      rituals: [
        { ritual: satyanarayanId, price: 2500 },
        { ritual: ganeshaId, price: 1500 }
      ],
      availabilitySlots: [
        { day: 'Saturday', slots: ['09:00 AM - 02:00 PM', '04:00 PM - 08:00 PM'] },
        { day: 'Sunday', slots: ['09:00 AM - 02:00 PM', '04:00 PM - 08:00 PM'] }
      ],
      isVerified: 'pending',
      rating: 4.5,
      profilePic: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150&auto=format&fit=crop&q=80'
    });

    console.log('Pandit profiles seeded.');

    // Seed a couple of sample bookings (one completed, one pending) for Customer
    console.log('Seeding Sample Bookings...');
    const sharmaPandit = await Pandit.findOne({ user: panditUser1._id });
    const shastriPandit = await Pandit.findOne({ user: panditUser2._id });

    // 1. Completed Booking with Sharma
    await Booking.create({
      customer: customerUser._id,
      pandit: sharmaPandit._id,
      ritual: satyanarayanId,
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      timeSlot: '09:00 AM - 12:00 PM',
      address: {
        street: 'Flat 402, Shiv Shakti Apartments, Sector 13',
        city: 'Delhi',
        postalCode: '110085'
      },
      price: 3100,
      status: 'completed',
      notes: 'Please bring extra Ghee. We will keep puja outdoors in balcony.'
    });

    // 2. Pending Booking with Shastri
    await Booking.create({
      customer: customerUser._id,
      pandit: shastriPandit._id,
      ritual: havanId,
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days in future
      timeSlot: '08:00 AM - 11:30 AM',
      address: {
        street: 'House 14, Vishwanath Gali, Dashashwamedh',
        city: 'Varanasi',
        postalCode: '221001'
      },
      price: 7500,
      status: 'pending',
      notes: 'Performed for grandmother health recovery. Please start exactly at muhurat time.'
    });

    console.log('Sample bookings seeded.');
    console.log('\x1b[32m[Database Seeding Complete!]\x1b[0m App data seeded successfully.');
    mongoose.connection.close();
  } catch (error) {
    console.error(`Database seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedData();
