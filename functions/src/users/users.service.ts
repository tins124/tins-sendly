import { Injectable } from '@nestjs/common';
import db from 'src/firebase.server';

@Injectable()
export class UsersService {
  db: FirebaseFirestore.Firestore;
  constructor() {
    this.db = db;
  }
}
