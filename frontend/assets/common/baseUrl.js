import { Platform } from 'react-native'


let baseURL = '';

{
    Platform.OS == 'android'
        ? baseURL = 'http://172.34.12.34:4001/api/v1'
        : baseURL = 'http://172.34.12.34:4001/api/v1'
        
}

export default baseURL;