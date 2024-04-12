import { configureStore} from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import cartSplice from "./cartSlice";
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';

const persistConfig = {
    key: 'root',
    storage,
}
const cartReducer = persistReducer(persistConfig, cartSplice)
export const store = configureStore({
    reducer: {
        cart: cartReducer,
    },
    devTools: true,
    middleware: [thunk]
})

export const persistor = persistStore(store)