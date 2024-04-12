import Layout from "../../components/Layout";
import {useRouter} from "next/router";
import React, {useEffect, useReducer, useState} from "react";
import axios from "axios";
import {getError} from "../../utils/error";
import {Carousel} from "react-responsive-carousel";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight,faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import {useDispatch} from "react-redux";
import { addCartProduct, getCartCount, getTotal } from '../../redux/cartSlice'
import {toast} from "react-toastify";

function Reduser(State, Action) {
    switch (Action.type) {
        case 'FETCH_REQUEST':
            return { ...State, Loading: true, Error: '' };
        case 'FETCH_SUCCESS':
            return { ...State, Loading: false, Error: '' };
        case 'FETCH_FAIL':
            return { ...State, Loading: false, Error: Action.payload };
        default:
            State;
    }
}
export default function detailedItem() {
    const [selectedSize,setSelectedSize] = useState(null);
    const [selectedColor,setSelectedColor] = useState(null);
    const [item, setItem] = useState();
    const [count, setCount] = useState(1);
    const [imagesData,setImagesData] =useState([]);
    const [sizes,setSizes]=useState([]);
    const [colors,setColors] = useState([]);
    const { query } = useRouter();
    const itemId = query.id;
    const dispatch = useDispatch();
    const [
        { Loading, Error},
        Dispatch,
    ] = useReducer(Reduser, {
        Loading: true,
        Error: '',
    });
    useEffect(() => {
        const FetchData = async () =>{
            try{
                Dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(`http://127.0.0.1:8080/tovars/item?itemid=${itemId}`);
                setItem(data);
                if(data.images !== "[]"){
                    setImagesData(JSON.parse(data.images));
                }
                if(data.category === "Футбольна форма" || data.category === "Футбольне взуття"){
                    const sizeArray =  data.sizes.split(',');
                    const colorArray = data.color.split(',');
                    const stopush = [];
                    const ctopush = [];
                    sizeArray.map((size)=>{
                        stopush.push({value:size,label:size})
                    })
                    colorArray.map((color)=>{
                        ctopush.push({value:color,label:color})
                    })
                    setSizes(stopush);
                    setColors(ctopush);
                }
                if(data.category === "Воротарське екіпірування"){
                    const sizeArray =  data.sizes.split(',');
                    const stopush = [];
                    sizeArray.map((size)=>{
                        stopush.push({value:size,label:size})
                    })
                    setSizes(stopush);
                }
                if(data.category === "Сумки спортивні"){
                    const colorArray = data.color.split(',');
                    const ctopush = [];
                    colorArray.map((color)=>{
                        ctopush.push({value:color,label:color})
                    })
                    setColors(ctopush);
                }
                Dispatch({ type: 'FETCH_SUCCESS'});
            } catch (err){
                Dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
            }
        };
        FetchData();
    }, [itemId]);
    const sizeHandler = (selected) =>{
        setSelectedSize(selected)
    }
    const colorHandler = (selected) =>{
        setSelectedColor(selected)
    }
    return(
        <Layout>
            <div className="mx-[200px]">
                {Loading ? (
                    <div className="text-2xl text-white text-center">Завантаження</div>
                ):(
                    <>
                        <div className="text-white text-3xl">{item?.name}</div>
                        <div className="flex mt-1">
                            <div className="h-[4px] w-[655px] bg-green-700 rounded-l-2xl"/>
                            <div className="h-[2px] mt-[1px] w-[890px] bg-gray-800 rounded-r-2xl"/>
                        </div>
                        <div className="flex mt-[10px]">
                            <Carousel infiniteLoop autoPlay showThumbs={false} showStatus={false} interval={5000} className="ml-[px] rounded-2xl w-[600px]">
                                {imagesData.map(img => {
                                    return(
                                        <div key={img.public_id} className="rounded-2xl h-full">
                                            <img src={img.url} className="rounded-2xl w-full object-contain"/>
                                        </div>
                                    )
                                })}
                            </Carousel>
                            <div className="w-full">
                                <div className="border-[1px] border-gray-600 m-4">
                                    <div className="flex h-[100px]">
                                        <span className="text-white text-3xl w-full p-4 my-[20px] ml-[50px]">{item?.price} ₴</span>
                                        <div className="flex bg-gray-700 rounded-[5px] my-[20px] mr-[50px]">
                                            <FontAwesomeIcon onClick={()=>{if(count>1) setCount(count-1)}} icon={faArrowLeft} className="text-white text-xl p-5 hover:bg-gray-600 rounded-[5px]"/>
                                            <span className="text-white text-xl text-center p-4">{count}</span>
                                            <FontAwesomeIcon onClick={()=>setCount(count+1)} icon={faArrowRight} className="text-white text-xl p-5 hover:bg-gray-600 rounded-[5px]"/>
                                        </div>
                                        <button
                                            className="bg-green-700 my-[20px] w-[400px] text-white text-xl rounded-[5px] mr-[50px]"
                                            onClick={()=>{
                                                let obj = {item, sSize:selectedSize,sColor:selectedColor,quantity:count};
                                                dispatch(addCartProduct(obj));
                                                dispatch(getCartCount())
                                                dispatch(getTotal())
                                                toast.success("Товар додано до кошика!")
                                            }}
                                        >В кошик {count>1 && `(на ${item?.price * count} ₴)`}</button>
                                    </div>
                                    {(item?.category === "Футбольна форма" || item?.category === "Футбольне взуття" || item?.category === "Воротарське екіпірування") && (
                                        <Select
                                            onChange={sizeHandler}
                                            value={selectedSize}
                                            options={sizes}
                                            placeholder="Оберіть розмір"
                                            className=" text-xl border-none focus:ring-0 m-4"
                                        />
                                    )}
                                    {(item?.category === "Футбольна форма" || item?.category === "Футбольне взуття" || item?.category === "Сумки спортивні") && (
                                        <Select
                                            onChange={colorHandler}
                                            value={selectedColor}
                                            options={colors}
                                            placeholder="Оберіть колір"
                                            className=" text-xl border-none focus:ring-0 m-4"
                                        />
                                    )}

                                </div>
                                <div className="m-4">
                                    <div className="text-white text-3xl">Опис</div>
                                    <div className="flex mt-1">
                                        <div className="h-[4px] w-[200px] bg-green-700 rounded-l-2xl"/>
                                        <div className="h-[2px] mt-[1px] w-[900px] bg-gray-800 rounded-r-2xl"/>
                                    </div>
                                    <p className="whitespace-pre-line text-white">{item?.description}</p>
                                    <div className="flex mt-1">
                                        <div className="h-[2px] mt-[1px] w-[1100px] bg-gray-800 rounded-r-2xl"/>
                                    </div>
                                </div>
                                {item?.category === "Воротарське екіпірування" ? (
                                    <div className="m-4">
                                        <div className="text-white text-3xl">Характеристики</div>
                                        <div className="flex mt-1">
                                            <div className="h-[4px] w-[200px] bg-green-700 rounded-l-2xl"/>
                                            <div className="h-[2px] mt-[1px] w-[900px] bg-gray-800 rounded-r-2xl"/>
                                        </div>
                                        <p className="whitespace-pre-line text-white">Стать: {item?.gender}</p>
                                    </div>
                                ): item?.category === "М'ячі для футболу" ? (
                                    <div className="m-4">
                                        <div className="text-white text-3xl">Характеристики</div>
                                        <div className="flex mt-1">
                                            <div className="h-[4px] w-[200px] bg-green-700 rounded-l-2xl"/>
                                            <div className="h-[2px] mt-[1px] w-[900px] bg-gray-800 rounded-r-2xl"/>
                                        </div>
                                        <p className="whitespace-pre-line text-white">Розмір: {item?.sizes}</p>
                                        <p className="whitespace-pre-line text-white">Колір: {item?.color}</p>
                                        <p className="whitespace-pre-line text-white">Матеріал: {item?.material}</p>
                                        <p className="whitespace-pre-line text-white">Вага: {item?.weight}</p>
                                    </div>
                                ): item?.category === "Футбольне взуття" ? (
                                    <div className="m-4">
                                        <div className="text-white text-3xl">Характеристики</div>
                                        <div className="flex mt-1">
                                            <div className="h-[4px] w-[200px] bg-green-700 rounded-l-2xl"/>
                                            <div className="h-[2px] mt-[1px] w-[900px] bg-gray-800 rounded-r-2xl"/>
                                        </div>
                                        <p className="whitespace-pre-line text-white">Стать: {item?.gender}</p>
                                        <p className="whitespace-pre-line text-white">Тип підошви: {item?.soleType}</p>
                                    </div>
                                ): item?.category === "Футбольна форма" && (
                                    <div className="m-4">
                                        <div className="text-white text-3xl">Характеристики</div>
                                        <div className="flex mt-1">
                                            <div className="h-[4px] w-[200px] bg-green-700 rounded-l-2xl"/>
                                            <div className="h-[2px] mt-[1px] w-[900px] bg-gray-800 rounded-r-2xl"/>
                                        </div>
                                        <p className="whitespace-pre-line text-white">Стать: {item?.gender}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}

            </div>
        </Layout>
    )
}