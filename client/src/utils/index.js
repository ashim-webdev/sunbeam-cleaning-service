export const formatDate = (date) => {
  // Get the month, day, and year
  const month = date.toLocaleString("en-US", { month: "short" });
  const day = date.getDate();
  const year = date.getFullYear();

  const formattedDate = `${day}-${month}-${year}`;

  return formattedDate;
};

export function dateFormatter(dateString) {
  const inputDate = new Date(dateString);

  if (isNaN(inputDate)) {
    return "Invalid Date";
  }

  const year = inputDate.getFullYear();
  const month = String(inputDate.getMonth() + 1).padStart(2, "0");
  const day = String(inputDate.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}

export function getInitials(fullName) {
  const names = fullName.split(" ");

  const initials = names.slice(0, 2).map((name) => name[0].toUpperCase());

  const initialsStr = initials.join("");

  return initialsStr;
}

export const PRIORITY_STYLES = {
  high: "text-red-600",
  medium: "text-yellow-600",
  low: "text-[#4CAF50]",
  normal: "text-[#0004ff]"
};

export const TASK_TYPE = {
  todo: "bg-blue-600",
  "in progress": "bg-yellow-600",
  completed: "bg-green-600",
};

export const TASK_HEADER = {
  todo: "bg-blue-600/70",
  "in progress": "bg-yellow-600/70",
  completed: "bg-green-600/70",
};

export const TASK_ICON = {
  todo: {
    icon: "fa-solid fa-folder-open",
    color: "text-blue-600"
  },
  "in progress": {
    icon: "fa-solid fa-alarm-clock",
    color: "text-yellow-600"
  },
  completed: {
    icon: "fa-solid fa-check-double",
    color: "text-green-600"
  },
};


export const BGS = [
  "bg-blue-600",
  "bg-yellow-600",
  "bg-red-600",
  "bg-green-600",
  "bg-chocolate-500"
];