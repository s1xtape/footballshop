import Order from '../../../models/Order';
import db from '../../../utils/db';

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
    const newOrder = new Order({
        items: JSON.stringify(req.body.items),
        shipping: JSON.stringify(req.body.shipping),
        price: req.body.price,
        status: 'Нове замовлення',
    });
    const order = await newOrder.save();
    res.status(201).send(order);
};
const getHandler = async(req,res) => {
    await  db.connect();
    const orders = await Order.find({});
    await db.disconnect();
    res.send(orders);
}
export default handler;
