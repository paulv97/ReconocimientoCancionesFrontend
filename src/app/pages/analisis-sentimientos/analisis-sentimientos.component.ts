import { Component } from '@angular/core';

@Component({
  selector: 'app-analisis-sentimientos',
  templateUrl: './analisis-sentimientos.component.html',
  styleUrls: ['./analisis-sentimientos.component.scss']
})
export class AnalisisSentimientosComponent {
  public pieChartData: any[] = [
    { name: 'Positivos', value: 300 },
    { name: 'Negativos', value: 500 },
    { name: 'Neutrales', value: 200 }
  ];

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  onPieChartSelect(event: any) {
    // Aquí puedes manejar la selección del gráfico de pastel si es necesario
    console.log('Pie chart select event:', event);
  }
}
