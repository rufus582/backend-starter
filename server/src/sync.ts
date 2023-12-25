import { SyncOptions } from "sequelize";
import sequelize from "./db";
import { User } from "./models";
import bcrypt from 'bcrypt';

export function syncDB(options: SyncOptions) {
  sequelize.models.User = User;

  sequelize.sync(options)
    .then(() => {
      User.findOne({
        where: {
          role: 'admin',
        },
      }).then((user) => {
        if (!user) {
          bcrypt.hash('admin', process.env.SALT_ROUNDS ?? '10')
            .then((hash) => {
              User.create({
                email: 'admin@local.com',
                name: 'Admin',
                password: hash,
                role: 'admin',
              });
            })
            .catch((error) => {
              console.error(error);
            });
        }
      });
    });
}