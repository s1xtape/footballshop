import {useEffect, useReducer, useState} from "react";
import {toast} from "react-toastify";
import {getError} from "../../../utils/error";
import axios from "axios";
import {useRouter} from "next/router";
import Layout from "../../../components/Layout";
import {Carousel} from "react-responsive-carousel";
import Select from "react-select";
import cats from "../../../utils/cats";

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: '' };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, error: '' };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        case 'UPLOAD_REQUEST':
            return { ...state, loadingUpload: true, errorUpload: '' };
        case 'UPLOAD_SUCCESS':
            return {
                ...state,
                loadingUpload: false,
                errorUpload: '',
            };
        case 'UPLOAD_FAIL':
            return { ...state, loadingUpload: false, errorUpload: action.payload };

        case 'UNLOAD_REQUEST':
            return { ...state, loadingUpload: true, errorUpload: '' };
        case 'UNLOAD_SUCCESS':
            return {
                ...state,
                loadingUpload: false,
                errorUpload: '',
            };
        case 'UNLOAD_FAIL':
            return { ...state, loadingUpload: false, errorUpload: action.payload };
        default:
            return state;
    }
}

export default function AddTovar() {
    const [imagesData,setImagesData] = useState([]);
    const [savedImagesData, setSavedImagesData] = useState([]);
    const [category,setCategory] = useState(null);
    const [subCategory,setSubCategory] = useState(null);
    const [subCategoryes,setSubCategoryes] = useState([]);
    const [name,setName] = useState();
    const [description,setDescription] = useState();
    const [brand,setBrand] = useState();
    const [price,setPrice] = useState();
    const [gender,setGender] = useState();
    const [color,setColor] = useState();
    const [sizes,setSizes] = useState();
    const [soleType,setSoleType] = useState();
    const [material,setMaterial] = useState();
    const [weight,setWeight] = useState();
    const { query } = useRouter();
    const itemId = query.id;
    const router = useRouter();

    const [{loading, error, loadingUpdate,loadingUpload}, dispatch] = useReducer( reducer, {
        loading: true,
        error: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try{
                dispatch({type: 'FETCH_REQUEST'});
                const {data} = await axios.get(`http://127.0.0.1:8080/tovars/item?itemid=${itemId}`);
                setName(data.name);
                setBrand(data.brand);
                setDescription(data.description);
                setPrice(data.price);
                setCategory({value:data.category,label:data.category});
                setSubCategory({value:data.subCategory,label:data.subCategory});
                switch (data.category){
                    case "Футбольна форма":
                        setGender(data.gender);
                        setSizes(data.sizes);
                        setColor(data.color);
                        break;
                    case "Футбольне взуття":
                        setGender(data.gender);
                        setSizes(data.sizes);
                        setColor(data.color);
                        setSoleType(data.soleType);
                        break;
                    case "М'ячі для футболу":
                        setSizes(data.sizes);
                        setColor(data.color);
                        setMaterial(data.material);
                        setWeight(data.weight);
                        break;
                    case "Воротарське екіпірування":
                        setGender(data.gender);
                        setSizes(data.sizes);
                        setColor(data.color);
                        break;
                    case "Сумки спортивні":
                        setColor(data.color);
                        break;
                }
                if(data.images !== '[]'){
                    setImagesData(JSON.parse(data.images));
                    setSavedImagesData(JSON.parse(data.images));
                }
                dispatch({type: 'FETCH_SUCCESS'});
            } catch(err) {
                dispatch({type: 'FETCH_FAIL', payload: getError(err)})
            }
        };
        fetchData();
    }, [itemId]);

    const uploadImages = async(e) => {
        e.preventDefault();
        dispatch({type: 'UPLOAD_REQUEST'});
        for(const img of e.target.files){
            const data = new FormData();
            data.append("file",img);
            data.append("upload_preset",process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME);
            try{
                const resp = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,data);
                imagesData.push({url: resp.data.url, public_id: resp.data.public_id})
            }catch (err){
                dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
                toast.error(getError(err));
            }
        }
        dispatch({ type: 'UPLOAD_SUCCESS' });
    }
    async function deleteImage(publicId) {
        const res = await fetch(`/api/images?public_id=${publicId}`, {
            method: 'DELETE',
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message);
        }

        return data.message;
    }
    const deleteHandler = async (e) => {
        if(!window.confirm('видалити зображення')) {
            return;
        }
        dispatch({type: 'UNLOAD_REQUEST'});
        try{
            await deleteImage(e.target.alt);
            const index = savedImagesData.findIndex(element => element.public_id === e.target.alt);
            if(index > -1){
                savedImagesData.splice(index,1);
                await axios.put(`/api/items/${itemId}`,{
                    savedImagesData,
                });
                toast.success('Фото успішно оновлено!');
            }
            imagesData.splice(imagesData.findIndex(obj => {
                return obj.public_id === e.target.alt
            }),1);
        } catch (err){
            dispatch({ type: 'UNLOAD_FAIL', payload: getError(err) });
            toast.error(getError(err));
        }
        dispatch({ type: 'UNLOAD_SUCCESS' });
    }
    const submitHandler = async () => {
        try{
            dispatch({ type: 'CREATE_REQUEST' });
            await axios.put(`http://127.0.0.1:8080/updateitem?itemid=${itemId}`,{
                category: category.value,
                subCategory: subCategory.value,
                name: name,
                description: description,
                brand: brand,
                price: price,
                images: imagesData,
                gender: gender,
                color: color,
                sizes: sizes,
                soleType: soleType,
                material: material,
                weight: weight,
            });
            dispatch({type: 'CREATE_SUCCESS'});
            toast.success('Товар успішно оновлено!');
        } catch (err){
            dispatch({ type: 'CREATE_FAIL', payload: getError(err) });
            toast.error(getError(err));
        }
    };
    const HandleCategory = (selected) => {
        setCategory(selected);
        setSubCategory(null);
        setGender(undefined);
        setSizes(undefined);
        setColor(undefined);
        setMaterial(undefined);
        setWeight(undefined);
        setSoleType(undefined);
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
    const HandleSubCategory = (selected) => {
        setSubCategory(selected)
    }
    return(
        <Layout>
            <div className="mx-[200px] h-[740px] gap-x-[50px] overflow-y-auto">
                <div className="flex gap-x-[100px]">
                    <div className="w-1/2">
                        <div>
                            <div className="flex w-full overflow-x-auto">
                                {imagesData.map(img => {
                                    return(
                                        <img onClick={deleteHandler} src={img.url} alt={img.public_id} className="rounded-2xl h-[400px] w-full object-contain"/>
                                    )
                                })}
                            </div>
                            <input type="file" multiple onChange={uploadImages} className=" text-white w-full mt-[10px] bg-gray-700 text-xl border-none"/>
                        </div>
                    </div>
                    <div className="w-1/2">
                        <input value={name} onChange={(e)=>setName(e.target.value)} type="text" className="text-white bg-gray-700 focus:ring-0 border-none text-xl w-full" placeholder="Назва товару"/>
                        <input value={brand} onChange={(e)=>setBrand(e.target.value)} type="text" className="text-white bg-gray-700 focus:ring-0 border-none text-xl w-full mt-2" placeholder="Бренд/Виробник"/>
                        <textarea value={description} onChange={(e)=>setDescription(e.target.value)} className="text-white bg-gray-700 focus:ring-0 border-none text-xl w-full mt-2" placeholder="Опис товару"/>
                        <input value={price} onChange={(e)=>setPrice(e.target.value)} type="number" className="text-white bg-gray-700 focus:ring-0 border-none text-xl w-full mt-2" placeholder="Ціна у грн"/>
                        <Select
                            onChange={HandleCategory}
                            value={category}
                            options={cats.mainCats}
                            placeholder="Оберіть категорію товара"
                            className="w-full text-xl border-none focus:ring-0 mt-4"
                        />
                        <Select
                            onChange={HandleSubCategory}
                            value={subCategory}
                            options={subCategoryes}
                            placeholder="Оберіть підкатегорію товара"
                            className="w-full text-xl border-none focus:ring-0 mt-4"
                        />
                        {subCategory === null ? (
                            <div className="text-xl text-white w-full">Оберіть категорію та підкатегорію для продовження</div>
                        ):(
                            <>
                                {category.value === "Футбольна форма" ? (
                                    <>
                                        <div className="flex">
                                            <div className="text-white text-xl mt-[20px] mr-[10px] w-[155px]">Стать:</div>
                                            <select value={gender} onChange={(e)=>setGender(e.target.value)} className="w-full text-xl border-none focus:ring-0 mt-4">
                                                <option value="чоловіча">чоловіча</option>
                                                <option value="жіноча">жіноча</option>
                                                <option value="універсальна">універсальна</option>
                                            </select>
                                        </div>
                                        <div className="flex">
                                            <div className="text-white text-xl mt-[20px] mr-[10px] w-[155px]">Розміри:</div>
                                            <input value={sizes} onChange={(e)=>setSizes(e.target.value)} type="text" className="text-white bg-gray-700 focus:ring-0 border-none text-xl w-full mt-2" placeholder="Розміри через кому (xs,s,m)"/>
                                        </div>
                                        <div className="flex">
                                            <div className="text-white text-xl mt-[20px] mr-[10px] w-[155px]">Кольори:</div>
                                            <input value={color} onChange={(e)=>setColor(e.target.value)} type="text" className="text-white bg-gray-700 focus:ring-0 border-none text-xl w-full mt-2" placeholder="Кольори через кому (червоний,чорний,блакитний)"/>
                                        </div>
                                    </>
                                ): category.value === "Футбольне взуття" ? (
                                    <>
                                        <div className="flex">
                                            <div className="text-white text-xl mt-[20px] mr-[10px] w-[155px]">Стать:</div>
                                            <select value={gender} onChange={(e)=>setGender(e.target.value)} className="w-full text-xl border-none focus:ring-0 mt-4">
                                                <option value="чоловіча">чоловіча</option>
                                                <option value="жіноча">жіноча</option>
                                                <option value="універсальна">універсальна</option>
                                            </select>
                                        </div>
                                        <div className="flex">
                                            <div value={sizes} className="text-white text-xl mt-[20px] mr-[10px] w-[155px]">Розміри:</div>
                                            <input onChange={(e)=>setSizes(e.target.value)} type="text" className="text-white bg-gray-700 focus:ring-0 border-none text-xl w-full mt-2" placeholder="Розміри через кому (xs,s,m)"/>
                                        </div>
                                        <div className="flex">
                                            <div className="text-white text-xl mt-[20px] mr-[10px] w-[155px]">Кольори:</div>
                                            <input value={color} onChange={(e)=>setColor(e.target.value)} type="text" className="text-white bg-gray-700 focus:ring-0 border-none text-xl w-full mt-2" placeholder="Кольори через кому (червоний,чорний,блакитний)"/>
                                        </div>
                                        <div className="flex">
                                            <div className="text-white text-xl mt-[20px] mr-[10px] w-[155px]">Вид підошви: </div>
                                            <input value={soleType} onChange={(e)=>setSoleType(e.target.value)} type="text" className="text-white bg-gray-700 focus:ring-0 border-none text-xl w-full mt-2" placeholder="введіть вид підошви"/>
                                        </div>
                                    </>
                                ): category.value === "М'ячі для футболу" ? (
                                    <>
                                        <div className="flex">
                                            <div className="text-white text-xl mt-[20px] mr-[10px] w-[155px]">Розмір:</div>
                                            <input value={sizes} onChange={(e)=>setSizes(e.target.value)} type="number" className="text-white bg-gray-700 focus:ring-0 border-none text-xl w-full mt-2" placeholder="Введіть розмір м'яча"/>
                                        </div>
                                        <div className="flex">
                                            <div className="text-white text-xl mt-[20px] mr-[10px] w-[155px]">Колір:</div>
                                            <input value={color} onChange={(e)=>setColor(e.target.value)} type="text" className="text-white bg-gray-700 focus:ring-0 border-none text-xl w-full mt-2" placeholder="введіть колір м'яча"/>
                                        </div>
                                        <div className="flex">
                                            <div className="text-white text-xl mt-[20px] mr-[10px] w-[155px]">Матеріал:</div>
                                            <input value={material} onChange={(e)=>setMaterial(e.target.value)} type="text" className="text-white bg-gray-700 focus:ring-0 border-none text-xl w-full mt-2" placeholder="введіть матеріал"/>
                                        </div>
                                        <div className="flex">
                                            <div className="text-white text-xl mt-[20px] mr-[10px] w-[155px]">Вага:</div>
                                            <input value={weight} onChange={(e)=>setWeight(e.target.value)} type="number" className="text-white bg-gray-700 focus:ring-0 border-none text-xl w-full mt-2" placeholder="введіть вагу у грамах"/>
                                        </div>
                                    </>
                                ): category.value === "Воротарське екіпірування" ? (
                                    <>
                                        <div className="flex">
                                            <div className="text-white text-xl mt-[20px] mr-[10px] w-[155px]">Стать:</div>
                                            <select value={gender} onChange={(e)=>setGender(e.target.value)} className="w-full text-xl border-none focus:ring-0 mt-4">
                                                <option value="чоловіча">чоловіча</option>
                                                <option value="жіноча">жіноча</option>
                                                <option value="універсальна">універсальна</option>
                                            </select>
                                        </div>
                                        <div className="flex">
                                            <div className="text-white text-xl mt-[20px] mr-[10px] w-[155px]">Розміри:</div>
                                            <input value={sizes} onChange={(e)=>setSizes(e.target.value)} type="text" className="text-white bg-gray-700 focus:ring-0 border-none text-xl w-full mt-2" placeholder="Розміри через кому (xs,s,m)"/>
                                        </div>
                                        <div className="flex">
                                            <div className="text-white text-xl mt-[20px] mr-[10px] w-[155px]">Колір:</div>
                                            <input value={color} onChange={(e)=>setColor(e.target.value)} type="text" className="text-white bg-gray-700 focus:ring-0 border-none text-xl w-full mt-2" placeholder="введіть колір м'яча"/>
                                        </div>
                                    </>
                                ): category.value === "Аксесуари та обладнання" ? (
                                    <div className="text-xl text-white w-full">Внесіть характеристики в опис</div>
                                ): category.value === "Фанатська атрибутика" ? (
                                    <div className="text-xl text-white w-full">Внесіть характеристики в опис</div>
                                ): category.value === "Нагородна атрибутика" ? (
                                    <div className="text-xl text-white w-full">Внесіть характеристики в опис</div>
                                ):(
                                    <div className="flex">
                                        <div className="text-white text-xl mt-[20px] mr-[10px] w-[155px]">Кольори:</div>
                                        <input value={color} onChange={(e)=>setColor(e.target.value)} type="text" className="text-white bg-gray-700 focus:ring-0 border-none text-xl w-full mt-2" placeholder="Кольори через кому (червоний,чорний,блакитний)"/>
                                    </div>
                                )}
                                <button onClick={submitHandler} className="text-xl text-white bg-gray-700 p-2 rounded-md hover:bg-gray-600 mt-4">Оновити товар</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    )
}
