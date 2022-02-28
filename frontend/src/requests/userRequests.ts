import axios from 'axios';

// Get all users
export async function getAllUsers(url: string) {
  let response;
  try {
    response = await axios.get(url);
  } catch (e: any) {
    response = e.response;
  }
  return response.data;
}

// Get user by login
export async function getUserByUsername(url: string, user: any) {
  try {
    user = await axios.get(url);
  } catch (e: any) {
    user = { data: e.response.data.message };
  }
  return user;
}

// Create user
export async function createUser(url: string, create_input: string) {
  const new_user = { username: create_input };
  let response;
  try {
    response = await axios.post(url, new_user);
  } catch (e: any) {
    console.log(e);
    response = e.response;
  }
  return response.data;
}

// Update user data by Id
// Call this function in createUser() if login already exists
export async function updateUser(url: string, update_input: any) {
  let response;
  try {
    response = await axios.patch(url, update_input);
  } catch (e: any) {
    response = e.response;
  }
  return response.data;
}

// Delete user
export async function deleteUser(url: string) {
  let response;
  try {
    response = await axios.delete(url);
  } catch (e: any) {
    response = e.response;
  }
  return response.data;
}
