let backendHost;

const hostname = window && window.location && window.location.hostname;
//TO-DO 
//backendHost = "http://localhost:8080"
backendHost =  `http://${hostname}:8080`
export const BACK_ROOT = backendHost
export const API_ROOT = `${backendHost}/api/`;
export const SOCKET_ROOT = `${backendHost}/`;