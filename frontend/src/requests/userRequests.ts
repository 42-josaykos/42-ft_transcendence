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
      user.value = await axios.get(url);
    } catch (e: any) {
      user.value = { data: e.response.data.message };
    }
    search_input.value = '';
  }
  
// Create user
export async function createUser(url: string) {
    const new_user = { username: create_input.value };
    axios
      .post(url, new_user)
      .then((ret) => {
        data.value.push(ret.data);
        data.value.sort((a: any, b: any) => a.id - b.id);
      })
      .catch((e) => e.response.data);
    create_input.value = '';
  }

// Update user data by Id
// Call this function in createUser() if login already exists
export async function updateUser(id: string, updated_data: string, url: string) {
    axios
      .patch(url + '/' + id, { username: updated_data })
      .then((ret) => {
        const index = data.value.findIndex((el: any) => el.id === +id);
        data.value[index] = { ...data.value[index], ...ret.data };
        data.value.sort((a: any, b: any) => a.id - b.id);
      })
      .catch((e) => e.response.data);
    create_input.value = '';
  }
  
// Delete user
export async function deleteUser(id: number, url: string) {
    axios
      .delete(url + '/' + id.toString())
      .then(() => {
        data.value = data.value.filter((el: any) => el.id !== id);
        data.value.sort((a: any, b: any) => a.id - b.id);
      })
      .catch((e) => e.response.data);
    create_input.value = '';
  }