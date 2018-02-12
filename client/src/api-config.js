let backendHost;

const hostname = window && window.location && window.location.hostname;

if (hostname === 'dronecast.azurewebsites.net') {
    backendHost = 'https://dronecastapi.westeurope.cloudapp.azure.com:8080';
} else {
    backendHost = "http://localhost:8080";
}
backendHost = "http://dronecastapi.westeurope.cloudapp.azure.com:8080"

export const API_ROOT = `${backendHost}/api/`;
export const SOCKET_ROOT = `${backendHost}/clients`;