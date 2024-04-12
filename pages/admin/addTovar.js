import {useReducer, useState} from "react";
import {toast} from "react-toastify";
import {getError} from "../../utils/error";
import axios from "axios";
import {useRouter} from "next/router";
import Layout from "../../components/Layout";
import {Carousel} from "react-responsive-carousel";
import bag from "../../public/bag.png"
import Select from "react-select";
import cats from "../../utils/cats";

function reducer(state, action) {
    switch (action.type) {

        case 'CREATE_REQUEST':
            return { ...state, loadingCreate: true, errorCreate: '' };
        case 'CREATE_SUCCESS':
            return { ...state, loadingCreate: false, errorUCreate: '' };
        case 'CREATE_FAIL':
            return { ...state, loadingCreate: false, errorCreate: action.payload };

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

    const router = useRouter();

    const [{loadingCreate,loadingUpload}, dispatch] = useReducer( reducer, {
        loading: true,
        error: '',
    });
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
            await axios.post(`http://127.0.0.1:8080/add`,{
                
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
            toast.success('Товар успішно додано!');
            await router.push("/admin/adminMain");
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
                            <Carousel infiniteLoop autoPlay showThumbs={false} showStatus={false} interval={5000} className="rounded-2xl h-[400px] w-full">
                                {imagesData.map(img => {
                                    return(
                                        <div key={img.public_id} className="rounded-2xl h-full">
                                            <img src={img.url} className="rounded-2xl h-[400px] w-full object-contain"/>
                                        </div>
                                    )
                                })}
                            </Carousel>
                            <input type="file" multiple onChange={uploadImages} className=" text-white w-full mt-[10px] bg-gray-700 text-xl border-none"/>
                        </div>
                    </div>
                    <div className="w-1/2">
                        <input onChange={(e)=>setName(e.target.value)} type="text" className="text-white bg-gray-700 focus:ring-0 border-none text-xl w-full" placeholder="Назва товару"/>
                        <input onChange={(e)=>setBrand(e.target.value)} type="text" className="text-white bg-gray-700 focus:ring-0 border-none text-xl w-full mt-2" placeholder="Бренд/Виробник"/>
                        <textarea onChange={(e)=>setDescription(e.target.value)} className="text-white bg-gray-700 focus:ring-0 border-none text-xl w-full mt-2" placeholder="Опис товару"/>
                        <input onChange={(e)=>setPrice(e.target.value)} type="number" className="text-white bg-gray-700 focus:ring-0 border-none text-xl w-full mt-2" placeholder="Ціна у грн"/>
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
                                            <select onChange={(e)=>setGender(e.target.value)} className="w-full text-xl border-none focus:ring-0 mt-4">
                                                <option value="чоловіча">чоловіча</option>
                                                <option value="жіноча">жіноча</option>
                                                <option value="універсальна">універсальна</option>
                                            </select>
                                        </div>
                                        <div className="flex">
                                            <div className="text-white text-xl mt-[20px] mr-[10px] w-[155px]">Розміри:</div>
                                            <input onChange={(e)=>setSizes(e.target.value)} type="text" className="text-white bg-gray-700 focus:ring-0 border-none text-xl w-full mt-2" placeholder="Розміри через кому (xs,s,m)"/>
                                        </div>
                                        <div className="flex">
                                            <div className="text-white text-xl mt-[20px] mr-[10px] w-[155px]">Кольори:</div>
                                            <input onChange={(e)=>setColor(e.target.value)} type="text" className="text-white bg-gray-700 focus:ring-0 border-none text-xl w-full mt-2" placeholder="Кольори через кому (червоний,чорний,блакитний)"/>
                                        </div>
                                    </>
                                ): category.value === "Футбольне взуття" ? (
                                    <>
                                        <div className="flex">
                                            <div className="text-white text-xl mt-[20px] mr-[10px] w-[155px]">Стать:</div>
                                            <select onChange={(e)=>setGender(e.target.value)} className="w-full text-xl border-none focus:ring-0 mt-4">
                                                <option value="чоловіча">чоловіча</option>
                                                <option value="жіноча">жіноча</option>
                                                <option value="універсальна">універсальна</option>
                                            </select>
                                        </div>
                                        <div className="flex">
                                            <div className="text-white text-xl mt-[20px] mr-[10px] w-[155px]">Розміри:</div>
                                            <input onChange={(e)=>setSizes(e.target.value)} type="text" className="text-white bg-gray-700 focus:ring-0 border-none text-xl w-full mt-2" placeholder="Розміри через кому (xs,s,m)"/>
                                        </div>
                                        <div className="flex">
                                            <div className="text-white text-xl mt-[20px] mr-[10px] w-[155px]">Кольори:</div>
                                            <input onChange={(e)=>setColor(e.target.value)} type="text" className="text-white bg-gray-700 focus:ring-0 border-none text-xl w-full mt-2" placeholder="Кольори через кому (червоний,чорний,блакитний)"/>
                                        </div>
                                        <div className="flex">
                                            <div className="text-white text-xl mt-[20px] mr-[10px] w-[155px]">Вид підошви: </div>
                                            <input onChange={(e)=>setSoleType(e.target.value)} type="text" className="text-white bg-gray-700 focus:ring-0 border-none text-xl w-full mt-2" placeholder="введіть вид підошви"/>
                                        </div>
                                    </>
                                ): category.value === "М'ячі для футболу" ? (
                                    <>
                                        <div className="flex">
                                            <div className="text-white text-xl mt-[20px] mr-[10px] w-[155px]">Розмір:</div>
                                            <input onChange={(e)=>setSizes(e.target.value)} type="number" className="text-white bg-gray-700 focus:ring-0 border-none text-xl w-full mt-2" placeholder="Введіть розмір м'яча"/>
                                        </div>
                                        <div className="flex">
                                            <div className="text-white text-xl mt-[20px] mr-[10px] w-[155px]">Колір:</div>
                                            <input onChange={(e)=>setColor(e.target.value)} type="text" className="text-white bg-gray-700 focus:ring-0 border-none text-xl w-full mt-2" placeholder="введіть колір м'яча"/>
                                        </div>
                                        <div className="flex">
                                            <div className="text-white text-xl mt-[20px] mr-[10px] w-[155px]">Матеріал:</div>
                                            <input onChange={(e)=>setMaterial(e.target.value)} type="text" className="text-white bg-gray-700 focus:ring-0 border-none text-xl w-full mt-2" placeholder="введіть матеріал"/>
                                        </div>
                                        <div className="flex">
                                            <div className="text-white text-xl mt-[20px] mr-[10px] w-[155px]">Вага:</div>
                                            <input onChange={(e)=>setWeight(e.target.value)} type="number" className="text-white bg-gray-700 focus:ring-0 border-none text-xl w-full mt-2" placeholder="введіть вагу у грамах"/>
                                        </div>
                                    </>
                                ): category.value === "Воротарське екіпірування" ? (
                                    <>
                                        <div className="flex">
                                            <div className="text-white text-xl mt-[20px] mr-[10px] w-[155px]">Стать:</div>
                                            <select onChange={(e)=>setGender(e.target.value)} className="w-full text-xl border-none focus:ring-0 mt-4">
                                                <option value="чоловіча">чоловіча</option>
                                                <option value="жіноча">жіноча</option>
                                                <option value="універсальна">універсальна</option>
                                            </select>
                                        </div>
                                        <div className="flex">
                                            <div className="text-white text-xl mt-[20px] mr-[10px] w-[155px]">Розміри:</div>
                                            <input onChange={(e)=>setSizes(e.target.value)} type="text" className="text-white bg-gray-700 focus:ring-0 border-none text-xl w-full mt-2" placeholder="Розміри через кому (xs,s,m)"/>
                                        </div>
                                        <div className="flex">
                                            <div className="text-white text-xl mt-[20px] mr-[10px] w-[155px]">Колір:</div>
                                            <input onChange={(e)=>setColor(e.target.value)} type="text" className="text-white bg-gray-700 focus:ring-0 border-none text-xl w-full mt-2" placeholder="введіть колір м'яча"/>
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
                                        <input onChange={(e)=>setColor(e.target.value)} type="text" className="text-white bg-gray-700 focus:ring-0 border-none text-xl w-full mt-2" placeholder="Кольори через кому (червоний,чорний,блакитний)"/>
                                    </div>
                                )}
                                <button onClick={submitHandler} className="text-xl text-white bg-gray-700 p-2 rounded-md hover:bg-gray-600 mt-4">Додати товар</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    )
}
