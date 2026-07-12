#  WiFi File Share

A simple, lightweight, and open-source file sharing application built with **Python (Flask)** and a modern web interface.

Share files instantly between devices connected to the same WiFi or Local Area Network (LAN). Simply start the server, open the webpage, and upload or download files from any device on the network.

![Python](https://img.shields.io/badge/Python-3.11-blue)
![Flask](https://img.shields.io/badge/Flask-Latest-black)
![License](https://img.shields.io/badge/License-MIT-green)

---

##  Features

-  Upload files from any device
-  Download shared files
-  Preview supported files directly in the browser
-  Delete individual files
-  Delete multiple selected files
-  Delete all shared files
-  Mobile-friendly interface
-  Fast transfers over local WiFi
-  Files stay on your local network
-  Runs entirely on your own computer

---

##  Screenshot

> Add a screenshot here.

```
assets/
└── screenshot.png
```

Then add:

```md
![Screenshot](assets/screenshot.png)
```

---

##  Project Structure

```
wifi-file-share/
│
├── app.py
├── README.md
├── requirements.txt
├── start-share.sh
│
├── shared_files/
│
├── templates/
│   └── index.html
│
└── static/
    ├── style.css
    └── app.js
```

---

##  Installation

### 1. Clone the repository

```bash
git clone https://github.com/deep-mistry10/Wifi_File_Share.git
cd Wifi_File_Share
```

### 2. Install dependencies

```bash
pip install flask werkzeug
```

Or

```bash
pip install -r requirements.txt
```

### 3. Start the server

```bash
python app.py
```

The server starts on

```
http://localhost:5000
```

---

##  Access From Other Devices

Find your computer's local IP address.

Windows:

```bash
ipconfig
```

Example:

```
IPv4 Address : 192.168.1.15
```

Open on another device connected to the same WiFi:

```
http://192.168.1.15:5000
```

---

## 🛠 Built With

- Python 3
- Flask
- HTML5
- CSS3
- Vanilla JavaScript

---

##  Security

This application is intended for **trusted local networks only**.

Do **not** expose it directly to the public Internet.

---

##  API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Home page |
| GET | `/api/files` | List shared files |
| POST | `/upload` | Upload files |
| GET | `/download/<file>` | Download file |
| GET | `/preview/<file>` | Preview file |
| DELETE | `/delete/<file>` | Delete a file |
| POST | `/delete-selected` | Delete selected files |
| DELETE | `/delete-all` | Delete all files |

---

##  License

This project is licensed under the MIT License.

---

##  Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push your branch

```bash
git push origin feature-name
```

5. Open a Pull Request

---

##  Support

If you found this project useful, consider giving it a ⭐ on GitHub.

It helps others discover the project and motivates future development.