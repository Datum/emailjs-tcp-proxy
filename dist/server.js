'use strict';

var _cluster = require('cluster');

var _cluster2 = _interopRequireDefault(_cluster);

var _npmlog = require('npmlog');

var _npmlog2 = _interopRequireDefault(_npmlog);

var _proxy = require('./proxy');

var _proxy2 = _interopRequireDefault(_proxy);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LOG_FORMAT = ':remote-addr [:date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer"';

_npmlog2.default.level = 'silly';
var port = process.env.PROXY_PORT || 8888;

var exit = function exit(signal, exitCode) {
  return function () {
    _npmlog2.default.warn('exit', 'Exited on ' + signal);
    process.exit(exitCode);
  };
};

process.on('SIGINT', exit('SIGINT', 1));
process.on('SIGUSR1', exit('SIGUSR1', 1));
process.on('SIGUSR2', exit('SIGUSR2', 1));
// process.on('uncaughtException', exit('Uncaught exception', 1))
process.on('SIGTERM', exit('SIGTERM', 0));
process.on('SIGINT', exit('SIGINT', 0));
// process.on('uncaughtException', exit('uncaughtException', 1))
process.on('unhandledRejection', function (reason, p) {
  console.error(reason, 'Unhandled Rejection at Promise', p);
}).on('uncaughtException', function (err) {
  console.error(err, 'Uncaught Exception thrown');
  process.exit(1);
});
process.on('exit', function () {
  if (_cluster2.default.isMaster) {
    for (var id in _cluster2.default.workers) {
      _cluster2.default.workers[id].kill();
    }
  }
  exit(0)();
});

if (_cluster2.default.isMaster) {
  _cluster2.default.on('fork', function (worker) {
    _npmlog2.default.info('cluster', 'Forked worker #%s [pid:%s]', worker.id, worker.process.pid);
  });

  _cluster2.default.on('exit', function (worker) {
    _npmlog2.default.warn('cluster', 'Worker #%s [pid:%s] died', worker.id, worker.process.pid);
    setTimeout(function () {
      _cluster2.default.fork();
    }, 1000);
  });

  _cluster2.default.fork();
} else {
  var app = (0, _express2.default)();
  var server = (0, _http.Server)(app);
  app.disable('x-powered-by');
  app.use((0, _morgan2.default)(LOG_FORMAT, {
    stream: { write: function write() {
        var line = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        return line.trim() && _npmlog2.default.http('express', line);
      } }
  }));
  server.listen(port, function () {
    var _server$address = server.address(),
        address = _server$address.address,
        port = _server$address.port;

    (0, _proxy2.default)(server, _npmlog2.default);
    _npmlog2.default.info('express', 'Server listening on %s:%s', address, port);
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zZXJ2ZXIuanMiXSwibmFtZXMiOlsiTE9HX0ZPUk1BVCIsImxvZyIsImxldmVsIiwicG9ydCIsInByb2Nlc3MiLCJlbnYiLCJQUk9YWV9QT1JUIiwiZXhpdCIsInNpZ25hbCIsImV4aXRDb2RlIiwid2FybiIsIm9uIiwicmVhc29uIiwicCIsImNvbnNvbGUiLCJlcnJvciIsImVyciIsImNsdXN0ZXIiLCJpc01hc3RlciIsImlkIiwid29ya2VycyIsImtpbGwiLCJ3b3JrZXIiLCJpbmZvIiwicGlkIiwic2V0VGltZW91dCIsImZvcmsiLCJhcHAiLCJzZXJ2ZXIiLCJkaXNhYmxlIiwidXNlIiwic3RyZWFtIiwid3JpdGUiLCJsaW5lIiwidHJpbSIsImh0dHAiLCJsaXN0ZW4iLCJhZGRyZXNzIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBLElBQU1BLGFBQWEsaUdBQW5COztBQUVBQyxpQkFBSUMsS0FBSixHQUFZLE9BQVo7QUFDQSxJQUFNQyxPQUFPQyxRQUFRQyxHQUFSLENBQVlDLFVBQVosSUFBMEIsSUFBdkM7O0FBRUEsSUFBTUMsT0FBTyxTQUFQQSxJQUFPLENBQUNDLE1BQUQsRUFBU0MsUUFBVDtBQUFBLFNBQXNCLFlBQU07QUFDdkNSLHFCQUFJUyxJQUFKLENBQVMsTUFBVCxpQkFBOEJGLE1BQTlCO0FBQ0FKLFlBQVFHLElBQVIsQ0FBYUUsUUFBYjtBQUNELEdBSFk7QUFBQSxDQUFiOztBQUtBTCxRQUFRTyxFQUFSLENBQVcsUUFBWCxFQUFxQkosS0FBSyxRQUFMLEVBQWUsQ0FBZixDQUFyQjtBQUNBSCxRQUFRTyxFQUFSLENBQVcsU0FBWCxFQUFzQkosS0FBSyxTQUFMLEVBQWdCLENBQWhCLENBQXRCO0FBQ0FILFFBQVFPLEVBQVIsQ0FBVyxTQUFYLEVBQXNCSixLQUFLLFNBQUwsRUFBZ0IsQ0FBaEIsQ0FBdEI7QUFDQTtBQUNBSCxRQUFRTyxFQUFSLENBQVcsU0FBWCxFQUFzQkosS0FBSyxTQUFMLEVBQWdCLENBQWhCLENBQXRCO0FBQ0FILFFBQVFPLEVBQVIsQ0FBVyxRQUFYLEVBQXFCSixLQUFLLFFBQUwsRUFBZSxDQUFmLENBQXJCO0FBQ0E7QUFDQUgsUUFDR08sRUFESCxDQUNNLG9CQUROLEVBQzRCLFVBQUNDLE1BQUQsRUFBU0MsQ0FBVCxFQUFlO0FBQ3ZDQyxVQUFRQyxLQUFSLENBQWNILE1BQWQsRUFBc0IsZ0NBQXRCLEVBQXdEQyxDQUF4RDtBQUNELENBSEgsRUFJR0YsRUFKSCxDQUlNLG1CQUpOLEVBSTJCLGVBQU87QUFDOUJHLFVBQVFDLEtBQVIsQ0FBY0MsR0FBZCxFQUFtQiwyQkFBbkI7QUFDQVosVUFBUUcsSUFBUixDQUFhLENBQWI7QUFDRCxDQVBIO0FBUUFILFFBQVFPLEVBQVIsQ0FBVyxNQUFYLEVBQW1CLFlBQU07QUFDdkIsTUFBSU0sa0JBQVFDLFFBQVosRUFBc0I7QUFDcEIsU0FBSyxJQUFJQyxFQUFULElBQWVGLGtCQUFRRyxPQUF2QixFQUFnQztBQUM5Qkgsd0JBQVFHLE9BQVIsQ0FBZ0JELEVBQWhCLEVBQW9CRSxJQUFwQjtBQUNEO0FBQ0Y7QUFDRGQsT0FBSyxDQUFMO0FBQ0QsQ0FQRDs7QUFTQSxJQUFJVSxrQkFBUUMsUUFBWixFQUFzQjtBQUNwQkQsb0JBQVFOLEVBQVIsQ0FBVyxNQUFYLEVBQW1CLFVBQVVXLE1BQVYsRUFBa0I7QUFDbkNyQixxQkFBSXNCLElBQUosQ0FBUyxTQUFULEVBQW9CLDRCQUFwQixFQUFrREQsT0FBT0gsRUFBekQsRUFBNkRHLE9BQU9sQixPQUFQLENBQWVvQixHQUE1RTtBQUNELEdBRkQ7O0FBSUFQLG9CQUFRTixFQUFSLENBQVcsTUFBWCxFQUFtQixVQUFVVyxNQUFWLEVBQWtCO0FBQ25DckIscUJBQUlTLElBQUosQ0FBUyxTQUFULEVBQW9CLDBCQUFwQixFQUFnRFksT0FBT0gsRUFBdkQsRUFBMkRHLE9BQU9sQixPQUFQLENBQWVvQixHQUExRTtBQUNBQyxlQUFXLFlBQU07QUFBRVIsd0JBQVFTLElBQVI7QUFBZ0IsS0FBbkMsRUFBcUMsSUFBckM7QUFDRCxHQUhEOztBQUtBVCxvQkFBUVMsSUFBUjtBQUNELENBWEQsTUFXTztBQUNMLE1BQU1DLE1BQU0sd0JBQVo7QUFDQSxNQUFNQyxTQUFTLGtCQUFPRCxHQUFQLENBQWY7QUFDQUEsTUFBSUUsT0FBSixDQUFZLGNBQVo7QUFDQUYsTUFBSUcsR0FBSixDQUFRLHNCQUFPOUIsVUFBUCxFQUFtQjtBQUN6QitCLFlBQVEsRUFBRUMsT0FBTztBQUFBLFlBQUNDLElBQUQsdUVBQVEsRUFBUjtBQUFBLGVBQWVBLEtBQUtDLElBQUwsTUFBZWpDLGlCQUFJa0MsSUFBSixDQUFTLFNBQVQsRUFBb0JGLElBQXBCLENBQTlCO0FBQUEsT0FBVDtBQURpQixHQUFuQixDQUFSO0FBR0FMLFNBQU9RLE1BQVAsQ0FBY2pDLElBQWQsRUFBb0IsWUFBWTtBQUFBLDBCQUNOeUIsT0FBT1MsT0FBUCxFQURNO0FBQUEsUUFDdkJBLE9BRHVCLG1CQUN2QkEsT0FEdUI7QUFBQSxRQUNkbEMsSUFEYyxtQkFDZEEsSUFEYzs7QUFFOUIseUJBQVl5QixNQUFaLEVBQW9CM0IsZ0JBQXBCO0FBQ0FBLHFCQUFJc0IsSUFBSixDQUFTLFNBQVQsRUFBb0IsMkJBQXBCLEVBQWlEYyxPQUFqRCxFQUEwRGxDLElBQTFEO0FBQ0QsR0FKRDtBQUtEIiwiZmlsZSI6InNlcnZlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjbHVzdGVyIGZyb20gJ2NsdXN0ZXInXHJcbmltcG9ydCBsb2cgZnJvbSAnbnBtbG9nJ1xyXG5pbXBvcnQgYXR0YWNoUHJveHkgZnJvbSAnLi9wcm94eSdcclxuaW1wb3J0IG1vcmdhbiBmcm9tICdtb3JnYW4nXHJcbmltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnXHJcbmltcG9ydCB7IFNlcnZlciB9IGZyb20gJ2h0dHAnXHJcblxyXG5jb25zdCBMT0dfRk9STUFUID0gJzpyZW1vdGUtYWRkciBbOmRhdGVdIFwiOm1ldGhvZCA6dXJsIEhUVFAvOmh0dHAtdmVyc2lvblwiIDpzdGF0dXMgOnJlc1tjb250ZW50LWxlbmd0aF0gXCI6cmVmZXJyZXJcIidcclxuXHJcbmxvZy5sZXZlbCA9ICdzaWxseSdcclxuY29uc3QgcG9ydCA9IHByb2Nlc3MuZW52LlBST1hZX1BPUlQgfHwgODg4OFxyXG5cclxuY29uc3QgZXhpdCA9IChzaWduYWwsIGV4aXRDb2RlKSA9PiAoKSA9PiB7XHJcbiAgbG9nLndhcm4oJ2V4aXQnLCBgRXhpdGVkIG9uICR7c2lnbmFsfWApXHJcbiAgcHJvY2Vzcy5leGl0KGV4aXRDb2RlKVxyXG59XHJcblxyXG5wcm9jZXNzLm9uKCdTSUdJTlQnLCBleGl0KCdTSUdJTlQnLCAxKSlcclxucHJvY2Vzcy5vbignU0lHVVNSMScsIGV4aXQoJ1NJR1VTUjEnLCAxKSlcclxucHJvY2Vzcy5vbignU0lHVVNSMicsIGV4aXQoJ1NJR1VTUjInLCAxKSlcclxuLy8gcHJvY2Vzcy5vbigndW5jYXVnaHRFeGNlcHRpb24nLCBleGl0KCdVbmNhdWdodCBleGNlcHRpb24nLCAxKSlcclxucHJvY2Vzcy5vbignU0lHVEVSTScsIGV4aXQoJ1NJR1RFUk0nLCAwKSlcclxucHJvY2Vzcy5vbignU0lHSU5UJywgZXhpdCgnU0lHSU5UJywgMCkpXHJcbi8vIHByb2Nlc3Mub24oJ3VuY2F1Z2h0RXhjZXB0aW9uJywgZXhpdCgndW5jYXVnaHRFeGNlcHRpb24nLCAxKSlcclxucHJvY2Vzc1xyXG4gIC5vbigndW5oYW5kbGVkUmVqZWN0aW9uJywgKHJlYXNvbiwgcCkgPT4ge1xyXG4gICAgY29uc29sZS5lcnJvcihyZWFzb24sICdVbmhhbmRsZWQgUmVqZWN0aW9uIGF0IFByb21pc2UnLCBwKTtcclxuICB9KVxyXG4gIC5vbigndW5jYXVnaHRFeGNlcHRpb24nLCBlcnIgPT4ge1xyXG4gICAgY29uc29sZS5lcnJvcihlcnIsICdVbmNhdWdodCBFeGNlcHRpb24gdGhyb3duJyk7XHJcbiAgICBwcm9jZXNzLmV4aXQoMSk7XHJcbiAgfSk7XHJcbnByb2Nlc3Mub24oJ2V4aXQnLCAoKSA9PiB7XHJcbiAgaWYgKGNsdXN0ZXIuaXNNYXN0ZXIpIHtcclxuICAgIGZvciAodmFyIGlkIGluIGNsdXN0ZXIud29ya2Vycykge1xyXG4gICAgICBjbHVzdGVyLndvcmtlcnNbaWRdLmtpbGwoKVxyXG4gICAgfVxyXG4gIH1cclxuICBleGl0KDApKClcclxufSlcclxuXHJcbmlmIChjbHVzdGVyLmlzTWFzdGVyKSB7XHJcbiAgY2x1c3Rlci5vbignZm9yaycsIGZ1bmN0aW9uICh3b3JrZXIpIHtcclxuICAgIGxvZy5pbmZvKCdjbHVzdGVyJywgJ0ZvcmtlZCB3b3JrZXIgIyVzIFtwaWQ6JXNdJywgd29ya2VyLmlkLCB3b3JrZXIucHJvY2Vzcy5waWQpXHJcbiAgfSlcclxuXHJcbiAgY2x1c3Rlci5vbignZXhpdCcsIGZ1bmN0aW9uICh3b3JrZXIpIHtcclxuICAgIGxvZy53YXJuKCdjbHVzdGVyJywgJ1dvcmtlciAjJXMgW3BpZDolc10gZGllZCcsIHdvcmtlci5pZCwgd29ya2VyLnByb2Nlc3MucGlkKVxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7IGNsdXN0ZXIuZm9yaygpIH0sIDEwMDApXHJcbiAgfSlcclxuXHJcbiAgY2x1c3Rlci5mb3JrKClcclxufSBlbHNlIHtcclxuICBjb25zdCBhcHAgPSBleHByZXNzKClcclxuICBjb25zdCBzZXJ2ZXIgPSBTZXJ2ZXIoYXBwKVxyXG4gIGFwcC5kaXNhYmxlKCd4LXBvd2VyZWQtYnknKVxyXG4gIGFwcC51c2UobW9yZ2FuKExPR19GT1JNQVQsIHtcclxuICAgIHN0cmVhbTogeyB3cml0ZTogKGxpbmUgPSAnJykgPT4gbGluZS50cmltKCkgJiYgbG9nLmh0dHAoJ2V4cHJlc3MnLCBsaW5lKSB9XHJcbiAgfSkpXHJcbiAgc2VydmVyLmxpc3Rlbihwb3J0LCBmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25zdCB7YWRkcmVzcywgcG9ydH0gPSBzZXJ2ZXIuYWRkcmVzcygpXHJcbiAgICBhdHRhY2hQcm94eShzZXJ2ZXIsIGxvZylcclxuICAgIGxvZy5pbmZvKCdleHByZXNzJywgJ1NlcnZlciBsaXN0ZW5pbmcgb24gJXM6JXMnLCBhZGRyZXNzLCBwb3J0KVxyXG4gIH0pXHJcbn1cclxuIl19