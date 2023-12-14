import { SET_ACCESS_TOKEN, REMOVE_ACCESS_TOKEN } from './types';

export const setAccessToken = (token) => ({
  type: SET_ACCESS_TOKEN,
  payload: token,
});

export const removeAccessToken = () => ({
  type: REMOVE_ACCESS_TOKEN,
});