import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { AuthenticationError, ForbiddenError } from "apollo-server";
import jwt from "jsonwebtoken";
import { PubSub, withFilter } from "graphql-subscriptions";

const pubsub = new PubSub();
const prisma = new PrismaClient();

const MESSAGE_ADDED = "MESSAGE_ADDED";

const resolvers = {
  Query: {
    getFriendsFromMessages: async (_, __, { userId }) => {
      if (!userId) throw new ForbiddenError("You must be logged in");

      const messages = await prisma.message.findMany({
        where: {
          OR: [{ senderId: userId }, { receiverId: userId }],
        },
        include: {
          sender: true,
          receiver: true,
        },
      });

      const uniqueUsers = new Map();

      messages.forEach(({ sender, receiver }) => {
        if (sender.id !== userId) {
          uniqueUsers.set(sender.id, sender);
        }
        if (receiver.id !== userId) {
          uniqueUsers.set(receiver.id, receiver);
        }
      });

      return Array.from(uniqueUsers.values());
    },

    messagesByUser: async (
      _,
      { receiverId, cursor, limit = 15 },
      { userId }
    ) => {
      if (!userId) throw new ForbiddenError("You must be logged in");

      const cursorDate = cursor
        ? new Date(parseInt(cursor)).toISOString()
        : undefined;

      const whereClause = {
        OR: [
          { senderId: userId, receiverId },
          { senderId: receiverId, receiverId: userId },
        ],
        createdAt: cursorDate ? { lt: cursorDate } : undefined,
      };

      const messages = await prisma.message.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        take: limit + 1, // Fetch one extra to check for the next page
        include: {
          sender: true, // Include sender details
        },
      });

      // Check if there's a next page
      const hasNextPage = messages.length > limit;
      // Slice if more messages were fetched than needed
      const edges = hasNextPage ? messages.slice(0, -1) : messages;

      // Reverse the messages here before sending to client
      return {
        edges: edges.reverse().map((message) => ({
          node: message,
        })),
        pageInfo: {
          endCursor: edges.length ? edges[0].createdAt : null, // Adjusted to the new last item in the list
          hasNextPage,
        },
      };
    },

    getCurrentUserStatus: async (_, args, { userId }) => {
      if (!userId) {
        throw new AuthenticationError(
          "You must be logged in to see the status"
        );
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, status: true },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return user;
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
        throw new AuthenticationError("email or password is invalid");
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

    updateUserStatus: async (_, { status }, { userId }) => {
      if (!userId) throw new ForbiddenError("You must be logged in");

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { status },
      });

      return updatedUser;
    },

    addFriend: async (_, { friendId }, { userId }) => {
      if (!userId) throw new ForbiddenError("You must be logged in");

      // Validate the friendId exists
      const friend = await prisma.user.findUnique({
        where: { id: friendId },
        select: { id: true, firstName: true, lastName: true, status: true },
      });

      if (!friend) {
        throw new Error("User not found");
      }

      return {
        id: friend.id,
        firstName: friend.firstName,
        lastName: friend.lastName,
        status: friend.status,
      };
    },

    removeFriend: async (_, { friendId }, { userId }) => {
      if (!userId) throw new ForbiddenError("You must be logged in");

      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          friends: {
            disconnect: { id: friendId },
          },
        },
      });

      return user;
    },
  },

  Subscription: {
    messageAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(MESSAGE_ADDED),
        (payload, variables, context) => {
          return payload.messageAdded.receiverId === context.userId;
        }
      ),
    },
  },
};

export default resolvers;
