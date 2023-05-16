import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { AudioService } from 'src/app/shared/services/audio.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {
  chart!: Chart
  file!: Blob

  @ViewChild('preview', { read: ElementRef }) preview!: ElementRef;
  @ViewChild('canvas') canvas!: ElementRef;

  constructor(
    private audioService: AudioService
  ) {
  }

  ngAfterViewInit(): void {
    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Tonalidad',
          data: [],
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          x: {
            display: false
          },
          y: {
            min: 0,
            max: 1
          }
        }
      }
    });
  }

  startRecording() {
    this.chart.data.datasets[0].data = []
    this.audioService.initAudioContext()
    this.audioService.setChart(this.chart)
    this.audioService.start()
  }

  stopRecording() {
    this.audioService.stop()
    const audioRecorded = this.audioService.getAudioRecorded()
    if(audioRecorded) {
      const url = URL.createObjectURL(audioRecorded)
      console.log(url)
      this.preview.nativeElement.src = url
    }
  }

  handleFileInput(event: any) {
    console.log(event)
    const file: File = event.target.files.item(0)
    if(file) {
      this.readFileContent(file)
    }
  }

  readFileContent(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as ArrayBuffer
      console.log(content)
      this.file = new Blob([content])
      const url = URL.createObjectURL(this.file)
      console.log(url)
      this.preview.nativeElement.src = url
    };
    reader.readAsArrayBuffer(file);
  }

  processAudio() {
    
  }

}
