import img1 from "../img/image.png"
import img2 from "../img/neco.jpeg"
import office1 from "../img/office1.jpg"
import office2 from "../img/office2.jpg"
import office3 from "../img/office3.jpg"
import office4 from "../img/office4.jpg"

import m1 from "../img/m1.jpg"
import m2 from "../img/m2.jpg"
import m3 from "../img/m3.jpg"
import m4 from "../img/m4.jpg"
import m5 from "../img/m5.jpg"
import m6 from "../img/m6.jpg"
import m7 from "../img/m7.jpg"




export const summary = {
  totalTasks: 48,
    // 👇 NEW (dummy last month stats)
  lastMonth: {
    totalTasks: 58,
    tasks: {
      completed: 32,
      "in progress": 15,
      todo: 11,
    },
    month: "January 2024",
  },

  last10Task: [
    {
      _id: "65c5f12ab5204a81bde866a9",
      title: "Office Clean Up",
      clientName: "Jasmine Ajamogha Edirin",
      address: "Jikwoyi phase 2 extention, Abuja",
      date: "2024-02-09T00:00:00.000Z",
      priority: "low",
      stage: "todo",
      assets: [
        "https://firebasestorage.googleapis.com/v0/b/taskmanager-557d7.appspot.com/o/1707471138863original-a005132062ca5bafc505c4c74f0e1865.jpg?alt=media&token=55f909f2-7f05-42f3-af4f-dc7f87cdea1d",
        "https://firebasestorage.googleapis.com/v0/b/taskmanager-557d7.appspot.com/o/1707471144712PsZch9E1_400x400.jpg?alt=media&token=7ce62c7e-c240-4032-83c6-bb6c9cdc0d4b",
      ],
      team: [
        {
          _id: "65c317360fd860f958baa08e",
          img: m1,
          name: "Alex Johnson",
          title: "Sanitation Specialist",
          email: "alex.johnson@example.com",
          isLeader: false
        },
        {
          _id: "65c3176a0fd860f958baa099",
          img: m5,
          name: "Ashimo Stephen",
          title: "Home Care Technician",
          email: "emily.wilson@example.com",
          isLeader: false
        },
        {
          _id: "65c317980fd860f958baa099",
          img: m2,
          name: "Emily Wilson",
          title: "Carpet Expert",
          email: "emily.wilson@example.com",
          isLeader: false
        },
        {
          _id: "65c31798099d860f958baa099",
          img: m4,
          name: "Emily Wilson",
          title: "Residential Cleaning Specialist",
          email: "emily.wilson@example.com",
          isLeader: false
        },
        {
          _id: "65c3179809906860f958baa099",
          img: m6,
          name: "Emily Wilson",
          title: "Office Sanitation Expert",
          email: "emily.wilson@example.com",
          isLeader: true
        },
        {
          _id: "65c3179809978860f958baa099",
          img: m7,
          name: "Emily Wilson",
          title: "Window Cleaning Specialist",
          email: "emily.wilson@example.com",
          isLeader: false
        },
        {
          _id: "65c3179809906860f958baa099",
          img: m1,
          name: "Emily Wilson",
          title: "Floor Care Technician",
          email: "emily.wilson@example.com",
          isLeader: false
        },
      ],
      isTrashed: false,
      activities: [],
      subTasks: [
        {
          title: "Task manager youtube tutorial",
          date: "2024-02-09T00:00:00.000Z",
          tag: "tutorial",
          _id: "65c5f153b5204a81bde866c8",
        },
      ],
      createdAt: "2024-02-09T09:32:26.574Z",
      updatedAt: "2024-02-09T09:36:53.339Z",
      __v: 1,
    },
    {
      _id: "65c5d547660756f6fd453a7a",
      title: "Home renovation clean up",
      clientName: "Favour Peter Asiwaju",
      address: "Kuje tipper garage, 1000 unit, Abuja",
      date: "2024-02-09T00:00:00.000Z",
      priority: "medium",
      stage: "in progress",
      assets: [],
      team: [
        {
          _id: "65c317360f9787860f958baa08e",
          img: m5,
          name: "Alex Johnson",
          title: "UX Designer",
          role: "Designer",
          email: "alex.johnson@example.com",
          isLeader: false
        },
        {
          _id: "65c3176a0fd860f958baa099",
          img: m1,
          name: "Emily Wilson",
          title: "Data Analyst",
          role: "Analyst",
          email: "emily.wilson@example.com",
          isLeader: false
        },
        {
          _id: "65c317360fde343d860f958baa08e",
          img: m4,
          name: "Alex Johnson",
          title: "UX Designer",
          role: "Designer",
          email: "alex.johnson@example.com",
          isLeader: true
        },
        {
          _id: "65c317360fd09887860f958baa08e",
          img: m6,
          name: "Alex Johnson",
          title: "UX Designer",
          role: "Designer",
          email: "alex.johnson@example.com",
          isLeader: false
        },
      ],
      isTrashed: false,
      activities: [
        {
          type: "started",
          activity: "Project started",
          date: "2024-02-09T09:16:56.623Z",
          by: "65c202d4aa62f32ffd1303cc",
          _id: "65c5f18bb5204a81bde866d1",
        },
        {
          type: "commented",
          activity: "i like coding!!",
          date: "2024-02-09T09:16:56.623Z",
          by: "65c202d4aa62f32ffd1303cc",
          _id: "65c5f19eb5204a81bde866dd",
        },
        {
          type: "bug",
          activity: "bug found",
          date: "2024-02-09T09:16:56.623Z",
          by: "65c202d4aa62f32ffd1303cc",
          _id: "65c5f1abb5204a81bde866eb",
        },
      ],
      subTasks: [
        {
          title: "Blog App Admin Dashboard",
          date: "2024-02-08T00:00:00.000Z",
          tag: "Website App",
          _id: "65c3535476ed5c48f9440973",
        },
      ],
      createdAt: "2024-02-09T07:33:27.590Z",
      updatedAt: "2024-02-09T09:36:10.386Z",
      __v: 4,
    },
    {
      _id: "65c46026af6ec0118be9407a",
      title: "Backyard Cleaning up",
      clientName: "Jennifer smith",
      address: "Karu abuja clinic estate, Abuja",
      date: "2024-02-07T00:00:00.000Z",
      priority: "high",
      stage: "todo",
      assets: [
        "https://firebasestorage.googleapis.com/v0/b/taskmanager-557d7.appspot.com/o/1707410130023hand-holding-writing-checklist-application-form-document-clipboard-white-background-3d-illustration.jpg?alt=media&token=08de4848-517f-48ca-a9b4-624744d5ddb0",
        "https://firebasestorage.googleapis.com/v0/b/taskmanager-557d7.appspot.com/o/1707412301523image_processing20220706-26930-ktfgon.png?alt=media&token=6cd185c1-9fc3-4f52-bb0b-0d4a29e65b85",
        "https://firebasestorage.googleapis.com/v0/b/taskmanager-557d7.appspot.com/o/1707412306237image_processing20220706-11953-1f826f4.png?alt=media&token=7270475f-a994-41fd-8ae6-62e00f72b0b3",
      ],
      team: [
        {
          _id: "65c202d4aa62f32ffd1303cc",
          img: m7,
          name: "Codewave Asante",
          title: "Administrator",
          role: "Admin",
          email: "admin@gmail.com",
          isLeader: false
        },
        {
          _id: "65c27a0e18c0a1b750ad5cad",
          img: m6,
          name: "John Doe",
          title: "Software Engineer",
          role: "Developer",
          email: "john.doe@example.com",
          isLeader: false
        },
        {
          _id: "65c30b96e639681a13def0b5",
          img: m3,
          name: "Jane Smith",
          title: "Product Manager",
          role: "Manager",
          email: "jane.smith@example.com",
          isLeader: false
        },
        {
          _id: "65c317360f345d860f958baa08e",
          img: m2,
          name: "Alex Johnson",
          title: "UX Designer",
          role: "Designer",
          email: "alex.johnson@example.com",
          isLeader: false
        },
        {
          _id: "65c317360f908887860f958baa08e",
          img: m5,
          name: "Alex Johnson",
          title: "UX Designer",
          role: "Designer",
          email: "alex.johnson@example.com",
          isLeader: true
        },
      ],
      isTrashed: false,
      activities: [
        {
          type: "assigned",
          activity: "Test activity. Let's go!!!",
          date: "2024-02-08T17:55:34.353Z",
          by: "65c202d4aa62f32ffd1303cc",
          _id: "65c5188be1585cfa650b79c4",
        },
        {
          type: "in progress",
          activity: "Project is progress. Hiope to fin=ish soon!!",
          date: "2024-02-08T17:55:34.353Z",
          by: "65c202d4aa62f32ffd1303cc",
          _id: "65c518dce1585cfa650b79da",
        },
        {
          type: "bug",
          activity: "Bug found in the code. Kindly check and fixed ASAP!!!",
          date: "2024-02-08T18:13:14.717Z",
          by: "65c202d4aa62f32ffd1303cc",
          _id: "65c51a5e8064df97d208b392",
        },
        {
          type: "commented",
          activity: "Nice work. Let's finished hard!!!",
          date: "2024-02-08T18:13:14.717Z",
          by: "65c202d4aa62f32ffd1303cc",
          _id: "65c51af08064df97d208b3b0",
        },
      ],
      subTasks: [
        {
          title: "Blog App Dashboard",
          date: "2024-02-06T00:00:00.000Z",
          tag: "Design",
          _id: "65c352e776ed5c48f944095c",
        },
        {
          title: "Blog App Admin Dashboard",
          date: "2024-02-07T00:00:00.000Z",
          tag: "Design",
          _id: "65c3531476ed5c48f9440965",
        },
      ],
      createdAt: "2024-02-08T05:01:26.983Z",
      updatedAt: "2024-02-09T06:51:15.005Z",
      __v: 8,
    },
    {
      _id: "65c45fb6af6ec0118be94052",
      title: "Task Manager Youtube Video",
      clientName: "Ashimonye Gabriel Ndubuisi",
      address: "Jikwoyi phase 2 extention, Abuja",
      date: "2024-02-11T00:00:00.000Z",
      priority: "medium",
      stage: "completed",
      assets: [
        "https://firebasestorage.googleapis.com/v0/b/taskmanager-557d7.appspot.com/o/1707412043078report.jpg?alt=media&token=41d02b42-c25c-4fbb-90a9-340a45f4bbe1",
        "https://firebasestorage.googleapis.com/v0/b/taskmanager-557d7.appspot.com/o/1707412052287hand-holding-writing-checklist-application-form-document-clipboard-white-background-3d-illustration.jpg?alt=media&token=98b360b4-954c-47e3-8283-8228a54a327c",
      ],
      team: [
        {
          _id: "65c317387877998fd860f958baa08e",
          img: m4,
          name: "Alex Johnson",
          title: "UX Designer",
          role: "Designer",
          email: "alex.johnson@example.com",
          isLeader: false
        },
        {
          _id: "65c3176a0fd860f958baa099",
          img: m5,
          name: "Emily Wilson",
          title: "Data Analyst",
          role: "Analyst",
          email: "emily.wilson@example.com",
          isLeader: true
        },
        {
          _id: "65c3173665688860f958baa08e",
          img: m1,
          name: "Alex Johnson",
          title: "UX Designer",
          role: "Designer",
          email: "alex.johnson@example.com",
          isLeader: false
        },
        {
          _id: "65c317360fd8989f958baa08e",
          img: m7,
          name: "Alex Johnson",
          title: "UX Designer",
          role: "Designer",
          email: "alex.johnson@example.com",
          isLeader: false
        },
      ],
      isTrashed: false,
      activities: [
        {
          type: "completed",
          activity: "Project completed!!",
          date: "2024-02-08T18:13:14.717Z",
          by: "65c202d4aa62f32ffd1303cc",
          _id: "65c51b998064df97d208b3f9",
        },
      ],
      subTasks: [
        {
          title: "Blog App Admin Dashboard",
          date: "2024-02-08T00:00:00.000Z",
          tag: "Website App",
          _id: "65c3535476ed5c48f9440973",
        },
      ],
      createdAt: "2024-02-08T04:59:34.826Z",
      updatedAt: "2024-02-09T06:51:15.005Z",
      __v: 3,
    },
    {
      _id: "65c4586f0548279012f8c256",
      title: "Bug Fixing",
      clientName: "Paul Salama",
      address: "Gwagwalada, Abuja",
      date: "2024-02-07T00:00:00.000Z",
      priority: "high",
      stage: "todo",
      assets: [
        "https://firebasestorage.googleapis.com/v0/b/taskmanager-557d7.appspot.com/o/1707412457946Wed%20Dev%20Course.png?alt=media&token=028416bf-88c6-4738-9a5a-d90e6d53b202",
        "https://firebasestorage.googleapis.com/v0/b/taskmanager-557d7.appspot.com/o/1707412466672original-380755132e03e80a9fa3ef1203219cf3.png?alt=media&token=10d96b0d-feea-4627-aa1e-9b8f87cf7500",
        "https://firebasestorage.googleapis.com/v0/b/taskmanager-557d7.appspot.com/o/1707412469358original-a738b8d0cbced29ae8609072d006fbcb.jpg?alt=media&token=9a6cc56f-63ff-4405-b978-d962c3c1f1d0",
        "https://firebasestorage.googleapis.com/v0/b/taskmanager-557d7.appspot.com/o/1707412472346cosial.png?alt=media&token=b6e427b3-bc36-4fa2-a8f9-438f9ebf93e2",
        "https://firebasestorage.googleapis.com/v0/b/taskmanager-557d7.appspot.com/o/1707412478590original-a005132062ca5bafc505c4c74f0e1865.jpg?alt=media&token=e81047bd-a1e2-49e5-85f5-feda31c423f2",
      ],
      team: [
        {
          _id: "65c30b96e639681a13def0b5",
          img: m3,
          name: "Jane Smith",
          title: "Product Manager",
          role: "Manager",
          email: "jane.smith@example.com",
          isLeader: false
        },
        {
          _id: "65c202d4aa62f32ffd1303cc",
          img: m1,
          name: "Codewave Asante",
          title: "Administrator",
          role: "Admin",
          email: "admin@gmail.com",
          isLeader: false
        },
        {
          _id: "65c31736778860f958baa08e",
          img: m5,
          name: "Alex Johnson",
          title: "UX Designer",
          role: "Designer",
          email: "alex.johnson@example.com",
          isLeader: true
        },
        {
          _id: "65c317369898d860f958baa08e",
          img: m7,
          name: "Alex Johnson",
          title: "UX Designer",
          role: "Designer",
          email: "alex.johnson@example.com",
          isLeader: false
        },
        {
          _id: "65c31736087979d860f958baa08e",
          img: m3,
          name: "Alex Johnson",
          title: "UX Designer",
          role: "Designer",
          email: "alex.johnson@example.com",
          isLeader: false
        },
      ],
      isTrashed: false,
      activities: [
        {
          type: "commented",
          activity: "Great!!!",
          date: "2024-02-08T18:13:14.717Z",
          by: "65c202d4aa62f32ffd1303cc",
          _id: "65c51b678064df97d208b3d6",
        },
      ],
      subTasks: [
        {
          title: "Check Login code and fix bugs asap",
          date: "2024-02-08T00:00:00.000Z",
          tag: "Bug Fixing",
          _id: "65c46074af6ec0118be94094",
        },
      ],
      createdAt: "2024-02-08T04:28:31.966Z",
      updatedAt: "2024-02-09T06:51:15.005Z",
      __v: 3,
    },
    {
      _id: "65c3c457fb9c6768ce4bc31a",
      title: "Duplicate - Website Project Proposal",
      clientName: "Francis Emmanuel",
      address: "Gwarimpa Third Gate Lapo, Abuja",
      date: "2024-02-07T17:55:13.218Z",
      priority: "high",
      stage: "todo",
      assets: [],
      team: [
        {
          _id: "65c202d4aa62f32ffd1303cc",
          img: m4,
          name: "Codewave Asante",
          title: "Administrator",
          role: "Admin",
          email: "admin@gmail.com",
          isLeader: false
        },
        {
          _id: "65c27a0e18c0a1b750ad5cad",
          img: m1,
          name: "John Doe",
          title: "Software Engineer",
          role: "Developer",
          email: "john.doe@example.com",
          isLeader: true
        },
        {
          _id: "65c30b96e639681a13def0b5",
          img: m7,
          name: "Jane Smith",
          title: "Product Manager",
          role: "Manager",
          email: "jane.smith@example.com",
          isLeader: false
        },
        {
          _id: "65c317360fd860f958baa08e",
          img: m3,
          name: "Alex Johnson",
          title: "UX Designer",
          role: "Designer",
          email: "alex.johnson@example.com",
          isLeader: false
        },
        {
          _id: "65c3178780fd860f958baa08e",
          img: m6,
          name: "Alex Johnson",
          title: "UX Designer",
          role: "Designer",
          email: "alex.johnson@example.com",
          isLeader: false
        },
      ],
      isTrashed: false,
      activities: [],
      subTasks: [
        {
          title: "Blog App Dashboard",
          date: "2024-02-06T00:00:00.000Z",
          tag: "Design",
          _id: "65c352e776ed5c48f944095c",
        },
        {
          title: "Blog App Admin Dashboard",
          date: "2024-02-07T00:00:00.000Z",
          tag: "Design",
          _id: "65c3531476ed5c48f9440965",
        },
      ],
      createdAt: "2024-02-07T17:56:39.969Z",
      updatedAt: "2024-02-09T06:51:15.005Z",
      __v: 1,
    },
    {
      _id: "65c3c439fb9c6768ce4bc308",
      title: "Duplicate - Review Code Changes",
      clientName: "Harvest Suliman",
      address: "Kurudu barracks, Abuja",
      date: "2024-02-07T17:55:13.218Z",
      priority: "medium",
      stage: "in progress",
      assets: [],
      team: [
        {
          _id: "65c317360fd8yt7t655f958baa08e",
          img: m7,
          name: "Alex Johnson",
          title: "UX Designer",
          role: "Designer",
          email: "alex.johnson@example.com",
          isLeader: true
        },
        {
          _id: "65c3176a0fd860f958baa099",
          img: m6,
          name: "Emily Wilson",
          title: "Data Analyst",
          role: "Analyst",
          email: "emily.wilson@example.com",
          isLeader: false
        },
        {
          _id: "65c317667t0fd860f958baa08e",
          img: m2,
          name: "Alex Johnson",
          title: "UX Designer",
          role: "Designer",
          email: "alex.johnson@example.com",
          isLeader: false
        },
        {
          _id: "65c31736fg8g0d860f958baa08e",
          img: m3,
          name: "Alex Johnson",
          title: "UX Designer",
          role: "Designer",
          email: "alex.johnson@example.com",
          isLeader: false
        },
      ],
      isTrashed: false,
      activities: [],
      subTasks: [
        {
          title: "Blog App Admin Dashboard",
          date: "2024-02-08T00:00:00.000Z",
          tag: "Website App",
          _id: "65c3535476ed5c48f9440973",
        },
      ],
      createdAt: "2024-02-07T17:56:09.174Z",
      updatedAt: "2024-02-07T17:56:09.456Z",
      __v: 1,
    },
    {
      _id: "65c3c21f55ae9b2f7666e86c",
      title: "Duplicate - Website Project Proposal",
      clientName: "Sam Smith",
      address: "Nyanya PopoLa, Abuja",
      date: "2024-02-07T17:46:56.040Z",
      priority: "normal",
      stage: "todo",
      assets: [],
      team: [
        {
          _id: "65c202d4aa62f32ffd1303cc",
          img: m6,
          name: "Codewave Asante",
          title: "Administrator",
          role: "Admin",
          email: "admin@gmail.com",
          isLeader: false
        },
        {
          _id: "65c27a0e18c0a1b750ad5cad",
          img: m5,
          name: "John Doe",
          title: "Software Engineer",
          role: "Developer",
          email: "john.doe@example.com",
          isLeader: true
        },
        {
          _id: "65c30b96e639681a13def0b5",
          img: m4,
          name: "Jane Smith",
          title: "Product Manager",
          role: "Manager",
          email: "jane.smith@example.com",
          isLeader: false
        },
        {
          _id: "65c317360fdy676t76f958baa08e",
          img: m3,
          name: "Alex Johnson",
          title: "UX Designer",
          role: "Designer",
          email: "alex.johnson@example.com",
          isLeader: false
        },
        {
          _id: "65c317360fd860f958baa08e",
          img: m2,
          name: "Alex Johnson",
          title: "UX Designer",
          role: "Designer",
          email: "alex.johnson@example.com",
          isLeader: false
        },
      ],
      isTrashed: false,
      activities: [],
      subTasks: [
        {
          title: "Blog App Dashboard",
          date: "2024-02-06T00:00:00.000Z",
          tag: "Design",
          _id: "65c352e776ed5c48f944095c",
        },
        {
          title: "Blog App Admin Dashboard",
          date: "2024-02-07T00:00:00.000Z",
          tag: "Design",
          _id: "65c3531476ed5c48f9440965",
        },
      ],
      createdAt: "2024-02-07T17:47:11.560Z",
      updatedAt: "2024-02-07T17:47:11.972Z",
      __v: 1,
    },
    {
      _id: "65c352b376ed5c48f9440955",
      title: "Review Code Changes",
      clientName: "Samuel Johnson",
      address: "Giri Junction, Abuja",
      date: "2024-02-05T00:00:00.000Z",
      priority: "medium",
      stage: "in progress",
      assets: [],
      team: [
        {
          _id: "65c317360fd860f958baa08e",
          img: m3,
          name: "Alex Johnson",
          title: "UX Designer",
          role: "Designer",
          email: "alex.johnson@example.com",
          isLeader: false
        },
        {
          _id: "65c3176a0fd860f958baa099",
          img: m7,
          name: "Emily Wilson",
          title: "Data Analyst",
          role: "Analyst",
          email: "emily.wilson@example.com",
          isLeader: false
        },
        {
          _id: "65c317ff70fd860f958baa08e",
          img: m2,
          name: "Alex Johnson",
          title: "UX Designer",
          role: "Designer",
          email: "alex.johnson@example.com",
          isLeader: false
        },
        {
          _id: "65c31736556fd860f958baa08e",
          img: m1,
          name: "Alex Johnson",
          title: "UX Designer",
          role: "Designer",
          email: "alex.johnson@example.com",
          isLeader: true
        },
      ],
      isTrashed: false,
      activities: [],
      subTasks: [
        {
          title: "Blog App Admin Dashboard",
          date: "2024-02-08T00:00:00.000Z",
          tag: "Website App",
          _id: "65c3535476ed5c48f9440973",
        },
      ],
      createdAt: "2024-02-07T09:51:47.149Z",
      updatedAt: "2024-02-07T09:54:28.645Z",
      __v: 1,
    },
    {
      _id: "65c351b976ed5c48f9440947",
      title: "Website Project Proposal",
      clientName: "Michael Brown",
      address: "Karimu Police Station, Abuja",
      date: "2024-02-07T00:00:00.000Z",
      priority: "high",
      stage: "todo",
      assets: [],
      team: [
        {
          _id: "65c202d4aa62f32ffd1303cc",
          // img: m1,
          name: "Codewave Asante",
          title: "Administrator",
          role: "Admin",
          email: "admin@gmail.com",
          isLeader: true
        },
        {
          _id: "65c27a0e18c0a1b750ad5cad",
          img: m2,
          name: "John Doe",
          title: "Software Engineer",
          role: "Developer",
          email: "john.doe@example.com",
          isLeader: false
        },
        {
          _id: "65c30b96e639681a13def0b5",
          img: m3,
          name: "Jane Smith",
          title: "Product Manager",
          role: "Manager",
          email: "jane.smith@example.com",
          isLeader: false
        },
        {
          _id: "65c31736fgf5860f958baa08e",
          img: m4,
          name: "Alex Johnson",
          title: "UX Designer",
          role: "Designer",
          email: "alex.johnson@example.com",
          isLeader: false
        },
        {
          _id: "65c317360fd860f958baa08e",
          img: m6,
          name: "Alex Johnson",
          title: "UX Designer",
          role: "Designer",
          email: "alex.johnson@example.com",
          isLeader: false
        },
      ],
      isTrashed: false,
      activities: [],
      subTasks: [
        {
          title: "Blog App Dashboard",
          date: "2024-02-06T00:00:00.000Z",
          tag: "Design",
          _id: "65c352e776ed5c48f944095c",
        },
        {
          title: "Blog App Admin Dashboard",
          date: "2024-02-07T00:00:00.000Z",
          tag: "Design",
          _id: "65c3531476ed5c48f9440965",
        },
      ],
      createdAt: "2024-02-07T09:47:37.337Z",
      updatedAt: "2024-02-07T09:53:24.079Z",
      __v: 2,
    },
  ],
  users: [
    {
      _id: "65c5f27fb5204a81bde86833",
      img: m1,
      name: "New User",
      email: "user@gmail.com",
      title: "Designer",
      role: "Developer",
      isActive: false,
      createdAt: "2024-02-09T09:38:07.765Z",
      tiktok: "https://www.google.com",
      youtube: "",
      whatsApp: "",
      telegram: "",
    },
    {
      _id: "65c3176a0fd860f958baa099",
      img: m2,
      name: "Emily Wilson",
      email: "emilyWilson@gmail.com",
      title: "Data Analyst",
      role: "Analyst",
      isActive: true,
      createdAt: "2024-02-07T05:38:50.816Z",
      tiktok: "",
      youtube: "",
      whatsApp: "",
      telegram: "",
    },
    {
      _id: "65c317360fd860f958baa08e",
      // img: m3,
      name: "Alex Johnson",
      email: "alexJohnson@gmail.com",
      title: "UX Designer",
      role: "Designer",
      isActive: true,
      createdAt: "2024-02-07T05:37:58.862Z",
      tiktok: "",
      youtube: "",
      whatsApp: "",
      telegram: "",
    },
    {
      _id: "65c30b96e639681a13def0b5",
      img: m4,
      name: "Jane Smith",
      email: "janeSmith@gmail.com",
      title: "Product Manager",
      role: "Manager",
      isActive: false,
      createdAt: "2024-02-07T04:48:22.519Z",
      tiktok: "",
      youtube: "",
      whatsApp: "",
      telegram: "",
    },
    {
      _id: "65c202d4aa62f32ffd1303cc",
      img: m5,
      name: "Codewave Asante",
      email: "codeAsa@gmail.com",
      title: "Administrator",
      role: "Admin",
      createdAt: "2024-02-06T09:58:44.794Z",
      isActive: true,
      tiktok: "",
      youtube: "",
      whatsApp: "",
      telegram: "",
    },
  ],
  tasks: {
    todo: 12,
    "in progress": 9,
    completed: 26,
  },
};

export const pieData = [
  {
    name: "Total Task",
    total: 48,
  },
  {
    name: "In Progress",
    total: 15,
  },
  {
    name: "Todo",
    total: 11,
  },
  {
    name: "Completed",
    total: 32,
  },
]

export const chartData = [
  {
    name: "High",
    total: 3500,
  },
  {
    name: "Medium",
    total: 2500,
  },
  {
    name: "Normal",
    total: 1500,
  },
  {
    name: "Low",
    total: 800,
  },
];
















export const tasks = [
  {
    _id: "65c5f12ab5204a81bde866a9",
    title: "Office Clean Up",
    clientName: "Jasmine Ajamogha Edirin",
    address: "Jikwoyi phase 2 extention, Abuja",
    date: "2024-02-09T00:00:00.000Z",
    priority: "low",
    stage: "todo",
    assets: [
      img1,
      img2,
      img2,
      img2,
      img2,
    ],
    team: [
      {
        _id: "65c317360fd860f958baa08e",
        img: m1,
        name: "Alex Johnson",
        title: "Sanitation Specialist",
        email: "alex.johnson@example.com",
        isLeader: false
      },
      {
        _id: "65c3176a0fd860f958baa099",
        img: m2,
        name: "Ashimo Stephen",
        title: "Home Care Technician",
        email: "emily.wilson@example.com",
        isLeader: false
      },
      {
        _id: "65c317980fd860f958baa099",
        img: m3,
        name: "Emily Wilson",
        title: "Carpet Expert",
        email: "emily.wilson@example.com",
        isLeader: false
      },
      {
        _id: "65c31798099d860f958baa099",
        img: m4,
        name: "Emily Wilson",
        title: "Residential Cleaning Specialist",
        email: "emily.wilson@example.com",
        isLeader: false
      },
      {
        _id: "65c3179809906860f958baa099",
        img: m5,
        name: "Emily Wilson",
        title: "Office Sanitation Expert",
        email: "emily.wilson@example.com",
        isLeader: true
      },
      {
        _id: "65c3179809978860f958baa099",
        img: m6,
        name: "Emily Wilson",
        title: "Window Cleaning Specialist",
        email: "emily.wilson@example.com",
        isLeader: false
      },
      {
        _id: "65c3179809906860f958baa099",
        img: m7,
        name: "Emily Wilson",
        title: "Floor Care Technician",
        email: "emily.wilson@example.com",
        isLeader: false
      },
    ],
    isTrashed: false,
    activities: [],
    subTasks: [
      {
        title: "Roof and solar panel cleaning",
        date: "2024-02-09T00:00:00.000Z",
        tag: "House cleaning",
        _id: "65c5f153b5204a81bde866c8",
      },
    ],
    createdAt: "2024-02-09T09:32:26.574Z",
    updatedAt: "2024-02-09T09:36:53.339Z",
    __v: 1,
  },
  {
    _id: "65c5d547660756f6fd453a7a",
    title: "Home renovation clean up",
    clientName: "Favour Peter Asiwaju",
    address: "Kuje tipper garage, 1000 unit, Abuja",
    date: "2024-02-09T00:00:00.000Z",
    priority: "medium",
    stage: "in progress",
    assets: [],
    team: [
      {
        _id: "65c317360fd860f958baa08e",
        img: m7,
        name: "Alex Johnson",
        title: "UX Designer",
        email: "alex.johnson@example.com",
        isLeader: true
      },
      {
        _id: "65c3176a0fd860f958baa099",
        img: m5,
        name: "Emily Wilson",
        title: "Data Analyst",
        email: "emily.wilson@example.com",
        isLeader: false
      },
      {
        _id: "65c3176a0fd860f98baa099",
        img: m2,
        name: "Emily Wilson",
        title: "Data Analyst",
        email: "emily.wilson@example.com",
        isLeader: false
      },
    ],
    isTrashed: false,
    activities: [
      {
        type: "started",
        activity: "Project started",
        date: "2024-02-09T09:16:56.623Z",
        by: "65c202d4aa62f32ffd1303cc",
        _id: "65c5f18bb5204a81bde866d1",
      },
      {
        type: "commented",
        activity: "i like coding!!",
        date: "2024-02-09T09:16:56.623Z",
        by: "65c202d4aa62f32ffd1303cc",
        _id: "65c5f19eb5204a81bde866dd",
      },
      {
        type: "bug",
        activity: "bug found",
        date: "2024-02-09T09:16:56.623Z",
        by: "65c202d4aa62f32ffd1303cc",
        _id: "65c5f1abb5204a81bde866eb",
      },
    ],
    subTasks: [
      {
        title: "Garden cleaning up",
        date: "2024-02-08T00:00:00.000Z",
        tag: "Renovation",
        _id: "65c3535476ed5c48f9440973",
      },
    ],
    createdAt: "2024-02-09T07:33:27.590Z",
    updatedAt: "2024-02-09T09:36:10.386Z",
    __v: 4,
  },
  {
    _id: "65c46026af6ec0118be9407a",
    title: "Backyard Cleaning up",
    clientName: "Jennifer smith",
    address: "Karu abuja clinic estate, Abuja",
    date: "2024-02-07T00:00:00.000Z",
    priority: "high",
    stage: "completed",
    assets: [
      "https://firebasestorage.googleapis.com/v0/b/taskmanager-557d7.appspot.com/o/1707410130023hand-holding-writing-checklist-application-form-document-clipboard-white-background-3d-illustration.jpg?alt=media&token=08de4848-517f-48ca-a9b4-624744d5ddb0",
      "https://firebasestorage.googleapis.com/v0/b/taskmanager-557d7.appspot.com/o/1707412301523image_processing20220706-26930-ktfgon.png?alt=media&token=6cd185c1-9fc3-4f52-bb0b-0d4a29e65b85",
      "https://firebasestorage.googleapis.com/v0/b/taskmanager-557d7.appspot.com/o/1707412306237image_processing20220706-11953-1f826f4.png?alt=media&token=7270475f-a994-41fd-8ae6-62e00f72b0b3",
    ],
    team: [
      {
        _id: "65c202d4aa62f32ffd1303cc",
        img: m6,
        name: "Codewave Asante",
        title: "Administrator",
        email: "admin@gmail.com",
        isLeader: false
      },
      {
        _id: "65c27a0e18c0a1b750ad5cad",
        img: m1,
        name: "John Doe",
        title: "Software Engineer",
        email: "john.doe@example.com",
        isLeader: false
      },
      {
        _id: "65c30b96e639681a13def0b5",
        img: m7,
        name: "Jane Smith",
        title: "Product Manager",
        email: "jane.smith@example.com",
        isLeader: false
      },
      {
        _id: "65c30b96e639681rd6a13def0b5",
        img: m4,
        name: "Jane Smith",
        title: "Product Manager",
        email: "jane.smith@example.com",
        isLeader: true
      },
    ],
    isTrashed: false,
    activities: [
      {
        type: "assigned",
        activity: "Test activity. Let's go!!!",
        date: "2024-02-08T17:55:34.353Z",
        by: "65c202d4aa62f32ffd1303cc",
        _id: "65c5188be1585cfa650b79c4",
      },
      {
        type: "in progress",
        activity: "Project is progress. Hiope to fin=ish soon!!",
        date: "2024-02-08T17:55:34.353Z",
        by: "65c202d4aa62f32ffd1303cc",
        _id: "65c518dce1585cfa650b79da",
      },
      {
        type: "bug",
        activity: "Bug found in the code. Kindly check and fixed ASAP!!!",
        date: "2024-02-08T18:13:14.717Z",
        by: "65c202d4aa62f32ffd1303cc",
        _id: "65c51a5e8064df97d208b392",
      },
      {
        type: "commented",
        activity: "Nice work. Let's finished hard!!!",
        date: "2024-02-08T18:13:14.717Z",
        by: "65c202d4aa62f32ffd1303cc",
        _id: "65c51af08064df97d208b3b0",
      },
    ],
    subTasks: [
      {
        title: "Children play ground cleaning up",
        date: "2024-02-06T00:00:00.000Z",
        tag: "Play ground",
        _id: "65c352e776ed5c48f944095c",
      },
      {
        title: "Blog App Admin Dashboard",
        date: "2024-02-07T00:00:00.000Z",
        tag: "Design",
        _id: "65c3531476ed5c48f9440965",
      },
    ],
    createdAt: "2024-02-08T05:01:26.983Z",
    updatedAt: "2024-02-09T06:51:15.005Z",
    __v: 8,
  },
  {
    _id: "65c45fb6af6ec0118be94052",
    title: "Office Clean Up",
    clientName: "Ashimonye Gabriel Ndubuisi",
    address: "Jikwoyi phase 2 extention, Abuja",
    date: "2024-02-11T00:00:00.000Z",
    priority: "medium",
    stage: "completed",
    assets: [
      office1,
      office2,
      office3,
      office4,
    ],
    team: [
      {
        _id: "65c317360fd860f958baa08e",
        img: m1,
        name: "Alex Johnson",
        title: "Sanitation Specialist",
        email: "alex.johnson@example.com",
        isLeader: false
      },
      {
        _id: "65c3176a0fd860f958baa099",
        img: m2,
        name: "Ashimo Stephen",
        title: "Home Care Technician",
        email: "emily.wilson@example.com",
        isLeader: false
      },
      {
        _id: "65c317980fd860f958baa099",
        img: m3,
        name: "Emily Wilson",
        title: "Carpet Expert",
        email: "emily.wilson@example.com",
        isLeader: false
      },
      {
        _id: "65c31798099d860f958baa099",
        img: m4,
        name: "Emily Wilson",
        title: "Residential Cleaning Specialist",
        email: "emily.wilson@example.com",
        isLeader: false
      },
      {
        _id: "65c3179809906860f958baa099",
        img: m5,
        name: "Emily Wilson",
        title: "Office Sanitation Expert",
        email: "emily.wilson@example.com",
        isLeader: true
      },
      {
        _id: "65c3179809978860f958baa099",
        img: m6,
        name: "Emily Wilson",
        title: "Window Cleaning Specialist",
        email: "emily.wilson@example.com",
        isLeader: false
      },
      {
        _id: "65c3179809906860f958baa099",
        img: m7,
        name: "Emily Wilson",
        title: "Floor Care Technician",
        email: "emily.wilson@example.com",
        isLeader: false
      },
    ],
    isTrashed: false,
    activities: [
      {
        type: "started",
        activity: "Project completed!!",
        date: "2024-02-08T18:13:14.717Z",
        by: { _id: "65c202d4aa62f32ffd1303cc", name: "Codewave" },
        _id: "65c51b998064dfd208b3f9",
      },
      {
        type: "commented",
        activity: "Project completed!!",
        date: "2024-02-08T18:13:14.717Z",
        by: { _id: "65c202d4aa62f32ffd1303cc", name: "Codewave" },
        _id: "65c51b98064df97d208b3f9",
      },
      {
        type: "completed",
        activity: "Project completed!!",
        date: "2024-02-08T18:13:14.717Z",
        by: { _id: "65c202d4aa62f32ffd1303cc", name: "Codewave" },
        _id: "65c51b998064df97d208b3f9",
      },
    ],
    subTasks: [
      {
        title: "Blog App Admin Dashboard",
        date: "2024-02-08T00:00:00.000Z",
        tag: "Website App",
        _id: "65c3535476ed5c48f9440973",
      },
    ],
    createdAt: "2024-02-08T04:59:34.826Z",
    updatedAt: "2024-02-09T06:51:15.005Z",
    __v: 3,
  },
  {
    _id: "65c4586f0548279012f8c256",
    title: "Bug Fixing",
    clientName: "Solomon clerk james",
    address: "Jikwoyi phase 2 extention, Abuja",
    date: "2024-02-07T00:00:00.000Z",
    priority: "high",
    stage: "todo",
    assets: [
      "https://firebasestorage.googleapis.com/v0/b/taskmanager-557d7.appspot.com/o/1707412457946Wed%20Dev%20Course.png?alt=media&token=028416bf-88c6-4738-9a5a-d90e6d53b202",
      "https://firebasestorage.googleapis.com/v0/b/taskmanager-557d7.appspot.com/o/1707412466672original-380755132e03e80a9fa3ef1203219cf3.png?alt=media&token=10d96b0d-feea-4627-aa1e-9b8f87cf7500",
      "https://firebasestorage.googleapis.com/v0/b/taskmanager-557d7.appspot.com/o/1707412469358original-a738b8d0cbced29ae8609072d006fbcb.jpg?alt=media&token=9a6cc56f-63ff-4405-b978-d962c3c1f1d0",
      "https://firebasestorage.googleapis.com/v0/b/taskmanager-557d7.appspot.com/o/1707412472346cosial.png?alt=media&token=b6e427b3-bc36-4fa2-a8f9-438f9ebf93e2",
      "https://firebasestorage.googleapis.com/v0/b/taskmanager-557d7.appspot.com/o/1707412478590original-a005132062ca5bafc505c4c74f0e1865.jpg?alt=media&token=e81047bd-a1e2-49e5-85f5-feda31c423f2",
    ],
    team: [
      {
        _id: "65c30b96e639681a13def0b5",
        img: m2,
        name: "Jane Smith",
        title: "Product Manager",
        email: "jane.smith@example.com",
        isLeader: true
      },
      {
        _id: "65c202d4aa62f32ffd1303cc",
        img: m4,
        name: "Codewave Asante",
        title: "Administrator",
        email: "admin@gmail.com",
        isLeader: false
      },
      {
        _id: "65c317360fd860f958baa08e",
        img: m6,
        name: "Alex Johnson",
        title: "UX Designer",
        email: "alex.johnson@example.com",
        isLeader: false
      },
    ],
    isTrashed: false,
    activities: [
      {
        type: "commented",
        activity: "Great!!!",
        date: "2024-02-08T18:13:14.717Z",
        by: "65c202d4aa62f32ffd1303cc",
        _id: "65c51b678064df97d208b3d6",
      },
    ],
    subTasks: [
      {
        title: "Check Login code and fix bugs asap",
        date: "2024-02-08T00:00:00.000Z",
        tag: "Bug Fixing",
        _id: "65c46074af6ec0118be94094",
      },
    ],
    createdAt: "2024-02-08T04:28:31.966Z",
    updatedAt: "2024-02-09T06:51:15.005Z",
    __v: 3,
  },
  {
    _id: "65c3c457fb9c6768ce4bc31a",
    title: "Duplicate - Website Project Proposal",
    clientName: "Jasmine Ajamogha Edirin",
    address: "Jikwoyi phase 2 extention, Abuja",
    date: "2024-02-07T17:55:13.218Z",
    priority: "high",
    stage: "todo",
    assets: [],
    team: [
      {
        _id: "65c202d4aa62f32ffd1303cc",
        img: m3,
        name: "Codewave Asante",
        title: "Administrator",
        email: "admin@gmail.com",
        isLeader: false
      },
      {
        _id: "65c27a0e18c0a1b750ad5cad",
        img: m7,
        name: "John Doe",
        title: "Software Engineer",
        email: "john.doe@example.com",
        isLeader: false
      },
      {
        _id: "65c30b96e639681a13def0b5",
        img: m4,
        name: "Jane Smith",
        title: "Product Manager",
        email: "jane.smith@example.com",
        isLeader: true
      },
    ],
    isTrashed: false,
    activities: [],
    subTasks: [
      {
        title: "Blog App Dashboard",
        date: "2024-02-06T00:00:00.000Z",
        tag: "Design",
        _id: "65c352e776ed5c48f944095c",
      },
      {
        title: "Blog App Admin Dashboard",
        date: "2024-02-07T00:00:00.000Z",
        tag: "Design",
        _id: "65c3531476ed5c48f9440965",
      },
    ],
    createdAt: "2024-02-07T17:56:39.969Z",
    updatedAt: "2024-02-09T06:51:15.005Z",
    __v: 1,
  },
  {
    _id: "65c3c439fb9c6768ce4bc308",
    title: "Duplicate - Review Code Changes",
    clientName: "Jasmine Ajamogha Edirin",
    address: "Jikwoyi phase 2 extention, Abuja",
    date: "2024-02-07T17:55:13.218Z",
    priority: "medium",
    stage: "in progress",
    assets: [],
    team: [
      {
        _id: "65c317360fd860f958baa08e",
        img: m1,
        name: "Alex Johnson",
        title: "UX Designer",
        email: "alex.johnson@example.com",
        isLeader: true
      },
      {
        _id: "65c3176a0fd860f958baa099",
        img: m5,
        name: "Emily Wilson",
        title: "Data Analyst",
        email: "emily.wilson@example.com",
        isLeader: false
      },
    ],
    isTrashed: false,
    activities: [],
    subTasks: [
      {
        title: "Blog App Admin Dashboard",
        date: "2024-02-08T00:00:00.000Z",
        tag: "Website App",
        _id: "65c3535476ed5c48f9440973",
      },
    ],
    createdAt: "2024-02-07T17:56:09.174Z",
    updatedAt: "2024-02-07T17:56:09.456Z",
    __v: 1,
  },
  {
    _id: "65c3c21f55ae9b2f7666e86c",
    title: "Duplicate - Website Project Proposal",
    clientName: "Jasmine Ajamogha Edirin",
    address: "Jikwoyi phase 2 extention, Abuja",
    date: "2024-02-07T17:46:56.040Z",
    priority: "normal",
    stage: "todo",
    assets: [],
    team: [
      {
        _id: "65c202d4aa62f32ffd1303cc",
        img: m5,
        name: "Codewave Asante",
        title: "Administrator",
        email: "admin@gmail.com",
        isLeader: false
      },
      {
        _id: "65c27a0e18c0a1b750ad5cad",
        img: m4,
        name: "John Doe",
        title: "Software Engineer",
        email: "john.doe@example.com",
        isLeader: true
      },
      {
        _id: "65c30b96e639681a13def0b5",
        img: m2,
        name: "Jane Smith",
        title: "Product Manager",
        email: "jane.smith@example.com",
        isLeader: false
      },
    ],
    isTrashed: false,
    activities: [],
    subTasks: [
      {
        title: "Blog App Dashboard",
        date: "2024-02-06T00:00:00.000Z",
        tag: "Design",
        _id: "65c352e776ed5c48f944095c",
      },
      {
        title: "Blog App Admin Dashboard",
        date: "2024-02-07T00:00:00.000Z",
        tag: "Design",
        _id: "65c3531476ed5c48f9440965",
      },
    ],
    createdAt: "2024-02-07T17:47:11.560Z",
    updatedAt: "2024-02-07T17:47:11.972Z",
    __v: 1,
  },
  {
    _id: "65c352b376ed5c48f9440955",
    title: "Review Code Changes",
    clientName: "Jasmine Ajamogha Edirin",
    address: "Jikwoyi phase 2 extention, Abuja",
    date: "2024-02-05T00:00:00.000Z",
    priority: "medium",
    stage: "in progress",
    assets: [],
    team: [
      {
        _id: "65c317360fd860f958baa08e",
        img: m1,
        name: "Alex Johnson",
        title: "UX Designer",
        email: "alex.johnson@example.com",
        isLeader: false
      },
      {
        _id: "65c3176a0fd860f958baa099",
        img: m3,
        name: "Emily Wilson",
        title: "Data Analyst",
        email: "emily.wilson@example.com",
        isLeader: true
      },
    ],
    isTrashed: false,
    activities: [],
    subTasks: [
      {
        title: "Blog App Admin Dashboard",
        date: "2024-02-08T00:00:00.000Z",
        tag: "Website App",
        _id: "65c3535476ed5c48f9440973",
      },
    ],
    createdAt: "2024-02-07T09:51:47.149Z",
    updatedAt: "2024-02-07T09:54:28.645Z",
    __v: 1,
  },
  {
    _id: "65c351b976ed5c48f9440947",
    title: "Website Project Proposal",
    clientName: "Jasmine Ajamogha Edirin",
    address: "Jikwoyi phase 2 extention, Abuja",
    date: "2024-02-07T00:00:00.000Z",
    priority: "high",
    stage: "todo",
    assets: [],
    team: [
      {
        _id: "65c202d4aa62f32ffd1303cc",
        img: m4,
        name: "Codewave Asante",
        title: "Administrator",
        email: "admin@gmail.com",
        isLeader: false
      },
      {
        _id: "65c27a0e18c0a1b750ad5cad",
        img: m7,
        name: "John Doe",
        title: "Software Engineer",
        email: "john.doe@example.com",
        isLeader: false
      },
      {
        _id: "65c27a0e18c0a1b750ad5cad",
        img: m6,
        name: "John Doe",
        title: "Software Engineer",
        email: "john.doe@example.com",
        isLeader: false
      },
      {
        _id: "65c27a0e18c0a1b750ad5cad",
        img: m3,
        name: "John Doe",
        title: "Software Engineer",
        email: "john.doe@example.com",
        isLeader: false
      },
      {
        _id: "65c30b96e639681a13def0b5",
        img: m1,
        name: "Jane Smith",
        title: "Product Manager",
        email: "jane.smith@example.com",
        isLeader: true
      },
    ],
    isTrashed: false,
    activities: [],
    subTasks: [
      {
        title: "Blog App Dashboard",
        date: "2024-02-06T00:00:00.000Z",
        tag: "Design",
        _id: "65c352e776ed5c48f944095c",
      },
      {
        title: "Blog App Admin Dashboard",
        date: "2024-02-07T00:00:00.000Z",
        tag: "Design",
        _id: "65c3531476ed5c48f9440965",
      },
    ],
    createdAt: "2024-02-07T09:47:37.337Z",
    updatedAt: "2024-02-07T09:53:24.079Z",
    __v: 2,
  },
];







export const user = {
  _id: "662f32ffd1303cc",
  name: "Codewave",
  title: "Administrator",
  role: "Admin",
  email: "admin@mts.com",
  isAdmin: true,
  tasks: [],
  createdAt: "2024-02-06T09:58:44.794Z",
  updatedAt: "2024-02-07T06:13:26.757Z",
  __v: 0,
  isActive: true,
};

export const activitiesData = [
  {
    _id: "0",
    type: "started",
    activity: "started this task.",
    date: new Date("2023-01-15").toISOString(),
    by: "Akwasi Asante",
  },
  {
    _id: "1",
    type: "commented",
    activity:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt nunc ipsum tempor purus vitae id. Morbi in vestibulum nec varius. Et diam cursus quis sed purus nam.",
    date: new Date("2023-01-15").toISOString(),
    by: "Eduardo Benz",
  },
  {
    _id: "2",
    type: "assigned",
    activity: "task to Codewave Asante",
    date: new Date("2023-01-15").toISOString(),
    by: "Akwasi Asante",
  },

  {
    _id: "3",
    type: "in progress",
    activity:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt nunc ipsum.",
    date: new Date("2024-01-15").toISOString(),
    by: "Jason Meyers",
  },
  {
    _id: "5",
    type: "bug",
    activity: "bug to Codewave Asante",
    date: new Date("2023-01-15").toISOString(),
    by: "Akwasi Asante",
  },
  {
    _id: "4",
    type: "completed",
    activity: "Codewave Asante has completed the task assigned",
    date: new Date("2023-01-15").toISOString(),
    by: "Akwasi Asante",
  },
];



export const initialMockEvents = [
  {
    id: '1',
    title: 'Team Standup',
    description: 'Daily team synchronization meeting to discuss progress and blockers.',
    date: '2026-03-05',
    startTime: '09:00',
    endTime: '09:30',
  },
  {
    id: '2',
    title: 'Product Launch',
    description: 'Official launch of our new product line. All hands on deck!',
    date: '2026-03-15',
    startTime: '14:00',
    endTime: '16:00',
  },
  {
    id: '3',
    title: 'Client Presentation',
    description: 'Present Q1 results and roadmap to key stakeholders.',
    date: '2026-03-20',
    startTime: '10:00',
    endTime: '11:30',
  },
  {
    id: '4',
    title: 'Sprint Planning',
    description: 'Plan the next sprint with the development team.',
    date: '2026-03-10',
    startTime: '13:00',
    endTime: '15:00',
  },
  {
    id: '5',
    title: 'Team Building Event',
    description: 'Company-wide team building activities and networking.',
    date: '2026-03-28',
    startTime: '12:00',
    endTime: '17:00',
  },
  {
    id: '6',
    title: 'Design Review',
    description: 'Review new UI/UX designs for the mobile app.',
    date: '2026-03-12',
    startTime: '15:00',
    endTime: '16:00',
  },
  {
    id: '7',
    title: 'Board Meeting',
    description: 'Quarterly board meeting with investors and executives.',
    date: '2026-03-25',
    startTime: '09:00',
    endTime: '12:00',
  },
  {
    id: '8',
    title: 'Training Session',
    description: 'New employee onboarding and training program.',
    date: '2026-03-18',
    startTime: '10:00',
    endTime: '12:00',
  },
  {
    id: '9',
    title: 'Code Review',
    description: 'Weekly code review session with senior developers.',
    date: '2026-03-05',
    startTime: '14:00',
    endTime: '15:00',
  },
  {
    id: '10',
    title: 'Marketing Campaign Kickoff',
    description: 'Launch our new marketing campaign across all channels.',
    date: '2026-03-22',
    startTime: '11:00',
    endTime: '12:30',
  },
];




export const dummyEvents = [
  {
    Id: 1,
    Subject: 'Staff Vacation Week',
    Description: 'Annual company-wide vacation period. Office will be operating with minimal staff.',
    StartTime: new Date(2026, 2, 10, 9, 0),
    EndTime: new Date(2026, 2, 14, 18, 0),
    Location: 'Company-wide',
    Color: '#4F46E5'
  },
  {
    Id: 2,
    Subject: 'Company All-Hands Meeting',
    Description: 'Quarterly review and planning session. All team members required to attend.',
    StartTime: new Date(2026, 2, 5, 10, 0),
    EndTime: new Date(2026, 2, 5, 12, 0),
    Location: 'Conference Room A',
    Color: '#10B981'
  },
  {
    Id: 3,
    Subject: 'Project Alpha Deadline',
    Description: 'Final deliverable due for Project Alpha. All development work must be completed.',
    StartTime: new Date(2026, 2, 15, 17, 0),
    EndTime: new Date(2026, 2, 15, 18, 0),
    Location: 'Development Team',
    Color: '#EF4444'
  },
  {
    Id: 4,
    Subject: 'Server Maintenance',
    Description: 'Scheduled maintenance window. Systems may be temporarily unavailable.',
    StartTime: new Date(2026, 2, 20, 22, 0),
    EndTime: new Date(2026, 2, 21, 2, 0),
    Location: 'Data Center',
    Color: '#F59E0B'
  },
  {
    Id: 5,
    Subject: 'Team Building Event',
    Description: 'Annual team building activities. Casual dress code. Lunch provided.',
    StartTime: new Date(2026, 2, 25, 11, 0),
    EndTime: new Date(2026, 2, 25, 16, 0),
    Location: 'City Park Pavilion',
    Color: '#8B5CF6'
  },
  {
    Id: 6,
    Subject: 'Product Launch Review',
    Description: 'Review meeting for upcoming product launch. Marketing and Sales teams to present.',
    StartTime: new Date(2026, 2, 3, 14, 0),
    EndTime: new Date(2026, 2, 3, 16, 0),
    Location: 'Conference Room B',
    Color: '#06B6D4'
  },
  {
    Id: 7,
    Subject: 'Client Presentation',
    Description: 'Quarterly business review with top tier client. Executive attendance required.',
    StartTime: new Date(2026, 2, 8, 13, 30),
    EndTime: new Date(2026, 2, 8, 15, 30),
    Location: 'Client Office',
    Color: '#EC4899'
  },
  {
    Id: 8,
    Subject: 'Training Workshop',
    Description: 'Professional development workshop on new technologies and best practices.',
    StartTime: new Date(2026, 2, 18, 9, 0),
    EndTime: new Date(2026, 2, 18, 13, 0),
    Location: 'Training Room',
    Color: '#14B8A6'
  }
];
