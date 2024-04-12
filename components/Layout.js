import React, {Fragment, useEffect, useReducer, useState} from 'react';
import Head from "next/head";
import {useSelector} from "react-redux";
import {signOut, useSession} from "next-auth/react";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import logo from "../public/Logo.png";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass, faShoppingBasket, faArrowRight} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import axios from "axios";
import {getError} from "../utils/error";

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
const Layout = ({children}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [filteredItems, setFilteredItems] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [searchOpen, setSearchOpen] = useState(false);
    const count = useSelector((state) => state.cart.totalCount);

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

    const searchHendler = (name) =>{
        setSearchText(name);
        setFilteredItems(items.filter(function (item){
            return item.name.toLowerCase().includes(name.toLowerCase());
        }).slice(0,5));
    }

    return (
        <>
            <Head>
                <title>{'Footballer'}</title>
                <meta name="Football store" content="Footbal equipment" />
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <ToastContainer position="bottom-center" limit={1} />

            <div className="flex flex-col bg-gray-950 min-h-screen justify-between">
            <header className="h-[100px] bg-green-700 flex justify-between">
                <Link href="/">
                    <img src={logo.src} alt={logo.alt} className="object-contain h-[80px] my-[10px] ml-[200px]"/>
                </Link>
                <div className="relative inline-block">
                    <button className="text-xl text-white font-bold bg-gray-800 w-[350px] ml-[80px] mt-[30px] h-[40px] rounded-[5px]" onClick={()=>setIsOpen(!isOpen)}>Категорії</button>
                    {isOpen && (
                        <div className="absolute right-0 mt-2 w-[350px] origin-top-right rounded-md bg-gray-700">
                            <div>
                                <Link href={`/catalog?category=Футбольна форма`}>
                                    <button className="text-xl text-gray-400 w-[340px] flex justify-between p-2 hover:bg-gray-400 hover:text-black ml-[10px] my-[5px] rounded-l-2xl">
                                        <span className="">Футбольна форма</span>
                                        <FontAwesomeIcon icon={faArrowRight} className="mt-[4px]"/>
                                    </button>
                                </Link>
                            </div>
                            <div>
                                <Link href={`/catalog?category=Футбольне взуття`}>
                                    <button className="text-xl text-gray-400 w-[340px] flex justify-between p-2 hover:bg-gray-400 hover:text-black ml-[10px] my-[5px] rounded-l-2xl">
                                        <span>Футбольне взуття</span>
                                        <FontAwesomeIcon icon={faArrowRight} className="mt-[4px]"/>
                                    </button>
                                </Link>
                            </div>
                            <div>
                                <Link href={`/catalog?category=М'ячі для футболу`}>
                                    <button className="text-xl text-gray-400 w-[340px] flex justify-between p-2 hover:bg-gray-400 hover:text-black ml-[10px] my-[5px] rounded-l-2xl">
                                        <span>М'ячі для футболу</span>
                                        <FontAwesomeIcon icon={faArrowRight} className="mt-[4px]"/>
                                    </button>
                                </Link>
                            </div>
                            <div>
                                <Link href={`/catalog?category=Воротарське екіпірування`}>
                                    <button className="text-xl text-gray-400 w-[340px] flex justify-between p-2 hover:bg-gray-400 hover:text-black ml-[10px] my-[5px] rounded-l-2xl">
                                        <span>Воротарське екіпірування</span>
                                        <FontAwesomeIcon icon={faArrowRight} className="mt-[4px]"/>
                                    </button>
                                </Link>
                            </div>
                            <div>
                                <Link href={`/catalog?category=Аксесуари та обладнання`}>
                                    <button className="text-xl text-gray-400 w-[340px] flex justify-between p-2 hover:bg-gray-400 hover:text-black ml-[10px] my-[5px] rounded-l-2xl">
                                        <span>Аксесуари та обладнання</span>
                                        <FontAwesomeIcon icon={faArrowRight} className="mt-[4px]"/>
                                    </button>
                                </Link>
                            </div>
                            <div>
                                <Link href={`/catalog?category=Фанатська атрибутика`}>
                                    <button className="text-xl text-gray-400 w-[340px] flex justify-between p-2 hover:bg-gray-400 ml-[10px] hover:text-black my-[5px] rounded-l-2xl">
                                        <span>Фанатська атрибутика</span>
                                        <FontAwesomeIcon icon={faArrowRight} className="mt-[4px]"/>
                                    </button>
                                </Link>
                            </div>
                            <div>
                                <Link href={`/catalog?category=Нагородна атрибутика`}>
                                    <button className="text-xl text-gray-400 w-[340px] flex justify-between p-2 hover:bg-gray-400 ml-[10px] hover:text-black my-[5px] rounded-l-2xl">
                                        <span>Нагородна атрибутика</span>
                                        <FontAwesomeIcon icon={faArrowRight} className="mt-[4px]"/>
                                    </button>
                                </Link>
                            </div>
                            <div>
                                <Link href={`/catalog?category=Сумки спортивні`}>
                                    <button className="text-xl text-gray-400 w-[340px] flex justify-between p-2 hover:bg-gray-400 ml-[10px] hover:text-black my-[5px] rounded-l-2xl">
                                        <span>Сумки спортивні</span>
                                        <FontAwesomeIcon icon={faArrowRight} className="mt-[4px]"/>
                                    </button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
                <div className="relative inline-block">
                    <div className="flex mt-[30px] w-[500px] bg-gray-800 px-2 rounded-[5px] ml-[200px]">
                        <input type="text" placeholder="пошук" onFocus={()=>setSearchOpen(true)} className="w-full text-center text-xl text-white bg-gray-800 border-none rounded-none focus:ring-0" onChange={(e)=>searchHendler(e.target.value)}/>
                        <FontAwesomeIcon icon={faMagnifyingGlass} className="text-[25px] p-2 text-white"/>
                    </div>
                    {(searchText.length > 3 && searchOpen) && (
                        <div className="absolute right-0 mt-2 w-[500px] origin-top-right rounded-md bg-gray-700">
                            {filteredItems.map((item)=>{
                                return(
                                    <Link href={`/detailedItem/${item._id}`}>
                                        <div className="flex">
                                            {item.images !== "[]" ? (
                                                <img src={JSON.parse(item.images)[0].url} alt="error load" className="bg-white mt-1 rounded-md w-[100px] h-[100px]"/>
                                            ):(
                                                <div className="bg-white mt-1 rounded-md w-[100px] h-[100px]">Зображення відсутне</div>
                                            )}
                                            <button className="text-xl text-gray-400 w-full flex justify-center p-2 hover:bg-gray-400 hover:text-black my-[5px] rounded-2xl">
                                                <span className="">{item.name}</span>
                                            </button>
                                            <button className="text-white font-bold mt-3 text-xl w-full text-center">{item.price} ₴</button>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
                <div className="flex my-[20px] ml-[20px] mr-[200px]">
                    <Link href="/cart">
                        <FontAwesomeIcon icon={faShoppingBasket} className="text-[45px] text-white"/>
                    </Link>
                    <div className="relative right-[15px] bottom-[10px] text-white bg-gray-800 rounded-[40px] h-[30px] p-1">{count}</div>
                </div>
            </header>
            <main className="bg-gray-950">{children}</main>
            <footer className="bg-gray-800">
                <p className="text-center">© 2023 Footballer. Все права защищены.</p>
                <Link href="/admin/adminMain">
                    <button className="text-gray-400 hover:text-white">адміністрування</button>
                </Link>
            </footer>
            </div>
        </>
    );
};

export default Layout;