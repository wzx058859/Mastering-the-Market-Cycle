const NAV_ITEMS = [
  { href: 'index.html', label: '首页' },
  { href: 'cycles.html', label: '周期图谱' },
  { href: 'thermometer.html', label: '周期温度计' },
  { href: 'strategy.html', label: '投资策略' },
];

function renderNav() {
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  const header = document.querySelector('.site-header');
  if (!header) return;

  const nav = document.createElement('nav');
  nav.innerHTML = `
    <a class="nav-brand" href="index.html">周期</a>
    <button class="nav-toggle" aria-label="菜单">☰</button>
    <div class="nav-right">
      <ul class="nav-links">
        ${NAV_ITEMS.map(item => `
          <li><a href="${item.href}" class="${currentPage === item.href ? 'active' : ''}">${item.label}</a></li>
        `).join('')}
      </ul>
      <button class="theme-toggle" id="theme-toggle" aria-label="切换主题"></button>
    </div>
  `;
  header.appendChild(nav);

  const toggle = nav.querySelector('.nav-toggle');
  const links = nav.querySelector('.nav-links');
  toggle.addEventListener('click', () => links.classList.toggle('open'));
}

function initTheme() {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'dark');
  document.documentElement.setAttribute('data-theme', theme);
  updateThemeIcon(theme);
}

function updateThemeIcon(theme) {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  btn.title = theme === 'dark' ? '切换到白天模式' : '切换到黑夜模式';
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon(next);
  updateChartTheme(next);
}

function updateChartTheme(theme) {
  if (theme === 'light') {
    CHART_THEME.textColor = '#3f3f46';
    CHART_THEME.gridBorder = '#d4d4d8';
    CHART_THEME.splitLine = '#e4e4e7';
    CHART_THEME.tooltipBg = 'rgba(255,255,255,0.95)';
    CHART_THEME.tooltipBorder = '#d4d4d8';
    CHART_THEME.accent = '#b8860b';
    CHART_THEME.green = '#16a34a';
    CHART_THEME.red = '#dc2626';
    CHART_THEME.blue = '#2563eb';
  } else {
    CHART_THEME.textColor = '#a1a1aa';
    CHART_THEME.gridBorder = '#27272a';
    CHART_THEME.splitLine = '#1e1e21';
    CHART_THEME.tooltipBg = 'rgba(24,24,27,0.95)';
    CHART_THEME.tooltipBorder = '#27272a';
    CHART_THEME.accent = '#d4a853';
    CHART_THEME.green = '#4ade80';
    CHART_THEME.red = '#f87171';
    CHART_THEME.blue = '#60a5fa';
  }
}

function renderFooter() {
  const footer = document.querySelector('.site-footer');
  if (!footer) return;
  footer.innerHTML = `
    <p>
      基于霍华德·马克斯《周期》(Mastering the Market Cycle) 制作<br>
      数据来源：<a href="https://historyofmarket.com" target="_blank">History of Market</a>、
      <a href="https://fred.stlouisfed.org" target="_blank">FRED</a>、
      <a href="https://finance.yahoo.com" target="_blank">Yahoo Finance</a><br>
      仅供研究与教育用途，不构成投资建议
    </p>
  `;
}

async function fetchJSON(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    console.error(`Fetch failed: ${url}`, e);
    return null;
  }
}

function formatNum(n, digits = 2) {
  if (n == null || isNaN(n)) return '—';
  return Number(n).toFixed(digits);
}

function formatPct(n, digits = 1) {
  if (n == null || isNaN(n)) return '—';
  return (n >= 0 ? '+' : '') + (n * 100).toFixed(digits) + '%';
}

function valClass(n) {
  if (n == null) return 'val-neutral';
  return n >= 0 ? 'val-up' : 'val-down';
}

function initChart(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return null;
  return echarts.init(el, null, { renderer: 'canvas' });
}

const CHART_THEME = {
  textColor: '#a1a1aa',
  gridBorder: '#27272a',
  splitLine: '#1e1e21',
  tooltipBg: 'rgba(24,24,27,0.95)',
  tooltipBorder: '#27272a',
  accent: '#d4a853',
  green: '#4ade80',
  red: '#f87171',
  blue: '#60a5fa',
};

function baseChartOption(title) {
  return {
    backgroundColor: 'transparent',
    textStyle: { fontFamily: 'Inter, sans-serif', color: CHART_THEME.textColor },
    title: title ? {
      text: title,
      textStyle: { fontSize: 13, fontWeight: 600, color: '#e4e4e7' },
      left: 0, top: 0,
    } : undefined,
    tooltip: {
      trigger: 'axis',
      backgroundColor: CHART_THEME.tooltipBg,
      borderColor: CHART_THEME.tooltipBorder,
      textStyle: { color: '#e4e4e7', fontSize: 12 },
    },
    grid: { left: 50, right: 20, top: title ? 40 : 20, bottom: 30, containLabel: false },
    xAxis: {
      type: 'category',
      axisLine: { lineStyle: { color: CHART_THEME.gridBorder } },
      axisTick: { show: false },
      axisLabel: { fontSize: 11, color: CHART_THEME.textColor },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: CHART_THEME.splitLine } },
      axisLabel: { fontSize: 11, color: CHART_THEME.textColor },
    },
  };
}

initTheme();

document.addEventListener('DOMContentLoaded', () => {
  renderNav();
  renderFooter();
  updateThemeIcon(document.documentElement.getAttribute('data-theme') || 'dark');
  document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);
});
