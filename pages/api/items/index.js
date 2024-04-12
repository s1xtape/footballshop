import Item from "../../../models/Item";
import db from '../../../utils/db'

const handler = async (req, res) => {
    if (req.method === 'GET') {
        return getHandler(req, res);
    } else if (req.method === 'POST') {
        return postHandler(req, res);
    } else {
        return res.status(400).send({message: 'Method not allowed'});
    }
};
const postHandler = async (req, res) => {
    await db.connect();
    const newItem = new Item({
        category: req.body.category.value,
        subCategory: req.body.subCategory.value,
        name: req.body.name,
        description: req.body.description,
        brand: req.body.brand,
        price: req.body.price,
        images: JSON.stringify(req.body.images),
        gender: req.body.gender,
        color: req.body.color,
        sizes: req.body.sizes,
        soleType: req.body.soleType,
        material: req.body.material,
        weight: req.body.weight,
    });
    const item = await newItem.save();
    await db.disconnect();
    res.send({message: "Hotel created", item})
};
const getHandler = async(req,res) => {
    await  db.connect();
    const items = await Item.find({});
    await db.disconnect();
    res.send(items);
}
export default handler;