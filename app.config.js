import 'dotenv/config';

export default {
  expo: {
    name: "front_native",
    slug: "front_native",
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL,
    },
  },
};
