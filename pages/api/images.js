import { v2 as cloudinary } from 'cloudinary';

export default async function handler(req, res) {
    const { public_id } = req.query;

    try {
        // Delete the image from Cloudinary
        await cloudinary.uploader.destroy(public_id);

        res.status(200).json({ message: 'Image deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}