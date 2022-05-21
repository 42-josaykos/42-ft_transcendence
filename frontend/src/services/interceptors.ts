import axios from "axios";

const ax = axios.create();
let refresh = false;

ax.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response.status === 401 && !refresh) {
      refresh = true;
      try {
        await ax.get(`/auth/refresh`);
        return ax(err.config);
      } catch (_error: any) {
        if (_error.response && _error.response.data) {
          return Promise.reject(_error.response.data);
        }
        return ax(err.config);
      }
    }
    refresh = false;
    return Promise.reject(err);
  }
);

export default ax;
