const Model = require('../models/toxicologicalSample');
const Service = require('./base_services');
const { isObject, floatEquals, objectHasRightStructure } = require( '../utils/helpers' );
const { httpStatusCodes } = require( '../utils/constants' );
const mapper = { map: function( sample ) {
    let highValues = sample.drugs.filter( d => d.isPositive ).map(d => {
        return { [d.name ]: d.value }
    });
    return {
        "codigo_amostra": sample.sample_code,
        "testada?": sample.tested ? 'Sim':'Não',
        "laudo": sample.result ? 'positivo': 'negativo',
        "detectadas": highValues.length > 0 ? highValues : null
    }
}}
class ToxicologicalSampleServices extends Service {
    constructor() {
        super('Toxicological Sample', Model, mapper);
    };

    testSample = sample => {
        try {           
            if( !isSampleTestable( sample ))
                throw new Error( 'Sample is not testable.' );
            
            const higherValuesAllowed = {
                'cocaína': 0.5,
                'anfetamina': 0.2,
                'metanfetamina': 0.2,
                'mda': 0.2,
                'mdma': 0.2,
                'thc': 0.05,
                'morfina': 0.2,
                'codeína': 0.2,
                'heroína': 0.2,
                'benzoilecgonina': 0.05,
                'cocaetileno': 0.05,
                'norcocaína': 0.05,
            };            
            let sampleIsPositive = false;
            
            for( let i = 0; i < sample.drugs.length; i++ ){                
                let drugIsPositive = false;
                let { name, value } = sample.drugs[i];                
                let h = higherValuesAllowed[ name ];
                
                if( name === 'benzoilecgonina' || name === 'cocaetileno' || name === 'norcocaína' )
                    continue;

                if( name === "cocaína" )
                    drugIsPositive = testCocaine( sample.drugs );
                else
                    drugIsPositive = value >= h;
                                
                sample.drugs[i].isPositive = drugIsPositive;
                sampleIsPositive = sampleIsPositive || drugIsPositive;
            }

            sample.tested = true;
            sample.result = sampleIsPositive;
            return sample;
        } catch (error) {
            throw error
        }
    }
}

function isSampleTestable( sample ){   
    if( !isObject( sample ))
        throw new TypeError( '"sample" argument must be an object.');
    
    const testableDrugs = [
        'cocaína',
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

    if( !objectHasRightStructure( sample, ['sample_code', 'drugs' ]))
        return false;
        
    const { drugs } = sample;
    if( !Array.isArray( drugs ))
        return false;
    
    if( !isDruglistTestable( drugs, testableDrugs ))
        return false
    
    return true;
};

function isCocaineTestable( druglist ){
    let hasCocaine = druglist.some( d => d?.name === 'cocaína' );
    let hasBenzo = druglist.some( d => d?.name === 'benzoilecgonina' );
    let hasCoca = druglist.some( d => d?.name === 'cocaetileno' );
    let hasNorco = druglist.some( d => d?.name === 'norcocaína' );

    return hasCocaine && hasBenzo && hasCoca && hasNorco;    
}

function testCocaine( drugs ) {
    let cocaine = drugs.find( d => d.name === 'cocaína' );
    let benzo = drugs.find( d => d.name === 'benzoilecgonina'  );
    let coca = drugs.find( d => d.name === 'cocaetileno' );
    let norco = drugs.find( d => d.name === 'norcocaína' );    

    let cocaineIsHigh = cocaine.value >= 0.5;
    let benzoIsHigh = benzo.value >= 0.05;
    let cocaIsHigh = coca.value >= 0.05;
    let norcoIsHigh = norco.value >= 0.05 

    return cocaineIsHigh && ( benzoIsHigh || cocaIsHigh || norcoIsHigh )
}

function isSamplePositive( sample ){
    if( !isObject( sample ))
        throw new TypeError( 'Argument must be an object.')

    if( !isSampleTestable( sample ))
        throw Error('sample is not testable.');

    const { drugs } = sample;
    const highValuesDetected = []
    const higherValuesAllowed = {
        'cocaína': 0.5,
        'anfetamina': 0.2,
        'metanfetamina': 0.2,
        'mda': 0.2,
        'mdma': 0.2,
        'thc': 0.05,
        'morfina': 0.2,
        'codeína': 0.2,
        'heroína': 0.2,
        'benzoilecgonina': 0.05,
        'cocaetileno': 0.05,
        'norcocaína': 0.05,
    };

    for( let drug of drugs ){
        const { name, value } = drug; 

        if( name in higherValuesAllowed ){
            let h = higherValuesAllowed[ nome ];
            let valueAndHigherAreEqual = floatEquals( value, h );

            if( valueAndHigherAreEqual || value > h ){
                if( name !== 'cocaína'){               
                    highValuesDetected.push({ name, value, allowed: h })
                }
                
            }
        }           
    }
    return false;
}

function isDruglistTestable( druglist, testableDrugs ){
    if( !Array.isArray( druglist ))
        throw new TypeError('Argument "druglist" must be of type Array.');
    
    if( !Array.isArray( testableDrugs ))
        throw new TypeError( 'Argument "testableDrugs" must be of type Array.' )

    for( let drug of druglist ){
        let drugHasRightStructure = objectHasRightStructure( drug, [ "name", "value", "isPositive" ]);
        let drugIsTestable = testableDrugs.includes( drug?.name );
        let isCocaine = drug?.name === 'cocaína';          
        
        if( drugHasRightStructure && drugIsTestable && !isCocaine )
            return true;
        
        if( drugHasRightStructure && drugIsTestable && isCocaine )
            return isCocaineTestable( druglist );        
    };  
    
    return false;
};

module.exports = {
    ToxicologicalSampleServices,
    isCocaineTestable,    
    isSampleTestable,
    isSamplePositive,
    testCocaine
}

