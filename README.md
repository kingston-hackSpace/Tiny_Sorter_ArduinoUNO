# Tiny Sorter (Arduino Uno version)

Build a little paper machine that **looks at an object and sorts it** left or right, using a webcam, a machine learning model you train yourself, and a small motor.

This is an adaptation of Google's [Tiny Sorter](https://experiments.withgoogle.com/tiny-sorter/view/) experiment, changed so it works with an **Arduino Uno**.

👉 **Open the sorter page here:** https://kingston-hackspace.github.io/Tiny_Sorter_ArduinoUNO/

No coding needed. You'll just follow the steps below.

---

## 1. What you need

**For the paper sorter**
- Paper or thin cardstock
- Tape
- Scissors
- Ruler
- Googly eyes (optional, but recommended 👀)

**Electronics**
- Arduino Uno + its USB cable
- SG90 micro servo (the small blue motor)
- 3 jumper wires

**Computer**
- A laptop with a webcam
- **Google Chrome** or **Microsoft Edge**

**Paper template and folding instructions:** follow Google's guide at
https://experiments.withgoogle.com/tiny-sorter/view/

---

## 2. Connect the servo to the Arduino

The servo has three coloured wires. Use jumper wires to connect them to the Arduino:

| Servo wire | Arduino pin |
|------------|-------------|
| Brown      | GND         |
| Red        | 5V          |
| Orange     | 9           |

> Tip: do the wiring with the USB cable **unplugged**.

---

## 3. Put the program on the Arduino

You only need to do this once per Arduino.

1. Download and install the [Arduino IDE](https://www.arduino.cc/en/software).
2. Download this project: click the green **Code** button at the top of this page → **Download ZIP**, then unzip it.
3. Open the folder `UNO_tiny_sorter_serial` and double-click `UNO_tiny_sorter_serial.ino`. It opens in the Arduino IDE.
4. Plug the Arduino into your laptop with the USB cable.
5. In the menu, choose **Tools → Board → Arduino Uno**.
6. Choose **Tools → Port** and pick the one that mentions Arduino Uno.
7. Click the **Upload** button (the round arrow → at the top left).
8. Wait for "Done uploading". The servo should start wiggling gently. That means it's working and waiting.

No extra libraries are needed.

**Now close the Arduino IDE** (see Troubleshooting for why).

---

## 4. Train your model in Teachable Machine

1. Go to [Teachable Machine](https://teachablemachine.withgoogle.com/) → **Get Started** → **Image Project** → **Standard image model**.
2. Make **exactly three classes, in this order**:
   - **Class 1:** your first object (this goes one way)
   - **Class 2:** your second object (this goes the other way)
   - **Class 3:** the **empty sorter** (nothing in it)

   You can rename the classes, but keep this order.
3. For each class, click **Webcam** and hold down the record button to take lots of photos. Put the object *inside your paper sorter*, in view of the camera, exactly as it will be when sorting.
4. Click **Train Model** and wait.
5. Click **Export Model** → **Upload (shareable link)** → **Upload my model**.
6. Copy the link. It looks like `https://teachablemachine.withgoogle.com/models/abc123/` (keep the `/` at the end).

---

## 5. Run the sorter

1. Plug in the Arduino.
2. 👉 **Open the sorter page here:** https://kingston-hackspace.github.io/Tiny_Sorter_ArduinoUNO/
3. When the browser asks, click **Allow** to let it use the camera.
4. Paste your model link into the **Paste model link here** box, then click **LOAD MODEL**.
5. Click **CONNECT ARDUINO** (top right), select the **Arduino Uno** in the pop-up, and click **Connect**. Wait a couple of seconds.
6. Place an object in the sorter and watch it go! 🎉

---

## Troubleshooting

- **Close the Arduino IDE's Serial Monitor (or the whole Arduino IDE) before clicking CONNECT ARDUINO.** Only one program can talk to the Arduino at a time, and the Serial Monitor blocks it.
- **Use Chrome or Edge, not Safari or Firefox.** Safari and Firefox can't talk to the Arduino (they don't support "Web Serial"). If the button says *USE CHROME OR EDGE*, this is why.
- **The object doesn't land in the right place?** Tilt your laptop screen forwards or backwards to change the angle of the ramp.
- **Sorting is unreliable or it picks the wrong side?** Go back to Teachable Machine and add more photos to each class, with more variety: different positions, rotations, and lighting. Then export again and paste the new link.
- **"Train a model with at least three classes" message?** Your model needs all three classes (object 1, object 2, empty sorter).
- **Arduino doesn't appear in the pop-up?** Unplug it, plug it back in, and try again. Try a different USB cable (some only charge and don't carry data).

---

*Based on [Tiny Sorter](https://experiments.withgoogle.com/tiny-sorter/view/) by Google Creative Lab / Teachable Machine.*
