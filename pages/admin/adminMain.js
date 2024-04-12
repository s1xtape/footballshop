import Layout from "../../components/Layout";
import React, {useEffect, useReducer, useState} from "react";
import Link from "next/link";
import axios from "axios";
import {getError} from "../../utils/error";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDown, faArrowLeft, faArrowRight, faArrowUp, faShoppingBasket} from "@fortawesome/free-solid-svg-icons";
import {toast} from "react-toastify";
import cats from "../../utils/cats";
import Select from "react-select";
import {decrement, getCartCount, getTotal, increment} from "../../redux/cartSlice";

function IReduser(iState, iAction) {
    switch (iAction.type) {
        case 'FETCH_REQUEST':
            return { ...iState, iLoading: true, iError: '' };
        case 'FETCH_SUCCESS':
            return { ...iState, iLoading: false, items: iAction.payload, iError: '' };
        case 'FETCH_FAIL':
            return { ...iState, iLoading: false, iError: iAction.payload };
        case 'UPDATE_REQUEST':
            return { ...iState, iloadingUpdate: true, ierrorUpdate: '' };
        case 'UPDATE_SUCCESS':
            return { ...iState, iloadingUpdate: false, ierrorUpdate: '' };
        case 'UPDATE_FAIL':
            return { ...iState, iloadingUpdate: false, ierrorUpdate: iAction.payload };
        case 'DELETE_REQUEST':
            return { ...iState, iLoadingDelete: true };
        case 'DELETE_SUCCESS':
            return { ...iState, iLoadingDelete: false, iSuccessDelete: true };
        case 'DELETE_FAIL':
            return { ...iState, iLoadingDelete: false };
        case 'DELETE_RESET':
            return { ...iState, iLoadingDelete: false, iSuccessDelete: false };
        default:
            iState;
    }
}
function OReduser(oState, oAction) {
    switch (oAction.type) {
        case 'FETCH_REQUEST':
            return { ...oState, oLoading: true, oError: '' };
        case 'FETCH_SUCCESS':
            return { ...oState, oLoading: false, orders: oAction.payload, oError: '' };
        case 'FETCH_FAIL':
            return { ...oState, oLoading: false, oError: oAction.payload };
        case 'UPDATE_REQUEST':
            return { ...oState, oLoadingUpdate: true, oErrorUpdate: '' };
        case 'UPDATE_SUCCESS':
            return { ...oState, oLoadingUpdate: false, oErrorUpdate: '' };
        case 'UPDATE_FAIL':
            return { ...oState, oLoadingUpdate: false, oErrorUpdate: oAction.payload };
        default:
            oState;
    }
}

export default function Home() {
    const [iname,setIName] = useState("");
    const [status,setStatus] = useState("all");
    const [category,setCategory] = useState(null);
    const [subCategory,setSubCategory] = useState(null);
    const [subCategoryes,setSubCategoryes] = useState([]);
    const [panel,setPanel] = useState(0);
    const [pSort,setPSort] = useState(-1);
    const [oSort,setOSort] = useState(-1);
    const [fsItems, setFCItems] = useState([]);
    const [fsOrders, setFCOrders] = useState([]);
    const [orderDetail,setOrderDetail] = useState("");

    const [
        { iLoading, iError, iloadingUpdate, items, iSuccessDelete},
        iDispatch,
    ] = useReducer(IReduser, {
        iLoading: true,
        items: [],
        iError: '',
    });
    const [
        { oLoading, oError, oLoadingUpdate, orders},
        oDispatch,
    ] = useReducer(OReduser, {
        oLoading: true,
        orders: [],
        oError: '',
    });
    useEffect(() => {
        const FetchData = async () =>{
            try{
                iDispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(`http://127.0.0.1:8080/getitems`);
                setFCItems(data);
                iDispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err){
                iDispatch({ type: 'FETCH_FAIL', payload: getError(err) });
            }
        };
        if(iSuccessDelete) {
            iDispatch({type: 'DELETE_RESET'});
        } else {
            FetchData();
        }
    }, [iloadingUpdate, iSuccessDelete]);

    useEffect(() => {
        const FetchData = async () =>{
            try{
                oDispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(`http://127.0.0.1:8080/getallorders`);
                setFCOrders(data);
                oDispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err){
                oDispatch({ type: 'FETCH_FAIL', payload: getError(err) });
            }
        };
        if(iSuccessDelete) {
            oDispatch({type: 'DELETE_RESET'});
        } else {
            FetchData();
        }
    }, [oLoadingUpdate]);

    const DeleteHandler = async (itemId) => {
        if(!window.confirm('Ви впевнені у видаленні?')){
            return;
        }
        try{
            iDispatch({type: 'DELETE_REQUEST'});
            await axios.delete(`http://127.0.0.1:8080/deleteitem?itemid=${itemId}`);
            iDispatch({type: 'DELETE_SUCCESS'});
            toast.success('Товар було видалено!');
        } catch (err) {
            iDispatch({type: 'DELETE_FAIL'});
            toast.error(getError(err));
        }
    };
    const updateHandler = async(nStat,itemid) =>{
        if(!window.confirm('Ви впевнені у зміні статусу?')){
            return;
        }
        try {
            oDispatch({ type: 'UPDATE_REQUEST' });
            await axios.put(`http://127.0.0.1:8080/updateorder?orderid=${itemid}`, {
                status: nStat,
            });
            oDispatch({ type: 'UPDATE_SUCCESS' });
            toast.success('Заказ оновлено');
        } catch (err) {
            oDispatch({ type: 'UPDATE_FAIL', payload: getError(err) });
            toast.error(getError(err));
        }
    }
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
    const sortOrderHandler = (sType) => {
        setOSort(sType);
        switch (sType){
            case 0:
                setFCOrders(fsOrders.sort(function (a,b){
                    return new Date(b.createdAt) - new Date(a.createdAt);
                }))
                break;
            case 1:
                setFCOrders(fsOrders.sort(function (a,b){
                    return new Date(a.createdAt) - new Date(b.createdAt);
                }))
                break;
        }
    }
    const orderFilter = (stat) =>{
        console.log(stat)
        setStatus(stat);
        const filtered = orders.filter(function (order){
            if(stat !== "all"){
                if(stat !== order.status){
                    return false;
                }
            }
            return true;
        })
        if(oSort !== -1){
            switch (oSort){
                case 0:
                    setFCOrders(filtered.sort(function (a,b){
                        return new Date(b.createdAt) - new Date(a.createdAt);
                    }))
                    break;
                case 1:
                    setFCOrders(filtered.sort(function (a,b){
                        return new Date(a.createdAt) - new Date(b.createdAt);
                    }))
                    break;
            }
        } else {

            setFCOrders(filtered);
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
    return (
        <Layout>
            <div className="flex mx-[200px] h-[740px] gap-x-[50px]">
                <div className="w-[300px]">
                    <div className="flex">
                        <button className={"text-xl text-white bg-gray-700 p-2 rounded-l-md w-1/2 hover:bg-gray-600"} onClick={()=>{ if(panel !== 0) setPanel(0)}}>товари</button>
                        <button className="text-xl text-white bg-gray-700 p-2 rounded-r-md w-1/2 hover:bg-gray-600" onClick={()=>{ if(panel !== 1) setPanel(1)}}>Замовлення</button>
                    </div>
                    {panel === 0 ? (
                        <>
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
                        </>
                    ):(
                        <>
                            <div className="text-white text-xl mt-3">Статус замовлення</div>
                            <div className="flex mt-1">
                                <div className="h-[4px] w-[185px] bg-green-700 rounded-l-2xl"/>
                                <div className="h-[2px] mt-[1px] w-[115px] bg-gray-800 rounded-r-2xl"/>
                            </div>
                            <select
                                onChange={(e)=>orderFilter(e.target.value)}
                                value={status}
                                className="w-full text-xl border-none focus:ring-0 mt-4"
                            >
                                <option value="all">Всі замовлення</option>
                                <option value="Нове замовлення">Нове замовлення</option>
                                <option value="Комплектуєтся">Комплектуєтся</option>
                                <option value="Відправлено">Відправлено</option>
                                <option value="Доставлено">Доставлено</option>
                                <option value="Виконано">Виконано</option>
                                <option value="Скасовано">Скасовано</option>
                            </select>
                        </>
                    )}

                </div>
                <div className="overflow-y-auto w-full">
                    {panel === 0 ? (
                        <>
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
                                <Link href="/admin/addTovar">
                                    <button className="text-xl text-white bg-gray-700 p-2 rounded-md hover:bg-gray-600">Додати новий товар</button>
                                </Link>
                            </div>
                            <div className="flex flex-wrap">
                                {fsItems.length > 0 ? (
                                    <>
                                        {fsItems.map((item)=>{
                                            return(
                                                <div className="h-[400px] w-[300px] bg-gray-800 border-[1px] border-gray-600 flex flex-col">
                                                    {item.images !== "[]" ? (
                                                        <img src={JSON.parse(item.images)[0].url} alt="error load" className="bg-white mt-1 rounded-md mx-[25px] w-[250px] h-[250px]"/>
                                                    ):(
                                                        <div className="bg-white mt-1 rounded-md mx-[25px] w-[250px] h-[250px]">Зображення відсутне</div>
                                                    )}

                                                    <span className="text-white font-bold mt-2 mx-[5px] text-xl h-[30px]">{item.brand}</span>
                                                    <Link href={`/admin/item/${item.id}`}>
                                                        <button className="text-white font-bold mx-[5px] text-md h-[50px] text-left">{item.name}</button>
                                                    </Link>
                                                    <span className="text-white font-bold mt-3 ml-[20px] text-xl w-[200px]">{item.price} ₴</span>
                                                    <button onClick={()=>DeleteHandler(item.id)} className="h-[35px] text-red-200 bg-gray-700 hover:bg-gray-600">Видалити товар</button>
                                                </div>
                                            )
                                        })}
                                    </>
                                ):(
                                    <div className="text-white text-3xl">Товари відсутні</div>
                                )}
                            </div>
                        </>
                    ):(
                        <>
                            <div className="flex">
                                <div className="flex">
                                    <div className="text-xl text-white p-2 bg-green-700 rounded-l-md">Сортування</div>
                                    {oSort === 0 ? (
                                        <button onClick={()=>sortOrderHandler(0)} className="text-xl text-green-500 py-2 px-4 bg-gray-700 hover:text-green-500">Нові</button>
                                    ):(
                                        <button onClick={()=>sortOrderHandler(0)} className="text-xl text-white py-2 px-4 bg-gray-700 hover:text-green-500">Нові</button>
                                    )}
                                    {oSort === 1 ? (
                                        <button onClick={()=>sortOrderHandler(1)} className="text-xl text-green-500 py-2 px-4 bg-gray-700 hover:text-green-500 rounded-r-md">Старі</button>
                                    ):(
                                        <button onClick={()=>sortOrderHandler(1)} className="text-xl text-white py-2 px-4 bg-gray-700 hover:text-green-500 rounded-r-md">Старі</button>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col">
                                {fsOrders.length > 0 ? (
                                    <>
                                        {fsOrders.map((order)=>{
                                            const shipping = JSON.parse(order.shipping);
                                            const oitems = JSON.parse(order.items);
                                            return(
                                                <>
                                                    {order.id === orderDetail ? (
                                                        <div className="bg-gray-800 border-[1px] border-gray-600 mt-4 flex flex-col rounded-md">
                                                            <div className="flex justify-between">
                                                                <span className="text-white font-bold ml-[20px] w-[400px] text-xl">Замовлення: {order.id}</span>
                                                                <span className="text-white font-bold text-xl">від: {new Date(order.createdAt).toLocaleDateString()}</span>
                                                                <span className="text-white font-bold text-xl">статус: {order.status}</span>
                                                                <FontAwesomeIcon onClick={()=>setOrderDetail("")} icon={faArrowUp} className="text-white font-bold mr-[20px] p-1 text-xl"/>
                                                            </div>
                                                            <div className="text-white text-xl mt-2 ml-[20px]">Дані доставки</div>
                                                            <div className="flex mt-1 ml-[20px]">
                                                                <div className="h-[4px] w-[165px] bg-green-700 rounded-l-2xl"/>
                                                                <div className="h-[2px] mt-[1px] w-[1035px] bg-gray-700 rounded-r-2xl"/>
                                                            </div>
                                                            <p className="text-white text-md mt-1 ml-[20px]">Замовник: {shipping.fullName}</p>
                                                            <p className="text-white text-md mt-1 ml-[20px]">Номер: {shipping.number}</p>
                                                            <p className="text-white text-md mt-1 ml-[20px]">E-mail: {shipping.email}</p>
                                                            <p className="text-white text-md mt-1 ml-[20px]">Адреса: {shipping.address}</p>
                                                            <div className="text-white text-xl mt-2 ml-[20px]">Замовлені товари</div>
                                                            <div className="flex mt-1 ml-[20px]">
                                                                <div className="h-[4px] w-[165px] bg-green-700 rounded-l-2xl"/>
                                                                <div className="h-[2px] mt-[1px] w-[1035px] bg-gray-700 rounded-r-2xl"/>
                                                            </div>
                                                            
                                                                
                                                                
                                                                    
                                                                    <div key={oitems.id} className="flex m-2">
                                                                        {oitems.item.images !== "[]" ? (
                                                                            <img src={JSON.parse(oitems.item.images)[0]} alt="error load" className="bg-white rounded-md w-[100px] h-[100px]"/>
                                                                        ):(
                                                                            <div className="bg-white rounded-md w-[100px] h-[100px]">Зображення відсутне</div>
                                                                        )}
                                                                        <div className="w-[700px] ml-[10px]">
                                                                            <Link href={`/detailedItem/${oitems.item.id}`}>
                                                                                <button className="text-white text-2xl truncate w-[700px] text-left">{oitems.item.name}</button>
                                                                            </Link>
                                                                            {oitems.sSize !== null && (
                                                                                <p className="text-white text-xl">- розмір: {oitems.sSize.value}</p>
                                                                            )}
                                                                            {oitems.sColor !== null && (
                                                                                <p className="text-white text-xl">- колір: {oitems.sColor.value}</p>
                                                                            )}
                                                                        </div>
                                                                        <p className="text-white text-xl w-[120px] mt-[25px] p-4">{oitems.item.price * oitems.quantity} ₴</p>
                                                                        <div className="flex bg-gray-700 rounded-[5px] mt-[25px] mr-[50px]">
                                                                            <span className="text-white text-xl text-center p-4">{oitems.quantity} од.</span>
                                                                        </div>
                                                                    </div>
                                                                
                                                            
                                                            <div className="flex justify-between bg-gray-700 h-[50px] rounded-b-md">
                                                                <select
                                                                    onChange={(e)=>updateHandler(e.target.value,order.id)}
                                                                    value={order.status}
                                                                    className="w-[200px] text-md border-none focus:ring-0"
                                                                >
                                                                    <option value="Нове замовлення">Нове замовлення</option>
                                                                    <option value="Комплектуєтся">Комплектуєтся</option>
                                                                    <option value="Відправлено">Відправлено</option>
                                                                    <option value="Доставлено">Доставлено</option>
                                                                    <option value="Виконано">Виконано</option>
                                                                    <option value="Скасовано">Скасовано</option>
                                                                </select>
                                                                <p className="text-2xl text-white mr-[20px] mt-[10px]">Загальна вартість: {order.price} ₴</p>
                                                            </div>
                                                        </div>
                                                    ):(
                                                        <div className="bg-gray-800 border-[1px] border-gray-600 mt-1 flex flex-col rounded-md">
                                                            <div className="flex justify-between">
                                                                <span className="text-white font-bold ml-[20px] w-[500px] text-xl">Замовлення: {order.id}</span>
                                                                <span className="text-white font-bold text-xl text-left w-[250px]">від: {new Date(order.createdAt).toLocaleDateString()}</span>
                                                                <span className="text-white font-bold text-xl">статус: {order.status}</span>
                                                                <FontAwesomeIcon onClick={()=>setOrderDetail(order.id)} icon={faArrowDown} className="text-white font-bold mr-[20px] p-1 text-xl"/>
                                                            </div>
                                                        </div>
                                                    )}

                                                </>
                                            )
                                        })}
                                    </>
                                ):(
                                    <div className="text-white text-3xl">Замовлення відсутні</div>
                                )}
                            </div>
                        </>
                    )}

                </div>
            </div>
        </Layout>
    );
}
