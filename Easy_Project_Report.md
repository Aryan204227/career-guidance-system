# 🎓 AI Career Counselling & Aptitude System - Simple Project Report

## 📝 1. Project Kya Hai? (Project Overview)
Ye ek smart website hai jo students ko unka **Career** choose karne me help karti hai. Aksar students confuse hote hain ki 10th ya 12th ke baad kya karein. Ye system unka ek **Aptitude Test** leta hai aur unke scores ke basis par batata hai ki kaunsa career unke liye best hai.

---

## ✨ 2. Main Features (Isme Kya-Kya Hai?)

1.  **Secure Login**: Students apna account bana sakte hain ya direct **Google** se login kar sakte hain.
2.  **Aptitude Test**: Ek 12-questions ka test hota hai jisme Maths, Logic, English, aur Computer ke sawal hote hain.
3.  **Smart Dashboard**: Test ke baad ek "Radar Chart" (Spider graph) dikhta hai jo student ki strengths aur weaknesses batata hai.
4.  **PDF Report**: Student apni result report download kar sakte hain jisme top 3 career suggestions hote hain.
5.  **Career Directory**: 22 different careers ki poori details (Salary, Exams, Roadmap) di gayi hain.
6.  **AI Chatbot**: Ek robotic assistant hai jo career se related kisi bhi sawal ka jawab deta hai.
7.  **Dark/Light Mode**: Website ko din ya raat ke hisab se change kar sakte hain.

---

## ⚙️ 3. Ye Kaam Kaise Karta Hai? (Working Logic)

Iska sabse important part **"Weighted Matching"** hai. 
*   Har career (jaise Software Engineer) ke liye humne kuch percentage set kiye hain. 
*   Maano Software Engineer ke liye Technical skills 50% aur Logical skills 30% chahiye.
*   Jab student test deta hai, toh system uske marks ko career ke weights se multiply karke ek **"Match %"** nikalta hai.
*   Jisme sabse zyada % aati hai, wahi career recommend hota hai.

---

## 💻 4. Kaunsi Technology Use Hui Hai? (Tech Stack)

Humne isme **MERN Stack** use kiya hai:
*   **M (MongoDB)**: Data store karne ke liye (Database).
*   **E (Express.js)**: Backend server banane ke liye.
*   **R (React.js)**: Frontend (Design) banane ke liye.
*   **N (Node.js)**: Server ko run karne ke liye.
*   **Extras**: 
    *   **JWT**: Login secure karne ke liye.
    *   **Bcrypt**: Passwords ko safe (hash) rakhne ke liye.
    *   **Recharts**: Graphs dikhane ke liye.
    *   **jsPDF**: PDF banane ke liye.

---

## 🎯 5. Faide (Why is it useful?)

*   **No Guesswork**: Sirf pasand par nahi, balki dimaag (aptitude) par career suggest karta hai.
*   **Real Data**: Isme purana data nahi, balki India ke hisab se latest salary aur exams ki info hai.
*   **User Friendly**: Bahut simple aur sundar design hai jo koi bhi student asani se use kar sake.

---

## ❓ 6. Viva Questions (Short & Simple Answers)

**Q1: Password database me kaise save hota hai?**
*   **Ans**: Hum password ko directly save nahi karte. Use **bcrypt** library se "hash" (lock) kar dete hain taaki koi use read na kar sake.

**Q2: JWT kya hai?**
*   **Ans**: JWT (JSON Web Token) ek chota code hota hai jo login ke baad browser me save ho jata hai. Isse server ko pata chalta hai ki user logged-in hai.

**Q3: Result me PDF kaise banti hai?**
*   **Ans**: Humne **jsPDF** library use ki hai jo browser me hi dashboard ka data lekar ek sundar PDF file bana deti hai.

**Q4: Google Login kaise lagaya?**
*   **Ans**: Humne Google ki official library use ki hai. Jab user click karta hai, Google ek token deta hai jise hum apne backend par verify karke user ko login kar dete hain.

**Q5: Career recommend karne ka formula kya hai?**
*   **Ans**: `Student Score x Career Weight = Match %`. Top 3 matches dikhaye jate hain.

---
*Created for Academic Presentation — 2026*
