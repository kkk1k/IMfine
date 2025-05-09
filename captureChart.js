// captureChart.js

// 1) 차트를 canvas 에 그리는 함수
export function drawChartOnCanvas(ctx, width, height, data, colors) {
  ctx.save();
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const barWidth = width / data.length;
  data.forEach((d, i) => {
    const barH = (d.value / maxVal) * (height * 0.8);
    const x = i * barWidth + 10;
    const y = height - barH - 20;
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(x, y, barWidth - 20, barH);

    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.font = "14px sans-serif";
    ctx.fillText(d.value, x + (barWidth - 20) / 2, y - 5);
    ctx.fillText(d.id, x + (barWidth - 20) / 2, height - 5);
  });
}

// 2) 버튼 클릭 시 호출될 전역 함수
export function captureChart(data, colors) {
  const canvas = document.getElementById("export-canvas");
  const ctx = canvas.getContext("2d");
  drawChartOnCanvas(ctx, canvas.width, canvas.height, data, colors);
  const url = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = url;
  a.download = "chart.png";
  a.click();
}
