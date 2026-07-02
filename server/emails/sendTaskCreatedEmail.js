import { resend } from "../Services/emailService.js";

export  const sendTaskCreatedEmail = async ({ email, name, taskTitle }) => {
  console.log("Data", email, name, taskTitle);

  try {
    const response = await resend.emails.send({
      from: "TaskMe <onboarding@resend.dev>",
      to: email,
      subject: "New Task Assigned",
      html: `<h1>Hello SunBeannians ${name}</h1><p>Task: ${taskTitle}</p>`,
    });

    console.log("Resend response:", response);
    return response; // ✅ THIS FIXES YOUR ISSUE
  } catch (error) {
    console.log("Email error:", error);
    throw error;
  }
};
