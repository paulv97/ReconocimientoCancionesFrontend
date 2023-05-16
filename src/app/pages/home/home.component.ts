import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js/auto';
import { AudioService } from 'src/app/shared/services/audio.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('preview', { read: ElementRef }) preview!: ElementRef;
  @ViewChild('canvas') canvas!: ElementRef;

  audioChart!: Chart;
  audioContext!: AudioContext;
  audioSource!: AudioBufferSourceNode;
  animationFrameId!: number;
  arrayBufferData!: ArrayBuffer;
  audioData!: File;

  tunes = [
    { id: 1, name: 'El aguacate' },
    { id: 2, name: 'Mentirosa' },
    { id: 3, name: 'Motora' },
    { id: 4, name: 'Niña bonita' },
    { id: 5, name: 'Without me' },
  ]

  selectedTune: any = null

  score: number = 0

  isLoading = false

  constructor(
    private audioService: AudioService,
    private httpClient: HttpClient
  ) {
  }

  ngAfterViewInit(): void {
    this.audioContext = new AudioContext()
  }

  handleFileInput(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.item(0);

    if (file) {
      this.audioData = file
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const audioData = e.target?.result as ArrayBuffer;
        this.arrayBufferData = audioData
        // this.decodeAudioData(audioData);
      };
      reader.readAsArrayBuffer(file);
    }
  }

  async decodeAudioData(audioData: ArrayBuffer) {
    this.isLoading = true
    try {
      await this.audioContext.decodeAudioData(audioData, (buffer: AudioBuffer) => {
        const audioChannelData = buffer.getChannelData(0);
        const sampleRate = buffer.sampleRate;
        const samples = audioChannelData.length;
        const step = Math.ceil(samples / 1000); // Calcula el paso para obtener 1000 muestras
  
        const timestamps: any[] = [];
        const amplitudes: any[] = [];
  
        const update = () => {
          const currentTime = this.audioContext.currentTime;
          const currentIndex = Math.floor(currentTime * sampleRate);
  
          timestamps.push(currentTime.toFixed(2));
          amplitudes.push(audioChannelData[currentIndex]);
  
          if (currentIndex < samples) {
            this.animationFrameId = requestAnimationFrame(update);
            this.renderChart(timestamps, amplitudes);
          }
        };
  
        this.audioSource = this.audioContext.createBufferSource();
        this.audioSource.buffer = buffer;
        this.audioSource.connect(this.audioContext.destination);
        this.audioSource.start();
  
        this.animationFrameId = requestAnimationFrame(update);
      });
    }
    finally {
      this.isLoading = false
    }
  }

  renderChart(timestamps: number[], amplitudes: number[]): void {
    if (this.audioChart) {
      this.audioChart.destroy();
    }

    const ctx = this.canvas.nativeElement.getContext('2d');
    this.audioChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: timestamps,
        datasets: [{
          label: 'Audio',
          data: amplitudes,
          borderColor: 'blue',
          fill: false
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Tiempo'
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Amplitud'
            }
          }
        },
        animation: {
          duration: 0
        }
      }
    });
  }

  stopPlayback(): void {
    this.arrayBufferData = new ArrayBuffer(1)
    if (this.audioSource) {
      this.audioSource.stop();
      cancelAnimationFrame(this.animationFrameId);
      if(this.audioChart) {
        this.audioChart.destroy()
      }
      this.score = 0
      this.preview.nativeElement.value = ''
      this.selectedTune = null
    }
  }

  selectTune(tune: any) {
    this.selectedTune = tune
    console.log(this.selectedTune)
  }

  processAudio() {
    if(this.selectedTune == null) {
      alert('Seleccione una cancion')
      return;
    }

    if(this.audioData == null || this.audioData == undefined) {
      alert('Debe cargar un archivo de audio')
      return;
    }
    console.log(this.audioData)

    try{
      this.decodeAudioData(this.arrayBufferData)
      setTimeout(() => this.gradeScore(), 3000)
    }
    catch(err) {
      console.log(err)
      this.isLoading = false;
    }   
  }

  gradeScore() {
    const formData: FormData = new FormData();
    formData.append('audio', this.audioData);
    formData.append('etiqueta', this.selectedTune.id);

    this.httpClient.post<number>('http://localhost:5000/api/process-audio', formData)
    .pipe(finalize(() => this.isLoading = false))
    .subscribe(
      (resp: number) => {
        console.log(resp)
        this.score = Math.ceil(resp)
      },
      error => console.log(error))
  }

}
