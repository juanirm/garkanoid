# Garkanoid

Garkanoid is an Arkanoid-style game featuring the Star Wars Imperial March as background music.

## Prerequisites

Before you begin, ensure you have met the following requirements:

* You have installed Python 3.x on your system.
* You have a modern web browser (Chrome, Firefox, Safari, or Edge).

## Running the Game

To run the Garkanoid game, follow these steps:

1. Open a terminal or command prompt.

2. Navigate to the game's directory:
   ```
   cd path/to/garkanoid
   ```

3. Start the Python HTTP server:
   ```
   python -m http.server 8000
   ```
   If you're using Python 3 on some systems, you might need to use `python3` instead of `python`.

4. Open your web browser and go to:
   ```
   http://localhost:8000
   ```

5. The game should now load in your browser. Click the "Start" button to begin playing.

6. Use the left and right arrow keys or your mouse to move the paddle and bounce the ball.

7. To stop the server, go back to your terminal and press `Ctrl+C`.

## Troubleshooting

If you encounter any issues:

* Make sure you're running the server from the correct directory (where the game files are located).
* Check that port 8000 is not being used by another application. If it is, you can specify a different port:
  ```
  python -m http.server 8080
  ```
  Then access the game at `http://localhost:8080`.
* If you see any console errors, please report them along with your browser and operating system details.

## Game Levels

Garkanoid features 10 exciting levels, each with increasing difficulty:

1. Each level has a unique brick layout, including:
   - Rectangle
   - Triangle
   - Diamond
   - Circle
   - Random patterns

2. The ball speed increases by 10% with each new level, making the game progressively more challenging.

3. The score multiplier increases with each level, rewarding players for reaching higher levels.

4. The brick layouts repeat every 5 levels, but with increased difficulty due to higher ball speed and more points per brick.

## Power-ups

During gameplay, you may encounter the following power-ups:

1. 🔵 Blue Orb - Force Push (Wider Paddle):
   - Temporarily increases the width of your paddle, making it easier to hit the ball.
   - Duration: 10 seconds

2. 🔴 Red Orb - Force Split (Multi-Ball):
   - Splits the current ball into three, giving you more chances to break bricks.
   - The extra balls remain in play until they fall off the screen.

3. ⚡ Yellow Orb - Force Speed (Faster Balls):
   - Temporarily increases the speed of all balls on the screen.
   - Duration: 8 seconds
   - This power-up can be both helpful and challenging, as faster balls can break more bricks quickly but are harder to control.

Power-ups are randomly generated when breaking certain bricks. Catch them with your paddle to activate their effects!

Enjoy playing Garkanoid!
