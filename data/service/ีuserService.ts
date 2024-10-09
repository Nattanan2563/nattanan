import { User } from '~/data/types/user';

const users: User[] = [
    new User(1, 'Alice'),
    new User(2, 'Bob'),
];

export function getUsers(): User[] {
    return users;
}

// import axios from 'axios';
// // import { User } from '~/data/types/user';
// import type { User } from '~/types/user';

// export class UserService {
//     private apiUrl = 'https://api.example.com/users'; // แก้ไข URL ให้ตรงกับ API ที่คุณต้องการ

//     async getAllUsers(): Promise<User[]> {
//         try {
//             const response = await axios.get<User[]>(this.apiUrl);
//             return response.data;
//         } catch (error) {
//             console.error('Error fetching users:', error);
//             throw error;
//         }
//     }

//     async getUserById(id: number): Promise<User> {
//         try {
//             const response = await axios.get<User>(`${this.apiUrl}/${id}`);
//             return response.data;
//         } catch (error) {
//             console.error('Error fetching user by ID:', error);
//             throw error;
//         }
//     }
// }