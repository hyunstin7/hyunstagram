import { connectDB } from "@/util/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function Handler(req, res) {
    const { id } = req.body;

    try {
        const session = await getServerSession(req, res, authOptions);
        const user = session?.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const db = (await connectDB).db('user');
        
        if (req.method === 'POST') {
            const userInfo = await db.collection('userinfo').findOne({ email: user.email })
            if (!userInfo) {
                return res.status(404).json({ message: "User not found" });
            }
            if (!userInfo.bookmark.includes(id)) {
                await db.collection('userinfo').updateOne({ email: user.email }, { $push: { bookmark: id } });
            }
            const updatedUserInfo = await db.collection('userinfo').findOne({ email: user.email });
            const bookmark = updatedUserInfo?.bookmark || [];


            return res.status(200).json(bookmark);
        } else if (req.method === 'DELETE') {
            await db.collection('userinfo').updateOne({ email: user.email }, { $pull: { bookmark: id } });
            const updatedUserInfo = await db.collection('userinfo').findOne({ email: user.email });
            const bookmark = updatedUserInfo?.bookmark || [];
            return res.status(200).json(bookmark);
        } else {
            return res.status(405).json({ message: "Method not allowed" });
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: error.message });
    }
}
