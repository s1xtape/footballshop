import Order from '../../../../models/Order';
import db from '../../../../utils/db';

const handler = async(req,res) => {
    if (req.method === 'GET'){
        return getHandler(req, res);
    } else if(req.method === 'PUT') {
        return putHandler(req,res);
    } else  {
        return res.status(400).send({message: 'Method not allowed'});
    }
};
const getHandler = async (req,res) => {
    await db.connect();
    const orders = await Order.findById(req.query.id);
    await db.disconnect();
    res.send(orders)
};
const putHandler = async (req,res) => {
    await  db.connect();
    const order = await Order.findById(req.query.id);
    if(order) {
        order.status = req.body.status;
        await order.save();
        await db.disconnect();
        res.send({message: 'Order updated'})
    }else{
        await db.disconnect();
        res.status(404).send({message: 'Order not found'});
    }
}
export default handler;