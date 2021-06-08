import axios from "axios"

const fetch = axios.create({
	baseURL: "api",
})

fetch.interceptors.response.use((res) => {
	return res.data
})

export { fetch }
