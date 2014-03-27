( function ( win, doc, nav, ns, und )
{
	'use strict';

	var EventHandler = function ()
	{
	};

	EventHandler.hasVerticalScroll = function ( oElement, fpCallback )
	{
		if ( !oElement )
		{
			return;
		}
		oElement.scrollTop = 1;
		if ( oElement.scrollTop === 1 )
		{
			oElement.scrollTop = 0;
			fpCallback.call( oElement );
		}
	};

	EventHandler.DOMLoad = (function ()
	{
		var bDOMLoaded = false,
			nDOMLoadTimer = null,
			aFunctionsToCall = [],
			oAddedStrings = {},
			fpErrorHandling = function ()
			{
				win.console.error.apply( win.console, arguments );
			},
			execFunctions = function ()
			{
				var nFunction = 0,
					nLenFunctions = aFunctionsToCall.length;

				for ( ; nFunction < nLenFunctions; nFunction++ )
				{
					try
					{
						aFunctionsToCall[nFunction]();
					}
					catch ( erError )
					{
						if ( fpErrorHandling && typeof fpErrorHandling === "function" )
						{
							fpErrorHandling( erError );
						}
					}
				}
				aFunctionsToCall = [];
			},
			domHasLoaded = function ()
			{
				if ( bDOMLoaded )
				{
					return;
				}
				bDOMLoaded = true;
				execFunctions();
			};

		doc.addEventListener( "DOMContentLoaded", domHasLoaded, false );

		return {
			DOMReady: function ()
			{
				var nArgument = 0,
					nLenArguments = arguments.length,
					fpRef;

				for ( ; nArgument < nLenArguments; nArgument++ )
				{
					fpRef = arguments[nArgument];
					if ( !fpRef.DOMReady && !oAddedStrings[fpRef] )
					{
						fpRef.DOMReady = true;
						aFunctionsToCall.push( fpRef );
					}
				}
				if ( bDOMLoaded )
				{
					execFunctions();
				}
			},
			setErrorHandling: function ( funcRef )
			{
				fpErrorHandling = funcRef;
			}
		};
	}());
	EventHandler.DOMReady = EventHandler.DOMLoad.DOMReady;
	EventHandler.aEvents = [];
	EventHandler.systemEvents = {
		"blur": "blur",
		"focus": "focus",
		"focusin": "focusin",
		"focusout": "focusout",
		"load": "load",
		"resize": "resize",
		"scroll": "scroll",
		"unload": "unload",
		"click": "click",
		"dblclick": "dblclick",
		"mousedown": "mousedown",
		"mouseup": "mouseup",
		"mousemove": "mousemove",
		"mouseover": "mouseover",
		"mouseout": "mouseout",
		"mouseenter": "mouseenter",
		"mouseleave": "mouseleave",
		"contextmenu": "contextmenu",
		"change": "change",
		"select": "select",
		"submit": "submit",
		"keydown": "keydown",
		"keypress": "keypress",
		"keyup": "keyup",
		"error": "error",
		"webkitTransitionEnd": "webkitTransitionEnd"
	};
	if ( win.onhashchange !== und )
	{
		EventHandler.systemEvents.hashchange = "hashchange";
	}
	if ( win.oninvalid !== und )
	{
		EventHandler.systemEvents.invalid = "invalid";
	}

	EventHandler.addEvent = function ( oElement, aData, sEvent, fpFunction, bUseCapture )
	{
		var aAux = [],
			a_Data = aData,
			s_Event = sEvent,
			fp_Function = fpFunction,
			b_UseCapture = bUseCapture,
			fpFunctionWithEvent;

		if ( !oElement )
		{
			return false;
		}

		if ( !ns.Utilities.isArray( aData ) )
		{
			a_Data = [];
			s_Event = aData;
			fp_Function = sEvent;
			b_UseCapture = fpFunction;
		}
		aAux.push( a_Data );

		fpFunctionWithEvent = function ( event )
		{
			var oEvent = ns.Event.instance( event );
			aAux.unshift( oEvent );

			if ( fp_Function.apply( oElement, aAux ) === false )
			{
				oEvent.originalEvent.preventDefault();
				oEvent.originalEvent.stopPropagation();
			}
		};
		if ( EventHandler.systemEvents[s_Event] !== und )
		{
			oElement.addEventListener( s_Event, fpFunctionWithEvent, bUseCapture === und ? true : bUseCapture );
			return fpFunctionWithEvent;
		}
		else
		{
			return EventHandler.bind( oElement, s_Event, fp_Function );
		}

	};

	EventHandler.removeEvent = function ( oElement, sEvent, fpFunction, bUseCapture )
	{
		if ( EventHandler.systemEvents[sEvent] !== und )
		{
			if ( fpFunction )
			{
				oElement.removeEventListener( sEvent, fpFunction, bUseCapture === und ? true : bUseCapture );
			}
		}
		else
		{
			EventHandler.unbind( oElement, sEvent, fpFunction );
		}
	};

	EventHandler.fireEvent = function ( oElement, sEvent, aData, oTriggerObject, eEvent )
	{
		var oEvent;
		if ( EventHandler.systemEvents[sEvent] !== und )
		{
			if ( eEvent !== und )
			{
				oEvent = eEvent;
			}
			else
			{
				oEvent = doc.createEvent( 'HTMLEvents' );
				oEvent.initEvent( sEvent, true, true );
			}

			oElement.dispatchEvent( oEvent );
		}
		else
		{
			EventHandler.trigger( oElement, sEvent, aData, oTriggerObject );
		}
	};

	EventHandler._now = function ()
	{
		return new win.Date().getTime();
	};
	EventHandler._removeDuplicateElement = function ( oArray )
	{
		var aAux = [],
			nItem = 0,
			nLenArray = oArray.length,
			nCount = 0;

		label:for ( ; nItem < nLenArray; nItem++ )
		{
			for ( nCount = 0; nCount < aAux.length; nCount++ )
			{
				if ( aAux[nCount] === oArray[nItem] )
				{
					continue label;
				}
			}
			aAux[aAux.length] = oArray[nItem];
		}
		return aAux;
	};
	EventHandler._fixTypesArray = function ( sTypes )
	{
		return EventHandler._removeDuplicateElement( sTypes.split( "," ) );
	};
	EventHandler._add = function ( oElement, sType, nIdentifier, fpPointer, oTriggerObject )
	{
		if ( EventHandler.aEvents[oElement] === und )
		{
			EventHandler.aEvents[oElement] = [];
		}
		if ( EventHandler.aEvents[oElement][sType] === und )
		{
			EventHandler.aEvents[oElement][sType] = [];
		}

		if ( oTriggerObject !== und && oTriggerObject.nId === und )
		{
			oTriggerObject.nId = win.Math.random() * +new win.Date();
		}
		if ( oTriggerObject !== und && EventHandler.aEvents[oElement][sType][oTriggerObject.nId] === und )
		{
			EventHandler.aEvents[oElement][sType][oTriggerObject.nId] = [];
		}

		if ( oTriggerObject !== und )
		{
			EventHandler.aEvents[oElement][sType][oTriggerObject.nId][nIdentifier] = fpPointer;
		}
		else
		{
			EventHandler.aEvents[oElement][sType][nIdentifier] = fpPointer;
		}
	};
	EventHandler.bind = function ( oElement, sTypes, fpPointer, oTriggerObject )
	{
		var aType = EventHandler._fixTypesArray( sTypes ),
			nType = 0,
			nLenType = aType.length,
			nIdentifier = EventHandler._now();

		for ( ; nType < nLenType; nType++ )
		{
			EventHandler._add( oElement, aType[nType], nIdentifier, fpPointer, oTriggerObject );
		}

		aType = null;

		return nIdentifier;
	};
	EventHandler._remove = function ( oElement, sType, nIdentifier )
	{
		if ( EventHandler.aEvents[oElement] === und )
		{
			return;
		}

		if ( EventHandler.aEvents[oElement][sType] === und )
		{
			return;
		}

		if ( nIdentifier !== und )
		{
			delete EventHandler.aEvents[oElement][sType][nIdentifier];
		}
		else
		{
			EventHandler.aEvents[oElement][sType] = [];
		}
	};
	EventHandler.unbind = function ( oElement, sTypes, nIdentifier )
	{
		var aType = EventHandler._fixTypesArray( sTypes ),
			nType = 0,
			nLenType = aType.length;
		for ( ; nType < nLenType; nType++ )
		{
			EventHandler._remove( oElement, aType[nType], nIdentifier );
		}
	};
	/**
	 * Overloads the trigger event, always in the window context.
	 * Used for the calls from api.
	 * @param sType string Event type.
	 * @param aData array Data for the event handler.
	 * @param oTriggerObject object Triggering object.
	 */
	EventHandler.triggerWindowEvent = function ( sType, aData, oTriggerObject )
	{
		EventHandler.trigger( win, sType, aData, oTriggerObject );
	};
	/**
	 * Trigger an event
	 * @param oElement object Element in which context the event is fired.
	 * @param sType string Event type.
	 * @param aData array Data for the event handler.
	 * @param oTriggerObject object Triggering object.
	 */
	EventHandler.trigger = function ( oElement, sType, aData, oTriggerObject )
	{
		var aEvents = [],
			nIdentifier = -1,
			bTriggerObject = oTriggerObject !== und;
		if ( EventHandler.aEvents[oElement] === und )
		{
			return;
		}
		if ( EventHandler.aEvents[oElement][sType] === und )
		{
			return;
		}
		if ( aData === und )
		{
			aData = [];
		}
		if ( bTriggerObject )
		{
			if ( EventHandler.aEvents[oElement][sType][oTriggerObject.nId] !== und )
			{
				aEvents = EventHandler.aEvents[oElement][sType][oTriggerObject.nId];
			}
		}
		else
		{
			aEvents = EventHandler.aEvents[oElement][sType];
		}

		for ( nIdentifier in aEvents )
		{
			if ( aEvents.hasOwnProperty( nIdentifier ) )
			{
				if ( nIdentifier.indexOf( "." ) !== -1 )
				{
					if ( aEvents[nIdentifier][oTriggerObject.nId] )
					{
						aEvents[nIdentifier][oTriggerObject.nId].apply( oElement, aData );
					}
				}
				else
				{
					aEvents[nIdentifier].apply( oElement, aData );
				}
			}
		}
	};

	// Expose to the win.
	ns.EventHandler = EventHandler;

}( window, document, navigator, Namespace ) );