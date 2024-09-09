import { connectDB } from "@/util/database";


export default async function Handler(req, res) {

    if (req.method == 'POST') {
        const email = req.body.email;
        console.log('작동됨')
        console.log(email)
        const db = (await connectDB).db('user')
        const result = await db.collection('users').findOne({ email : email })

        if (result) {
           return res.status(400).json({ message :'이미 존재하는 이메일입니다.'})
        } 
            return res.status(200).json({ message : ''})

        

        
    }

}