// 월별 결함 수 차트
const ctxMonthly = document.getElementById('monthlyDefectsChart');
new Chart(ctxMonthly, {
  type: 'line',
  data: {
    labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
    datasets: [
      {
        label: '결함 수',
        data: [12, 19, 3, 5, 2, 3], // 샘플 데이터
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  }
});

// 양품 비율 차트
const ctxQuality = document.getElementById('qualityRatioChart');
new Chart(ctxQuality, {
  type: 'doughnut',
  data: {
    labels: ['정상', '불량'],
    datasets: [
      {
        label: '양품 비율',
        data: [95, 5], // 샘플 데이터
        backgroundColor: ['#4caf50', '#f44336']
      }
    ]
  }
});
