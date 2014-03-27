(function ( win, doc, ns )
{
	if( typeof ns === 'undefined' )
	{
		ns = win;
	}
	/**
	 * Check if a value is a string.
	 * @param sValue
	 * @return {Boolean} false if is not a valid String
	 */
	function isString(sValue)
	{
		var bResult = false;
		if( sValue instanceof String || typeof sValue === 'string' )
		{
			bResult = true;
		}
		return bResult;
	}
	/**
	 * AjaxDataObject is a helper class to set data to be sent via Ajax
	 * @name AjaxDataObject
	 * @constructor
	 */
	var AjaxDataObject = function ()
	{
		/**
		 * aData stores all the params to be sent.
		 * @type {Array}
		 */
		this.aData = [];
	};
	AjaxDataObject.prototype = {
		/**
		 * Encodes the value to be sent to avoid break the url when sent
		 * and add it to aData
		 * @param oName
		 * @param oValue
		 * @return {AjaxDataObject}
		 */
		add: function ( oName, oValue )
		{
			var sEncodedValue;

			if( isString( oName ) === false || isString( oValue ) === false)
			{
				oName = String( oName );
				oValue = String( oValue );
			}
			 sEncodedValue = encodeURIComponent( oValue )
									.replace( /!/g, '%21' )
									.replace( /'/g, '%27' )
									.replace( /\(/g, '%28' )
									.replace( /\)/g, '%29' )
									.replace( /\*/g, '%2A' )
									.replace( /~/g, '%7E' );
			this.aData.push( oName + "=" + sEncodedValue );
			return this;
		},
		/**
		 * Returns all the data to be sent as String with the ampersand separator
		 * @return {String}
		 */
		toString: function ()
		{
			return this.aData.join( '&' );
		}
	};

	/*
	 * Expose to Namespace
	 */
	ns.AjaxDataObject = AjaxDataObject;
}( window, document, (window.Namespace ? window.Namespace : {}) ) );