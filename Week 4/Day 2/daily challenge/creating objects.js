// 1. Define the Video class
class Video {
  constructor(title, uploader, time) {
    this.title = title;
    this.uploader = uploader;
    this.time = time;
  }

  // 2. Define the watch() method
  watch() {
    console.log(`${this.uploader} watched all ${this.time} seconds of ${this.title}!`);
  }
}

// 3. Instantiate a new Video instance and call watch()
const video1 = new Video("JavaScript Basics", "Alice", 300);
video1.watch();
// Output: Alice watched all 300 seconds of JavaScript Basics!

// 4. Instantiate a second Video instance with different values
const video2 = new Video("CSS Flexbox Tutorial", "Bob", 450);
video2.watch();
// Output: Bob watched all 450 seconds of CSS Flexbox Tutorial!


// 5. BONUS: Use an array of objects (best data structure) to store data for 5 videos
const videoData = [
  { title: "Learn React in 10 Minutes", uploader: "Charlie", time: 600 },
  { title: "Node.js Crash Course", uploader: "Diana", time: 1200 },
  { title: "Python vs JavaScript", uploader: "Evan", time: 240 },
  { title: "SQL Database Design", uploader: "Fiona", time: 900 },
  { title: "Git & GitHub Basics", uploader: "George", time: 500 }
];

// 6. BONUS: Loop through the array to instantiate those instances
const videoInstances = videoData.map(data => new Video(data.title, data.uploader, data.time));

// Test watching all newly created video instances
videoInstances.forEach(video => video.watch());