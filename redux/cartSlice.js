import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    items: [],
    totalCount: 0,
    totalPrice: 0,
}

export const cartSplice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addCartProduct: {
            reducer: (state, action) => {
                console.log(action.payload);
                console.log(state.items);
                let cartIndex = state.items.findIndex(
                    (item) => {
                        if(item._id !== action.payload._id){
                            return false;
                        }
                        if(action.payload.sSize !== null && item.sSize !== null){
                            if(item.sSize.value !== action.payload.sSize.value){
                                return false;
                            }
                        }
                        if(action.payload.sColor !== null && item.sColor !== null){
                            if(item.sColor.value !== action.payload.sColor.value){
                                return false;
                            }
                        }
                        return true;
                    },
                )
                console.log(cartIndex);
                if (cartIndex >= 0) {
                    state.items[cartIndex].quantity += action.payload.quantity;
                } else {
                    let tempProduct = { ...action.payload, quantity: action.payload.quantity }
                    state.items.push(tempProduct);
                }
            },
        },
        getCartProducts: (state) => {
            return {
                ...state,
            }
        },
        getCartCount: (state) => {
            state.totalCount = state.items.reduce((total, item) => {
                return item.quantity + total;
            }, 0);
        },
        getTotal: (state) => {
            state.totalPrice = state.items.reduce((acc, item) => {
                return acc + item.item.price * item.quantity;
            }, 0)
        },
        increment: (state, action) => {
            let index = state.items.findIndex(
                (item) => {
                    if(item.item._id !== action.payload.itemId){
                        return false;
                    }
                    if(action.payload.sSize !== null && item.sSize !== null){
                        if(item.sSize.value !== action.payload.sSize.value){
                            return false;
                        }
                    }
                    if(action.payload.sColor !== null && item.sColor !== null){
                        if(item.sColor.value !== action.payload.sColor.value){
                            return false;
                        }
                    }
                    return true;
                },
            );
            state.items[index].quantity += 1
        },
        decrement: (state, action) => {
            let index = state.items.findIndex(
                (item) => {
                    if(item.item._id !== action.payload.itemId){
                        return false;
                    }
                    if(action.payload.sSize !== null && item.sSize !== null){
                        if(item.sSize.value !== action.payload.sSize.value){
                            return false;
                        }
                    }
                    if(action.payload.sColor !== null && item.sColor !== null){
                        if(item.sColor.value !== action.payload.sColor.value){
                            return false;
                        }
                    }
                    return true;
                },
            )
            if (state.items[index].quantity <= 1) {
                state.items.splice(index, 1)
            } else {
                state.items[index].quantity -= 1
            }
        },
        clear: (state) => {
            state.items = [];
            state.totalCount = 0;
            state.totalPrice = 0;
        }
    },
})
export const {
    addCartProduct,
    getCartProducts,
    removeCartItem,
    getCartCount,
    getTotal,
    increment,
    decrement,
    clear,
} = cartSplice.actions;
export default cartSplice.reducer;