from .api import LightningShield, initialize, get_metrics, export_dashboard_json
from .visualizer import generate_html_dashboard

try:
    from .server import start_server, app
    has_web = True
except ImportError:
    has_web = False

__version__ = "1.2.1"
__all__ = ["LightningShield", "initialize", "get_metrics", "export_dashboard_json", "generate_html_dashboard"]

if has_web:
    __all__.extend(["start_server", "app"])
