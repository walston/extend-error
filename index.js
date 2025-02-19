var util = require('util');
var assert = require('assert');

/**
 * Add extend() method to Error type
 *
 * @param subTypeName
 * @param errorCode [optional]
 * @returns {SubType}
 */

Error.extend = function(subTypeName, errorCode /*optional*/) {
  var Parent = this;
  assert(subTypeName, 'subTypeName is required');

  var o = {
    //define new error type
    [subTypeName]: function(message) {
      //handle constructor call without 'new'
      if (!(this instanceof SubType)) {
        return new SubType(message);
      }

      //populate error details
      this.name = subTypeName;
      this.code = errorCode;
      this.message = message || '';

      //include stack trace in error object
      Error.captureStackTrace(this, this.constructor);
    }
  };

  var SubType = o[subTypeName];

  //inherit the base prototype chain
  util.inherits(SubType, this);

  //override the toString method to error type name and inspected message (to expand objects)
  SubType.prototype.toString = function() {
    return this.name + ': ' + util.inspect(this.message);
  };

  //attach extend() to the SubType to make it extendable further
  SubType.extend = Parent.extend;

  return SubType;
};
