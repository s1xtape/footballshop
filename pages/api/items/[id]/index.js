import Item from "../../../../models/Item";
import db from "../../../../utils/db";
import { v2 as cloudinary } from 'cloudinary';

const handler = async(req,res) => {
    if (req.method === 'GET'){
        return getHandler(req, res);
    } else if(req.method === 'PUT') {
        return putHandler(req,res);
    } else if(req.method === 'DELETE'){
        return deleteHandler(req,res);
    } else {
        return res.status(400).send({message: 'Method not allowed'});
    }
};
const getHandler = async (req,res) => {
    await db.connect();
    const item = await Item.findById(req.query.id);
    await db.disconnect();
    res.send(item)
};
const putHandler = async (req,res) => {
    await  db.connect();
    const item = await Item.findById(req.query.id);
    if(item) {
        if(req.body.name === undefined){
            item.images = JSON.stringify(req.body.savedImagesData);
            await item.save();
            await db.disconnect();
            res.send({message: 'Item images updated'})
        }else{
            item.category= req.body.category.value;
            item.subCategory= req.body.subCategory.value;
            item.name= req.body.name;
            item.description= req.body.description;
            item.brand= req.body.brand;
            item.price= req.body.price;
            item.images= JSON.stringify(req.body.images);
            item.gender= req.body.gender;
            item.color= req.body.color;
            item.sizes= req.body.sizes;
            item.soleType= req.body.soleType;
            item.material= req.body.material;
            item.weight= req.body.weight;
            await item.save();
            await db.disconnect();
            res.send({message: 'Item updated'})
        }
    }else{
        await db.disconnect();
        res.status(404).send({message: 'Item not found'});
    }
}
const deleteHandler = async (req,res) =>{
    await  db.connect();
    const item = await Item.findById(req.query.id);
    if(item){
        if(item.images !== '[]'){
            const images = JSON.parse(item.images);
            for(const img of images){
                await cloudinary.uploader.destroy(img.public_id);
            }
        }
        await item.remove();
        await db.disconnect();
        res.send({message: 'Item deleted'})
    }else{
        await db.disconnect();
        res.status(404).send({ message: 'Item not found' });
    }
}
export default handler;