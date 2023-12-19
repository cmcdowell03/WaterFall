
import http.server
import json
import os
from datetime import datetime
from urllib.parse import urlparse, parse_qs

class MyHttpRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/list-files':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            files_info = []
            for file in os.listdir('.'):
                if os.path.isfile(file):
                    mod_timestamp = os.path.getmtime(file)
                    mod_time = datetime.fromtimestamp(mod_timestamp).strftime('%Y-%m-%d %H:%M:%S')
                    files_info.append({'name': file, 'modified': mod_time})
            self.wfile.write(bytes(json.dumps(files_info), "utf8"))
        else:
            super().do_GET()

    def do_DELETE(self):
        query_components = urlparse(self.path).query
        file_name = parse_qs(query_components).get('name', [''])[0]
        if file_name:
            try:
                os.remove(file_name)
                self.send_response(200)
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'text/plain')
                self.end_headers()
                self.wfile.write(str(e).encode())
        else:
            self.send_response(400)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write('File name not provided'.encode())

handler_object = MyHttpRequestHandler

with http.server.HTTPServer(("", 8000), handler_object) as server:
    print("Server started at http://localhost:8000")
    server.serve_forever()
