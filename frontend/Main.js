import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import DrawerNavigator from './Navigators/DrawerNavigator';
import Mains from './Navigators/Main';

import SyncStorage from 'sync-storage'
import { Button } from 'native-base';
import { USER_LOGIN_SUCCESS } from './Redux/constants';

export default function Main() {

    const { userInfo } = useSelector(state => state.user);

    const dispatch = useDispatch()

    const initializeData = () => {
        

        const user = SyncStorage.get('user') || null;
        const token = SyncStorage.get('token') || null;
        console.log(SyncStorage.get('user'))
        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: {
                user,
                token
            }
        })

    }

    useEffect(() => {
        initializeData()
    }, [])

    return (
        <>
            <DrawerNavigator />
        </>
    );
    
}