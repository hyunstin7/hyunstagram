import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";

export default async function Handler(req, res) {
    // Get session
 
    const {email} = req.body

    if (!email) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const db = (await connectDB).db('4rum');
    const db2 = (await connectDB).db('user');

    try {
        if (req.method === 'POST') {
            // Fetch user info from the 'user' database
            const user = await db2.collection('userinfo').findOne({ email });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Convert bookmark IDs to ObjectId
            const bookmarkIds = user.bookmark.map(id => ObjectId(id));

            // Fetch posts with these ObjectId values
            const bookmarks = await db.collection('post').find({ _id: { $in: bookmarkIds } }).toArray();

            return res.status(200).json(bookmarks);
        } else {
            return res.status(405).json({ message: "Method not allowed" });
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: error.message });
    }
}
