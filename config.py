# Reducing BUF_SIZE may allow more concurrent connections, at the expense of performance.
BUF_SIZE = 65536

# CLIENT_ROOT is the path of the Ratatoskr HTML5 client.
CLIENT_ROOT = b"client"

# LISTEN_ADDR and LISTEN_PORT specify the interface and port number to listen on.
LISTEN_ADDR = b"0.0.0.0"
LISTEN_PORT = 80

# CGI_BIN is a dictionary of CGI scripts.
CGI_BIN = {b"/cgitest": b"cgitest.py"}

# AUTHORIZE should return True if a request is allowed, or False if the server should return a 401 Unauthorized response.
# The path is already decoded and has had any ..s removed.
def AUTHORIZE(method, path, query, headers):
  if path.startswith(b"/Files"):
    if headera.AUTHORIZATION == b"Basic someauthstring":
      return True
    return False
  if method in [b"OPTIONS", b"HEAD", b"GET"]:
    return True
  return False

# MAP_PATH returns the filesystem path for the request
def MAP_PATH(method, path, query, headers):
  if path.startswith(b"/Files"):
    return b"/hdd" + path
  if path.endswith(b"/"):
    return b"/hdd/WWW" + path + b"index.html"
  return b"/hdd/WWW" + path
