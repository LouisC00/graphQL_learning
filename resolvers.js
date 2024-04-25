import pc from "@prisma/client";
import bcrypt from "bcryptjs";
import { AuthenticationError } from "apollo-server";
import jwt from "jsonwebtoken";

const prisma = new pc.PrismaClient();

const resolvers = {
  Query: {
    users: async (_, args, { userId }) => {
      console.log(userId);
      const users = await prisma.user.findMany();
      return users;
    },
  },

  Mutation: {
    signupUser: async (_, { userNew }) => {
      const user = await prisma.user.findUnique({
        where: { email: userNew.email },
      });

      if (user) {
        throw new AuthenticationError("User already exists with that email");
      }

      const hashedPassword = await bcrypt.hash(userNew.password, 10);
      const newUser = await prisma.user.create({
        data: {
          ...userNew,
          password: hashedPassword,
        },
      });

      return {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      };
    },

    signinUser: async (_, { userSignin }) => {
      const user = await prisma.user.findUnique({
        where: { email: userSignin.email },
      });

      const match =
        user && (await bcrypt.compare(userSignin.password, user.password));

      if (!match) {
        throw new AuthenticationError("email or password id invalid");
      }

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
      return { token };
    },
  },
};

export default resolvers;
