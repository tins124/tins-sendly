import { Injectable, UnauthorizedException } from '@nestjs/common';
import db from 'src/firebase.server';

@Injectable()
export class UsersService {
  db: FirebaseFirestore.Firestore;
  constructor() {
    this.db = db;
  }

  async getUser(username: string) {
    const snapshot = await this.db
      .collection('users')
      .where('username', '==', username)
      .get();

    const data = snapshot.docs;
    if (data.length <= 0) {
      throw new UnauthorizedException();
    }

    return data[0].data();
  }
}
