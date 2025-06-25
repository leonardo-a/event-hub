import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:3333',
})

api.interceptors.request.use(async config => {
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3NzQzNGM3Ny1iNmQ4LTRiZGYtYWU1Ni1iZDEwNjc3ZGZhOWMiLCJuYW1lIjoiTGVvbmFyZG8gTGVhbCIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc1MDgyNDAwNn0.OLWomFoE2cBB9ik2XZ1x5WYaYD3aKGHQXaS0q9woG4k'

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
