import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import db from 'src/firebase.server';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  db: FirebaseFirestore.Firestore;
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {
    this.db = db;
  }

  async signIn(username: string, password: string) {
    const snapshot = await db
      .collection('users')
      .where('username', '==', username)
      .get();

    if (snapshot.docs.length == 0) {
      return {
        message: `Don't have any user who has username equal ${username}`,
      };
    }

    const data = snapshot.docs[0].data();
    const isMatch = await bcrypt.compare(password, data.password);

    if (isMatch) {
      const payload = { sub: data.id, username: data.username };
      return {
        username,
        access_token: await this.jwtService.signAsync(payload),
      };
    }
    throw new UnauthorizedException();
  }

  async signUp(username: string, password: string) {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    const snapshot = await db
      .collection('users')
      .doc(uuidv4())
      .set({ username, password: hash });

    return snapshot;
  }
}
