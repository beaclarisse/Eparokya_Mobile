import { Platform } from 'react-native'


let baseURL = '';

{
    Platform.OS == 'android'
        ? baseURL = 'http://192.168.1.7:4001/api/v1'
        : baseURL = 'http://192.168.1.1:4001/api/v1'
        
}

export default baseURL;