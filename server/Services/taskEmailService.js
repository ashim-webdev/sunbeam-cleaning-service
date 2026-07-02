import { resend } from "./emailService.js";
import TaskCreatedEmail from "../emails/TaskCreatedEmail.js";

export const sendTaskCreatedEmail = async ({
  email,
  name,
  taskTitle,
}) => {
  try {
    const response = await resend.emails.send({
      from: "TaskMe <onboarding@resend.dev>",
      to: email,
      subject: "New Task Assigned",

      react: TaskCreatedEmail({
        name,
        taskTitle,
      }),
    });

    console.log(response);
  } catch (error) {
    console.log(error);
  }
};