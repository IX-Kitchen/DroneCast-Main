let backendHost;

const hostname = window && window.location && window.location.hostname;

if (hostname === 'dronecast.azurewebsites.net') {
    backendHost = 'https://dronecastapi.azurewebsites.net';
} else {
    backendHost = "http://localhost:8080";
}
//backendHost = "https://dronecastapi.azurewebsites.net"
export const BACK_ROOT = backendHost
export const API_ROOT = `${backendHost}/api/`;
export const SOCKET_ROOT = `${backendHost}/clients`;