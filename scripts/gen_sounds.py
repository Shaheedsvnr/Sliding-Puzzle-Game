import math
import wave
import struct
import os

os.makedirs('src/assets', exist_ok=True)

fr = 44100

# click effect
frames = []
l = 0.08
for i in range(int(fr * l)):
    t = i / fr
    value = int(32767 * 0.3 * math.sin(2 * math.pi * 880 * t) * (1 - t / l))
    frames.append(struct.pack('<h', value))
with wave.open('src/assets/click.wav', 'wb') as wf:
    wf.setnchannels(1)
    wf.setsampwidth(2)
    wf.setframerate(fr)
    wf.writeframes(b''.join(frames))

# victory effect
frames = []
l = 0.7
for i in range(int(fr * l)):
    t = i / fr
    freq = 440 + 220 * t
    envelope = (1 - t / l) * (0.5 + 0.5 * math.sin(math.pi * t / l))
    value = int(32767 * 0.25 * math.sin(2 * math.pi * freq * t) * envelope)
    frames.append(struct.pack('<h', value))
with wave.open('src/assets/victory.wav', 'wb') as wf:
    wf.setnchannels(1)
    wf.setsampwidth(2)
    wf.setframerate(fr)
    wf.writeframes(b''.join(frames))
