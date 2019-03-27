'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _net = require('net');

var _net2 = _interopRequireDefault(_net);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (server, log) {
  (0, _socket2.default)(server).on('connection', function (socket) {
    var id = socket.conn.id;
    var remote = socket.conn.remoteAddress;
    log && log.info('io', 'New connection [%s] from %s', id, remote);

    socket.on('open', function (_ref, fn) {
      var host = _ref.host,
          port = _ref.port;

      log && log.verbose('io', 'Open request to %s:%s [%s]', host, port, id);
      var tcp = _net2.default.connect(port, host, function () {
        log && log.verbose('io', 'Opened tcp connection to %s:%s [%s]', host, port, id);

        tcp.on('data', function (chunk) {
          log && log.silly('io', 'Received %s bytes from %s:%s [%s]', chunk.length, host, port, id);
          socket.emit('data', chunk);
        });

        tcp.on('end', function () {
          return socket.emit('end');
        });

        tcp.on('close', function () {
          log && log.verbose('io', 'Closed tcp connection to %s:%s [%s]', host, port, id);
          socket.emit('close');

          socket.removeAllListeners('data');
          socket.removeAllListeners('end');
        });

        socket.on('data', function (chunk, fn) {
          if (!chunk || !chunk.length) {
            if (typeof fn === 'function') {
              fn();
            }
            return;
          }
          log && log.silly('io', 'Sending %s bytes to %s:%s [%s]', chunk.length, host, port, id);
          tcp.write(chunk, function () {
            if (typeof fn === 'function') {
              fn();
            }
          });
        });

        socket.on('end', function () {
          log && log.verbose('io', 'Received request to close connection to %s:%s [%s]', host, port, id);
          tcp.end();
        });

        if (typeof fn === 'function') {
          fn(_os2.default.hostname()); // reply with hostname once we're set up
        }

        socket.on('disconnect', function () {
          log && log.verbose('io', 'Closed connection [%s], closing connection to %s:%s ', id, host, port);
          tcp.end();
          socket.removeAllListeners();
        });
      });
      // move down here so that error handler is attached early enough to catch net.connect errors during connection phase, e.g. host not found
      tcp.on('error', function (err) {
        log && log.verbose('io', 'Error for %s:%s [%s]: %s', host, port, id, err.message);
        socket.emit('socketerror', err.message); // send to client, 'error' is a reserved name that doesn't get sent to client
        socket.emit('error', err.message);
      });
    });

    socket.on('error', function (err) {
      log && log.verbose('io', 'Error for %s', err);
    });
  });
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wcm94eS5qcyJdLCJuYW1lcyI6WyJzZXJ2ZXIiLCJsb2ciLCJvbiIsImlkIiwic29ja2V0IiwiY29ubiIsInJlbW90ZSIsInJlbW90ZUFkZHJlc3MiLCJpbmZvIiwiZm4iLCJob3N0IiwicG9ydCIsInZlcmJvc2UiLCJ0Y3AiLCJuZXQiLCJjb25uZWN0Iiwic2lsbHkiLCJjaHVuayIsImxlbmd0aCIsImVtaXQiLCJyZW1vdmVBbGxMaXN0ZW5lcnMiLCJ3cml0ZSIsImVuZCIsIm9zIiwiaG9zdG5hbWUiLCJlcnIiLCJtZXNzYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztrQkFFZSxVQUFDQSxNQUFELEVBQVNDLEdBQVQsRUFBaUI7QUFDOUIsd0JBQVNELE1BQVQsRUFBaUJFLEVBQWpCLENBQW9CLFlBQXBCLEVBQWtDLGtCQUFVO0FBQzFDLFFBQU1DLEtBQUtDLE9BQU9DLElBQVAsQ0FBWUYsRUFBdkI7QUFDQSxRQUFNRyxTQUFTRixPQUFPQyxJQUFQLENBQVlFLGFBQTNCO0FBQ0FOLFdBQU9BLElBQUlPLElBQUosQ0FBUyxJQUFULEVBQWUsNkJBQWYsRUFBOENMLEVBQTlDLEVBQWtERyxNQUFsRCxDQUFQOztBQUVBRixXQUFPRixFQUFQLENBQVUsTUFBVixFQUFrQixnQkFBaUJPLEVBQWpCLEVBQXdCO0FBQUEsVUFBckJDLElBQXFCLFFBQXJCQSxJQUFxQjtBQUFBLFVBQWZDLElBQWUsUUFBZkEsSUFBZTs7QUFDeENWLGFBQU9BLElBQUlXLE9BQUosQ0FBWSxJQUFaLEVBQWtCLDRCQUFsQixFQUFnREYsSUFBaEQsRUFBc0RDLElBQXRELEVBQTREUixFQUE1RCxDQUFQO0FBQ0EsVUFBTVUsTUFBTUMsY0FBSUMsT0FBSixDQUFZSixJQUFaLEVBQWtCRCxJQUFsQixFQUF3QixZQUFNO0FBQ3hDVCxlQUFPQSxJQUFJVyxPQUFKLENBQVksSUFBWixFQUFrQixxQ0FBbEIsRUFBeURGLElBQXpELEVBQStEQyxJ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InByb3h5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHNvY2tldGlvIGZyb20gJ3NvY2tldC5pbydcclxuaW1wb3J0IG5ldCBmcm9tICduZXQnXHJcbmltcG9ydCBvcyBmcm9tICdvcydcclxuXHJcbmV4cG9ydCBkZWZhdWx0IChzZXJ2ZXIsIGxvZykgPT4ge1xyXG4gIHNvY2tldGlvKHNlcnZlcikub24oJ2Nvbm5lY3Rpb24nLCBzb2NrZXQgPT4ge1xyXG4gICAgY29uc3QgaWQgPSBzb2NrZXQuY29ubi5pZFxyXG4gICAgY29uc3QgcmVtb3RlID0gc29ja2V0LmNvbm4ucmVtb3RlQWRkcmVzc1xyXG4gICAgbG9nICYmIGxvZy5pbmZvKCdpbycsICdOZXcgY29ubmVjdGlvbiBbJXNdIGZyb20gJXMnLCBpZCwgcmVtb3RlKVxyXG5cclxuICAgIHNvY2tldC5vbignb3BlbicsICh7IGhvc3QsIHBvcnQgfSwgZm4pID0+IHtcclxuICAgICAgbG9nICYmIGxvZy52ZXJib3NlKCdpbycsICdPcGVuIHJlcXVlc3QgdG8gJXM6JXMgWyVzXScsIGhvc3QsIHBvcnQsIGlkKVxyXG4gICAgICBjb25zdCB0Y3AgPSBuZXQuY29ubmVjdChwb3J0LCBob3N0LCAoKSA9PiB7XHJcbiAgICAgICAgbG9nICYmIGxvZy52ZXJib3NlKCdpbycsICdPcGVuZWQgdGNwIGNvbm5lY3Rpb24gdG8gJXM6JXMgWyVzXScsIGhvc3QsIHBvcnQsIGlkKVxyXG5cclxuICAgICAgICB0Y3Aub24oJ2RhdGEnLCBjaHVuayA9PiB7XHJcbiAgICAgICAgICBsb2cgJiYgbG9nLnNpbGx5KCdpbycsICdSZWNlaXZlZCAlcyBieXRlcyBmcm9tICVzOiVzIFslc10nLCBjaHVuay5sZW5ndGgsIGhvc3QsIHBvcnQsIGlkKVxyXG4gICAgICAgICAgc29ja2V0LmVtaXQoJ2RhdGEnLCBjaHVuaylcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICB0Y3Aub24oJ2VuZCcsICgpID0+IHNvY2tldC5lbWl0KCdlbmQnKSlcclxuXHJcbiAgICAgICAgdGNwLm9uKCdjbG9zZScsICgpID0+IHtcclxuICAgICAgICAgIGxvZyAmJiBsb2cudmVyYm9zZSgnaW8nLCAnQ2xvc2VkIHRjcCBjb25uZWN0aW9uIHRvICVzOiVzIFslc10nLCBob3N0LCBwb3J0LCBpZClcclxuICAgICAgICAgIHNvY2tldC5lbWl0KCdjbG9zZScpXHJcblxyXG4gICAgICAgICAgc29ja2V0LnJlbW92ZUFsbExpc3RlbmVycygnZGF0YScpXHJcbiAgICAgICAgICBzb2NrZXQucmVtb3ZlQWxsTGlzdGVuZXJzKCdlbmQnKVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIHNvY2tldC5vbignZGF0YScsIChjaHVuaywgZm4pID0+IHtcclxuICAgICAgICAgIGlmICghY2h1bmsgfHwgIWNodW5rLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgZm4oKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgbG9nICYmIGxvZy5zaWxseSgnaW8nLCAnU2VuZGluZyAlcyBieXRlcyB0byAlczolcyBbJXNdJywgY2h1bmsubGVuZ3RoLCBob3N0LCBwb3J0LCBpZClcclxuICAgICAgICAgIHRjcC53cml0ZShjaHVuaywgKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgZm4oKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIHNvY2tldC5vbignZW5kJywgKCkgPT4ge1xyXG4gICAgICAgICAgbG9nICYmIGxvZy52ZXJib3NlKCdpbycsICdSZWNlaXZlZCByZXF1ZXN0IHRvIGNsb3NlIGNvbm5lY3Rpb24gdG8gJXM6JXMgWyVzXScsIGhvc3QsIHBvcnQsIGlkKVxyXG4gICAgICAgICAgdGNwLmVuZCgpXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgZm4ob3MuaG9zdG5hbWUoKSkgLy8gcmVwbHkgd2l0aCBob3N0bmFtZSBvbmNlIHdlJ3JlIHNldCB1cFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc29ja2V0Lm9uKCdkaXNjb25uZWN0JywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgbG9nICYmIGxvZy52ZXJib3NlKCdpbycsICdDbG9zZWQgY29ubmVjdGlvbiBbJXNdLCBjbG9zaW5nIGNvbm5lY3Rpb24gdG8gJXM6JXMgJywgaWQsIGhvc3QsIHBvcnQpXHJcbiAgICAgICAgICB0Y3AuZW5kKClcclxuICAgICAgICAgIHNvY2tldC5yZW1vdmVBbGxMaXN0ZW5lcnMoKVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH0pXHJcbiAgICAgIC8vIG1vdmUgZG93biBoZXJlIHNvIHRoYXQgZXJyb3IgaGFuZGxlciBpcyBhdHRhY2hlZCBlYXJseSBlbm91Z2ggdG8gY2F0Y2ggbmV0LmNvbm5lY3QgZXJyb3JzIGR1cmluZyBjb25uZWN0aW9uIHBoYXNlLCBlLmcuIGhvc3Qgbm90IGZvdW5kXHJcbiAgICAgIHRjcC5vbignZXJyb3InLCBlcnIgPT4ge1xyXG4gICAgICAgIGxvZyAmJiBsb2cudmVyYm9zZSgnaW8nLCAnRXJyb3IgZm9yICVzOiVzIFslc106ICVzJywgaG9zdCwgcG9ydCwgaWQsIGVyci5tZXNzYWdlKVxyXG4gICAgICAgIHNvY2tldC5lbWl0KCdzb2NrZXRlcnJvcicsIGVyci5tZXNzYWdlKSAvLyBzZW5kIHRvIGNsaWVudCwgJ2Vycm9yJyBpcyBhIHJlc2VydmVkIG5hbWUgdGhhdCBkb2Vzbid0IGdldCBzZW50IHRvIGNsaWVudFxyXG4gICAgICAgIHNvY2tldC5lbWl0KCdlcnJvcicsIGVyci5tZXNzYWdlKVxyXG4gICAgICB9KVxyXG4gICAgfSlcclxuXHJcbiAgICBzb2NrZXQub24oJ2Vycm9yJywgZXJyID0+IHtcclxuICAgICAgbG9nICYmIGxvZy52ZXJib3NlKCdpbycsICdFcnJvciBmb3IgJXMnLCBlcnIpXHJcbiAgICB9KTtcclxuICB9KVxyXG59XHJcbiJdfQ==