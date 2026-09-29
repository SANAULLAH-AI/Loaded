import os

def generate_html_dashboard(metrics_history, output_path="lightning_dashboard.html"):
    batches = [x['Batch'] for x in metrics_history]
    throughputs = [x['Throughput'] for x in metrics_history]
    latencies = [x['Latency'] for x in metrics_history]
    nans = [x['NaNs'] for x in metrics_history]
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>⚡ LightningClean Core Telemetry Dashboard</title>
        <script src="https://jsdelivr.net"></script>
        <style>
            body {{ font-family: 'Segoe UI', sans-serif; background-color: #0f172a; color: #f8fafc; margin: 20px; }}
            .container {{ max-width: 1200px; margin: 0 auto; }}
            .header {{ background: linear-gradient(135deg, #1e1b4b, #311042); padding: 25px; border-radius: 12px; margin-bottom: 20px; border: 1px solid #4338ca; }}
            h1 {{ margin: 0; color: #6366f1; }}
            .grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(500px, 1fr)); gap: 20px; }}
            .card {{ background-color: #1e293b; padding: 20px; border-radius: 12px; border: 1px solid #334155; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>⚡ LIGHTNINGCLEAN CORE TELEMETRY</h1>
                <p>Hardware-Accelerated Tabular Firewall | Version 1.2.1 Audit Active</p>
            </div>
            <div class="grid">
                <div class="card">
                    <h3>🚀 Engine Ingestion Throughput (M-Cells / Sec)</h3>
                    <canvas id="throughputChart"></canvas>
                </div>
                <div class="card">
                    <h3>⏱️ Pipeline Latency Profile (Milliseconds)</h3>
                    <canvas id="latencyChart"></canvas>
                </div>
            </div>
        </div>
        <script>
            const opts = {{ responsive: true, plugins: {{ legend: {{ labels: {{ color: '#f1f5f9' }} }} }} }};
            new Chart(document.getElementById('throughputChart'), {{
                type: 'line',
                data: {{ labels: {batches}, datasets: [{{ label: 'Throughput', data: {throughputs}, borderColor: '#10b981', fill: true }}] }},
                options: opts
            }});
            new Chart(document.getElementById('latencyChart'), {{
                type: 'bar',
                data: {{ labels: {batches}, datasets: [{{ label: 'Latency (ms)', data: {latencies}, backgroundColor: '#6366f1' }}] }},
                options: opts
            }});
        </script>
    </body>
    </html>
    """
    with open(output_path, "w") as f:
        f.write(html_content)
    print(f"🎨 HTML Visual Dashboard compiled safely as -> {output_path}")
