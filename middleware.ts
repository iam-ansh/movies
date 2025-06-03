export { default } from "next-auth/middleware";

// Optionally, you can export a config object for type safety or advanced usage
export const config = {
  matcher: ["/home"],
};