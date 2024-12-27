import { config } from "dotenv";
import {dbConnect} from "../config/database.js"
import { User } from "../models/user.model.js";
config();

const seedUsers =
[
    {
      email: 'harsh.yadav@example.com',
      firstName: 'Harsh',
      lastName: 'Yadav',
      password: '123456',
      friends: [],
      friendRequests: [],
      profilePic: 'https://avatar.iran.liara.run/public/boy?username=[Harsh]'
    },
    {
      email: 'harsh.singh@example.com',
      firstName: 'Harsh',
      lastName: 'Singh',
      password: '123456',
      friends: [],
      friendRequests: [],
      profilePic: 'https://avatar.iran.liara.run/public/boy?username=[Harsh]'
    },
    {
      email: 'ankit.mehta@example.com',
      firstName: 'Ankit',
      lastName: 'Mehta',
      password: '123456',
      friends: [],
      friendRequests: [],
      profilePic: 'https://avatar.iran.liara.run/public/boy?username=[Ankit]'
    },
    {
      email: 'shivam.jain@example.com',
      firstName: 'Shivam',
      lastName: 'Jain',
      password: '123456',
      friends: [],
      friendRequests: [],
      profilePic: 'https://avatar.iran.liara.run/public/boy?username=[Shivam]'
    },
    {
      email: 'parth.bajaj@example.com',
      firstName: 'Parth',
      lastName: 'Bajaj',
      password: '123456',
      friends: [],
      friendRequests: [],
      profilePic: 'https://avatar.iran.liara.run/public/boy?username=[Parth]'
    },
    {
      email: 'ankit.rana@example.com',
      firstName: 'Ankit',
      lastName: 'Rana',
      password: '123456',
      friends: [],
      friendRequests: [],
      profilePic: 'https://avatar.iran.liara.run/public/boy?username=[Ankit]'
    },
    {
      email: 'aditya.singh@example.com',
      firstName: 'Aditya',
      lastName: 'Singh',
      password: '123456',
      friends: [],
      friendRequests: [],
      profilePic: 'https://avatar.iran.liara.run/public/boy?username=[Aditya]'
    },
    {
      email: 'arjun.mehta@example.com',
      firstName: 'Arjun',
      lastName: 'Mehta',
      password: '123456',
      friends: [],
      friendRequests: [],
      profilePic: 'https://avatar.iran.liara.run/public/boy?username=[Arjun]'
    },
    {
      email: 'siddharth.rajput@example.com',
      firstName: 'Siddharth',
      lastName: 'Rajput',
      password: '123456',
      friends: [],
      friendRequests: [],
      profilePic: 'https://avatar.iran.liara.run/public/boy?username=[Siddharth]'
    },
    {
      email: 'aarav.singh@example.com',
      firstName: 'Aarav',
      lastName: 'Singh',
      password: '123456',
      friends: [],
      friendRequests: [],
      profilePic: 'https://avatar.iran.liara.run/public/boy?username=[Aarav]'
    },
    {
      email: 'rahul.joshi@example.com',
      firstName: 'Rahul',
      lastName: 'Joshi',
      password: '123456',
      friends: [],
      friendRequests: [],
      profilePic: 'https://avatar.iran.liara.run/public/boy?username=[Rahul]'
    },
    {
      email: 'dhruv.gupta@example.com',
      firstName: 'Dhruv',
      lastName: 'Gupta',
      password: '123456',
      friends: [],
      friendRequests: [],
      profilePic: 'https://avatar.iran.liara.run/public/boy?username=[Dhruv]'
    },
    {
      email: 'rishi.singh@example.com',
      firstName: 'Rishi',
      lastName: 'Singh',
      password: '123456',
      friends: [],
      friendRequests: [],
      profilePic: 'https://avatar.iran.liara.run/public/boy?username=[Rishi]'
    },
    {
      email: 'aditya.gupta@example.com',
      firstName: 'Aditya',
      lastName: 'Gupta',
      password: '123456',
      friends: [],
      friendRequests: [],
      profilePic: 'https://avatar.iran.liara.run/public/boy?username=[Aditya]'
    },
    {
      email: 'arjun.reddy@example.com',
      firstName: 'Arjun',
      lastName: 'Reddy',
      password: '123456',
      friends: [],
      friendRequests: [],
      profilePic: 'https://avatar.iran.liara.run/public/boy?username=[Arjun]'
    },
    {
      email: 'aarav.patel@example.com',
      firstName: 'Aarav',
      lastName: 'Patel',
      password: '123456',
      friends: [],
      friendRequests: [],
      profilePic: 'https://avatar.iran.liara.run/public/boy?username=[Aarav]'
    },
    {
      email: 'vivaan.chauhan@example.com',
      firstName: 'Vivaan',
      lastName: 'Chauhan',
      password: '123456',
      friends: [],
      friendRequests: [],
      profilePic: 'https://avatar.iran.liara.run/public/boy?username=[Vivaan]'
    },
    {
      email: 'siddharth.malhotra@example.com',
      firstName: 'Siddharth',
      lastName: 'Malhotra',
      password: '123456',
      friends: [],
      friendRequests: [],
      profilePic: 'https://avatar.iran.liara.run/public/boy?username=[Siddharth]'
    },
    {
      email: 'harsh.rajput@example.com',
      firstName: 'Harsh',
      lastName: 'Rajput',
      password: '123456',
      friends: [],
      friendRequests: [],
      profilePic: 'https://avatar.iran.liara.run/public/boy?username=[Harsh]'
    },
    {
      email: 'manav.patel@example.com',
      firstName: 'Manav',
      lastName: 'Patel',
      password: '123456',
      friends: [],
      friendRequests: [],
      profilePic: 'https://avatar.iran.liara.run/public/boy?username=[Manav]'
    },
    {
      email: 'naina.verma@example.com',
      firstName: 'Naina',
      lastName: 'Verma',
      password: '123456',
      friends: [],
      friendRequests: [],
      profilePic: 'https://avatar.iran.liara.run/public/boy?username=[Naina]'
    },
    {
      email: 'simran.joshi@example.com',
      firstName: 'Simran',
      lastName: 'Joshi',
      password: '123456',
      friends: [],
      friendRequests: [],
      profilePic: 'https://avatar.iran.liara.run/public/boy?username=[Simran]'
    },
    {
      email: 'sanya.joshi@example.com',
      firstName: 'Sanya',
      lastName: 'Joshi',
      password: '123456',
      friends: [],
      friendRequests: [],
      profilePic: 'https://avatar.iran.liara.run/public/boy?username=[Sanya]'
    },
    {
      email: 'priya.chauhan@example.com',
      firstName: 'Priya',
      lastName: 'Chauhan',
      password: '123456',
      friends: [],
      friendRequests: [],
      profilePic: 'https://avatar.iran.liara.run/public/boy?username=[Priya]'
    },
    {
      email: 'sanya.rana@example.com',
      firstName: 'Sanya',
      lastName: 'Rana',
      password: '123456',
      friends: [],
      friendRequests: [],
      profilePic: 'https://avatar.iran.liara.run/public/boy?username=[Sanya]'
    },
    {
      email: 'simran.malhotra@example.com',
      firstName: 'Simran',
      lastName: 'Malhotra',
      password: '123456',
      friends: [],
      friendRequests: [],
      profilePic: 'https://avatar.iran.liara.run/public/boy?username=[Simran]'
    },
    {
      email: 'pooja.rana@example.com',
      firstName: 'Pooja',
      lastName: 'Rana',
      password: '123456',
      friends: [],
      friendRequests: [],
      profilePic: 'https://avatar.iran.liara.run/public/boy?username=[Pooja]'
    },
    {
      email: 'isha.reddy@example.com',
      firstName: 'Isha',
      lastName: 'Reddy',
      password: '123456',
      friends: [],
      friendRequests: [],
      profilePic: 'https://avatar.iran.liara.run/public/boy?username=[Isha]'
    },
    {
      email: 'isha.bhatt@example.com',
      firstName: 'Isha',
      lastName: 'Bhatt',
      password: '123456',
      friends: [],
      friendRequests: [],
      profilePic: 'https://avatar.iran.liara.run/public/boy?username=[Isha]'
    },
    {
      email: 'pooja.saxena@example.com',
      firstName: 'Pooja',
      lastName: 'Saxena',
      password: '123456',
      friends: [],
      friendRequests: [],
      profilePic: 'https://avatar.iran.liara.run/public/boy?username=[Pooja]'
    },
    {
      email: 'ananya.bhatt@example.com',
      firstName: 'Ananya',
      lastName: 'Bhatt',
      password: '123456',
      friends: [],
      friendRequests: [],
      profilePic: 'https://avatar.iran.liara.run/public/boy?username=[Ananya]'
    },
    {
      email: 'aarohi.singh@example.com',
      firstName: 'Aarohi',
      lastName: 'Singh',
      password: '123456',
      friends: [],
      friendRequests: [],
      profilePic: 'https://avatar.iran.liara.run/public/boy?username=[Aarohi]'
    },
    {
      email: 'aarohi.rajput@example.com',
      firstName: 'Aarohi',
      lastName: 'Rajput',
      password: '123456',
      friends: [],
      friendRequests: [],
      profilePic: 'https://avatar.iran.liara.run/public/boy?username=[Aarohi]'
    },
    {
      email: 'meera.singh@example.com',
      firstName: 'Meera',
      lastName: 'Singh',
      password: '123456',
      friends: [],
      friendRequests: [],
      profilePic: 'https://avatar.iran.liara.run/public/boy?username=[Meera]'
    },
    {
      email: 'isha.joshi@example.com',
      firstName: 'Isha',
      lastName: 'Joshi',
      password: '123456',
      friends: [],
      friendRequests: [],
      profilePic: 'https://avatar.iran.liara.run/public/boy?username=[Isha]'
    },
    {
      email: 'riya.yadav@example.com',
      firstName: 'Riya',
      lastName: 'Yadav',
      password: '123456',
      friends: [],
      friendRequests: [],
      profilePic: 'https://avatar.iran.liara.run/public/boy?username=[Riya]'
    },
    {
      email: 'sanya.gupta@example.com',
      firstName: 'Sanya',
      lastName: 'Gupta',
      password: '123456',
      friends: [],
      friendRequests: [],
      profilePic: 'https://avatar.iran.liara.run/public/boy?username=[Sanya]'
    },
    {
      email: 'vanya.pandey@example.com',
      firstName: 'Vanya',
      lastName: 'Pandey',
      password: '123456',
      friends: [],
      friendRequests: [],
      profilePic: 'https://avatar.iran.liara.run/public/boy?username=[Vanya]'
    },
    {
      email: 'kiara.malhotra@example.com',
      firstName: 'Kiara',
      lastName: 'Malhotra',
      password: '123456',
      friends: [],
      friendRequests: [],
      profilePic: 'https://avatar.iran.liara.run/public/boy?username=[Kiara]'
    },
    {
      email: 'diya.jain@example.com',
      firstName: 'Diya',
      lastName: 'Jain',
      password: '123456',
      friends: [],
      friendRequests: [],
      profilePic: 'https://avatar.iran.liara.run/public/boy?username=[Diya]'
    }
  ]
export const seedDatabase = async () => {
    try {
        await dbConnect();
        await User.insertMany(seedUsers);
        console.log("Database seeded successfully");
    } catch (error) {
        console.error("Error seeding database:", error);
    }
};

// Call the function
// seedDatabase();
