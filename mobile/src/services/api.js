import axios from 'axios';

/**
 * para funcionar com o emulador do android
 * digitar no terminal
 * adb reverse tcp:PORTA tcp:PORTA
 * Ex:
 * adb reverse tcp:3333 tcp:3333 
 */
const api = axios.create({
    baseURL: 'http://localhost:3333'
});

export default api;