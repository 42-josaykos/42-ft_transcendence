import axios from 'axios';

// Get all users
export async function getAllUsers(url: string, data: any) {
    axios
      .get(url)
      .then((res) => {
        data.value = res?.data;
        data.value.sort((a: any, b: any) => a.id - b.id);
      })
      .catch((e) => e.response.data);
  }
  
// Get user by login
export async function getUserByUsername(url: string, user: any) {
    try {
      user = await axios.get(url);
    } catch (e) {
      user = { data: e.response.data.message };
    }
    return user;
}

// Create user
export async function createUser(url: string, create_input: string, data: any) {
    const new_user = { username: create_input };
    axios
      .post(url, new_user)
      .then((ret) => {
        data.push(ret.data);
        data.sort((a: any, b: any) => a.id - b.id);
      })
      .catch((e) => console.log(e));
  }

// Update user data by Id
// Call this function in createUser() if login already exists
export async function updateUser(id: string, update_input: string, url: string, data: any) {
  console.log("1-url => ", url)
  axios
      .patch(url, { username: update_input })
      .then((ret) => {
        const index = data.findIndex((el: any) => el.id === +id);
        data[index] = { ...data[index], ...ret.data };
        data.sort((a: any, b: any) => a.id - b.id);
      })
      .catch((e) => console.log(e));
  }
  
// Delete user
export async function deleteUser(id: number, url: string) {
    try {
      await axios.delete(url);
    } catch(e) {
      id = -1;
      console.log(e);
    }
    return id;
  }
