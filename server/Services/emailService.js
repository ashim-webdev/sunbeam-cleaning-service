import { Resend } from "resend";

export const resend = new Resend(
  process.env.RESEND_API_KEY
);

console.log("API KEY:", process.env.RESEND_API_KEY);