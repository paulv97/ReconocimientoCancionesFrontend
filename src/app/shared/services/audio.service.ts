import { Injectable } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audioContext!: AudioContext;
  private mediaRecorder!: MediaRecorder;
  private audioChunks!: BlobPart[];
  private recordedAudio!: Blob;
  private analyser!: AnalyserNode;
  private bufferLength!: number;
  private dataArray!: Float32Array;
  private intervalId: any;
  private mediaStream!: MediaStream;
  private chart!: Chart

  constructor() {
  }

  initAudioContext() {
    if(!this.audioContext) {
      this.audioContext = new AudioContext()
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;
      this.bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Float32Array(this.bufferLength);
    }
  }

  start() {
    this.audioChunks = [];

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        this.mediaStream = stream;
        const source = this.audioContext.createMediaStreamSource(stream);

        this.mediaRecorder = new MediaRecorder(stream)
        this.mediaRecorder.addEventListener('dataavailable', (e:any) => {
          console.log(e)
          this.audioChunks.push(e.data);
        });
        // Cuando la grabación se detiene, reproducir la grabación
        this.mediaRecorder.addEventListener('stop', () => {
          // Convertir los datos grabados en un objeto Blob
          const blob = new Blob(this.audioChunks, { type: 'audio/ogg; codecs=opus' });
          this.recordedAudio = blob
        });

        source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
        this.intervalId = setInterval(() => this.processAudio(), 50); 
        this.mediaRecorder.start()       
      })
      .catch(err => console.log(err));
  }

  stop() {
    clearInterval(this.intervalId);
    this.mediaStream.getTracks().forEach(track => track.stop());
  }

  getAudioRecorded() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }

    return this.recordedAudio
  }

  setChart(chart: Chart) {
    this.chart = chart
  }

  graphUploadedAudio(audio: HTMLAudioElement) {
    const source = this.audioContext.createMediaElementSource(audio);
    source.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);
    audio.play()
    this.intervalId = setInterval(() => this.processAudio(), 50); 
  }

  private processAudio() {
    this.analyser.getFloatFrequencyData(this.dataArray);
    const sum = this.dataArray.reduce((acc, val) => acc + val);
    console.log('La suma', sum)
    const average = sum / this.bufferLength;
    console.log('Buffer Lenght', this.bufferLength)
    console.log('Average', average)

    const tonality = (average + 140) / 280; // Normalizar el valor a un rango de 0 a 1
    console.log('Tonality', tonality)
    this.updateChart(tonality);
  }

  private updateChart(tonality: number) {
    this.chart.data.labels?.push('');
    this.chart.data.datasets[0].data.push(tonality);
    this.chart.update();
  }
}
