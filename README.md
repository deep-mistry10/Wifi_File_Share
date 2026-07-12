# WiFi File Share

A simple, lightweight, and open-source file sharing application that lets you transfer files between devices connected to the same WiFi network.

The application starts a local Python server and automatically opens a web interface in your browser. Any device connected to the same network can access the page and upload or download files.

## Features

* 📁 Share files over your local WiFi network
* 🌐 Browser-based interface
* 🖥️ Cross-platform (Windows, Linux, macOS)
* 📱 Works on phones, tablets, and computers
* ⚡ Fast local transfers
* 🔒 No cloud storage
* 🔐 Files remain on your local network
* 🚀 Simple one-command startup
* 💻 Open Source

## Screenshots

> Add screenshots of the web interface here.

## Requirements

* Python 3.9 or newer

## Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/wifi-file-share.git
cd wifi-file-share
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the server:

```bash
python app.py
```

The application will automatically start the local server.

Open your browser and visit:

```
http://localhost:5000
```

To access it from another device, open:

```
http://YOUR-PC-IP:5000
```

Example:

```
http://192.168.1.5:5000
```

Make sure both devices are connected to the same WiFi network.

## Technologies

* Python
* HTML5
* CSS3
* JavaScript

## Project Structure

```text
wifi-file-share/
│
├── app.py
├── requirements.txt
├── templates/
├── static/
│   ├── css/
│   ├── js/
│   └── images/
├── uploads/
├── README.md
├── LICENSE
└── .gitignore
```

## Security

This project is intended for use on trusted local networks.

Avoid exposing the application directly to the public Internet.

## Contributing

Contributions are welcome. Feel free to open an issue or submit a pull request.

## License

Licensed under the MIT License.
