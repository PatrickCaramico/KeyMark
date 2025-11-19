# 🗝️ KeyMark - Link & Idea Vault

KeyMark is a minimalist link and idea vault focused on **productivity** and **organization**. It allows you to capture URLs, notes, and tasks, categorize them into queues, define priorities, and track the time spent on each item using an integrated timer.

## 💡 Key Features Overview

| Feature | Description |
| :--- | :--- |
| **Multifunctional Capture** | Save URLs and short notes, with support for **Alias (Short Title)** and **Time Estimation**. |
| **Visual Prioritization** | Classify your items with **Low**, **Medium**, or **High** priority, visually reflected on the cards. |
| **Column Organization** | Three main content queue categories: **📚 Read Later**, **📺 Watch Later**, and **⚙️ Test/Implement**. |
| **Integrated Timer** | Track the actual time spent on each task. Only one timer can run at a time, ensuring focus. |
| **Search and Filter** | Quickly search by keyword or URL. Filter the display by status (**Pending** or **Completed**). |
| **Light/Dark Mode** | Theme toggle is saved in the browser for visual comfort. |
| **Smart Trash Bin** | Deleted items are temporarily stored (limit of 10 items) for restoration or permanent removal. |
| **Persistence & Backup** | Data is automatically saved to Local Storage, with support for **Export** and **Import** (JSON format). |

## 🛠️ Technologies Used

KeyMark is built using fundamental web technologies, ensuring lightness and portability:

* **HTML5:** Semantic structure.
* **CSS3:** Styling, theme system (`.light-mode`), and responsive layout (**Grid Layout**).
* **JavaScript (Vanilla JS):** All logic for state management, data persistence (Local Storage), timers, and DOM manipulation.

## 🚀 How to Use KeyMark

### 1. Saving a New Item

1.  In the main input field (**"Paste the link or type your idea..."**), insert the URL or the text of your note.
2.  (Optional) Fill in the **Alias** (short title) and **Time Estimate** (e.g., `30 min`, `1 hour`).
3.  Click the **Priority** button to toggle the level of importance (Low is default).
4.  Click one of the category buttons (📚, 📺, ⚙️) to add the item to the respective queue.

### 2. Tracking Time with the Timer

KeyMark is designed to help you focus on one task at a time.

* If the item has a time estimate or already has time logged, a **⚙️ Timer Controls** button will appear. Click it.
* Click **▶️ Start** to begin the time count.
* **Note:** If another timer is running, it will be automatically paused.
* Use **⏸️ Pause** to stop the count and **↩️ Reset** to clear the logged time.

### 3. Editing and Status Management

* **Mark as Completed:** Click the **✅ Completed** button on any item. Completed items will be crossed out, and their status updated in the filters.
* **Edit Title (Alias):** For Links (URL), click **✏️ Title** to change the display name via the modal. For Notes, click directly on the content text and edit; the change is saved when you click outside (the `blur` event).
* **Delete:** Click **🗑️ Delete**. You will be asked for confirmation before sending it to the trash bin.

### 4. Data Backup

KeyMark stores all your data in Local Storage. For portability or security:

1.  Click **📥 Export Links** to download a JSON file containing all your links and trash bin items.
2.  Click **📤 Import Links** and select a valid JSON backup file to restore your vault.

## ⚙️ Installation (Local Use)

To run the project in your own environment:

1.  **Clone the repository:**
    ```bash
    git clone [/PatrickCaramico/KeyMark]
    ```
2.  **Navigate to the project folder:**
    ```bash
    cd keymark-link-vault
    ```
3.  **Open in Browser:** Simply open the `index.html` file in your preferred browser. Since the project is purely frontend (HTML, CSS, and JS), no web server is required.

## 🤝 Contributions

Feel free to explore the code, suggest improvements, or report bugs.

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---
**Developed with 💜 by [[PatrickCaramico](https://github.com/PatrickCaramico)]**
