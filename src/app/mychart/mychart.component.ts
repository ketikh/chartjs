import { Component, OnInit } from '@angular/core';
import times from '../times.json'
import 'chartjs-adapter-date-fns';
import otherTimes from '../other-time.json'
import annotationPlugin from 'chartjs-plugin-annotation';
import {
  Chart,
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  Legend,
  ChartData,
  LineController,
  PointElement,
  registerables
} from 'chart.js'
import { ChartDataModel, ChartModel } from '../models/model';
import { Colors } from '../models/color';
Chart.register(...registerables);
Chart.register(annotationPlugin);

@Component({
  selector: 'app-mychart',
  templateUrl: './mychart.component.html',
  styleUrls: ['./mychart.component.css']
})
export class MychartComponent implements OnInit {
  // input1:ChartModel = times;
  // input2:ChartModel = otherTimes;
  inputs: ChartModel[] = [times, otherTimes];
  myChart: Chart;
  datasets: ChartData<'line', ChartDataModel[]>= <ChartData<'line', ChartDataModel[]>>{
    datasets:[]
  };
  constructor() {
  }
  ngOnInit(): void {
    this.generateChartData();
  }

  generateChartData() {
    this.datasets.datasets=[];
    this.inputs.forEach((currentValue, index) => {
      const chartDataset = {
        data: currentValue.data,
        parsing: {
          xAxisKey: 'key',
          yAxisKey: 'value'
        },
        label: currentValue.name,
        borderColor: Colors.getColorsByIndex(index),
      }

      this.datasets.datasets.push(chartDataset);
    });
    this.createChart();
  }

  createChart() {
    const getOrCreateLegendList = (chart: any, id: string) => {
      const legendContainer = document.getElementById(id);
      let listContainer = legendContainer?.querySelector('ul');

      if (!listContainer) {
        listContainer = document.createElement('ul');
        listContainer.style.display = 'flex';
        listContainer.style.flexDirection = 'row';
        listContainer.style.margin = "0px";
        listContainer.style.padding = "0px";

        legendContainer?.appendChild(listContainer);
      }

      return listContainer;
    };

    const htmlLegendPlugin = {
      id: 'htmlLegend',
      afterUpdate(chart: { options: { plugins: { legend: { labels: { generateLabels: (arg0: any) => any; }; }; }; }; config: { type: any; }; toggleDataVisibility: (arg0: any) => void; setDatasetVisibility: (arg0: any, arg1: boolean) => void; isDatasetVisible: (arg0: any) => any; update: () => void; }, args: any, options: { containerID: string; }) {
        const ul = getOrCreateLegendList(chart, options.containerID);

        // Remove old legend items
        while (ul.firstChild) {
          ul.firstChild.remove();
        }

        // Reuse the built-in legendItems generator
        const items = chart.options.plugins.legend.labels.generateLabels(chart);

        items.forEach((item: { index: any; datasetIndex: any; fillStyle: string; strokeStyle: string; lineWidth: string; fontColor: string; hidden: any; text: string; },index: number) => {
          const li = document.createElement('li');
          li.style.alignItems = 'center';
          li.style.cursor = 'pointer';
          li.style.display = 'flex';
          li.style.flexDirection = 'row';
          li.style.marginLeft = '10px';

          li.onclick = () => {
            const { type } = chart.config;
            if (type === 'pie' || type === 'doughnut') {
              // Pie and doughnut charts only have a single dataset and visibility is per item
              chart.toggleDataVisibility(item.index);
            } else {
              chart.setDatasetVisibility(item.datasetIndex, !chart.isDatasetVisible(item.datasetIndex));
            }
            chart.update();
          };


          // Text
          const textContainer = document.createElement('p');
          textContainer.style.color = Colors.getColorsByIndex(index);
          textContainer.style.margin = "0px";
          textContainer.style.padding = "0px";
          textContainer.style.textDecoration = item.hidden ? 'line-through' : '';

          const text = document.createTextNode(item.text);
          textContainer.appendChild(text);

          li.appendChild(textContainer);
          ul.appendChild(li);
        });
      }
    };

    const config = <any>{
      type: 'line',
      data: this.datasets,
      options: {
        scales: {
          y: {
            beginAtZero: true,
            // ticks: {
            //   // Include a dollar sign in the ticks
            //   callback: function (value: string, index: any, ticks: any) {
            //     return value;
            //   }
            // }
          },
          x: {
            type: 'time',
            time: {
              unit: 'day',
              displayFormats: {
                'day': 'dd/MM/yyyy'
              },
            },

          }
        },
        annotation: {
          drawTime: 'afterDatasetsDraw',
          annotations: [
            {
              type: 'line',
              mode: 'vertical',
              scaleID: 'x-axis-0',
              value: 5,
              borderColor: 'green',
              borderWidth: 1,
              label: {
                enabled: true,
                position: "center",
                content: 10
              }
            },
            {
              type: 'line',
              mode: 'vertical',
              scaleID: 'x-axis-0',
              value: 30,
              borderColor: 'green',
              borderWidth: 1,
              label: {
                enabled: true,
                position: "center",
                content: 20
              }
            }]
       },
        plugins: {
          tooltip: {
            callbacks: {
              title: function () {
                return '';
              },
              label: function (context: { raw: { key: Date; value: number; unit: string; } | undefined; }) {
                const raw = context.raw as { key: Date; value: number; unit: string } | undefined;

                if (raw && raw.unit) {
                  return `Unit: ${raw.unit}`;
                } else {
                  return '';
                }
              }
            }
          },
          htmlLegend: {
            // ID of the container to put the legend in
            containerID: 'legend-container',
          },
          legend: {
            display: false,
          }
        }
        // tooltips: {
        //   callbacks: {
        //     title: function (tooltipItems, data) {
        //       return "";
        //     },

        //     label: function (t, d) {
        //       var xLabel = d.datasets[t.datasetIndex].label;
        //       var yLabel = t.yLabel;
        //       var multistringText = [chartLabelData.title + xLabel];
        //       multistringText.push(chartLabelData.date + new DatePipe(chartLabelData.language).transform(new Date(t.xLabel), "longDate"));
        //       multistringText.push(chartLabelData.time + new Date(t.xLabel).toLocaleTimeString(chartLabelData.language, { hour12: false, hour: '2-digit', minute: '2-digit' }));
        //       multistringText.push(chartLabelData.value + yLabel.toLocaleString() + ' ' + chartLabelData.unit);
        //       return multistringText;
        //     }
        //   }
        // },
      },
      plugins: [htmlLegendPlugin],
    }

    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    
    this.myChart = new Chart(ctx, config);
  }

}
