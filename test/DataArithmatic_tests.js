/**
* Unit tests for DataArithmatic
*
* @license     MIT
*
* @author      Steven Velozo <steven@velozo.com>
*/

var Chai = require("chai");
var Expect = Chai.expect;

let libDataArithmatic = require('../source/DataArithmatic.js');

suite
(
	'DataArithmatic Basic',
	function()
	{
		setup (()=> {} );

		suite
		(
			'Object Sanity',
			()=>
			{
				test
				(
					'The class should initialize itself into a happy little object.',
					(fTestComplete)=>
					{
						let _DataArithmatic = new libDataArithmatic();
						Expect(_DataArithmatic)
							.to.be.an('object', 'DataArithmatic should initialize as an object with no parameters.');
						fTestComplete();
					}
				);
			}
		);
	}
);
