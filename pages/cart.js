import Layout from "../components/Layout";
import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight,faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {useDispatch, useSelector} from "react-redux";
import {increment, decrement, getCartCount, getTotal, clear} from "../redux/cartSlice";
import Link from "next/link";
import {useForm} from "react-hook-form";
import PhoneInput , {isValidPhoneNumber} from "react-phone-number-input";
import axios from "axios";
import {getError} from "../utils/error";
import {toast} from "react-toastify";
import {useRouter} from "next/router";
export default function Home() {
    
    const cart = useSelector((state) => state.cart);
    const router = useRouter();
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm();
    const submitHandler = async () => {
        if(!isValidPhoneNumber(number)){
            toast.error("Номер телефона введено невірно!")
            return;
        }
        try{
            const items = cart.items;
            const price = cart.totalPrice;
            const shipping = { fullName, email, address, number };
            await axios.post(`http://127.0.0.1:8080/addorder`,{
                items,
                price,
                shipping,
            });
            dispatch(clear());
            toast.success("Замовлення успішно оформлено")
            await router.push("/");
        } catch (err){
            toast.error(getError(err));
        }
    };
    const numberHandler = (e) => {
        setNumber(e)
    }
    const FullNameHandler = (e) => {
        setFullName(e.target.value)
    }
    const AdressHandler = (e) => {
        SetAdress(e)
    }
    const EmailHandler = (e) => {
        SetEmail(e)
    }
   
   
    const dispatch = useDispatch();
    const [number, setNumber] = useState('+380');
    const [fullName, setFullName] = useState('');
    const [email, SetEmail] = useState('');
    const [address, SetAdress] = useState('');
    return (
        
        <Layout>
            <div className="mx-[200px]">
                <div className="text-white text-3xl">Ваш кошик</div>
                <div className="flex mt-1">
                    <div className="h-[4px] w-[655px] bg-green-700 rounded-l-2xl"/>
                    <div className="h-[2px] mt-[1px] w-[890px] bg-gray-800 rounded-r-2xl"/>
                </div>
                <div className="flex">
                    {cart.items.length > 0 ? (
                        <>
                            <div className="border-[1px] m-2 rounded-md w-[1000px]">
                                {cart.items.map((item)=>{
                                    return(
                                        <div key={item.item._id} className="flex m-2">
                                            {item.item.images !== "[]" ? (
                                                <img src={JSON.parse(item.item.images)[0].url} alt="error load" className="bg-white rounded-md w-[150px] h-[150px]"/>
                                            ):(
                                                <div className="bg-white rounded-md w-[150px] h-[150px]">Зображення відсутне</div>
                                            )}
                                            <div className="w-[500px] ml-[10px]">
                                                <Link href={`/detailedItem/${item.item._id}`}>
                                                    <button className="text-white text-2xl truncate w-[400px] text-left">{item.item.name}</button>
                                                </Link>
                                                {item.sSize !== null && (
                                                    <p className="text-white text-xl">- розмір: {item.sSize.value}</p>
                                                )}
                                                {item.sColor !== null && (
                                                    <p className="text-white text-xl">- колір: {item.sColor.value}</p>
                                                )}
                                            </div>
                                            <p className="text-white text-xl w-[120px] my-[50px] p-4">{item.item.price * item.quantity} ₴</p>
                                            <div className="flex bg-gray-700 rounded-[5px] my-[50px] mr-[50px]">
                                                <FontAwesomeIcon
                                                    onClick={() => {
                                                        const obj = {itemId:item.item._id,sSize:item.sSize,sColor:item.sColor}
                                                        dispatch(decrement(obj))
                                                        dispatch(getCartCount())
                                                        dispatch(getTotal())}
                                                    }
                                                    icon={faArrowLeft}
                                                    className="text-white text-xl p-5 hover:bg-gray-600 rounded-[5px]"/>
                                                <span className="text-white text-xl text-center p-4">{item.quantity}</span>
                                                <FontAwesomeIcon
                                                    onClick={() => {
                                                        const obj = {itemId:item.item._id,sSize:item.sSize,sColor:item.sColor}
                                                        dispatch(increment(obj))
                                                        dispatch(getCartCount())
                                                        dispatch(getTotal())}
                                                    }
                                                    icon={faArrowRight}
                                                    className="text-white text-xl p-5 hover:bg-gray-600 rounded-[5px]"/>
                                            </div>
                                        </div>
                                    )
                                })}
                                <div className="flex justify-end bg-gray-700 h-[50px] rounded-b-md">
                                    <p className="text-2xl text-white mr-[20px] mt-[10px]">Загальна вартість: {cart.totalPrice} ₴</p>
                                </div>
                            </div>
                            <div className="m-2">
                                <div className="text-white text-3xl">Оформлення замовлення</div>
                                <div className="flex mt-1">
                                    <div className="h-[4px] w-[400px] bg-green-700 rounded-l-2xl"/>
                                    <div className="h-[2px] mt-[1px] w-[200px] bg-gray-800 rounded-r-2xl"/>
                                </div>
                                <form
                                    onSubmit={handleSubmit(submitHandler)}
                                >
                                    <input
                                        
                                        type="text"
                                        className="text-white bg-gray-700 focus:ring-0 border-none text-xl w-full mt-2 text-center"
                                        placeholder="Ім'я та прізвище отримувача"
                                        onChange={FullNameHandler}
                                        {...register('fullName', {
                                            required: "Введіть ім'я та прізвище отримувача",
                                            pattern: {
                                                value: /[А-ЯІЇЄ][а-яіїє]+ [А-ЯІЇЄ][а-яіїє]+$/i,
                                                message: "Введіть коректне ім'я та прізвище",
                                            },
                                        })}
                                    />
                                    {errors.fullName && (
                                        <div className="text-red-500">{errors.fullName.message}</div>
                                    )}
                                    <PhoneInput
                                        
                                        international={true}
                                        defaultCountry="UA"
                                        value={number}
                                        limitMaxLength={13}
                                        onChange={numberHandler}
                                        className="mt-2"
                                        placeholder='Введіть свій номер телефона для зв`язку'

                                    />
                                    <input
                                        
                                        type="text"
                                        className="text-white bg-gray-700 focus:ring-0 border-none text-xl w-full mt-2 text-center"
                                        placeholder="e-mail"
                                        onChange={EmailHandler}
                                        {...register('email', {
                                            required: 'Введіть пошту',
                                            pattern: {
                                                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                                                message: 'Введіть коректну пошту',
                                            },
                                        })}
                                    />
                                    {errors.email && (
                                        <div className="text-red-500">{errors.email.message}</div>
                                    )}
                                    <input
                                        
                                        type="text"
                                        className="text-white bg-gray-700 focus:ring-0 border-none text-xl w-full mt-2 text-center"
                                        placeholder="Адреса доставки(Приклад: Дніпро, Тітова 1)"
                                        onChange={AdressHandler}
                                        {...register('address', {
                                            required: 'Введіть адресу доставки',
                                            pattern: {
                                                value: /[А-ЯІЇЄ][а-яіїє]+[,] [А-ЯІЇЄ][а-яіїє]+ [0-9]+$/i,
                                                message: 'Введіть коректну адресу',
                                            },
                                        })}
                                    />
                                    {errors.adress && (
                                        <div className="text-red-500">{errors.adress.message}</div>
                                    )}
                                    <button onClick={submitHandler} className="text-xl text-white bg-gray-700 p-2 rounded-md hover:bg-gray-600 mt-4 w-full">Підтвердити замовлення</button>
                                </form>
                            </div>
                        </>
                    ):(
                        <div className="text-center text-2xl text-white w-full">
                            кошик порожній!
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
