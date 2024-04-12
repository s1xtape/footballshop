import React, {useEffect, useReducer, useState} from "react";
import {useRouter} from "next/router";
import axios from "axios";
import {getError} from "../utils/error";
import Layout from "../components/Layout";
import Select from "react-select";
import cats from "../utils/cats";
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
export default function Catalog(){
    const [iname,setIName] = useState("");
    const [category,setCategory] = useState(null);
    const [subCategory,setSubCategory] = useState(null);
    const [subCategoryes,setSubCategoryes] = useState([]);
    const [panel,setPanel] = useState(0);
    const [pSort,setPSort] = useState(-1);
    const [fsItems, setFCItems] = useState([]);
    const  router = useRouter();
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
                const { data } = await axios.get(`http://127.0.0.1:8080/getitems`);
                if(router.query.category){
                    setCategory({value:router.query.category,label:router.query.category})
                    setFCItems(data.filter(function (item){
                        return item.category === router.query.category;
                    }))
                } else setFCItems(data);
                Dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err){
                Dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
            }
        };
        FetchData();
    }, []);
    const sortHandler = (sType) => {
        setPSort(sType);
        switch (sType){
            case 0:
                setFCItems(fsItems.sort(function (a,b){
                    return a.price - b.price;
                }))
                break;
            case 1:
                setFCItems(fsItems.sort(function (a,b){
                    return b.price - a.price;
                }))
                break;
            case 2:
                setFCItems(fsItems.sort(function (a,b){
                    return new Date(b.createdAt) - new Date(a.createdAt);
                }))
                break;
        }
    }

    const filterHandler = () => {
        const filtered = items.filter(function (item){
            if(!item.name.toLowerCase().includes(iname.toLowerCase())){
                return false
            }
            if(category !== null){
                if(category.value !== item.category){
                    return false;
                }
                if(subCategory !== null){
                    if(subCategory.value !== item.subCategory){
                        return false
                    }
                }
            }
            return true;
        })
        if(pSort !== -1){
            switch (pSort){
                case 0:
                    setFCItems(filtered.sort(function (a,b){
                        return a.price - b.price;
                    }))
                    break;
                case 1:
                    setFCItems(filtered.sort(function (a,b){
                        return b.price - a.price;
                    }))
                    break;
                case 2:
                    setFCItems(filtered.sort(function (a,b){
                        return new Date(b.createdAt) - new Date(a.createdAt);
                    }))
                    break;
            }
        } else {
            setFCItems(filtered);
        }
    }
    const HandleCategory = (selected) => {
        setCategory(selected);
        setSubCategory(null);
        if(selected !== null){
            switch (selected.value){
                case "Футбольна форма":
                    setSubCategoryes(cats.formCats);
                    break;
                case "Футбольне взуття":
                    setSubCategoryes(cats.shoeCats);
                    break;
                case "М'ячі для футболу":
                    setSubCategoryes(cats.ballCats);
                    break;
                case "Воротарське екіпірування":
                    setSubCategoryes(cats.goalCats);
                    break;
                case "Аксесуари та обладнання":
                    setSubCategoryes(cats.equiCats);
                    break;
                case "Фанатська атрибутика":
                    setSubCategoryes(cats.fansCats);
                    break;
                case "Нагородна атрибутика":
                    setSubCategoryes(cats.rewaCats);
                    break;
                default:
                    setSubCategoryes(cats.bagCats);
                    break;
            }
        }
    }
    const HandleSubCategory = (selected) => {
        setSubCategory(selected)
    }
    return(
        <Layout>
            <div className="flex mx-[200px] h-[740px] gap-x-[50px]">
                <div className="w-[300px]">
                    <div className="flex">
                        <button className={"text-xl text-white bg-gray-700 p-2 rounded-l-md w-1/2 hover:bg-gray-600"} onClick={()=>{ if(panel !== 0) setPanel(0)}}>товари</button>
                        <button className="text-xl text-white bg-gray-700 p-2 rounded-r-md w-1/2 hover:bg-gray-600" onClick={()=>{ if(panel !== 1) setPanel(1)}}>Замовлення</button>
                    </div>
                    <div className="text-white text-xl mt-3">Назва товару</div>
                    <div className="flex mt-1">
                        <div className="h-[4px] w-[125px] bg-green-700 rounded-l-2xl"/>
                        <div className="h-[2px] mt-[1px] w-[175px] bg-gray-800 rounded-r-2xl"/>
                    </div>
                    <input value={iname} onChange={(e)=>setIName(e.target.value)} type="text" className="text-white bg-gray-700 focus:ring-0 border-none text-xl w-full mt-2" placeholder="Пошук по назві"/>
                    <div className="text-white text-xl mt-3">Категорія товару</div>
                    <div className="flex mt-1">
                        <div className="h-[4px] w-[155px] bg-green-700 rounded-l-2xl"/>
                        <div className="h-[2px] mt-[1px] w-[145px] bg-gray-800 rounded-r-2xl"/>
                    </div>
                    <Select
                        isClearable
                        onChange={HandleCategory}
                        value={category}
                        options={cats.mainCats}
                        placeholder="Оберіть категорію товара"
                        className="w-full text-xl border-none focus:ring-0 mt-4"
                    />
                    <div className="text-white text-xl mt-3">Підкатегорія товару</div>
                    <div className="flex mt-1">
                        <div className="h-[4px] w-[155px] bg-green-700 rounded-l-2xl"/>
                        <div className="h-[2px] mt-[1px] w-[145px] bg-gray-800 rounded-r-2xl"/>
                    </div>
                    <Select
                        isClearable
                        onChange={HandleSubCategory}
                        value={subCategory}
                        options={subCategoryes}
                        placeholder="Оберіть підкатегорію"
                        className="w-full text-xl border-none focus:ring-0 mt-4"
                    />
                    <button onClick={filterHandler} className="text-xl text-white bg-gray-700 p-2 rounded-md w-full hover:bg-gray-600 mt-4">Знайти</button>
                </div>
                <div className="overflow-y-auto w-full">
                    <div className="flex justify-between">
                        <div className="flex">
                            <div className="text-xl text-white p-2 bg-green-700 rounded-l-md">Сортування</div>
                            {pSort === 0 ? (
                                <button onClick={()=>sortHandler(0)} className="text-xl text-green-500 py-2 px-4 bg-gray-700 hover:text-green-500">Дешеві</button>
                            ):(
                                <button onClick={()=>sortHandler(0)} className="text-xl text-white py-2 px-4 bg-gray-700 hover:text-green-500">Дешеві</button>
                            )}
                            {pSort === 1 ? (
                                <button onClick={()=>sortHandler(1)} className="text-xl text-green-500 py-2 px-4 bg-gray-700 hover:text-green-500">Дорогі</button>
                            ):(
                                <button onClick={()=>sortHandler(1)} className="text-xl text-white py-2 px-4 bg-gray-700 hover:text-green-500">Дорогі</button>
                            )}
                            {pSort === 2 ? (
                                <button onClick={()=>sortHandler(2)} className="text-xl text-green-500 py-2 px-4 bg-gray-700 hover:text-green-500 rounded-r-md">Новинки</button>
                            ):(
                                <button onClick={()=>sortHandler(2)} className="text-xl text-white py-2 px-4 bg-gray-700 hover:text-green-500 rounded-r-md">Новинки</button>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-wrap">
                        {fsItems.length > 0 ? (
                            <>
                                {fsItems.map((item)=>{
                                    return(
                                        <div className="h-[400px] w-[300px] bg-gray-800 border-[1px] border-gray-600 m-4 flex flex-col">
                                            {item.images !== "[]" ? (
                                                <img src={JSON.parse(item.images)[0].url} alt="error load" className="bg-white mt-1 rounded-md mx-[25px] w-[250px] h-[250px]"/>
                                            ):(
                                                <div className="bg-white mt-1 rounded-md mx-[25px] w-[250px] h-[250px]">Зображення відсутне</div>
                                            )}

                                            <span className="text-white font-bold mt-2 mx-[5px] text-xl h-[30px]">{item.brand}</span>
                                            <Link href={`/detailedItem/${item.id}`}>
                                                <button className="text-white font-bold mx-[5px] text-md h-[50px] text-left">{item.name}</button>
                                            </Link>
                                            <span className="text-white font-bold mt-3 ml-[20px] text-xl w-[200px]">{item.price} ₴</span>
                                        </div>
                                    )
                                })}
                            </>
                        ):(
                            <div className="text-white text-3xl">Товари відсутні</div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    )
}