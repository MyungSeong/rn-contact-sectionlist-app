import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV(/* {
    id: `user-${userId}-storage`,
    path: `${USER_DIRECTORY}/storage`,
    encryptionKey: 'hunter2',
} */);
