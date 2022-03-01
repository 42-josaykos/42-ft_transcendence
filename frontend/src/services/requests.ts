import axios from 'axios';

// Get
export async function Get(url: string) {
  let response;
  try {
    response = await axios.get(url);
  } catch (e: any) {
    response = e.response;
  }
  console.log(response);
  return response;
}

// Post
export async function Post(url: string, data: any) {
  let response;
  try {
    response = await axios.post(url, data);
  } catch (e: any) {
    response = e.response;
  }
  console.log(response);
  return response;
}

// Patch / Update
export async function Patch(url: string, data: any) {
  let response;
  try {
    response = await axios.patch(url, data);
  } catch (e: any) {
    response = e.response;
  }
  console.log(response);
  return response;
}

// Delete
export async function Delete(url: string) {
  let response;
  try {
    response = await axios.delete(url);
  } catch (e: any) {
    response = e.response;
  }
  console.log(response);
  return response;
}
