import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";

export default async function Handler(req, res) {
    if (req.method === 'POST') {
        try {
            const id = req.body;
            console.log(id);

            const db = (await connectDB).db('4rum');
            const result = await db.collection('post').findOne({ _id: ObjectId(id) });

            if (!result) {
                return res.status(404).json({ message: 'Post not found' });
            }

            return res.status(200).json(result);
        } catch (error) {
            console.error('Error processing request:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
