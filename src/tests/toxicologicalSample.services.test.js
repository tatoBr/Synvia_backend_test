const {
    ToxicologicalSampleServices,
    isCocaineTestable,
    isSampleTestable,
    isSamplePositive,
    testCocaine
} = require( '../services/toxicologicalSample' );

describe( 'func isSampleTestable works as expected',()=>{
    test( 'throws error if "sample" argument is not an object', ()=>{
        let invalidTypes = [ "", true, false, null, undefined, 1, 0.25,[1, 2, 3], Symbol('a'), new Set([1,2,3]), 1 * 'two'];
        for( let type of invalidTypes ){
            expect(() => isSampleTestable( type )).toThrow( '"sample" argument must be an object.' );
        }
    });

    test('"sample" argument miss one or more properties', ()=>{        
        expect( isSampleTestable({})).toBe( false );
        expect( isSampleTestable({ foo: 'baa' })).toBe( false );
        expect( isSampleTestable({ drugs: [] })).toBe( false );
        expect( isSampleTestable({ sample_code: 123 })).toBe( false );        
    });

    test('"sample" argument has a "drugs" property but it\'s not an Array',() => {
        let invalidTypes = [
            "", true, false, null, undefined, 1, 0.25, 1 * 'two',
            Symbol('a'), new Set([1,2,3]), function(){}, {}
        ];
        for( let type in invalidTypes ){
            expect( isSampleTestable({ sample_code: 123, drugs: type })).toBe( false );
        }
    });

    test('one or more elements in the "drugs" list are not valid objects', () => {
        let invalidTypes = [ "", true, false, null, undefined, 1, 0.25,[1, 2, 3], Symbol('a'), new Set([1,2,3]), 1 * 'two'];
        for( let type of invalidTypes ){
            expect( isSampleTestable({  codigo_amostra: 123, drogas: [ type ]})).toBe( false );
        };
    });

    test('one or more elements in the "drugs" list do not have the required properties "name" and "value"', () => {
       expect( isSampleTestable({  codigo_amostra: 123, drogas: [{}]})).toBe( false );
       expect( isSampleTestable({  codigo_amostra: 123, drogas: [{ nome: 'baa' },{ value: 0.5 }]})).toBe( false );
       expect( isSampleTestable({  codigo_amostra: 123, drogas: [{ prop: 'value' }, { name: 'baa', value: 0.5}]})).toBe( false );      
    });

    test('return true if "sample" argument is testable',()=>{  
        const drugs = [            
            'anfetamina',
            'metanfetamina',
            'mda',
            'mdma',
            'thc:',
            'morfina',
            'codeína',
            'heroína',
            'benzoilecgonina',
            'cocaetileno',
            'norcocaína'
        ];    
        
        for( let drug of drugs ){
            expect( isSampleTestable({
                sample_code: 123,
                drugs: [{ name: drug, value: Math.random() }]        
            })).toBe( true );
        }

        expect( isSampleTestable({
            sample_code: 123,
            drugs: [
                { name: 'cocaína', value: 1.0 },
                { name: 'benzoilecgonina', value: 1.0 },
                { name: 'cocaetileno', value: 1.0 },
                { name: 'norcocaína', value: 1.0 }
            ]        
        })).toBe( true );
    })
});

describe('function "isCocaineTestable" works as expected."', () => {
    test('should return true', () => {
        let druglist = [
            { name: 'cocaína', value: 1.0 },
            { name: 'benzoilecgonina', value: 1.0 },
            { name: 'cocaetileno', value: 1.0 },
            { name: 'norcocaína', value: 1.0 }
        ]
        expect( isCocaineTestable( druglist )).toBe( true );
    });

    test('should return false if any of the 4 drugs is missing', () => {
        expect( isCocaineTestable([
            { name: 'cocaína', value: 1.0 }
        ])).toBe( false );

        expect( isCocaineTestable([
            { name: 'cocaína', value: 1.0 },
            { name: 'benzoilecgonina', value: 1.0 }
        ])).toBe( false );

        expect( isCocaineTestable([
            { name: 'cocaína', value: 1.0 },
            { name: 'benzoilecgonina', value: 1.0 },
            { name: 'cocaetileno', value: 1.0 }
        ])).toBe( false );

        expect( isCocaineTestable([            
            { name: 'benzoilecgonina', value: 1.0 },
            { name: 'cocaetileno', value: 1.0 },
            { name: 'norcocaína', value: 1.0 }
        ])).toBe( false );
    });
});

describe('testCocaine function works as expected', () => {
    test('should be false if cocaine value is less then 0.5', () => {
        expect( testCocaine([
            { name: 'cocaína', value: 0.49 },
            { name: 'benzoilecgonina', value: 0.0 },
            { name: 'cocaetileno', value: 0.0 },
            { name: 'norcocaína', value: 0.0 }
        ])).toBe( false );
        expect( testCocaine([
            { name: 'cocaína', value: 0.3 },
            { name: 'benzoilecgonina', value: 1.0 },
            { name: 'cocaetileno', value: 1.0 },
            { name: 'norcocaína', value: 1.0 }
        ])).toBe( false );
        expect( testCocaine([
            { name: 'cocaína', value: 0.1 },
            { name: 'benzoilecgonina', value: 1.0 },
            { name: 'cocaetileno', value: 1.0 },
            { name: 'norcocaína', value: 1.0 }
        ])).toBe( false );
    });   
    
    test('should be false if cocaine value is equal or higher then 0.5, but Benzoylecgonine, Cocaethylene and Norcocaine values are less then 0.05', () => {
        expect( testCocaine([
            { name: 'cocaína', value: 0.5 },
            { name: 'benzoilecgonina', value: 0.049 },
            { name: 'cocaetileno', value: 0.049 },
            { name: 'norcocaína', value: 0.049 }
        ])).toBe( false );
        expect( testCocaine([
            { name: 'cocaína', value: 0.6 },
            { name: 'benzoilecgonina', value: 0.04999999 },
            { name: 'cocaetileno', value:  0.04999999 },
            { name: 'norcocaína', value:  0.04999999 }
        ])).toBe( false );
        expect( testCocaine([
            { name: 'cocaína', value: 1 },
            { name: 'benzoilecgonina', value:  0.01 },
            { name: 'cocaetileno', value:  0.01 },
            { name: 'norcocaína', value:  0.01 }
        ])).toBe( false );
    });

    test('should be false if cocaine value is less then 0.5, but Benzoylecgonine, Cocaethylene or Norcocaine values are equal or higher then 0.05', () => {
        expect( testCocaine([
            { name: 'cocaína', value: 0.4 },
            { name: 'benzoilecgonina', value: 0.05 },
            { name: 'cocaetileno', value: 0.0 },
            { name: 'norcocaína', value: 0.0 }
        ])).toBe( false );
        expect( testCocaine([
            { name: 'cocaína', value: 0.49999999 },
            { name: 'benzoilecgonina', value: 0.07 },
            { name: 'cocaetileno', value:  0.0 },
            { name: 'norcocaína', value:  0.07 }
        ])).toBe( false );

        expect( testCocaine([
            { name: 'cocaína', value: 0.2 },
            { name: 'benzoilecgonina', value:  0.08 },
            { name: 'cocaetileno', value:  0.07 },
            { name: 'norcocaína', value:  0.0 }
        ])).toBe( false );
    });

    test('should be true if cocaine value is equal or higher then 0.5, and Benzoylecgonine, Cocaethylene or Norcocaine values are equal or higher then 0.05', () => {
        expect( testCocaine([
            { name: 'cocaína', value: 0.5 },
            { name: 'benzoilecgonina', value: 0.05 },
            { name: 'cocaetileno', value: 0.0 },
            { name: 'norcocaína', value: 0.0 }
        ])).toBe( true );
        expect( testCocaine([
            { name: 'cocaína', value: 0.6 },
            { name: 'benzoilecgonina', value: 0.0 },
            { name: 'cocaetileno', value: 0.05 },
            { name: 'norcocaína', value: 0.0 }
        ])).toBe( true );
        expect( testCocaine([
            { name: 'cocaína', value: 0.8 },
            { name: 'benzoilecgonina', value: 0.0 },
            { name: 'cocaetileno', value: 0.0 },
            { name: 'norcocaína', value: 0.05 }
        ])).toBe( true );
        expect( testCocaine([
            { name: 'cocaína', value: 0.5 },
            { name: 'benzoilecgonina', value: 0.0 },
            { name: 'cocaetileno', value: 0.08 },
            { name: 'norcocaína', value: 0.05 }
        ])).toBe( true );
        
    });
});
