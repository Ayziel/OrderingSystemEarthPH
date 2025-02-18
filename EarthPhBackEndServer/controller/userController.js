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

  // Destructure the required fields from the request body, including tin
  const { firstName, middleName, lastName, workPhone, phoneNumber, email, team, userName, password, role, address, tin, uid, } = req.body;

  // Validation for required fields
  if (!userName || !password || !role || !firstName || !lastName || !phoneNumber || !workPhone || !email || !team || !address) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  console.log("Validated Fields:", { firstName, middleName, lastName, workPhone, phoneNumber, email, team, userName, password, role, address, tin, uid });

  const newUser = new UserModel({
    firstName,
    middleName,
    lastName,
    workPhone,
    phoneNumber,
    email,
    team,
    userName,
    password,
    role,
    address,
    tin,  // Added tin here
    uid,
    id,
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

// Controller to update an existing user
async function updateUser(req, res) {
  const { userId } = req.params;  // Get the userId from the URL params
  const { firstName, middleName, lastName, workPhone, phoneNumber, email, team, userName, password, role, address, tin, uid } = req.body;

  // Validation for required fields
  if (!userName || !password || !role || !firstName || !lastName || !phoneNumber || !workPhone || !email || !team || !address) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Find the user by ID and update the fields
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,  // Find user by ID
      { firstName, middleName, lastName, workPhone, phoneNumber, email, team, userName, password, role, address, tin, uid },
      { new: true }  // Return the updated user
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Error updating user', error: err });
  }
}


module.exports = { getUsers, createUser, updateUser};
