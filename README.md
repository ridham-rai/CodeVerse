# 🖥️ Online Code Editor Platform

This project is a browser-based **code editor** that allows users to write **HTML**, **CSS**, and **JavaScript** code in real-time and see the output immediately. It functions as a lightweight alternative to platforms like CodePen, JSFiddle, or JSBin, with the goal of providing a smooth, distraction-free experience for both beginners and experienced developers.

---

## ✨ Key Features

- 💻 **Live Output Preview** — As you write your HTML, CSS, or JS, the changes reflect instantly in the output window.
- 🧱 **Isolated Code Panels** — Separate input areas for HTML, CSS, and JavaScript to keep code organized and clean.
- 🔄 **Auto Rendering** — Automatically compiles and displays changes without needing to reload or press a button.
- ⚡ **Lightweight Frontend-Only Tool** — No backend server required, making it fast and easy to use offline.
- 🎓 **Educational Value** — Great for learning, teaching, or testing frontend concepts in a real-time environment.

---

## 🛠️ Technologies Used

- **HTML5** – For structuring the user interface and the code editor layout.
- **CSS3** – To style the editor, panels, and the responsive design.
- **JavaScript (ES6)** – To dynamically handle input events, update the live preview using `iframe`, and sync code updates.

---

## 💡 How It Works

- The editor has three textareas where users can write HTML, CSS, and JavaScript.
- JavaScript captures the content from these textareas every time the user types or edits the code.
- A dynamically constructed `iframe` is updated with the combined code — HTML, embedded CSS inside `<style>`, and JavaScript inside `<script>` — and renders the result in real-time.
- This mimics how a browser renders a full web page using all three technologies, making the user experience intuitive and instant.

---

## ⚙️ How to Use

1. **Download or Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/online-code-editor.git
   cd online-code-editor
