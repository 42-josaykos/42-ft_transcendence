import axios from 'axios';

// Get all users
export async function getAllUsers(url: string) {
  let response;
  try {
    response = await axios.get(url);
  } catch (e: any) {
    response = e.response;
  }
  console.log(response);
  return response;
}

// Get user by login
export async function getUserByUsername(url: string) {
  let response;
  try {
    response = await axios.get(url);
  } catch (e: any) {
    response = e.response;
  }
  console.log(response);
  return response;
}

// Create user
export async function createUser(url: string, create_input: string) {
  const new_user = { username: create_input };
  let response;
  try {
    response = await axios.post(url, new_user);
  } catch (e: any) {
    response = e.response;
  }
  console.log(response);
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
  console.log(response);
  return response;
}

// Delete user
export async function deleteUser(url: string) {
  let response;
  try {
    response = await axios.delete(url);
  } catch (e: any) {
    response = e.response;
  }
  console.log(response);
  return response.data;
}
