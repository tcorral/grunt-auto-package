/*global document, window, document, Namespace, XMLHttpRequest, ResourceNotFound, UnreacheableServer, UndefinedServerError, ServerError, escape, ThrowError, clearTimeout, setTimeout, sessionStorage  */
( function ( win, doc, ns, und )
{
	'use strict';
	if ( ns === und )
	{
		ns = win;
	}
	var ResponseAjax,
		fpBuildAjaxErrorInfo,
		Bus = win.Hydra.bus;

	/**
	 * fpBuildAjaxErrorInfo builds a string to log in case an AJAX error occurs.
	 * @param {Ajax} oAjax Ajax object to build the error string from.
	 * @return The error string information to log.
	 * @type String
	 */
	fpBuildAjaxErrorInfo = function ( oAjax )
	{
		var sInfo =
			'URL: '			+ oAjax.sUrl +
			' - Method: '	+ oAjax.sMethod +
			' - Data: '		+ oAjax.sData;

		return escape( sInfo );
	};

	/**
	 * ResponseAjax is the object to be used as response when returning the Ajax Call
	 * It's used in Ajax.
	 * @class ResponseAjax
	 * @constructor
	 * @version 1.0
	 * @author Tomas Corral Casas
	 * @param {Object} oHttp
	 */
	ResponseAjax = function ( oHttp )
	{
		/**
		 * _oHttp is the XMLHttpRequest Object
		 * @member ResponseAjax
		 * @private
		 * @author Tomas Corral Casas
		 * @type XMLHttpRequest
		 */
		var _oHttp = oHttp;
		/**
		 * responseTEXT is the internal method to get the response in text format
		 * @member ResponseAjax.prototype
		 * @author Tomas Corral Casas
		 * @return the response in text format
		 * @type String
		 */
		this.responseTEXT = function ()
		{
			return _oHttp.responseText;
		};
		/**
		 * responseXML is the internal method to get the response in XML format
		 * @member ResponseAjax.prototype
		 * @author Tomas Corral Casas
		 * @return the response in XML format
		 * @type XML
		 */
		this.responseXML = function ()
		{
			return _oHttp.responseXML;
		};
		/**
		 * responseHTML is the internal method to get the response in Node format
		 * @member ResponseAjax.prototype
		 * @author Tomas Corral Casas
		 * @return the response in Node format
		 * @type DocumentFragment
		 */
		this.responseHTML = function ()
		{
			var oLayer				= null,
				oDocumentFragment	= null,
				nLayer				= 0,
				nLenLayers			= 0;
			try
			{
				oLayer				= doc.createElement( "div" );
				oDocumentFragment	= doc.createDocumentFragment();
				oLayer.innerHTML	= _oHttp.responseText;
				nLenLayers			= oLayer.childNodes.length;
				for ( ; nLayer < nLenLayers; nLayer++ )
				{
					oDocumentFragment.appendChild( oLayer.childNodes[ nLayer ] );
				}
				return oDocumentFragment;
			}
			catch ( erError )
			{
				return {
					e_r_e_r_r_o_r_s_t_a_t_u_s_a_j_a_x: erError.message
				};
			}
		};
		/**
		 * responseJSON is the internal method to get the response in JSON format
		 * @member ResponseAjax.prototype
		 * @author Tomas Corral Casas
		 * @return the response in JSON format
		 * @type JSON
		 */
		this.responseJSON = function ()
		{
			try
			{
				return JSON.parse( _oHttp.responseText );
			}
			catch ( erError )
			{
				return {
					e_r_e_r_r_o_r_s_t_a_t_u_s_a_j_a_x: erError.message
				};
			}
		};
		/**
		 * getStatusNumber is the internal method to get the status number of the request
		 * @member ResponseAjax.prototype
		 * @author Tomas Corral Casas
		 * @return the status number for the response
		 * @type Number
		 */
		this.getStatusNumber = function ()
		{
			return _oHttp.status;
		};
		/**
		 * getStatusMessage is the internal method to get the status message of the request
		 * @member ResponseAjax.prototype
		 * @author Tomas Corral Casas
		 * @return the status message for the response
		 * @type String
		 */
		this.getStatusMessage = function ()
		{
			return _oHttp.statusText;
		};
	};

	/**
	 * Ajax is the class to launch AJAX calls to the server to retrieve information
	 * @class Ajax
	 * @requires ResponseAjax
	 * @constructor
	 * @version 1.0
	 * @author Tomas Corral Casas
	 */
	var Ajax = function ()
	{
		/**
		 * oHttp is the XMLHttpRequest Object
		 * @member Ajax.prototype
		 * @author Tomas Corral Casas
		 * @type XMLHttpRequest
		 */
		this.oHttp = this.getHTTPObject();
		/**
		 * sUrl is the URL to launch the AJAX call on server
		 * @member Ajax.prototype
		 * @author Tomas Corral Casas
		 * @type String
		 */
		this.sUrl = '';
		/**
		 * bAsync is boolean value to determine if you want an asynchronous call or not
		 * @member Ajax.prototype
		 * @author Tomas Corral Casas
		 * @type Boolean
		 */
		this.bAsync = true;
		/**
		 * sLastError is the variable to save the last error message returned in the AJAX call.
		 * @member Ajax.prototype
		 * @author Tomas Corral Casas
		 * @type String
		 */
		this.sLastError = '';
		/**
		 * sMethod is the method type to make the AJAX call
		 * POST method by default
		 * @member Ajax.prototype
		 * @author Tomas Corral Casas
		 * @type String
		 */
		this.sMethod = Ajax._methods.POST;
		/**
		 * sDataType is the expected datatype when receiving the response from the AJAX call
		 * TEXT datatype by default
		 * @member Ajax.prototype
		 * @author Tomas Corral Casas
		 * @type String
		 */
		this.sDataType = Ajax._dataTypes.TEXT;
		/**
		 * sData is the data to be added when making the AJAX call.
		 * @member Ajax.prototype
		 * @author Tomas Corral Casas
		 * @type String
		 */
		this.sData = '';
		/**
		 * bInProcess is the boolean value that saves the status of the AJAX call; is finished or not.
		 * @member Ajax.prototype
		 * @author Tomas Corral Casas
		 * @type Boolean
		 */
		this.bInProcess = false;
		/**
		 * onBeforeSend is the callback to be called before send the AJAX call. It could be used to process some values before send the AJAX call.
		 * @member Ajax.prototype
		 * @author Tomas Corral Casas
		 * @type Function
		 */
		this.onBeforeSend = function ()
		{
		};
		/**
		 * onReady is the callback to be called when the response is OK.
		 * @member Ajax.prototype
		 * @author Tomas Corral Casas
		 * @param {Object} oResponseAjax
		 * @type Function
		 */
		this.onReady = function ( oResponseAjax )
		{
		};
		/**
		 * onError is the callback to be called when the response is KO.
		 * @member Ajax.prototype
		 * @author Tomas Corral Casas
		 * @param {Object} oResponseAjax
		 * @param {String} sErrorMessage
		 * @param {Number} nStatusNumber
		 * @param {String} sStatusMessage
		 * @type Function
		 */
		this.onError = function ( oResponseAjax, sErrorMessage, nStatusNumber, sStatusMessage )
		{
		};
		/**
		 * onComplete is the callback to be called when the response is received. Don't take care about the response is OK or KO.
		 * @member Ajax.prototype
		 * @author Tomas Corral Casas
		 * @param {Object} oResponseAjax
		 * @param {Number} nStatusNumber
		 * @param {String} sStatusMessage
		 * @type Function
		 */
		this.onComplete = function ( oResponseAjax, nStatusNumber, sStatusMessage )
		{
		};
		/**
		 * oCache is the Namespace.Cache Object to be used when making calls.
		 * If oCache is different from null. The AJAX calls are cached and the next time is not needed to make the AJAX call again. Only retrieve it from the cache.
		 * @member Ajax.prototype
		 * @author Tomas Corral Casas
		 * @type Namespace.Cache
		 */
		this.oCache = null;
		/**
		 * nTimeout is the number of miliseconds to wait before launch a Timeout Error
		 * If you want to not use the Timeout Error, don't change this value.
		 * 10 seconds by default.
		 * @member Ajax.prototype
		 * @author Tomas Corral Casas
		 * @type Number
		 */
		this.nTimeout = 10000;
		/**
		 * nIdTimeout is the identifier for the setTimeout callback. This is used to clear the timeout if the time, of the request, is less than the specified in nTimeout
		 * It's only used if the nTimeout has a positive value greater than zero.
		 * @member Ajax.prototype
		 * @author Tomas Corral Casas
		 * @type Object
		 */
		this.nIdTimeout = -1;
	};

	/**
	 * Ajax._methods is the config class for AJAX methods
	 * requires Ajax
	 * @class Ajax._methods
	 * @member Ajax
	 * @constructor
	 * @version 1.0
	 * @author Tomas Corral Casas
	 */
	Ajax._methods =
	{
		GET: "GET",
		POST: "POST"
	};
	/**
	 * Ajax._dataTypes is the config class for AJAX dataTypes
	 * requires Ajax
	 * @class Ajax._dataTypes
	 * @member Ajax
	 * @constructor
	 * @version 1.0
	 * @author Tomas Corral Casas
	 */
	Ajax._dataTypes =
	{
		TEXT: "TEXT",
		XML: "XML",
		JSON: "JSON",
		HTML: "HTML"
	};
	/**
	 * Ajax._acceptType is the config class for AJAX accepted mimetypes
	 * requires Ajax
	 * @class Ajax._acceptType
	 * @member Ajax
	 * @constructor
	 * @version 1.0
	 * @author Tomas Corral Casas
	 */
	Ajax._acceptType =
	{
		TEXT: "text/plain",
		XML: "text/xml",
		HTML: "text/html",
		JSON: "application/json",
		"*": "*/*"
	};
	/**
	 * Ajax.errors is the config class for AJAX message errors
	 * requires Ajax
	 * @class Ajax.errors
	 * @member Ajax
	 * @constructor
	 * @version 1.0
	 * @author Tomas Corral Casas
	 */
	Ajax.errors =
	{
		notSupported:		'jsFramework Error:\nThis browser doesn\'t support the XMLHttpRequest object.',
		xmlParserError:		'XML parser error or not a valid XML file',
		jsonParserError:	'JSON parser error or not a valid JSON file',
		htmlParserError:	'HTML parser error or not a valid HTML file'
	};
	/**
	 * Return the XMLHttpRequest Object
	 * Self executing method to use the lazy pattern. It reduces the time.
	 * @member Ajax.prototype
	 * @author Tomas Corral Casas
	 * @return the XMLHttpRequest Object
	 * @type XMLHttpRequest
	 */
	Ajax.prototype.getHTTPObject = function ()
	{
		var oXmlHttp = null;
		try
		{
			oXmlHttp = new XMLHttpRequest();
		}
		catch ( oError )
		{
			ns.Hermes.logger.addError( new ns.Hermes.error( ns.Hermes.level.DEBUG, "Ajax.getHTTPObject", Ajax.errors.notSupported, "Ajax.js" ) );
			return false;
		}
		return oXmlHttp;
	};

	/**
	 * It is executed when an error is returned by the server.
	 *
	 * It looks at the status number to perform corresponding action.
	 *
	 * @param oResponseAjax Response object.
	 * @param sErrorMessage The error message.
	 * @param nStatusNumber The status number of error.
	 * @param sStatusMessage The message of error status.
	 * @return {Boolean}
	 */
	Ajax.prototype.fpOnError = function( oResponseAjax, sErrorMessage, nStatusNumber, sStatusMessage )
	{
		var self = this,
			oError = null;

		switch( nStatusNumber )
		{
			case 403:
				// If we receive a 403, means that we lost the User session somehow. Update the App.
				ns.Maintenance.actionsPostLogout();
				return false;
			case 404:
				oError = new ResourceNotFound( fpBuildAjaxErrorInfo( self ), "Ajax.js" );
				break;
			case 420:
				Bus.publish( 'forced-updates', 'client-version' );
				break;
			case 421:
				Bus.publish( 'forced-updates', 'code-version' );
				break;
			// When an ajax call is aborted it returns error but
			// the status number could be 0 if the call has not arrived to the server
			// or 200 if the call has arrived to the server.
			case 200:
			case 0:
			// 5XX server error types are tracked by the server then it's not needed to track anything.
			case 502:
			case 500:
				return false;
			default:
				oError = new ServerError( "Undefined server error. " + fpBuildAjaxErrorInfo( self ) + " - Error message: " + sErrorMessage + " - Status message:" + sStatusMessage + " Response text: " + oResponseAjax, "Ajax.js", null, nStatusNumber);
				break;
		}

		ns.Hermes.logger.addError( oError );
		return false;
	};
	/**
	 * Method used to configure all the differents properties and callback at the same time
	 * @member Ajax.prototype
	 * @author Tomas Corral Casas
	 * @param {Object} oConfig
	 * @return the instance of the Ajax object
	 * @type Ajax
	 */
	Ajax.prototype.setup = function ( oConfig )
	{
		var self			= this;
		self.sUrl			= oConfig.url || '';
		self.bAsync			= ( typeof oConfig.async === "boolean" ) ? oConfig.async : true;
		self.sMethod		= oConfig.method ? oConfig.method.toUpperCase() : Ajax._methods.POST;
		self.sData			= self.serializeData( oConfig.data || '' );
		self.sDataType		= oConfig.dataType ? oConfig.dataType.toUpperCase() : Ajax._dataTypes.TEXT;
		self.switchToSecureProtocolIfIsAvailable();
		self.onBeforeSend	= oConfig.beforeSend || function () {};
		self.onReady		= oConfig.success || function ( oResponseAjax ) {};
		self.onError		= oConfig.error ? function ( oResponseAjax, sErrorMessage, nStatusNumber, sStatusMessage )
		{
			oConfig.error.call( self, oResponseAjax, sErrorMessage, nStatusNumber, sStatusMessage );
			self.fpOnError.call( self, oResponseAjax, sErrorMessage, nStatusNumber, sStatusMessage );
		} : self.fpOnError;
		self.onComplete		= oConfig.complete || function ( oResponseAjax, nStatusNumber, sStatusMessage ) {};
		self.oCache			= ( typeof oConfig.cache !== "undefined" ) ? oConfig.cache : null;
		self.nTimeout		= oConfig.timeout > 0 ? oConfig.timeout : self.nTimeout;

		if ( self.sMethod === Ajax._methods.GET && self.sData.length > 0 )
		{
			self.sUrl += "?" + self.sData;
		}
		return self;
	};
	/**
	 * Checks if the oData is an object or String if it's an Object returns the serialized Object in String Format.
	 * @member Ajax.prototype
	 * @author Tomas Corral Casas
	 * @param {Object} oData
	 * @return the string representation of the oData Object.
	 * @type String
	 */
	Ajax.prototype.serializeData = function ( oData )
	{
		if ( typeof oData === "string" )
		{
			return oData;
		}
		else
		{
			return this._serializeObject( oData );
		}
	};
	/**
	 * Serialize an Object in Get String format.
	 * @member Ajax.prototype
	 * @private
	 * @author Tomas Corral Casas
	 * @param {Object} oObject
	 * @return the serialization of the object in Get format
	 * @type String
	 */
	Ajax.prototype._serializeObject = function ( oObject )
	{
		return ns.Utilities.serializeObject( oObject );
	};

	/**
	 * This method tries to switch to https protocol.
	 *
	 * Firstly it looks for https protocol is available to use it, if it is, it builds a absolute URL
	 * with https protocol, domain and query builder.
	 *
	 * @member Ajax.prototype
	 * @returns bool
	 */
	Ajax.prototype.switchToSecureProtocolIfIsAvailable = function ()
	{
		var self = this;

		if ( !self.shouldChangeToSsl() )
		{
			return false;
		}

		self.sUrl = 'https://' + doc.domain + '/' + self.sUrl.replace( /^\/\s*/, '' );
		return true;
	};

	/**
	 * Return true or false if the response is in incorrect format
	 * @member Ajax.prototype
	 * @author Tomas Corral Casas
	 * @return if the response is OK or KO
	 * @type Boolean
	 */
	Ajax.prototype.isResponseCorrect = function ()
	{
		var self = this;

		try
		{
			var oResponse = new ns.ResponseAjax( self.oHttp )['response' + self.sDataType]();

			if ( self.sDataType === Ajax._dataTypes.XML && oResponse === null )
			{
				self.sLastError = Ajax.errors.xmlParserError;
				ns.Hermes.logger.addError( new ThrowError( "Class: Ajax, Method: isResponseCorrect. " + Ajax.errors.xmlParserError, "Ajax.js" ) );
				return false;
			}
			if ( self.sDataType === Ajax._dataTypes.JSON && typeof oResponse.e_r_e_r_r_o_r_s_t_a_t_u_s_a_j_a_x !== "undefined" )
			{
				self.sLastError = Ajax.errors.jsonParserError;
				ns.Hermes.logger.addError( new ThrowError( "Class: Ajax, Method: isResponseCorrect. " + Ajax.errors.jsonParserError, "Ajax.js" ));
				return false;
			}
			if ( self.sDataType === Ajax._dataTypes.HTML && typeof oResponse.e_r_e_r_r_o_r_s_t_a_t_u_s_a_j_a_x !== "undefined" )
			{
				self.sLastError = Ajax.errors.htmlParserError;
				ns.Hermes.logger.addError( new ThrowError( "Class: Ajax, Method: isResponseCorrect. " + Ajax.errors.htmlParserError, "Ajax.js" ));
				return false;
			}
			return true;
		}
		catch ( eError )
		{
			self.sLastError = eError.message;
			return false;
		}
	};
	/**
	 * Check if the status of the AJAX call is OK or KO and call the correct callback.
	 * @member Ajax.prototype
	 * @author Tomas Corral Casas
	 */
	Ajax.prototype.checkReadyOrError = function ()
	{
		var oResponse	= null,
			self		= this;
		if ( self.oHttp.status === 200 )
		{
			if ( self.nTimeout )
			{
				clearTimeout( self.nIdTimeout );
			}
			if ( self.isResponseCorrect() )
			{
				oResponse = new ns.ResponseAjax( self.oHttp )[ 'response' + self.sDataType ]();
				if ( self.oCache !== null )
				{
					self.oCache.addAjaxResponse( self.sUrl + "(" + self.sData + self.sDataType + ")", oResponse );
				}
				self.getDebugInfo( oResponse );
				self.onReady( oResponse );
				oResponse = null;
			}
			else
			{
				oResponse = new ns.ResponseAjax( self.oHttp ).responseTEXT();
				self.getDebugInfo( oResponse );
				self.onError( oResponse, self.sLastError, self.oHttp.status, self.oHttp.statusText );
			}
		}
		else
		{
			oResponse = new ns.ResponseAjax( self.oHttp ).responseTEXT();
			self.getDebugInfo( oResponse );
			self.onError( oResponse, "Server Error", self.oHttp.status, self.oHttp.statusText );
		}
	};
	/**
	 * Gets the Debug data from the oResponse Ajax call response.
	 *
	 * @param oResponse Data got from the Ajax call response.
	 */
	Ajax.prototype.getDebugInfo = function ( oResponse )
	{
		if( oResponse && typeof oResponse.debug !== 'undefined' )
		{
			ns.GUI.oDebug.addAjaxItem( oResponse.debug_id, oResponse.debug );
		}
	};
	/**
	 * Array to save the different sets for the header
	 * @namespace Ajax.prototype.setHeaderPost
	 * @member Ajax.prototype
	 * @author Tomas Corral Casas
	 * @type Array
	 */
	Ajax.prototype.setHeaderPost = [];
	/**
	 * Callback to set the Headers, if the selected method is GET, when sending the AJAX call.
	 * @member Ajax.prototype.setHeaderPost
	 * @author Tomas Corral Casas
	 */
	Ajax.prototype.setHeaderPost.GET = function ( oAjax )
	{
		oAjax.oHttp.setRequestHeader( 'Accept', Ajax._acceptType[oAjax.sDataType]);
	};
	/**
	 * Callback to set the Headers, if the selected method is POST, when sending the AJAX call.
	 * @member Ajax.prototype.setHeaderPost
	 * @author Tomas Corral Casas
	 */
	Ajax.prototype.setHeaderPost.POST = function ( oAjax )
	{
		oAjax.oHttp.setRequestHeader( 'Accept', Ajax._acceptType[oAjax.sDataType]);
		oAjax.oHttp.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
	};
	/**
	 * Array to save the different methods when getting the data
	 * @namespace Ajax.prototype.wichMethod
	 * @member Ajax.prototype
	 * @author Tomas Corral Casas
	 * @type Array
	 */
	Ajax.prototype.wichMethod = [];
	/**
	 * Callback to return the data if the selected method is GET
	 * @member Ajax.prototype.wichMethod
	 * @author Tomas Corral Casas
	 */
	Ajax.prototype.wichMethod.GET = function ( oAjax )
	{
		return null;
	};
	/**
	 * Callback to return the data if the selected method is POST
	 * @member Ajax.prototype.wichMethod
	 * @author Tomas Corral Casas
	 */
	Ajax.prototype.wichMethod.POST = function ( oAjax )
	{
		return oAjax.sData;
	};
	/**
	 * Array to save the different ways to execute the AJAX calls
	 * @member Ajax.prototype
	 * @author Tomas Corral Casas
	 * @type Array
	 */
	Ajax.prototype.workAsyncMode = [];
	/**
	 * Callback to execute the AJAX call when the Asynchronous mode is false (Synchronous call)
	 * @member Ajax.prototype.workAsyncMode
	 * @author Tomas Corral Casas
	 */
	Ajax.prototype.workAsyncMode[0] = function ( oAjax )
	{
		var self = this;
		oAjax.onBeforeSend();
		if ( oAjax.nTimeout )
		{
			oAjax.nIdTimeout = setTimeout( function ()
			{
				oAjax.abort();
				ns.Hermes.logger.addError( new UnreacheableServer( fpBuildAjaxErrorInfo( self ) + " Timeout Error ", " Ajax.js" ) );
			}, oAjax.nTimeout );
		}
		oAjax.oHttp.send( oAjax.wichMethod[ oAjax.sMethod ]( oAjax ) );
		oAjax.bInProcess = false;
		oAjax.checkReadyOrError();
	};
	/**
	 * Callback to execute the AJAX call when the Asynchronous mode is true (Asynchronous call)
	 * @member Ajax.prototype.workAsyncMode
	 * @author Tomas Corral Casas
	 */
	Ajax.prototype.workAsyncMode[1] = function ( oAjax )
	{
		oAjax.oHttp.onreadystatechange = function ()
		{
			if ( oAjax.oHttp.readyState === 4 )
			{
				oAjax.onComplete( new ns.ResponseAjax( oAjax.oHttp )[ 'response' + oAjax.sDataType ]() );
				oAjax.bInProcess = false;
				oAjax.checkReadyOrError();
			}
		};
		oAjax.bInProcess = true;
		oAjax.onBeforeSend();
		if ( oAjax.nTimeout )
		{
			oAjax.nIdTimeout = setTimeout( function ()
			{
				oAjax.abort();
			}, oAjax.nTimeout );
		}
		oAjax.oHttp.send( oAjax.wichMethod[ oAjax.sMethod ]( oAjax ));
	};
	/**
	 * Launch the AJAX call
	 * @member Ajax.prototype
	 * @author Tomas Corral Casas
	 * @return the instance of the Ajax Object
	 * @type Ajax
	 */
	Ajax.prototype.call = function ()
	{
		var oCachedResponse	= '',
			self			= this,
			bRebuild		= sessionStorage.getItem( 'rebuildAjax' ) !== null,
			bDebug			= ns.Debug.isActive(),
			sUrl			= self.sUrl;

		// Check if debug and/or rebuild option is on, which overrides cache and appends an addition param.
		if ( bDebug )
		{
			sUrl += ( ( sUrl.indexOf( '?' ) > -1 ) ? '&' : '?' ) + 'debug=1';
		}
		if ( bRebuild )
		{
			sUrl += ( ( sUrl.indexOf( '?' ) > -1 ) ? '&' : '?' ) + 'rebuild=1';
		}
		else if ( self.oCache !== null )
		{
			oCachedResponse = self.oCache.getAjaxResponse( sUrl + "(" + self.sData + self.sDataType + ")" );
			if ( oCachedResponse )
			{
				self.onReady( oCachedResponse );
				return this;
			}
		}
		if ( self.oHttp && !self.bInProcess )
		{
			self.bInProcess = true;
			self.oHttp.open( self.sMethod, sUrl, self.bAsync );
			self._setUpCredentials();
			self.setHeaderPost[self.sMethod]( self );
			return self.workAsyncMode[ Number( self.bAsync ) ]( self );
		}
		return self;
	};

	/**
	 * Sets withCredential property of XHR object if we're using SSL. Can only by used after open().
	 */
	Ajax.prototype._setUpCredentials = function ()
	{
		var self = this;

		if ( !self.shouldChangeToSsl() )
		{
			return;
		}

		if ( self.oHttp instanceof XMLHttpRequest )
		{
			self.oHttp.withCredentials = true;
		}
	};

	/**
	 * Checks if current connection should use SSL.
	 *
	 * @returns boolean
	 */
	Ajax.prototype.shouldChangeToSsl = function ()
	{
		if ( 'undefined' === typeof win.oApplicationConfig )
		{
			return false;
		}

		return ( win.oApplicationConfig.is_available_ssl && !win.oApplicationConfig.is_using_ssl );
	};

	/**
	 * Abort the AJAX call
	 * @member Ajax.prototype
	 * @author Tomas Corral Casas
	 */
	Ajax.prototype.abort = function ()
	{
		this.oHttp.abort();
	};
	/**
	 * Static property to save the instance
	 * This is used by the getInstance method to get and use a Singleton.
	 * @member Ajax
	 * @author Tomas Corral Casas
	 * @type Ajax
	 */
	Ajax.instance = null;
	/**
	 * Static method to create a singleton instance of the Ajax Object
	 * This is used by the getInstance method to get and use a Singleton.
	 * @member Ajax
	 * @author Tomas Corral Casas
	 * @return the instance of the Ajax Object
	 * @type Ajax
	 */
	Ajax.getInstance = function ()
	{
		if ( Ajax.instance === null )
		{
			Ajax.instance = new ns.Ajax();
		}
		try
		{
			return Ajax.instance;
		}
		catch ( erError )
		{
		}
		finally
		{
			Ajax.getInstance = function ()
			{
				return Ajax.instance;
			};
		}
	};

	/**
	 * Encapsulates the call to the API service
	 * @param oConfig - Object with the config.
	 * Example of oConfig:
	 * {
	 *		apiCall:
	 *		{
	 *			callback: 'xxxx',	//Name of the callback to be executed in API
	 *			params:				// Array of param objects
	 *			[
	 *				{
	 *					type: 'string',
	 *					value: 'test'
	 *				},
	 *				{
	 *					type: 'float',	//All the numbers must be typed as float to be parsed by the api
	 *					value: '1.01'
	 *				}
	 *			]
	 *		},
	 *		method: 'xxx',			//Method to be used by the ajax call - [GET|POST]
	 *		success: function (oResult){},	//Callback to be executed if there is no error when the ajax call is resolved
	 *		error: function (oError){},		//Callback to be executed if there is an error when the ajax call is resolved
	 * }
	 * @param bAsync - Determines if the call will be asynchronous or not.
	 * @return mixed (Boolean | Ajax instance)
	 */
	Ajax.whiteAPICall = function ( oConfig, bAsync )
	{
		// Basic declarations.
		var oAjax					= null,
			sInternalServerUrl		= ns.Globals.APIWebServiceProtocol + "://" + ns.Globals.APIWebServiceDomain + ":" + ns.Globals.APIWebServicePort + "/",
			oApiCallInfo			= null,
			sApiCallInfoSerialized	= '',
			fpEmpty					= function (){},
			fpSuccessCallback		= null,
			fpErrorCallback			= null,
			fpSuccess				= function ( oResult )
			{
				fpSuccessCallback( oResult.result );
			},
			fpError					= function ( oResult )
			{
				fpErrorCallback( oResult.error );
			};

		// Check oConfig.
		if( typeof oConfig === 'undefined' || typeof oConfig.apiCall === 'undefined' )
		{
			return false;
		}

		// Assignations.
		oAjax					= new ns.Ajax();
		oApiCallInfo			= oConfig.apiCall;
		sApiCallInfoSerialized	= JSON.stringify( oApiCallInfo );
		fpSuccessCallback		= oConfig.success || fpEmpty;
		fpErrorCallback			= oConfig.error || fpEmpty;

		bAsync = bAsync === true;

		// Setup and execution.
		oAjax.setup( {
			url			: sInternalServerUrl,
			async		: bAsync,
			method		: oConfig.method || "GET",
			cache		: null,
			data		: "JSON=" + sApiCallInfoSerialized,
			dataType	: 'json',
			timeout		: 60000,
			success		: fpSuccess,
			error		: fpError
		} ).call();

		return oAjax;
	};
	/*
	 * Encapsulates whiteAPICall to execute an asynchronous ajax call to the API
	 * @param oConfig
	 * @return mixed (Boolean | Ajax instance)
	 */
	Ajax.asyncCallAPI = function ( oConfig )
	{
		return Ajax.whiteAPICall( oConfig, true );
	};
	/*
	 * Encapsulates whiteAPICall to execute a synchronous ajax call to the API
	 * @param oConfig
	 * @return mixed (Boolean | Ajax instance)
	 */
	Ajax.syncCallAPI = function ( oConfig )
	{
		return Ajax.whiteAPICall( oConfig, false );
	};

	// Expose to the Window.
	ns.ResponseAjax	= ResponseAjax;
	ns.Ajax			= Ajax;

}( window, document, (window.Namespace ? window.Namespace : {})));