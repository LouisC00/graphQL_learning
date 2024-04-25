import pc from "@prisma/client";
import bcrypt from "bcryptjs";
import { ApolloError, AuthenticationError } from "apollo-server";

const prisma = new pc.PrismaClient();

const resolvers = {
  Query: {},
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
  },
};

export default resolvers;
