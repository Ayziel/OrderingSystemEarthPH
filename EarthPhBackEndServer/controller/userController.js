const UserModel = require('../models/userModel');

// Controller to get all users
async function getUsers(req, res) {
  console.log('GET /getUsers route hit');
  
  try {
    const users = await UserModel.find({});
    console.log("Fetched Users:", users);
    res.json({ users });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Error fetching users', error: err });
  }
}

// Controller to create a new user
async function createUser(req, res) {
  console.log('Request Body:', req.body); // Log the incoming data

  // Destructure the required fields from the request body
  const { firstName, middleName, lastName, workPhone, phoneNumber, email, team, userName, password, role } = req.body;

  if (!userName || !password || !role) {
    return res.status(400).json({ message: 'Missing required fields: username, password, or role' });
  }

    let a = 10;
  if (a < 5) { 
    console.log('a is less than 5');
  }


  const newUser = new UserModel({
    firstName,
    middleName,
    lastName,
    workPhone,
    phoneNumber,   // Added phoneNumber field
    email,
    team,
    userName,
    password,
    role
  });

  try {
    // Save the new user to the database
    await newUser.save();
    res.json({ message: 'User created successfully', user: newUser });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Error creating user', error: err });
  }
}

module.exports = { getUsers, createUser };
