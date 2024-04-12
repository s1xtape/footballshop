import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema(
    {
        
        category: {type: String, required: true},
        subCategory: {type:String, required:true},
        name: {type:String, required:true},
        description: {type:String, required:true},
        brand: {type:String, required:true},
        price: { type: Number, required: true},
        images: {type: String, required: true},
        gender: {type:String},
        color: {type:String},
        sizes: {type:String},
        soleType: {type:String},
        material: {type:String},
        weight: {type:Number},
    },
    {
        timestamps: true,
    }
);

const Item = mongoose.models.Item || mongoose.model('Item', ItemSchema);
export default Item;
