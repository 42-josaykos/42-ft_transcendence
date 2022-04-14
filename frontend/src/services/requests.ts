import ax from './interceptors';

// Get
export async function Get(url: string) {
  let response;
  try {
    response = await ax.get(url);
  } catch (e: any) {
    response = e.response;
  }
  return response;
}

// Post
export async function Post(url: string, data: any) {
  let response;
  try {
    response = await ax.post(url, data);
  } catch (e: any) {
    response = e.response;
  }
  return response;
}

// Patch
export async function Patch(url: string, data: any) {
  let response;
  try {
    response = await ax.patch(url, data);
  } catch (e: any) {
    response = e.response;
  }
  return response;
}

// Put
export async function Put(url: string, data: any) {
  let response;
  try {
    response = await ax.put(url, data);
  } catch (e: any) {
    response = e.response;
  }
  return response;
}

// Delete
export async function Delete(url: string) {
  let response;
  try {
    response = await ax.delete(url);
  } catch (e: any) {
    response = e.response;
  }
  return response;
}
