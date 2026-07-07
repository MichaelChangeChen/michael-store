import axios from 'axios';

axios.defaults.timeout = 60000;
axios.defaults.withCredentials = true;

const resolveBaseUrl = 'https://ps-store-backend-uucr.onrender.com';

const request = axios.create({ baseURL: resolveBaseUrl });
const downloadBlob = axios.create({
	baseURL: resolveBaseUrl,
	responseType: 'blob'
});
const uploadBlob = axios.create({
	baseURL: resolveBaseUrl,
	responseType: 'blob'
});
const requestBlob = axios.create({
	baseURL: resolveBaseUrl,
	responseType: 'blob'
});
const upload = axios.create({
	baseURL: resolveBaseUrl,
	headers: { 'Content-Type': 'multipart/form-data' }
});
const requestMult = axios.create({
	baseURL: resolveBaseUrl,
	headers: { 'Content-Type': 'multipart/form-data' }
});
const loginRequest = axios.create({
	baseURL: resolveBaseUrl,
	headers: { 'Content-Type': 'application/json' }
});

export const getToken = (data) => request.post(`/auth/authToken`, data);
// export const apLogin = (data) => loginRequest.post('/auth/login', data);
export const getCodeImageVerify = () => loginRequest.get('/auth/getCodeImageVerify');
export const logout = () => request.post('/auth/logout', {});

export {
	request,
	downloadBlob,
	uploadBlob,
	requestBlob,
	upload,
	requestMult,
	loginRequest
};
