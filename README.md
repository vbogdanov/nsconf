NSConf
============
Namespaced configuration - read contents of a JSON-style javascript object using dotted namespaces. Supported methods:
```javascript
var conf = new NSConf(intialValue); 
conf.get(namespace);
conf.set(namespace, value);
conf.extend(namespace, value);
conf.delete(namespace);
```
Namespace is string, passing '' returns the root object, passing non-string value results in exception.
