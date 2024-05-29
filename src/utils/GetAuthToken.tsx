import { useAppSelector } from '@/store';
// import React from 'react'

const GetAuthToken = () => {
    const token = useAppSelector((state) => state.auth.session.token);
    console.log(token)
  return token
}

export default GetAuthToken