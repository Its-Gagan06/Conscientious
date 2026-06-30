import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, where, updateDoc, doc, getDoc, setDoc } from "firebase/firestore";

const firebaseConfigData = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "firebase-applet-config.json"), "utf8"));
const firebaseConfig = {
  apiKey: firebaseConfigData.apiKey,
  authDomain: firebaseConfigData.authDomain,
  projectId: firebaseConfigData.projectId,
  storageBucket: firebaseConfigData.storageBucket,
  messagingSenderId: firebaseConfigData.messagingSenderId,
  appId: firebaseConfigData.appId
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, firebaseConfigData.firestoreDatabaseId);

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const issuesDB = [];
const usersDB = [
  {
    id: "sys-1",
    name: "Rahul Sharma",
    contact: "9876543210",
    points: 120,
    reports: 5,
    password: "sys"
  },
  {
    id: "sys-2",
    name: "Priya Singh",
    contact: "9123456780",
    points: 85,
    reports: 3,
    password: "sys"
  }
];
let idCounter = 1;
let userIdCounter = 1;

const chatDB = [
  {
    id: "mock-1",
    userId: "sys-1",
    userName: "Rahul Sharma",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
    text: "Has anyone noticed the water logging near the main market? It's getting really bad.",
    timestamp: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: "mock-2",
    userId: "sys-2",
    userName: "Priya Singh",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    text: "Yes, I reported it yesterday! Please like the issue so it gets resolved faster.",
    timestamp: new Date(Date.now() - 1800000).toISOString()
  }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase payload limit for base64 images
  app.use(express.json({ limit: '50mb' }));

  app.get("/api/neighborhood-chat", (req, res) => {
    res.json({ success: true, messages: chatDB });
  });

  app.post("/api/neighborhood-chat", (req, res) => {
    const { userId, userName, text, userAvatar } = req.body;
    const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName || 'User'}`;
    const newMessage = {
      id: Date.now().toString(),
      userId,
      userName,
      userAvatar: userAvatar || defaultAvatar,
      text,
      timestamp: new Date().toISOString()
    };
    chatDB.push(newMessage);
    // Keep only last 50 messages
    if (chatDB.length > 50) {
      chatDB.shift();
    }
    res.json({ success: true, message: newMessage });
  });

  app.post("/api/civicai-chat", async (req, res) => {
    try {
      const { messages, userContext } = req.body;
      
      let systemInstruction = `You are CivicAI, a helpful community assistant for the Conscientious application.
Your goal is to help users use the website, guide them on how to report issues (potholes, water leaks, etc.), provide contact numbers for local services if asked, and help people connect.
User context: ${JSON.stringify(userContext || {})}`;

      const formattedContents = messages.map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
      }));

      const response = await ai.models.generateContent({
          model: "gemini-1.5-flash",
          contents: formattedContents,
          config: {
              systemInstruction: systemInstruction,
              temperature: 0.7
          }
      });

      res.json({ success: true, reply: response.text });
    } catch (e) {
      console.error("CivicAI chat error:", e);
      res.status(500).json({ success: false, error: "Failed to communicate with CivicAI." });
    }
  });

  app.post("/api/analyze-issue", async (req, res) => {
    try {
      const { image, description, location, userId } = req.body;

      const promptParts = [];
      
      if (image) {
        // Expected image format: data:image/jpeg;base64,...
        const match = image.match(/^data:(image\/\w+);base64,(.+)$/);
        if (match) {
          promptParts.push({
            inlineData: {
              mimeType: match[1],
              data: match[2]
            }
          });
        }
      }

      let promptStr = "Analyze this community issue report. ";
      if (description) {
        promptStr += `User description: "${description}". `;
      }
      if (location) {
        promptStr += `Location details: ${location.address || 'Unknown'}. `;
      }

      promptStr += "Categorize the issue (e.g., Potholes, Broken Roads, Waste Management, Water Leakage, Streetlight, etc.). " +
        "First, determine if the image (if provided) and description depict a genuine community issue. " +
        "If it is not a genuine issue (e.g., a selfie, a random meme, a screenshot of a game, or unrelated text), set 'isGenuine' to false and provide a reason in 'reasonIfNotGenuine'. " +
        "If it is genuine, set 'isGenuine' to true, provide an encouraging message, award them points for reporting (between 10 and 50), and tell them they are closer to earning the 'Society Leader' title. " +
        "Encourage them to provide more context if needed.";

      promptParts.push({ text: promptStr });

      let resultObj;
      try {
        const response = await ai.models.generateContent({
          model: "gemini-1.5-flash",
          contents: { parts: promptParts },
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                isGenuine: {
                  type: Type.BOOLEAN,
                  description: "True if the report depicts a real community issue. False if it is spam, unrelated, or a random photo."
                },
                reasonIfNotGenuine: {
                  type: Type.STRING,
                  description: "If isGenuine is false, provide a short reason why it was rejected."
                },
                category: {
                  type: Type.STRING,
                  description: "The category of the issue, e.g., Pothole, Waste Management."
                },
                encouragementMessage: {
                  type: Type.STRING,
                  description: "An encouraging message mentioning points, Society Leader title, and finding others with the same problem. Leave blank if not genuine."
                },
                pointsAwarded: {
                  type: Type.NUMBER,
                  description: "Random number of points between 10 and 50 awarded for this report. Set to 0 if not genuine."
                }
              },
              required: ["isGenuine", "category", "encouragementMessage", "pointsAwarded"]
            }
          }
        });

        const resultText = response.text;
        resultObj = JSON.parse(resultText.trim());
      } catch (error) {
        console.error("Error with Gemini API, using fallback:", error);
        resultObj = {
          isGenuine: true,
          category: "Community Issue",
          encouragementMessage: "Thanks for reporting this! You earned points and are closer to Society Leader.",
          pointsAwarded: 25
        };
      }
      
      if (!resultObj.isGenuine) {
        return res.json({ 
          success: false, 
          error: resultObj.reasonIfNotGenuine || "The uploaded photo or description does not appear to be a genuine community issue. Please upload another photo."
        });
      }

      let pointsAwarded = resultObj.pointsAwarded || Math.floor(Math.random() * 41) + 10;
      resultObj.pointsAwarded = pointsAwarded; // ensure it is set on the response object

      let userPoints = 0;
      let userReports = 0;

      if (userId) {
        try {
          const docId = String(userId);
          const userRef = doc(db, "users", docId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
             const userData = userSnap.data();
             userPoints = (userData.points || 0) + pointsAwarded;
             userReports = (userData.reports || 0) + 1;
             await updateDoc(userRef, {
               points: userPoints,
               reports: userReports
             });
          } else {
             throw new Error("Doc doesn't exist, use fallback");
          }
        } catch(e) {
           console.error("Failed to update user in firestore", e);
           const memUser = usersDB.find(u => String(u.id) === String(userId));
           if (memUser) {
              memUser.points = (memUser.points || 0) + pointsAwarded;
              memUser.reports = (memUser.reports || 0) + 1;
              userPoints = memUser.points;
              userReports = memUser.reports;
           }
        }
      }

      const newIssue = {
        id: idCounter++,
        userId,
        image: image || null,
        description,
        location,
        category: resultObj.category,
        upvotes: 1,
        isUserGenerated: true,
        additionalDescriptions: [],
        timestamp: new Date().toISOString()
      };
      
      issuesDB.push(newIssue);

      res.json({ success: true, analysis: resultObj, issue: newIssue, updatedPoints: userPoints, updatedReports: userReports });
    } catch (error) {
      console.error("Error analyzing issue:", error);
      res.status(500).json({ success: false, error: "Failed to analyze the issue." });
    }
  });

  app.post("/api/neighborhood-issues", async (req, res) => {
    try {
      const { location } = req.body;
      const address = location?.address || 'a generic neighborhood';
      
      const mockIssuesCount = issuesDB.filter(i => !i.isUserGenerated).length;
      
      if (mockIssuesCount === 0) {
        let generatedIssues = [];
        try {
          const promptStr = `Generate 3 realistic community issues (like potholes, broken streetlights, water leakage, waste management) that neighbors might have reported recently in or near this location: "${address}". Return them as a JSON array.`;
          
          const response = await ai.models.generateContent({
              model: "gemini-1.5-flash",
              contents: promptStr,
              config: {
                  responseMimeType: "application/json",
                  responseSchema: {
                      type: Type.ARRAY,
                      items: {
                          type: Type.OBJECT,
                          properties: {
                              category: { type: Type.STRING },
                              description: { type: Type.STRING },
                              address: { type: Type.STRING, description: "A slightly different nearby street or landmark" },
                              upvotes: { type: Type.NUMBER }
                          },
                          required: ["category", "description", "address", "upvotes"]
                      }
                  }
              }
          });
          
          generatedIssues = JSON.parse(response.text.trim());
        } catch (e) {
          console.error("Gemini AI error fetching mock issues, using fallback:", e);
          generatedIssues = [
            { category: "Infrastructure", description: "Pothole on main road causing traffic issues.", address: address + " (Nearby)", upvotes: 12 },
            { category: "Waste Management", description: "Overflowing garbage bins in the park.", address: address + " (Park)", upvotes: 5 },
            { category: "Utilities", description: "Broken streetlight creating a safety hazard at night.", address: address + " (Corner street)", upvotes: 8 }
          ];
        }
        
        generatedIssues.forEach(gi => {
            issuesDB.push({
                id: idCounter++,
                image: null,
                description: gi.description,
                location: { lat: location?.lat || 0, lng: location?.lng || 0, address: gi.address },
                category: gi.category,
                upvotes: gi.upvotes,
                isUserGenerated: false,
                additionalDescriptions: [],
                timestamp: new Date(Date.now() - Math.random() * 1000000000).toISOString()
            });
        });
      }

      res.json({ success: true, issues: issuesDB });
    } catch (error) {
       console.error("Error fetching neighborhood issues:", error);
       res.status(500).json({ success: false, error: "Failed to fetch neighborhood issues." });
    }
  });

  app.post("/api/like-issue", async (req, res) => {
    const { issueId, additionalDescription } = req.body;
    const issue = issuesDB.find(i => i.id === issueId);
    if (issue) {
        issue.upvotes += 1;
        if (additionalDescription) {
            issue.additionalDescriptions.push(additionalDescription);
        }
        
        // Award points to the author of the issue for getting a like
        if (issue.userId) {
            try {
               const docId = String(issue.userId);
               const userRef = doc(db, "users", docId);
               const userSnap = await getDoc(userRef);
               if (userSnap.exists()) {
                   const userData = userSnap.data();
                   await updateDoc(userRef, {
                       points: (userData.points || 0) + 5
                   });
               } else {
                   throw new Error("Doc not found in firestore");
               }
            } catch (e) {
               console.error("Failed to update user points for like", e);
               const memUser = usersDB.find(u => String(u.id) === String(issue.userId));
               if (memUser) {
                   memUser.points = (memUser.points || 0) + 5;
               }
            }
        }

        res.json({ success: true, issue });
    } else {
        res.status(404).json({ success: false, error: "Issue not found" });
    }
  });

  app.post("/api/signup", async (req, res) => {
    const { name, contact, password } = req.body;
    
    if (!name || !contact || !password) {
      return res.status(400).json({ success: false, error: "Please provide all details." });
    }

    if (!/^\d{10}$/.test(contact)) {
      return res.status(400).json({ success: false, error: "Contact number must be exactly 10 digits." });
    }

    if (password.length < 6 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      return res.status(400).json({ success: false, error: "Password must be at least 6 characters and contain both letters and numbers." });
    }

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("contact", "==", contact));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        return res.status(400).json({ success: false, error: "Contact number already registered." });
      }

      const newUser = {
        name,
        contact,
        password, // Storing in plain text for demo
        points: 0,
        reports: 0
      };

      const docRef = await addDoc(usersRef, newUser);
      res.json({ success: true, user: { id: docRef.id, name: newUser.name, contact: newUser.contact, points: newUser.points, reports: newUser.reports, avatar: newUser.avatar } });
    } catch (e) {
      console.error("Firebase signup error, falling back to memory:", e);
      const existingUser = usersDB.find(u => u.contact === contact);
      if (existingUser) {
        return res.status(400).json({ success: false, error: "Contact number already registered." });
      }

      const newUser = {
        id: "mem_" + userIdCounter++,
        name,
        contact,
        password,
        points: 0,
        reports: 0
      };

      usersDB.push(newUser);
      res.json({ success: true, user: { id: newUser.id, name: newUser.name, contact: newUser.contact, points: newUser.points, reports: newUser.reports, avatar: newUser.avatar } });
    }
  });

  app.get("/api/active-users", (req, res) => {
    // Return mock active users (everyone in usersDB, omit passwords)
    const active = usersDB.map(u => ({
      id: u.id,
      name: u.name,
      contact: u.contact,
      points: u.points,
      reports: u.reports,
      avatar: u.avatar
    }));
    res.json({ success: true, activeUsers: active });
  });

  app.get("/api/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      
      try {
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          return res.json({ success: true, user: { id: userDoc.id, name: userData.name, contact: userData.contact, points: userData.points || 0, reports: userData.reports || 0, avatar: userData.avatar } });
        }
      } catch (e) {
        // Fallback to memory
      }
      
      const user = usersDB.find(u => String(u.id) === String(userId));
      if (user) {
        res.json({ success: true, user: { id: user.id, name: user.name, contact: user.contact, points: user.points || 0, reports: user.reports || 0, avatar: user.avatar } });
      } else {
        res.status(404).json({ success: false, error: "User not found" });
      }
    } catch (e) {
      res.status(500).json({ success: false, error: "Server error" });
    }
  });

  app.post("/api/login", async (req, res) => {
    const { contact, password } = req.body;
    
    if (!contact || !password) {
      return res.status(400).json({ success: false, error: "Please provide contact and password." });
    }

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("contact", "==", contact), where("password", "==", password));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        res.json({ success: true, user: { id: userDoc.id, name: userData.name, contact: userData.contact, points: userData.points || 0, reports: userData.reports || 0, avatar: userData.avatar } });
      } else {
        res.status(401).json({ success: false, error: "Invalid credentials." });
      }
    } catch (e) {
      console.error("Firebase login error, falling back to memory:", e);
      const user = usersDB.find(u => u.contact === contact && u.password === password);
      if (user) {
        res.json({ success: true, user: { id: user.id, name: user.name, contact: user.contact, points: user.points, reports: user.reports || 0, avatar: user.avatar } });
      } else {
        res.status(401).json({ success: false, error: "Invalid credentials." });
      }
    }
  });

  app.post("/api/updateUser", async (req, res) => {
    const { userId, name, contact, password, avatar } = req.body;
    if (!userId || !name || !contact) {
      return res.status(400).json({ success: false, error: "Missing information." });
    }
    
    if (!/^\d{10}$/.test(contact)) {
      return res.status(400).json({ success: false, error: "Contact number must be exactly 10 digits." });
    }

    if (password && (password.length < 6 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password))) {
      return res.status(400).json({ success: false, error: "Password must be at least 6 characters and contain both letters and numbers." });
    }

    try {
      const docId = String(userId);
      const userRef = doc(db, "users", docId);
      const updateData = { name, contact };
      if (password) updateData.password = password;
      if (avatar) updateData.avatar = avatar;
      await setDoc(userRef, updateData, { merge: true });
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();
      res.json({ success: true, user: { id: userDoc.id, name: userData.name, contact: userData.contact, points: userData.points || 0, reports: userData.reports || 0, avatar: userData.avatar } });
    } catch (e) {
      console.error("Firebase updateUser error, falling back to memory:", e);
      let memUser = usersDB.find(u => String(u.id) === String(userId));
      if (!memUser) {
          memUser = { id: userId, name, contact, password: password || "", points: 0, reports: 0, avatar: avatar || null };
          usersDB.push(memUser);
      } else {
          memUser.name = name;
          memUser.contact = contact;
          if (password) memUser.password = password;
          if (avatar) memUser.avatar = avatar;
      }
      res.json({ success: true, user: { id: memUser.id, name: memUser.name, contact: memUser.contact, points: memUser.points || 0, reports: memUser.reports || 0, avatar: memUser.avatar } });
    }
  });

  app.post("/api/contacts", async (req, res) => {
    try {
      const { location } = req.body;
      const address = location?.address || 'India'; // Default to a generic location if none provided

      const promptStr = `Find the municipal department contact numbers for the location: "${address}". 
Provide contacts for departments like Waste Management (e.g., Nagar Nigam), Water (e.g., Jal Kal Vibhag / Jal Board), Electricity, and Roads.
Return a JSON array of objects. Each object must have:
- department (string, e.g. "Waste Management - Nagar Nigam")
- contact (string, a realistic phone number or helpline)
- description (string, brief description of what they handle)
Limit to 4-5 key departments.`;

      let contacts = [];
      try {
        const response = await ai.models.generateContent({
          model: "gemini-1.5-flash",
          contents: promptStr,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  department: { type: Type.STRING },
                  contact: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["department", "contact", "description"]
              }
            }
          }
        });

        contacts = JSON.parse(response.text.trim());
      } catch (error) {
        console.error("Error fetching contacts from Gemini, using fallback:", error);
        contacts = [
          { department: "City Helpdesk", contact: "311", description: "General city services and non-emergency requests." },
          { department: "Emergency", contact: "911", description: "Police, Fire, and Medical emergencies." }
        ];
      }
      res.json({ success: true, contacts });
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ success: false, error: "Failed to fetch local contacts." });
    }
  });

    app.post("/api/trivia", async (req, res) => {
    try {
      const { difficulty = "general", count = 1 } = req.body;
      
      const promptStr = `Generate a JSON array of ${count} trivia questions. Difficulty: ${difficulty}. 
Each object should have:
- question: string
- options: array of 4 strings (one must be the correct answer)
- answer: string (must exactly match one of the options)
- explanation: string (brief explanation of the answer)
Return ONLY valid JSON array.`;

      let questions = [];
      try {
        const response = await ai.models.generateContent({
          model: "gemini-1.5-flash",
          contents: promptStr,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  answer: { type: Type.STRING },
                  explanation: { type: Type.STRING }
                }
              }
            }
          }
        });
        
        questions = JSON.parse(response.text.trim());
      } catch (error) {
        console.error("Error generating trivia from Gemini, using fallback:", error);
        questions = [
          {
            question: "What is the primary number to call for non-emergency city services in many US cities?",
            options: ["911", "311", "411", "211"],
            answer: "311",
            explanation: "311 is widely used for reporting non-emergency issues like potholes and graffiti."
          }
        ];
      }
      res.json({ success: true, questions });
    } catch (error) {
      console.error("Error generating trivia:", error);
      res.status(500).json({ success: false, error: "Failed to generate trivia." });
    }
  });

if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
