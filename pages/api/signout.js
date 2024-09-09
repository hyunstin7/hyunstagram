import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // 세션을 클리어
    const session = await getSession({ req });
    if (session) {
      // 여기서 세션 클리어 처리를 할 수 있습니다
      res.status(200).json({ message: 'Sign out successful' });
    } else {
      res.status(401).json({ error: 'Not authenticated' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}