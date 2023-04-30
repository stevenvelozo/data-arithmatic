/**
* @license MIT
* @author <steven@velozo.com>
*/

/**
* Data Arithmatic
*
* @class DataArithmatic
*/
class DataArithmatic
{
	constructor()
	{
		// Regular Expressions (so they don't have to be recompiled every time)
		// These could be defined as static, but I'm not sure if that will work with browserify ... and specifically the QT browser.
		this._Regex_formatterInsertCommas = /.{1,3}/g;
		// Match Function:
		// function(pMatch, pSign, pZeros, pBefore, pDecimal, pAfter)
		// Thoughts about below:   /^([+-]?)(0*)(\d+)(\.(\d+))?$/;
		this._Regex_formatterAddCommasToNumber = /^([-+]?)(0?)(\d+)(.?)(\d+)$/g;
		this._Regex_formatterDollarsRemoveCommas = /,/gi;
		this._Regex_formatterCleanNonAlpha = /[^a-z0-9]/gi;

		// TODO: Potentially pull these in from a configuration.
		// TODO: Use locale data for this if it's defaults all the way down.
		this._Value_MoneySign_Currency = '$';
		this._Value_NaN_Currency = '--';
		this._Value_GroupSeparator_Number = ',';

		this._Value_Prefix_StringHash = 'HSH';
		this._Value_Clean_formatterCleanNonAlpha = '_';

		this._UseEngineStringStartsWith = (typeof(String.prototype.startsWith) === 'function');
		this._UseEngineStringEndsWith = (typeof(String.prototype.endsWith) === 'function');
	}


	/*************************************************************************
	 * String Manipulation and Comparison Functions
	 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*/

	/**
	 * Reverse a string
	 *
	 * @param {string} pString - The string to reverse
	 * @returns {string}
	 */
	stringReverse (pString)
	{
		// TODO: Benchmark if there are faster ways we want to do this with all the newer JS stuff
		//       ... and if it will work with browserify in a clean way.
	    return pString.split('').reverse().join('');
	}

	/**
	 * Test if a string starts with a given substring.
	 *
	 * @param {*} pString
	 * @param {*} pSearchString
	 * @param {*} pStartIndex
	 * @returns {*}
	 */
	stringStartsWith (pString, pSearchString, pStartIndex)
	{
		if (this._UseEngineStringStartsWith)
		{
			return pString.startsWith(pSearchString, pStartIndex);
		}
		else
		{
			return this.stringStartsWith_Polyfill.call(pString, pSearchString, pStartIndex);
		}
	}

	/**
	 * Check if a string starts with a given substring.  This is a safe polyfill for the ES6 string.startsWith() function.
	 *
	 * @param {*} pSearchString - The string to search for
	 * @param {*} pStartIndex - The index to start the search at
	 * @returns {boolean}
	 */
	stringStartsWith_Polyfill (pSearchString, pStartIndex)
	{
		return this.slice(pStartIndex || 0, pSearchString.length) === pSearchString;
	}

	/**
	 * Test if a string starts with a given substring.
	 *
	 * @param {*} pString
	 * @param {*} pSearchString
	 * @param {*} pEndIndex
	 * @returns {*}
	 */
	stringEndsWith (pString, pSearchString, pEndIndex)
	{
		if (this._UseEngineStringEndsWith)
		{
			return pString.endsWith(pSearchString, pEndIndex);
		}
		else
		{
			return this.stringEndsWith_Polyfill.call(pString, pSearchString, pEndIndex);
		}
	}

	/**
	 * Check if a string starts with a given substring.  This is a safe polyfill for the ES6 string.startsWith() function.
	 *
	 * @param {*} pSearchString - The string to search for
	 * @param {*} pEndIndex - The index to end the search at
	 * @returns {boolean}
	 */
	stringEndsWith_Polyfill (pSearchString, pEndIndex)
	{
		// This works much better than >= because
		// it compensates for NaN:
		if (!(pEndIndex < this.length))
		{
			pEndIndex = this.length;
		}
		else
		{
			pEndIndex |= 0; // round position
		}
		return this.substr(pEndIndex - pSearchString.length, pSearchString.length) === pSearchString;
	}

	/**
	 * Generate an insecure string hash.  Not meant to be secure, just a quick way to generate a hash for a string.  This is not a cryptographic hash.  Additional warranty and disclaimer ... this is not for passwords!
	 *
	 * @param {string} pString
	 * @returns {string}
	 */
	insecureStringHash (pString)
	{
	    let tmpHash = 0;
	    let tmpStringLength = pString.length;
	    let tmpCharacterIndex = 0;

	    while (tmpCharacterIndex < tmpStringLength)
	    {
	        tmpHash = (tmpHash << 5) - tmpHash + pString.charCodeAt(tmpCharacterIndex++) | 0;
	    }

	    return `${this._Value_Prefix_StringHash}${tmpHash}`;
	}

	/**
	 * Clean wrapping characters if they exist consistently around the string.  If they do not, the string is returned unchanged.
	 *
	 * @param {string} pWrapCharacter - The character expected as the wrapping character
	 * @param {string} pString - the string to clean
	 * @returns {string}
	 */
	cleanEnclosureWrapCharacters (pWrapCharacter, pString)
	{
		// # Use case from ManyFest DSL:
		//
		// When a boxed property is passed in, it should have quotes of some
		// kind around it.
		//
		// For instance:
		// 		MyValues['Name']
		// 		MyValues["Age"]
		// 		MyValues[`Cost`]
		//
		// This function is necessary to remove the wrapping quotes before object
		// resolution can occur.
		if (pString.startsWith(pWrapCharacter) && pString.endsWith(pWrapCharacter))
		{
			return pString.substring(1, pString.length - 1);
		}
		else
		{
			return pString;
		}
	}

	/**
	 *
	 * @param {*} pString
	 * @returns
	 */
	cleanNonAlphaCharacters (pString)
	{
	    if ((typeof(pString) == 'string') && (pString != ''))
	    {
	        return pString.replace(this._Regex_formatterCleanNonAlpha, this._Value_Clean_formatterCleanNonAlpha);
	    }
	}


	/*************************************************************************
	 * Number Formatting Functions
	 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*/

	/**
	 * Insert commas every 3 characters from the right.  Used by formatterAddCommasToNumber().
	 *
	 * @param {*} pString
	 * @returns {*}
	 */
	formatterInsertCommas (pString)
	{
	    // Reverse, because it's easier to do things from the left, given arbitrary digit counts
	    let tmpReversed = this.stringReverse(pString);
	    // Add commas every three characters
	    let tmpReversedWithCommas = tmpReversed.match(this._Regex_formatterInsertCommas).join(',');
	    // Reverse again (back to normal direction)
	    return this.stringReverse(tmpReversedWithCommas);
	}

	processAddCommasToNumberRegex(pMatch, pSign, pZeros, pBefore, pDecimal, pAfter)
	{
		// If there was no decimal, the last capture grabs the final digit, so
		// we have to put it back together with the 'before' substring
		return pSign + (pDecimal ? this.formatterInsertCommas(pBefore) + pDecimal + pAfter : this.formatterInsertCommas(pBefore + pAfter));
	}

	/**
	 * Add Commas to a Number for readability.
	 *
	 * @param {*} pNumber
	 * @returns {string}
	 */
	formatterAddCommasToNumber (pNumber)
	{
	    // If the regex doesn't match, `replace` returns the string unmodified
	    return (pNumber.toString()).replace
	    (
			this._Regex_formatterAddCommasToNumber,
	        this.processAddCommasToNumberRegex.bind(this)
	    );
	}

	/**
	 * This will take a number and format it as a dollar string.  It will also add commas to the number.  If the number is not a number, it will return '--'.
	 *
	 * @param {*} pValue
	 * @returns {string}
	 */
	formatterDollars (pValue)
	{
	    let tmpDollarAmount = parseFloat(pValue).toFixed(2);

	    if (isNaN(tmpDollarAmount))
	    {
	        // Try again and see if what was passed in was a dollars string.
	        if (typeof(pValue) == 'string')
	        {
				// TODO: Better rounding function?  This is a hack to get rid of the currency symbol and commas.
	            tmpDollarAmount = parseFloat(pValue.replace(this._Value_MoneySign_Currency,'').replace(this._Regex_formatterDollarsRemoveCommas,'')).toFixed(2);
	        }
			// If we didn't get a number, return the "not a number" string.
	        if (isNaN(tmpDollarAmount))
	        {
	            return this._Value_NaN_Currency;
	        }
	    }

	    // TODO: Get locale data and use that for this stuff.
	    return `$${this.formatterAddCommasToNumber(tmpDollarAmount)}`;
	}

	/**
	 * Round a number to a certain number of digits.  If the number is not a number, it will return 0.  If no digits are specified, it will default to 2 significant digits.
	 *
	 * @param {*} pValue
	 * @param {number} pDigits
	 * @returns {string}
	 */
	formatterRoundNumber (pValue, pDigits)
	{
	    let tmpDigits = (typeof(pDigits) == 'undefined') ? 2 : pDigits;

	    let tmpValue = Number.parseFloat(pValue).toFixed(tmpDigits);
	    if (isNaN(tmpValue))
	    {
	        let tmpZed = 0;
	        return tmpZed.toFixed(tmpDigits);
	    }
	    else
	    {
	        return tmpValue;
	    }
	}


	/*************************************************************************
	 * String Tokenization Functions
	 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*/

	/**
	 * Return the string before the matched substring.
	 *
	 * If the substring is not found, the entire string is returned.  This only deals with the *first* match.
	 *
	 * @param {string} pString
	 * @param {string} pMatch
	 * @returns {string}
	 */
	stringBeforeMatch (pString, pMatch)
	{
		return pString.split(pMatch)[0];
	}

	/**
	 * Return the string after the matched substring.
	 *
	 * If the substring is not found, an empty string is returned.  This only deals with the *first* match.
	 *
	 * @param {string} pString
	 * @param {string} pMatch
	 * @returns {string}
	 */
	stringAfterMatch (pString, pMatch)
	{
	    let tmpStringSplitLocation = pString.indexOf(pMatch);

		if ((tmpStringSplitLocation < 0) || ((tmpStringSplitLocation + pMatch.length) >= pString.length))
	    {
	        return '';
	    }

	    return pString.substring(tmpStringSplitLocation + pMatch.length);
	}

	/**
	 * Count the number of enclosures in a string based on the start and end characters.
	 *
	 * If no start or end characters are specified, it will default to parentheses.  If the string is not a string, it will return 0.
	 *
	 * @param {string} pString
	 * @param {string} pEnclosureStart
	 * @param {string} pEnclosureEnd
	 * @returns the count of full in the string
	 */
	stringCountEnclosures (pString, pEnclosureStart, pEnclosureEnd)
	{
	    let tmpString = (typeof(pString) == 'string') ? pString : '';
	    let tmpEnclosureStart = (typeof(pEnclosureStart) == 'string') ? pEnclosureStart : '(';
	    let tmpEnclosureEnd = (typeof(pEnclosureEnd) == 'string') ? pEnclosureEnd : ')';

	    let tmpEnclosureCount = 0;
	    let tmpEnclosureDepth = 0;
	    for (let i = 0; i < tmpString.length; i++)
	    {
	        // This is the start of an enclosure
	        if (tmpString[i] == tmpEnclosureStart)
	        {
	            if (tmpEnclosureDepth == 0)
	            {
	                tmpEnclosureCount++;
	            }
	            tmpEnclosureDepth++;
	        }
	        else if (tmpString[i] == tmpEnclosureEnd)
	        {
	            tmpEnclosureDepth--;
	        }
	    }

	    return tmpEnclosureCount;
	}


	/**
	 * Get the value of the enclosure at the specified index.
	 *
	 * If the index is not a number, it will default to 0.  If the string is not a string, it will return an empty string.  If the enclosure is not found, it will return an empty string.  If the enclosure
	 *
	 * @param {string} pString
	 * @param {number} pEnclosureIndexToGet
	 * @param {string} pEnclosureStart
	 * @param {string}} pEnclosureEnd
	 * @returns {string}
	 */
	stringGetEnclosureValueByIndex (pString, pEnclosureIndexToGet, pEnclosureStart, pEnclosureEnd)
	{
	    let tmpString = (typeof(pString) == 'string') ? pString : '';
	    let tmpEnclosureIndexToGet = (typeof(pEnclosureIndexToGet) == 'number') ? pEnclosureIndexToGet : 0;
	    let tmpEnclosureStart = (typeof(pEnclosureStart) == 'string') ? pEnclosureStart : '(';
	    let tmpEnclosureEnd = (typeof(pEnclosureEnd) == 'string') ? pEnclosureEnd : ')';

	    let tmpEnclosureCount = 0;
	    let tmpEnclosureDepth = 0;

		let tmpMatchedEnclosureIndex = false;
	    let tmpEnclosedValueStartIndex = 0;
	    let tmpEnclosedValueEndIndex = 0;

	    for (let i = 0; i < tmpString.length; i++)
	    {
	        // This is the start of an enclosure
	        if (tmpString[i] == tmpEnclosureStart)
	        {
	            tmpEnclosureDepth++;

				// Only count enclosures at depth 1, but still this parses both pairs of all of them.
				if (tmpEnclosureDepth == 1)
				{
					tmpEnclosureCount++;
					if (tmpEnclosureIndexToGet == (tmpEnclosureCount - 1))
					{
						// This is the start of *the* enclosure
						tmpMatchedEnclosureIndex = true;
						tmpEnclosedValueStartIndex = i;
					}
				}
	        }
			// This is the end of an enclosure
	        else if (tmpString[i] == tmpEnclosureEnd)
	        {
	            tmpEnclosureDepth--;

				// Again, only count enclosures at depth 1, but still this parses both pairs of all of them.
				if ((tmpEnclosureDepth == 0) &&
					tmpMatchedEnclosureIndex &&
					(tmpEnclosedValueEndIndex <= tmpEnclosedValueStartIndex))
				{
					tmpEnclosedValueEndIndex = i;
					tmpMatchedEnclosureIndex = false;
				}
	        }
	    }

	    if (tmpEnclosureCount <= tmpEnclosureIndexToGet)
	    {
			// Return an empty string if the enclosure is not found
	        return '';
	    }

	    if ((tmpEnclosedValueEndIndex > 0) && (tmpEnclosedValueEndIndex > tmpEnclosedValueStartIndex))
	    {
	        return tmpString.substring(tmpEnclosedValueStartIndex+1, tmpEnclosedValueEndIndex);
	    }
	    else
	    {
	        return tmpString.substring(tmpEnclosedValueStartIndex+1);
	    }
	}


	/**
	 * Remove an enclosure from a string based on the index of the enclosure.
	 *
	 * @param {string} pString
	 * @param {number} pEnclosureIndexToRemove
	 * @param {number} pEnclosureStart
	 * @param {number} pEnclosureEnd
	 * @returns {string}
	 */
	stringRemoveEnclosureByIndex (pString, pEnclosureIndexToRemove, pEnclosureStart, pEnclosureEnd)
	{
	    let tmpString = (typeof(pString) == 'string') ? pString : '';
	    let tmpEnclosureIndexToRemove = (typeof(pEnclosureIndexToRemove) == 'number') ? pEnclosureIndexToRemove : 0;
	    let tmpEnclosureStart = (typeof(pEnclosureStart) == 'string') ? pEnclosureStart : '(';
	    let tmpEnclosureEnd = (typeof(pEnclosureEnd) == 'string') ? pEnclosureEnd : ')';

	    let tmpEnclosureCount = 0;
	    let tmpEnclosureDepth = 0;

		let tmpMatchedEnclosureIndex = false;
	    let tmpEnclosureStartIndex = 0;
	    let tmpEnclosureEndIndex = 0;

	    for (let i = 0; i < tmpString.length; i++)
	    {
	        // This is the start of an enclosure
	        if (tmpString[i] == tmpEnclosureStart)
	        {
	            tmpEnclosureDepth++;

	            if (tmpEnclosureDepth == 1)
	            {
	                tmpEnclosureCount++;
					if (tmpEnclosureIndexToRemove == (tmpEnclosureCount - 1))
					{
						tmpMatchedEnclosureIndex = true;
						tmpEnclosureStartIndex = i;
					}
	            }
	        }
	        else if (tmpString[i] == tmpEnclosureEnd)
	        {
	            tmpEnclosureDepth--;

				if ((tmpEnclosureDepth == 0) &&
					tmpMatchedEnclosureIndex &&
					(tmpEnclosureEndIndex <= tmpEnclosureStartIndex))
				{
					tmpEnclosureEndIndex = i;
					tmpMatchedEnclosureIndex = false;
				}
	        }
	    }

	    if (tmpEnclosureCount <= tmpEnclosureIndexToRemove)
	    {
	        return tmpString;
	    }

	    let tmpReturnString = '';

	    if (tmpEnclosureStartIndex > 1)
	    {
	        tmpReturnString = tmpString.substring(0, tmpEnclosureStartIndex);
	    }

	    if ((tmpString.length > (tmpEnclosureEndIndex + 1)) && (tmpEnclosureEndIndex > tmpEnclosureStartIndex))
	    {
	        tmpReturnString += tmpString.substring(tmpEnclosureEndIndex+1);
	    }

	    return tmpReturnString;
	}
}

module.exports = DataArithmatic;