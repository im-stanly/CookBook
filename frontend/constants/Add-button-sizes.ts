import { Platform } from 'react-native';

export const Sizes = {
    ICON_SIZE: 32,
    TABBAR_HEIGHT: Platform.OS === 'ios' ? 100 : 80,
    ADDBTN_BOTTOM_OFFSET: Platform.OS === 'ios' ? '5%' : '3%',
    ADDBTN_RIGHT_OFFSET: Platform.OS === 'ios' ? '10%' : '10%',
    BTN_SIZE: 75,
    MINI_BTN_SIZE: 60,
    BTN_SPACING: 60 + 15,
    INITIAL_SPACING: 75 + 25,
};