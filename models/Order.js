import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        items: { type: String, required: true },
        shipping: { type: String, required: true },
        price: { type: Number, required: true },
        status: {type: String, required: true},
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;