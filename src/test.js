(() => {
    'use strict';
    const addition = require('./addition');
    // const expect = require('chai').expect;

    describe('Addition', () => {
        it('adds two numbers', () => {
            // expect(addition.add(2, 3)).to.equal(5);
            if (addition.add(2, 3) !== 5) {
                throw new Error(`Expected: ${5}, but found: ${addition.add(2, 3)}`);
            }
        });
    });
})();