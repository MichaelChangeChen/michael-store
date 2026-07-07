import axios from 'axios';

axios.defaults.timeout = 60000;
axios.defaults.withCredentials = true;

const apiOrigin = (import.meta.env.VITE_API_ORIGIN || 'https://ps-store-backend-uucr.onrender.com').replace(/\/$/, '');

const request = axios.create({
	baseURL: apiOrigin
});

const loginRequest = axios.create({
	baseURL: apiOrigin,
	headers: { 'Content-Type': 'application/json' }
});

const downloadBlob = axios.create({
	baseURL: apiOrigin,
	responseType: 'blob'
});

const uploadBlob = axios.create({
	baseURL: apiOrigin,
	responseType: 'blob'
});

const requestBlob = axios.create({
	baseURL: apiOrigin,
	responseType: 'blob'
});

const upload = axios.create({
	baseURL: apiOrigin,
	headers: { 'Content-Type': 'multipart/form-data' }
});

const requestMult = axios.create({
	baseURL: apiOrigin,
	headers: { 'Content-Type': 'multipart/form-data' }
});

export const getToken = (data) => request.post('/auth/authToken', data);
export const apLogin = (data) => loginRequest.post('/auth/login', data);
export const getCodeImageVerify = () => loginRequest.get('/auth/getCodeImageVerify');
export const logout = () => request.post('/auth/logout', {});

export const getGameList = (params) => request.get('/getGameList', { params });
export const addGame = (data) => request.post('/addGame', data);
export const updateGame = (data) => request.put('/updateGame', data);
export const deleteGame = (uuid) => request.delete(`/deleteGame/${uuid}`);

export {
	request,
	downloadBlob,
	uploadBlob,
	requestBlob,
	upload,
	requestMult,
	loginRequest
};
