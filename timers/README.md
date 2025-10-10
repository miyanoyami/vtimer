# vtimers

VTuber タイマー

## 音量補正
```
for f in *.mp3; do ffmpeg -i "$f" -filter:a "volume=6dB" "converted/$f"; done
```
