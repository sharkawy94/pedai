import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import bcrypt from 'bcryptjs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { name, email, password } = req.body;

    try {
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existingUser.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = bcrypt.hashSync(password, 10);

      const newUser = await db
        .insert(users)
        .values({
          name,
          email,
          password: hashedPassword
        })
        .returning();

      res
        .status(201)
        .json({ message: 'User created successfully', user: newUser[0] });
    } catch (error) {
      res.status(500).json({ message: 'Error creating user', error });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
