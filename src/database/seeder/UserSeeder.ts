import pool from "../mysql";
import { BcryptEncrypter } from '../../infrastructure/security/BcryptEncrypter'

export default async function run(): Promise<void> {
    // check exist if exist skip

    const passwordHasher = new BcryptEncrypter();

    // await hashes up front
    const adminPassword = await passwordHasher.hash('12345678');
    const userPassword = await passwordHasher.hash('12345678');

    const users = [
        { username: 'admin', password: adminPassword, role: 'admin' },
        { username: 'user', password: userPassword, role: 'staff' }
    ];

    for (const u of users) {
        const [rows] = await pool.query(`SELECT 1 FROM users WHERE username = ? LIMIT 1`, [u.username]);
        if ((rows as any[]).length > 0) {
            console.log(`User '${u.username}' exists — skipping`);
            continue;
        }

        await pool.query(
            `INSERT INTO users (username, password, role, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())`,
            [u.username, u.password, u.role]
        );
    }
}