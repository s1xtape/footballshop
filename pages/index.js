import Layout from "../components/Layout";
import mainImg from "../public/IndexMainImage.png"
import React, {useEffect, useReducer} from "react";
import suit from "../public/suit.png"
import shoes from "../public/shoes.png"
import balls from "../public/balls.png"
import accesuares from "../public/accesuares.png"
import rewarding from "../public/rewarding.png"
import goalkeeper from "../public/goalkeeper.png"
import fan from "../public/fan.png"
import bag from "../public/bag.png"
import axios from "axios";
import {getError} from "../utils/error";
import Link from "next/link";

function Reduser(State, Action) {
    switch (Action.type) {
        case 'FETCH_REQUEST':
            return { ...State, Loading: true, Error: '' };
        case 'FETCH_SUCCESS':
            return { ...State, Loading: false, items: Action.payload, Error: '' };
        case 'FETCH_FAIL':
            return { ...State, Loading: false, Error: Action.payload };
        default:
            State;
    }
}
export default function Home() {

    const [
        { Loading, Error, items},
        Dispatch,
    ] = useReducer(Reduser, {
        Loading: true,
        items: [],
        Error: '',
    });
    useEffect(() => {
        const FetchData = async () =>{
            try{
                Dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(`/api/items`);
                Dispatch({ type: 'FETCH_SUCCESS', payload: data});
            } catch (err){
                Dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
            }
        };
        FetchData();
    }, []);
    return (
        <Layout>
            <div className="h-full">
                <img src={mainImg.src} alt={mainImg.alt} className="object-contain"/>
                <div className="mx-[200px]">
                    <div className="text-white text-3xl mt-20">Футбольний магазин</div>
                    <div className="flex mt-2">
                        <div className="h-[4px] w-[360px] bg-green-700"/>
                        <div className="h-[2px] mt-[1px] w-full bg-gray-800"/>
                    </div>
                    <div className="flex flex-wrap justify-between gap-x-[20px]">
                        <div className="h-[320px] w-[300px] bg-gray-800 border-[1px] border-gray-600 mt-2 flex flex-col">
                            <img src={suit.src} alt={suit.alt} className="bg-white mt-1 rounded-md mx-[25px] w-[250px] h-[250px]"/>
                            <div className="flex items-center justify-center h-[60px]">
                                <Link href={`/catalog?category=Футбольна форма`}>
                                    <button className="text-white font-bold mt-2 w-full text-center text-xl h-full hover:bg-gray-200 hover:bg-opacity-10">Футбольна форма</button>
                                </Link>
                            </div>
                        </div>
                        <div className="h-[320px] w-[300px] bg-gray-800 border-[1px] border-gray-600 mt-2 flex flex-col">
                            <img src={shoes.src} alt={shoes.alt} className="bg-white mt-1 rounded-md mx-[25px] w-[250px] h-[250px]"/>
                            <div className="flex items-center justify-center h-[60px]">
                                <Link href={`/catalog?category=Футбольне взуття`}>
                                    <button className="text-white font-bold mt-2 w-full text-center text-xl h-full hover:bg-gray-200 hover:bg-opacity-10">Футбольне взуття</button>
                                </Link>
                            </div>
                        </div>
                        <div className="h-[320px] w-[300px] bg-gray-800 border-[1px] border-gray-600 mt-2 flex flex-col">
                            <img src={balls.src} alt={balls.alt} className="bg-white mt-1 rounded-md mx-[25px] w-[250px] h-[250px]"/>
                            <div className="flex items-center justify-center h-[60px]">
                                <Link href={`/catalog?category=М'ячі для футболу`}>
                                    <button className="text-white font-bold mt-2 w-full text-center text-xl h-full hover:bg-gray-200 hover:bg-opacity-10">М'ячі для футболу</button>
                                </Link>
                            </div>
                        </div>
                        <div className="h-[320px] w-[300px] bg-gray-800 border-[1px] border-gray-600 mt-2 flex flex-col">
                            <img src={goalkeeper.src} alt={goalkeeper.alt} className="bg-white mt-1 rounded-md mx-[25px] w-[250px] h-[250px]"/>
                            <div className="flex items-center justify-center h-[60px]">
                                <Link href={`/catalog?category=Воротарське екіпірування`}>
                                    <button className="text-white font-bold mt-2 w-full text-center text-xl h-full hover:bg-gray-200 hover:bg-opacity-10">Воротарське екіпірування</button>
                                </Link>
                            </div>
                        </div>
                        <div className="h-[320px] w-[300px] bg-gray-800 border-[1px] border-gray-600 mt-2 flex flex-col">
                            <img src={accesuares.src} alt={accesuares.alt} className="bg-white mt-1 rounded-md mx-[25px] w-[250px] h-[250px]"/>
                            <div className="flex items-center justify-center h-[60px]">
                                <Link href={`/catalog?category=Аксесуари та обладнання`}>
                                    <button className="text-white font-bold mt-2 w-full text-center text-xl h-full hover:bg-gray-200 hover:bg-opacity-10">Аксесуари та обладнання</button>
                                </Link>
                            </div>
                        </div>
                        <div className="h-[320px] w-[300px] bg-gray-800 border-[1px] border-gray-600 mt-2 flex flex-col">
                            <img src={fan.src} alt={fan.alt} className="bg-white mt-1 rounded-md mx-[25px] w-[250px] h-[250px]"/>
                            <div className="flex items-center justify-center h-[60px]">
                                <Link href={`/catalog?category=Фанатська атрибутика`}>
                                    <button className="text-white font-bold mt-2 w-full text-center text-xl h-full hover:bg-gray-200 hover:bg-opacity-10">Фанатська атрибутика</button>
                                </Link>
                            </div>
                        </div>
                        <div className="h-[320px] w-[300px] bg-gray-800 border-[1px] border-gray-600 mt-2 flex flex-col">
                            <img src={rewarding.src} alt={rewarding.alt} className="bg-white mt-1 rounded-md mx-[25px] w-[250px] h-[250px]"/>
                            <div className="flex items-center justify-center h-[60px]">
                                <Link href={`/catalog?category=Нагородна атрибутика`}>
                                    <button className="text-white font-bold mt-2 w-full text-center text-xl h-full hover:bg-gray-200 hover:bg-opacity-10">Нагородна атрибутика</button>
                                </Link>
                            </div>
                        </div>
                        <div className="h-[320px] w-[300px] bg-gray-800 border-[1px] border-gray-600 mt-2 flex flex-col">
                            <img src={bag.src} alt={bag.alt} className="bg-white mt-1 rounded-md mx-[25px] w-[250px] h-[250px]"/>
                            <div className="flex items-center justify-center h-[60px]">
                                <Link href={`/catalog?category=Сумки спортивні`}>
                                    <button className="text-white font-bold mt-2 w-full text-center text-xl h-full hover:bg-gray-200 hover:bg-opacity-10">Сумки спортивні</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="text-white text-3xl mt-20">Останні надходження</div>
                    <div className="flex mt-2">
                        <div className="h-[4px] w-[380px] bg-green-700"/>
                        <div className="h-[2px] mt-[1px] w-full bg-gray-800"/>
                    </div>
                    <div className="flex overflow-x-auto justify-between">
                        {items.sort(function (a,b){
                            return new Date(b.createdAt) - new Date(a.createdAt);
                        }).slice(0,4).map((item)=>{
                            return(
                                <div className="h-[400px] w-[300px] bg-gray-800 border-[1px] border-gray-600 m-4 flex flex-col">
                                    {item.images !== "[]" ? (
                                        <img src={JSON.parse(item.images)[0].url} alt="error load" className="bg-white mt-1 rounded-md mx-[25px] w-[250px] h-[250px]"/>
                                    ):(
                                        <div className="bg-white mt-1 rounded-md mx-[25px] w-[250px] h-[250px]">Зображення відсутне</div>
                                    )}
                                    <span className="text-white font-bold mt-2 mx-[5px] text-xl h-[30px]">{item.brand}</span>
                                    <Link href={`/detailedItem/${item._id}`}>
                                        <button className="text-white font-bold mx-[5px] text-md h-[50px] text-left">{item.name}</button>
                                    </Link>
                                    <div className="flex justify-between">
                                        <span className="text-white font-bold mt-3 text-xl w-full text-center">{item.price} ₴</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </Layout >
    );
}
