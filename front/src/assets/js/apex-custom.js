

$(function () {
	"use strict";
	// chart 1c:\Users\marie\OneDrive\바탕 화면\cv_proj_main\cv_proj_main\src\app\shared\sidebar\sidebar-routes.config.ts
	
	fetch('/assets/js/time_based.json')
	.then((response) => response.json())
	.then((data) => {
		const timeDistribution = data.time_distribution;  // 시간대별 데이터 가져오기
		const times = Object.keys(timeDistribution).map(time => time.replace(':00', '시'));  // 시간대 변경 (예: '8:00' → '8시')
		const values = Object.values(timeDistribution);  // 각 시간대에 해당하는 값들 (5, 7, 2 등)
	
		const options = {
			series: [{
				name: '결함 비율',
				data: values  // JSON에서 가져온 값을 차트 데이터로 사용
			}],
			chart: {
				foreColor: '#9ba7b2',
				height: 360,
				type: 'line',
				zoom: {
					enabled: false
				},
				toolbar: {
					show: true
				},
				dropShadow: {
					enabled: true,
					top: 3,
					left: 14,
					blur: 4,
					opacity: 0.10,
				}
			},
			stroke: {
				width: 5,
				curve: 'smooth'
			},
			xaxis: {
				categories: times,  // 시간대 설정
			},
			title: {
				text: '',
				align: 'left',
				style: {
					fontSize: "16px",
					color: '#666'
				}
			},
			fill: {
				type: 'gradient',
				gradient: {
					shade: 'light',
					gradientToColors: ['#f41127'],
					shadeIntensity: 1,
					type: 'horizontal',
					opacityFrom: 1,
					opacityTo: 1,
					stops: [0, 100, 100, 100]
				},
			},
			markers: {
				size: 4,
				colors: ["#f41127"],
				strokeColors: "#fff",
				strokeWidth: 2,
				hover: {
					size: 7,
				}
			},
			colors: ["#f41127"],
			yaxis: {
				title: {
					text: '비율 (%)',
				},
			},
			tooltip: {
				y: {
					formatter: function (val) {
						return val + " %"
					}
				}
			}
		};
	
		var chart = new ApexCharts(document.querySelector("#chart1"), options);
		chart.render();
	})
	.catch((error) => {
		console.error("Error loading JSON data:", error);
	});
	
	// chart 4
	fetch('/assets/js/monthly.json') // JSON 파일 경로
	.then((response) => response.json()) // JSON 형식으로 파싱
	.then((data) => {
		// 데이터를 차트에 맞게 변환
		const months = Object.keys(data); // 월 정보 가져오기 (예: ['2024-11', '2024-10'])
		const ngCounts = months.map(month => data[month].average_ng_count); // 불량품 평균 개수
		const totalImages = months.map(month => data[month].average_total_images); // 전체 이미지 평균 개수
		const ngRates = months.map(month => data[month].average_ng_rate); // 불량률

		// 월별 평균 생산량, 불량품, 불량률 계산
		const averageTotalImages = totalImages.reduce((acc, curr) => acc + curr, 0) / totalImages.length;
		const averageNgCount = ngCounts.reduce((acc, curr) => acc + curr, 0) / ngCounts.length;
		const averageNgRate = ngRates.reduce((acc, curr) => acc + curr, 0) / ngRates.length;

		// 월별 평균 생산량 (3백만 개 형식으로 표시)
		document.querySelector("#chart-text #total").textContent = `${(averageTotalImages).toFixed(0)}개`;

		// 월별 평균 불량품 (12만 개 형식으로 표시)
		document.querySelector("#chart-text #ng").textContent = `${(averageNgCount).toFixed(0)}개`;

		// 월별 평균 불량률 (4% 형식으로 표시)
		document.querySelector("#chart-text #ng_ratio").textContent = `${averageNgRate.toFixed(1)}%`;

		// 차트 옵션 설정
		const options = {
			series: [
				{ name: '불량품', data: ngCounts },
				{ name: '양품', data: totalImages.map((total, index) => total - ngCounts[index]) }
			],
			chart: {
				foreColor: '#9ba7b2',
				type: 'bar',
				height: 360
			},
			plotOptions: {
				bar: {
					horizontal: false,
					columnWidth: '55%',
					endingShape: 'rounded'
				}
			},
			dataLabels: {
				enabled: false
			},
			stroke: {
				show: true,
				width: 2,
				colors: ['transparent']
			},
			title: {
				text: '월별 양품 및 불량품 통계',
				align: 'left',
				style: {
					fontSize: '14px'
				}
			},
			colors: ["#212529", '#0d6efd'],
			xaxis: {
				categories: months.map(month => month.replace('2024-', '') + '월') // 월 이름 추출
			},
			yaxis: {
				title: {
					text: '개수'
				}
			},
			fill: {
				opacity: 1
			},
			tooltip: {
				y: {
					formatter: function (val) {
						return val + " 개";
					}
				}
			}
		};

		// 차트 렌더링
		const chart = new ApexCharts(document.querySelector("#chart4"), options);
		chart.render();
	})
	.catch((error) => {
		console.error("Error loading JSON data:", error);
	});


	fetch('/assets/js/ok_rate.json')
  .then((response) => response.json())
  .then((data) => {
    // JSON 데이터에서 2024-11-27 날짜의 ok_rate와 ng_rate 값을 추출
    const selectedData = data.find(item => item.date === "2024-11-27");

    const okRate = selectedData.ok_rate; // 2024-11-27의 ok rate
    const ngRate = selectedData.ng_rate; // 2024-11-27의 ng rate

    // Donut 차트 옵션 설정
    const options = {
      series: [okRate, ngRate], // OK Rate와 NG Rate를 차트에 적용
      labels: ["양품", "불량품"],
      chart: {
        foreColor: '#9ba7b2',
        height: "100%",
        width: "100%",
        type: 'donut',
      },
      colors: ["rgb(23, 160, 14)", "rgb(244, 17, 39)","#212529", "#17a00e", "#f41127"],
      legend: {
        position: 'bottom',
        fontSize: '10px',
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            height: 320
          },
          legend: {
            position: 'bottom'
          }
        }
      }],
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '16px',
                color: '#212529'
              },
              value: {
                show: true,
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#212529'
              },
              total: {
                show: true,
                label: '불량',
                fontSize: '20px',
                fontWeight: 600,
                color: '#212529',
                formatter: function (w) {
                  const total = w.globals.series.reduce((a, b) => a + b, 0); // 전체 합을 구함
                  const faultyPercentage = (w.globals.series[1] / total) * 100; // 불량 비율 계산
                  return `${faultyPercentage.toFixed(1)}%`; // 불량 비율 표시
                }
              }
            }
          }
        }
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + "%";
          }
        }
      }
    };

    // 차트 렌더링
    const chart = new ApexCharts(document.querySelector("#chart9"), options);
    chart.render();
  })
  .catch((error) => {
    console.error("Error loading JSON data:", error);
  });
	
});