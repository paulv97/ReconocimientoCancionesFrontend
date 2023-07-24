import { Component } from '@angular/core';

@Component({
  selector: 'app-analisis-sentimientos',
  templateUrl: './analisis-sentimientos.component.html',
  styleUrls: ['./analisis-sentimientos.component.scss']
})
export class AnalisisSentimientosComponent {
  public pieChartData: any[] = [
    { name: 'Positivos', value: 26 },
    { name: 'Negativos', value: 9 },
    { name: 'Neutrales', value: 20 }
  ];

  // colorScheme = {
  //   domain: ['#01DF3A', '#DF0101', '#848484']
  // };

  colorScheme = [
    { name: 'Positivos', value: '#01DF3A' }, // Colores personalizados en formato hexadecimal
    { name: 'Negativos', value: '#DF0101' },
    { name: 'Neutrales', value: '#848484' }
  ]

  onPieChartSelect(event: any) {
    // Aquí puedes manejar la selección del gráfico de pastel si es necesario
    console.log('Pie chart select event:', event);
  }



  public xAxisLabel: string = 'Categoría';
  public yAxisLabel: string = 'Conteo';

  public barChartData: any[] = [
    { name: 'Positivos', value: 26 },
    { name: 'Negativos', value: 9 },
    { name: 'Neutrales', value: 20 }
  ];

  onBarChartSelect(event: any) {
    // Aquí puedes manejar la selección del gráfico de barras si es necesario
    console.log('Bar chart select event:', event);
  }
}
