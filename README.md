# Gesture: Revolutionizing System Automation with Hand Gestures
===========================================================

## Project Title
Gesture is a software that utilizes hand gesture detection to interact with your screen purely through the use of your hand signs.

## Description
Gesture addresses the limitations of traditional input methods by enabling users to control their systems using hand gestures. This project leverages Mediapipe, OpenCV, and TensorFlow to provide an intuitive, efficient, and customizable way to interact with your computer. With Gesture, you can assign personalized commands to gestures, such as taking a screenshot or opening a browser with a simple hand sign.

## Key Features

1. **Gesture Recognition**: Accurate real-time hand tracking and gesture classification powered by OpenCV and MediaPipe.
2. **Custom Command Mapping**: Assign personalized commands to gestures.
3. **Advanced AI Integration**: CNNs trained with TensorFlow ensure robust gesture recognition, even in challenging environments.
4. **Cross-Platform Support**: An Electron-based desktop app that works on Windows, macOS, and Linux.

## Technologies Used

* **OpenCV**: For real-time video capture and preprocessing.
* **MediaPipe**: For hand landmark detection and tracking.
* **TensorFlow**: For training and deploying CNNs for gesture classification.
* **Electron**: To build a cross-platform desktop application.

## Installation Instructions
To get started with Gesture, follow these steps:

```bash
# Clone this repository:
git clone https://github.com/junw000/Gesture.git

# Install dependencies:
cd Gesture
pip install -r ./backend/requirements.txt
npm install

# Start the application:
npm start
```

## Usage
1. Launch the application by running `npm start`.
2. Configure your custom commands by assigning gestures to specific actions.
3. Use your hand gestures to interact with your computer.

## Contributing Guidelines
We welcome contributions to Gesture. If you're interested in contributing, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request with a clear description of your changes.
4. Ensure your code is well-documented and follows standard coding conventions.

## License
Gesture is licensed under the [MIT License](https://opensource.org/licenses/MIT). By contributing to this project, you agree to release your contributions under the MIT License.

## Acknowledgments
We would like to thank the following repositories for their inspiration and code:

* [Kazuhito00/hand-gesture-recognition-using-mediapipe](https://github.com/Kazuhito00/hand-gesture-recognition-using-mediapipe)
* [kinivi/hand-gesture-recognition-mediapipe](https://github.com/kinivi/hand-gesture-recognition-mediapipe)

## Team
Gesture was developed by:

* @ahaanbohra
* @bhinu
* @B-a-1-a
* @junw000

## How It Works
The system operates using a multi-stage pipeline:

1. Input images are processed using **OpenCV** and passed through a **hand detection neural network**.
2. Detected hand landmarks are fed into a **convolutional neural network (CNN)** for feature extraction.
3. A **feed-forward neural network** classifies the gestures into predefined or user-defined categories.

The flowchart below illustrates the pipeline:
(https://imgur.com/a/u34hjyz)

## Problem Statement
Traditional input methods, such as keyboards and mice, can be limiting, especially in scenarios that demand hands-free interaction, greater accessibility, or enhanced efficiency. Gesture addresses these challenges by enabling users to control their systems using hand gestures, which are:

* **Intuitive**: Natural movements for seamless interaction.
* **Efficient**: Automates repetitive tasks in a fraction of the time.
* **Customizable**: Users can assign their own commands to gestures.
* **Accessible**: Designed to assist users with physical disabilities or those in environments where traditional input is impractical.

![Gesture](appdemoscreenshot.png)