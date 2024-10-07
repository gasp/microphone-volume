import "./style.css";

const app = document.querySelector("#app");
let context;

const button = document.createElement("button");
const meter = document.createElement("meter");

button.innerHTML = "rec";

const rec = async () => {
  button.disabled = true;
  context = new window.AudioContext();

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
  });

  const micro = context.createMediaStreamSource(stream);
  micro.connect(context.destination);

  const analyserNode = context.createAnalyser();
  micro.connect(analyserNode);

  const pcmData = new Float32Array(analyserNode.fftSize);
  const onFrame = () => {
    analyserNode.getFloatTimeDomainData(pcmData);
    let sumSquares = 0.0;
    for (const amplitude of pcmData) {
      sumSquares += amplitude * amplitude;
    }
    meter.value = Math.sqrt(sumSquares / pcmData.length);
    window.requestAnimationFrame(onFrame);
  };
  window.requestAnimationFrame(onFrame);
};

button.addEventListener("click", rec);
const section = document.createElement("section");
const div = document.createElement("div");
div.append(meter);
section.append(button);
section.append(div);

app.append(section);
