const { isObject, floatEquals, arrayEquals, objectHasRightStructure } = require( '../utils/helpers');

describe('isObject function works as expected', () => {
    test('should return false if argument isn\'t an object', () => {
        let invalidTypes = [
            "", true, false, null, undefined, 1, 0.25, 1 * 'two',
            [1, 2, 3], Symbol('a'), new Set([1,2,3]), function(){}
        ];
        for( let type of invalidTypes ){
            expect( isObject( type )).toBe( false );
        }
    });

    test('should return true if argument is an object', () => {
        expect( isObject({})).toBe( true );
    });
});

describe('floatEquals function works as expected', () => {    
    test('should be true for small floats', () => {
        expect( floatEquals( 0.1, 0.1 ));
    });
    test('should be true for float1 equal 0.1 and float2 equal 0.2', () => {
        expect( floatEquals( 0.1, 0.2 ));
    });
    test('should be true for float1 equal 999999.1 and float2 equal 999999.1', () => {
        expect( floatEquals( 999999.1, 999999.1 ));
    });
    test('should be true for float1 equal 999999.1 and float2 equal 999999.2', () => {
        expect( floatEquals( 999999.1, 999999.2 ));
    });
    test('should be true for float1 equal 0.65874215 and float2 equal 0.65874215', () => {
        expect( floatEquals( 0.65874215, 0.65874215 )).toBe( true );
    });    
    test('should be false for float1 equal 0.35647859 and float2 equal 0.35647860', () => {
        expect( floatEquals( 0.35647859, 0.35647860 )).toBe( false );
    });    
    test('should be true for float1 equal 999999.79354826 and float2 equal 999999.79354826', () => {
        expect( floatEquals( 999999.79354826, 999999.79354826 )).toBe( true );
    });    
    test('should be false for float1 equal 999999.48796121 and float2 equal 999999.48796121', () => {
        expect( floatEquals( 999999.48796121, 999999.48796122 )).toBe( false );
    });      
});

describe('arrayEquals function works as expected', () => {
    test('["a","b","c"] and ["c","b","a"] are equal', () => {
        let arr1 = ["a","b","c"];
        let arr2 = ["c","b","a"];
        expect( arrayEquals( arr1, arr2 )).toBe( true );
    });

    test('["a", 1, 8, "b", 3, "c"] and [8, "c", 3, "b", 1, "a"] are equal', () => {
        let arr1 = ["a", 1, 8, "b", 3, "c"];
        let arr2 = [8, "c", 3, "b", 1, "a"];
        expect( arrayEquals( arr1, arr2 )).toBe( true );
    });

    test('[] and [] should be equal', () => {
        let arr1 = [];
        let arr2 = [];
        expect( arrayEquals( arr1, arr2 )).toBe( true );
    });

    test('[1, 2, 3] and ["1", "2", "3"] are different', () => {
        let arr1 = [1, 2, 3];
        let arr2 = ["1", "2", "3"];
        expect( arrayEquals( arr1, arr2 )).toBe( false );
    }); 

    test('[1, 2, 3] and [1, 2, 3, 4] are different', () => {
        let arr1 = [1, 2, 3];
        let arr2 = [1, 2, 3, 4];
        expect( arrayEquals( arr1, arr2 )).toBe( false );
    });    
});

describe('objectHasRightStructure works as expected', () => {
    test('should throw error if "obj" argument is not an object', () => {
        let invalidTypes = [
            "", true, false, null, undefined, 1, 0.25, 1 * 'two',
            [1, 2, 3], Symbol('a'), new Set([1,2,3]), function(){}
        ];
        for( let type of invalidTypes ){
            expect(() => objectHasRightStructure( type, [])).toThrow( '"obj" argument must be of type "Object".' );
        }
    });
    test('should throw error if "expectedProperties" argument is not an Array', () => {
        let invalidTypes = [
            "", true, false, null, undefined, 1, 0.25, 1 * 'two',
            {a: 'b'}, Symbol('a'), new Set([1,2,3]), function(){}
        ];
        for( let type of invalidTypes ){
            expect(() => objectHasRightStructure( {}, type )).toThrow( '"expectedProperties" argument must be of type "Array".' );
        }
    });

    test('should return false for arguments { a: 1 } and ["b"]', () => {
        expect( objectHasRightStructure( { a: 1 }, ["b"])).toBe( false );
    });

    test('should return false for arguments { a: 1, b: 2 } and ["b"]', () => {
        expect( objectHasRightStructure( { a: 1, b: 2 }, ["b"])).toBe( false );
    });

    test('should return true for arguments { a: 1, b: 2 } and ["b", "a"]', () => {
        expect( objectHasRightStructure( { a: 1, b: 2 }, ["b", "a"])).toBe( true );
    });

    test('should return true for arguments { b: 1, a: 2 } and ["a", "b"]', () => {
        expect( objectHasRightStructure( { a: 1, b: 2 }, ["b", "a"])).toBe( true );
    });
});



