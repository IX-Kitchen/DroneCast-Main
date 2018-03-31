let backendHost;

const hostname = window && window.location && window.location.hostname;

if (hostname === '') {
    backendHost = '';
} else {
    backendHost = "http://localhost:8080";
}
backendHost = "http://localhost:8080"
export const BACK_ROOT = backendHost
export const API_ROOT = `${backendHost}/api/`;
export const SOCKET_ROOT = `${backendHost}/`;