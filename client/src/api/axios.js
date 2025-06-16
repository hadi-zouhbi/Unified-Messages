import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true
})

axiosInstance.interceptors.response.use(
    // If success , return it unchanged
    res => res,

    async err => {
        // Keep a copy of the failed request
        const originalRequest = err.config

        // If we have not already retry then retry
        if(err.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                const res = await axios.post("http://localhost:5000/api/auth/refresh-token", {}, {withCredentials: true})

                axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.accessToken}`
                originalRequest.headers["Authorization"] = `Bearer ${res.data.accessToken}`

                // Retrying the original request 
                return axios(originalRequest)
            } catch (refreshErr) {
                return Promise.reject(refreshErr);
            }
        }
        return Promise.reject(err)
    }

)

export default axiosInstance