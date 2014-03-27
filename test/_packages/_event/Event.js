/**
 * Event
 * this class is used to normalize the event not depending of browser that owns the user
 * @class Event
 * @constructor
 * @param oEvent
 * @version 1.0
 * @author Tomas Corral Casas
 * @return Event
 * @type object
 */
( function ( win, doc, ns, und )
{
	'use strict';

	var Event;

	Event = function ( oEvent )
	{
		/**
		 * originalEvent stores the reference to the original event
		 * @version 1.0
		 * @author Tomas Corral Casas
		 * @type Event
		 */
		this.originalEvent = oEvent || null;
		/**
		 * altKey stores the reference to altKey property
		 * @version 1.0
		 * @author Tomas Corral Casas
		 * @type Boolean
		 */
		this.altKey = oEvent ? oEvent.altKey : false;
		/**
		 * button stores the reference to button property
		 * @version 1.0
		 * @author Tomas Corral Casas
		 * @type Number
		 */
		this.button = oEvent ? oEvent.button : -1;
		/**
		 * clientX stores the reference to clientX property
		 * @version 1.0
		 * @author Tomas Corral Casas
		 * @type Number
		 */
		this.clientX = oEvent ? oEvent.clientX : 0;
		/**
		 * clientY stores the reference to clientY property
		 * @version 1.0
		 * @author Tomas Corral Casas
		 * @type Number
		 */
		this.clientY = oEvent ? oEvent.clientY : 0;
		/**
		 * ctrlKey stores the reference to ctrlKey property
		 * @version 1.0
		 * @author Tomas Corral Casas
		 * @type Boolean
		 */
		this.ctrlKey = oEvent ? oEvent.ctrlKey : false;
		/**
		 * screenX stores the reference to screenX property
		 * @version 1.0
		 * @author Tomas Corral Casas
		 * @type Number
		 */
		this.screenX = oEvent ? oEvent.screenX : 0;
		/**
		 * screenY stores the reference to screenY property
		 * @version 1.0
		 * @author Tomas Corral Casas
		 * @type Number
		 */
		this.screenY = oEvent ? oEvent.screenY : 0;
		/**
		 * shiftKey stores the reference to shiftKey property
		 * @version 1.0
		 * @author Tomas Corral Casas
		 * @type Boolean
		 */
		this.shiftKey = oEvent ? oEvent.shiftKey : false;
		/**
		 * type stores the reference to type property
		 * @version 1.0
		 * @author Tomas Corral Casas
		 * @type String
		 */
		this.type = oEvent ? oEvent.type : '';
		/**
		 * target stores the reference to target property
		 * @version 1.0
		 * @author Tomas Corral Casas
		 * @type Object
		 */
		this.target = oEvent ? oEvent.target : null;
		/**
		 * relatedTarget stores the reference to relatedTarget property
		 * @version 1.0
		 * @author Tomas Corral Casas
		 * @type Object
		 */
		this.relatedTarget = oEvent ? oEvent.relatedTarget : null;
		/**
		 * pageX stores the reference to pageX property
		 * @version 1.0
		 * @author Tomas Corral Casas
		 * @type Number
		 */
		this.pageX = oEvent ? oEvent.pageX : 0;
		/**
		 * pageY stores the reference to pageY property
		 * @version 1.0
		 * @author Tomas Corral Casas
		 * @type Number
		 */
		this.pageY = oEvent ? oEvent.pageY : 0;
		/**
		 * which stores the reference to which property
		 * @version 1.0
		 * @author Tomas Corral Casas
		 * @type Number
		 */
		this.which = oEvent ? oEvent.which : 0;
		/**
		 * metaKey stores the reference to metaKey property
		 * Used for Apple key
		 * @version 1.0
		 * @author Tomas Corral Casas
		 * @type Boolean
		 */
		this.metaKey = oEvent ? oEvent.metaKey : false;

		if ( oEvent )
		{
			Event.buttonMouseDown = Event.setButtonMouseDown();
			this.normalize( oEvent );
		}
	};
	ns.ButtonMouseDown = function ()
	{
		this.left = 0;
		this.central = null;
		this.right = 2;
	};
	Event.setButtonMouseDown = function ()
	{
		return new ns.ButtonMouseDown();
	};
	/**
	 * buttonMouseDown returns the correct object to be used to detect the mouse button when pressed down
	 * @version 1.0
	 * @author Tomas Corral Casas
	 */
	Event.buttonMouseDown = null;
	/**
	 * preventDefault stops the default behaviour on the element where the event is attached
	 * @version 1.0
	 * @author Tomas Corral Casas
	 */
	Event.prototype.preventDefault = function ()
	{
		this.isDefaultPrevented = function ()
		{
			return true;
		};

		var eEvent = this.originalEvent;
		if ( !eEvent )
		{
			return;
		}
		// if preventDefault exists run it on the original event
		if ( eEvent.preventDefault )
		{
			eEvent.preventDefault();
			return this;
		}
		// otherwise set the returnValue property of the original event to false (IE)
		eEvent.returnValue = false;
		return this;
	};
	/**
	 * stopPropagation stops bubbling propagation
	 * @version 1.0
	 * @author Tomas Corral Casas
	 */
	Event.prototype.stopPropagation = function ()
	{
		this.isPropagationStopped = function ()
		{
			return true;
		};

		var eEvent = this.originalEvent;
		if ( !eEvent )
		{
			return;
		}
		// if stopPropagation exists run it on the original event
		if ( eEvent.stopPropagation )
		{
			eEvent.stopPropagation();
			return this;
		}
		// otherwise set the cancelBubble property of the original event to true (IE)
		eEvent.cancelBubble = true;
		return this;
	};
	/**
	 * stopImmediatePropagation forze the stop bubbling propagation
	 * @version 1.0
	 * @author Tomas Corral Casas
	 */
	Event.prototype.stopImmediatePropagation = function ()
	{
		this.isImmediatePropagationStopped = function ()
		{
			return true;
		};
		this.stopPropagation();
	};
	/**
	 * sisDefaultPrevented  return false
	 * @version 1.0
	 * @author Tomas Corral Casas
	 */
	Event.prototype.sisDefaultPrevented = function ()
	{
		return false;
	};
	/**
	 * sisPropagationStopped return false
	 * @version 1.0
	 * @author Tomas Corral Casas
	 */
	Event.prototype.sisPropagationStopped = function ()
	{
		return false;
	};
	/**
	 * sisImmediatePropagationStopped return false
	 * @version 1.0
	 * @author Tomas Corral Casas
	 */
	Event.prototype.sisImmediatePropagationStopped = function ()
	{
		return false;
	};
	/**
	 * normalize is the method that returns a normalized event object even if we are in different browsers.
	 * @version 1.0
	 * @author Tomas Corral Casas
	 * @param oEvent
	 * @type Event
	 */
	Event.prototype.normalize = function ( oEvent )
	{
		var oDoc,
			oBody;
		if ( !oEvent.target )
		{
			this.target = oEvent.srcElement || doc;
		}

		if ( this.target.nodeType === 3 )
		{
			this.target = oEvent.target.parentNode;
		}

		if ( !oEvent.relatedTarget && oEvent.fromElement )
		{
			this.relatedTarget = oEvent.fromElement === oEvent.target ? oEvent.toElement : oEvent.fromElement;
		}

		if ( oEvent.pageX === null && oEvent.clientX !== null )
		{
			oDoc = doc.documentElement;
			oBody = doc.body;
			this.pageX = oEvent.clientX + ((oDoc && oDoc.scrollLeft) || (oBody && oBody.scrollLeft) || 0) - ((oDoc && oDoc.clientLeft) || (oBody && oBody.clientLeft) || 0);
			this.pageY = oEvent.clientY + ((oDoc && oDoc.scrollTop) || (oBody && oBody.scrollTop) || 0) - ((oDoc && oDoc.clientTop) || (oBody && oBody.clientTop) || 0);
		}

		if ( !oEvent.which && (( oEvent.charCode || oEvent.charCode === 0 ) ? oEvent.charCode : oEvent.keyCode ) )
		{
			this.which = oEvent.charCode || oEvent.keyCode;
		}

		if ( !oEvent.metaKey && oEvent.ctrlKey )
		{
			this.metaKey = oEvent.ctrlKey;
		}

		if ( !oEvent.which && oEvent.button !== undefined )
		{
			this.which = (oEvent.button && 1 ? 1 : ( oEvent.button && 2 ? 3 : ( oEvent.button && 4 ? 2 : 0 ) ));
		}
	};
	/**
	 * instance is the method to be called each time we need a normalized event object
	 * @param {Object} oEvent
	 * @return the instance of the Event
	 */
	Event.instance = function ( oEvent )
	{
		return new Event( oEvent );
	};


	// Expose to the Window.
	ns.Event = Event;

}( window, document, Namespace ) );