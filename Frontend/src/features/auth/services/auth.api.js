import axios from 'axios';

const api=axios.create({
    baseURL:"https://moodify-backend-x14z.onrender.com/api/auth",
    withCredentials:true
})

async function login(identifier,password) {

    try {
        const response = await api.post("/login", { identifier, password });
        return response.data;
        
      } catch (error) {
        throw error.response?.data?.message || "Something went wrong";
      }
    
}

async function register(username,email,password) {
    const response = await api.post('/register',{username,email,password})
    return response.data
}

async function logout() {
    const response = await api.post('/logout')
    return response.data
}

async function getMe(){
    const response = await api.get('/get-me')
    return response.data
}

export const authService={
    login,
    register,
    logout,
    getMe
}