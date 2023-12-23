import { SyncOptions } from "sequelize";
import sequelize from "./db";
import { User } from "./models";

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
          User.create({
            email: 'admin@local.com',
            name: 'Admin',
            password: 'admin',
            role: 'admin',
          });
        }
      });
    });
}