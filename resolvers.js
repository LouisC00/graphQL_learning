import pc from "@prisma/client";
import bcrypt from "bcryptjs";
import { AuthenticationError, ForbiddenError } from "apollo-server";
import jwt from "jsonwebtoken";
import { PubSub } from "graphql-subscriptions";
import { withFilter } from "graphql-subscriptions";

const pubsub = new PubSub();

const MESSAGE_ADDED = "MESSAGE_ADDED";

const prisma = new pc.PrismaClient();

const resolvers = {
  Query: {
    getAllUsers: async (_, args, { userId }) => {
      if (!userId) throw new ForbiddenError("You must be logged in");

      const users = await prisma.user.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          id: {
            not: userId,
          },
        },
      });
      return users;
    },

    messagesByUser: async (_, { receiverId }, { userId }) => {
      if (!userId) throw new ForbiddenError("You must be logged in");

      const message = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: userId, receiverId: receiverId },
            { senderId: receiverId, receiverId: userId },
          ],
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      return message;
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

    createMessage: async (_, { receiverId, text }, { userId }) => {
      if (!userId) throw new ForbiddenError("You must be logged in");

      const message = await prisma.message.create({
        data: {
          text,
          receiverId,
          senderId: userId,
        },
      });
      pubsub.publish(MESSAGE_ADDED, { messageAdded: message });
      return message;
    },
  },

  Subscription: {
    messageAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(MESSAGE_ADDED),
        (payload, variables, context) => {
          // Only forward a message if the context userId matches the senderId or receiverId of the message
          return (
            // payload.messageAdded.senderId === context.userId ||
            payload.messageAdded.receiverId === context.userId
          );
        }
      ),
    },
  },
};

export default resolvers;
